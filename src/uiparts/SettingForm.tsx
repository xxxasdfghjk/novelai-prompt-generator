'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import InputPrompt from './InputPrompt'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { useLocalStorage } from 'usehooks-ts'
import ImageSizeSelector, { DEFAULT_IMAGE_SIZE } from './ImageSizeSelector'
import BatchCount, { DEFAULT_NOISE, Noise } from './BatchCount'
import ParameterList, { DEFAULT_SAMPLER, Sampler } from './ParameterList'
import SaveSetting from './SaveSetting'
import SubmitButton from './SubmitButton'
import { ImageFile } from '@/types/File'
import { RequestPayload } from '@/utils/request'
import { toast } from 'react-toastify'
import { generateImage, generateSetting, Job } from '@/utils/generateSetting'
import { processJobList } from '../utils/generateSetting'
import { z } from 'zod'
type Props = {
  onGenerateSuccess: (file: ImageFile, directory: string) => void
}
const SettingForm = (props: Props) => {
  const [prompt, setPrompt] = useLocalStorage('prompt', '')
  const [promptTokenNum, setPromptTokenNum] = useState(0)

  const [negativePrompt, setNegativePrompt] = useLocalStorage(
    'negativePrompt',
    ''
  )
  const [noise, setNoise] = useState<Noise>(DEFAULT_NOISE)

  const [negativePromptTokenNum, setNegativePromptTokenNum] = useState(0)
  const [batchCount, setBatchCount] = useLocalStorage('batch', 1)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: DEFAULT_IMAGE_SIZE.width, height: DEFAULT_IMAGE_SIZE.height }
  )
  const [totalCount, setTotalCount] = useState<number>(0)

  const [step, setStep] = useLocalStorage('step', 28)
  const [scale, setScale] = useLocalStorage('scale', 5)
  const [dyn, setDYN] = useLocalStorage<boolean>('dyn', false)
  const [smea, setSMEA] = useLocalStorage<boolean>('smea', true)
  const [rotate, setRotate] = useLocalStorage<boolean>('rotate', false)

  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [sampler, setSampler] = useState<Sampler>(DEFAULT_SAMPLER)
  const [saveDestination, setSaveDestination] = useLocalStorage<
    string | undefined
  >('saveDestination', undefined)
  const [useCustomSave, setUseCustomSave] = useLocalStorage<boolean>(
    'useCustomSave',
    false
  )
  const [currentNum, setCurrentNum] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const abortSignal = useRef<boolean>(false)
  const requestPayload = useRef<RequestPayload>()
  useEffect(() => {
    requestPayload.current = {
      input: prompt,
      model: 'nai-diffusion-3',
      action: 'generate',
      parameters: {
        params_version: 1,
        width: imageSize.width,
        height: imageSize.height,
        scale: scale,
        sampler: sampler.value, // 'k_euler'
        steps: step, // 28
        n_samples: 1, // 1
        ucPreset: 0, // 0
        qualityToggle: false, // 品質タグを追加するか
        sm: smea, // smea
        sm_dyn: dyn, // dyn
        dynamic_thresholding: false,
        controlnet_strength: 1,
        legacy: false,
        add_original_image: true,
        cfg_rescale: 0,
        noise_schedule: noise.value, // 'native'
        legacy_v3_extend: false,
        seed: seed ? seed : Math.floor(Math.random() * 9999999999), // 2701562552
        negative_prompt: negativePrompt,
        reference_image_multiple: [],
        reference_information_extracted_multiple: [],
        reference_strength_multiple: []
      }
    }
  }, [
    prompt,
    imageSize,
    scale,
    sampler,
    step,
    smea,
    dyn,
    noise,
    seed,
    negativePrompt
  ])
  const genImage = async (rotate: boolean) => {
    return await fetch('http://localhost:3000/api/sendRequest', {
      method: 'POST',
      body: JSON.stringify({
        ...requestPayload.current,
        parameters: {
          ...requestPayload.current?.parameters,
          seed: seed ? seed : Math.floor(Math.random() * 9999999999),
          width: rotate
            ? requestPayload.current?.parameters.height
            : requestPayload.current?.parameters.width,
          height: rotate
            ? requestPayload.current?.parameters.width
            : requestPayload.current?.parameters.height
        }
      })
    }).then((e) => e.json())
  }
  const jobSubmit = async (rawJobList: Job[]) => {
    const jobList = processJobList(rawJobList)
    setIsProcessing(true)
    setCurrentNum(0)
    setTotalCount(jobList.length)
    abortSignal.current = false
    try {
      for (const job of jobList) {
        if (abortSignal.current) {
          break
        }
        const res = await generateImage(job)
        props.onGenerateSuccess(
          { name: res.name, path: res.filePath, type: 'file' },
          res.dirPath
        )
        setCurrentNum((e) => e + 1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
      toast.success('generation done!')
    }
  }
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      try {
        const text = await file.text()
        const json = JSON.parse(text)
        const parsed = z
          .array(
            z.object({
              $comment: z.string(),
              batchCount: z.number(),
              prompt: z.string(),
              negativePrompt: z.string(),
              height: z.number(),
              width: z.number(),
              rotate: z.boolean().optional().default(false)
            })
          )
          .safeParse(json)
        if (!parsed.success) {
          throw Error('parse failed')
        } else {
          jobSubmit(
            parsed.data.map((e, i) => ({
              ...e,
              $comment: (i + 1).toString().padStart(3, '0') + e.$comment
            }))
          )
        }
      } catch (e) {
        alert('invalid format')
      }
    }
  }

  const handleSubmit = async () => {
    try {
      setIsProcessing(true)
      setCurrentNum(0)
      setTotalCount(batchCount)
      abortSignal.current = false
      for (let i = 0; i < batchCount; i++) {
        if (abortSignal.current) {
          break
        }
        const res = await genImage(rotate ? i % 2 === 1 : false)
        props.onGenerateSuccess(
          { name: res.name, path: res.filePath, type: 'file' },
          res.dirPath
        )
        setCurrentNum((e) => e + 1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
      toast.success('generation done!')
    }
  }
  return (
    <div>
      <div className="bg-slate-900 rounded-md pb-4">
        <Tabs>
          <TabList className="flex justify-start flex-row p-2">
            <Tab
              selectedClassName="bg-slate-950 rounded-lg font-bold !opacity-100"
              className="p-4 mx-1 opacity-50 cursor-pointer"
            >
              Prompt
            </Tab>
            <Tab
              selectedClassName="bg-slate-950 rounded-lg font-bold !opacity-100"
              className="p-4 mx-1 opacity-50 cursor-pointer"
            >
              Negative Prompt
            </Tab>
            <Tab
              selectedClassName="bg-slate-950 rounded-lg font-bold !opacity-100"
              className="p-4 mx-1 opacity-50 cursor-pointer"
            >
              Job
            </Tab>
          </TabList>
          <TabPanel>
            <InputPrompt
              prompt={prompt}
              promptTokenNum={promptTokenNum}
              onGetPromptTokenNum={(tokenNum) => setPromptTokenNum(tokenNum)}
              onChange={(prompt) => setPrompt(prompt)}
            />
          </TabPanel>
          <TabPanel>
            <InputPrompt
              prompt={negativePrompt}
              promptTokenNum={negativePromptTokenNum}
              onGetPromptTokenNum={(tokenNum) =>
                setNegativePromptTokenNum(tokenNum)
              }
              onChange={(prompt) => setNegativePrompt(prompt)}
            />
          </TabPanel>
          <TabPanel>
            <label>
              <p>Upload</p>
              <input type="file" accept=".json" onChange={handleFileUpload} />
            </label>
          </TabPanel>
        </Tabs>
        <ImageSizeSelector
          width={imageSize.width}
          height={imageSize.height}
          onChange={({ width, height }) => setImageSize({ width, height })}
        />
        <BatchCount
          count={batchCount}
          onChangeCount={(count) => setBatchCount(count)}
          noise={noise}
          onChangeNoise={(noise) => setNoise(noise)}
        />
        <ParameterList
          smea={smea}
          dyn={dyn}
          step={step}
          scale={scale}
          seed={seed}
          samplerName={sampler}
          rotate={rotate}
          onChangeDYN={(dyn) => setDYN(dyn)}
          onChangeSMEA={(smea) => setSMEA(smea)}
          onChangeStep={(step) => setStep(step)}
          onChangeScale={(scale) => setScale(scale)}
          onChangeSeedValue={(seed) => setSeed(seed)}
          onChangeSampler={(sampler) => setSampler(sampler)}
          onChangeRotate={setRotate}
        />
      </div>
      <SaveSetting
        saveDest={saveDestination}
        onChange={setSaveDestination}
        useCustomSave={useCustomSave}
        onChangeUseCustom={setUseCustomSave}
      />
      <SubmitButton
        onSubmit={handleSubmit}
        totalNum={totalCount}
        currentNum={currentNum}
        isProcessing={isProcessing}
        onClickAbort={() => {
          abortSignal.current = true
        }}
      />
    </div>
  )
}

export default SettingForm
