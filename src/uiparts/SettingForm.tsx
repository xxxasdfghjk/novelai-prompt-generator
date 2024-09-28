'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import InputPrompt from './InputPrompt'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { useLocalStorage } from 'usehooks-ts'
import ImageSizeSelector from './ImageSizeSelector'
import BatchCount, { DEFAULT_NOISE, Noise } from './BatchCount'
import ParameterList, { DEFAULT_SAMPLER, Sampler } from './ParameterList'
import SaveSetting from './SaveSetting'
import SubmitButton from './SubmitButton'
import { ImageFile } from '@/types/File'
import { RequestPayload } from '@/utils/request'
import { toast } from 'react-toastify'
import { generateImage, Job } from '@/utils/generateSetting'
import { processJobList } from '../utils/generateSetting'
import { z } from 'zod'
import {
  folderNameAtom,
  imageSizeAtom,
  prefixAtom,
  promptAtom,
  seedAtom
} from '@/utils/atoms'
import { useAtom } from 'jotai/react'
import { negativePromptAtom } from '../utils/atoms'
import { FormControlLabel, TextField } from '@mui/material'
type Props = {
  onGenerateSuccess: (file: ImageFile, directory: string) => void
}
const batchFileSchema = z.array(
  z.object({
    order: z.number(),
    $comment: z.string(),
    batchCount: z.number(),
    prompt: z.string(),
    negativePrompt: z.string(),
    height: z.number(),
    width: z.number(),
    rotate: z.boolean().optional().default(false)
  })
)
type BatchFileSchema = z.infer<typeof batchFileSchema>
const SettingForm = (props: Props) => {
  const [prompt, setPrompt] = useAtom(promptAtom)
  const [promptTokenNum, setPromptTokenNum] = useState(0)
  const [negativePrompt, setNegativePrompt] = useAtom(negativePromptAtom)
  const [noise, setNoise] = useState<Noise>(DEFAULT_NOISE)

  const [negativePromptTokenNum, setNegativePromptTokenNum] = useState(0)
  const [batchCount, setBatchCount] = useLocalStorage('batch', 1)
  const [imageSize, setImageSize] = useAtom(imageSizeAtom)
  const [totalCount, setTotalCount] = useState<number>(0)

  const [step, setStep] = useLocalStorage('step', 28)
  const [scale, setScale] = useLocalStorage('scale', 5)
  const [dyn, setDYN] = useLocalStorage<boolean>('dyn', false)
  const [smea, setSMEA] = useLocalStorage<boolean>('smea', true)
  const [rotate, setRotate] = useLocalStorage<boolean>('rotate', false)

  const [seed, setSeed] = useAtom(seedAtom)
  const [sampler, setSampler] = useState<Sampler>(DEFAULT_SAMPLER)
  const [currentNum, setCurrentNum] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [multiRatio, setMultiRatio] = useState(1)
  const [jobScale, setJobScale] = useLocalStorage<number>('jobScale', 5.0)
  const [trial, setTrial] = useLocalStorage<boolean>('trial', false)

  const [prefix, setPrefix] = useAtom(prefixAtom)
  const [folderName, setFolderName] = useAtom(folderNameAtom)
  const abortSignal = useRef<boolean>(false)
  const requestPayload = useRef<RequestPayload>()
  const [batchFile, setBatchFile] = useState<BatchFileSchema | undefined>()
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
    const qualityTag =
      'best quality , amazing quality , very aesthetic , absurdres'
    const editPrompt =
      prompt
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .join(', ') +
      ',' +
      qualityTag
    return await fetch('http://localhost:3000/api/sendRequest', {
      method: 'POST',
      body: JSON.stringify({
        ...requestPayload.current,
        input: editPrompt,
        parameters: {
          ...requestPayload.current?.parameters,
          seed: seed ? seed : Math.floor(Math.random() * 9999999999),
          width: rotate
            ? requestPayload.current?.parameters.height
            : requestPayload.current?.parameters.width,
          height: rotate
            ? requestPayload.current?.parameters.width
            : requestPayload.current?.parameters.height,
          folderName: folderName.length === 0 ? undefined : folderName,
          prefix: prefix.length === 0 ? undefined : prefix
        }
      })
    }).then((e) => e.json())
  }
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedJob, setSelectedJob] = useState<Record<number, boolean>>({})

  const jobSubmit = async (rawJobList: Job[]) => {
    const jobList = processJobList(
      trial
        ? rawJobList.map((e) => ({ ...e, batchCount: 1, scale: jobScale }))
        : rawJobList.map((e) => ({
            ...e,
            scale: jobScale,
            batchCount: e.batchCount * multiRatio
          }))
    )
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
      switch (Notification.permission) {
        case 'default':
          Notification.requestPermission()
          break
        case 'granted':
          new Notification('NovelAI Generator', {
            body: '生成が完了しました'
          })
          break
      }
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
        const parsed = batchFileSchema.safeParse(json)
        if (!parsed.success) {
          console.error(parsed.error)
          throw Error('parse failed')
        } else {
          const editData = parsed.data.map((e) => ({
            ...e,
            $comment: e.order.toString().padStart(5, '0') + e.$comment,
            batchCount: e.batchCount
          }))
          setBatchFile(editData)
          setSelectedJob(
            new Array(parsed.data.length)
              .fill(0)
              .map((e, i) => i)
              .reduce((prev, cur) => ({ ...prev, [cur]: true }), {})
          )
        }
      } catch (e) {
        console.error(e)
        alert('invalid format')
      } finally {
        event.target.value = ''
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
      switch (Notification.permission) {
        case 'default':
          Notification.requestPermission()
          break
        case 'granted':
          new Notification('NovelAI Generator', {
            // ここを追加
            body: '生成が完了しました'
          })
          break
      }
      setIsProcessing(false)
      toast.success('generation done!')
    }
  }

  return (
    <div>
      <div className="bg-slate-900 rounded-md pb-4">
        <Tabs
          onSelect={(index) => {
            setCurrentTab(index)
          }}
        >
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
            <div className="px-6 py-4">
              <div className="p-2">
                <label>
                  <p className="bg-orange-100 p-4 rounded-md text-slate-950 font-bold hover:opacity-60 hover:cursor-pointer">
                    Upload
                  </p>
                  <input
                    hidden
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <div className="flex justify-between flex-row">
                <div className="mr-4">
                  <h2 className="pb-2 font-bold">Multi Ratio</h2>
                  <TextField
                    className="w-full bg-slate-950 rounded-md"
                    type="number"
                    value={multiRatio}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10)
                      setMultiRatio(value)
                    }}
                    inputProps={{ className: 'text-slate-50  py-2' }}
                  />
                </div>
                <div className="mr-4">
                  <h2 className="pb-2 font-bold">Scale</h2>
                  <TextField
                    className="w-full bg-slate-950 rounded-md"
                    type="text"
                    value={jobScale}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10)
                      setJobScale(value)
                    }}
                    inputProps={{ className: 'text-slate-50  py-2' }}
                  />
                </div>
                <div className="min-w-8 mr-2">
                  <FormControlLabel
                    label="Trial"
                    control={
                      <input
                        className="m-2 scale-150"
                        type="checkbox"
                        checked={trial}
                        onChange={(e) => setTrial(e.target.checked)}
                      />
                    }
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </div>
              </div>
              {batchFile && (
                <div>
                  <div className="flex justify-around flex-row">
                    <div>
                      <label>
                        <p className="bg-orange-100 p-2 rounded-md text-slate-950 font-bold hover:opacity-60 hover:cursor-pointer">
                          All Select
                        </p>
                        <input
                          type="button"
                          onClick={() =>
                            setSelectedJob(() => {
                              return new Array(batchFile.length)
                                .fill(0)
                                .map((_, i) => i)
                                .reduce(
                                  (prev, cur) => ({ ...prev, [cur]: true }),
                                  {}
                                )
                            })
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        <p className="bg-orange-100 p-2 rounded-md text-slate-950 font-bold hover:opacity-60 hover:cursor-pointer">
                          Clear
                        </p>
                        <input
                          type="button"
                          onClick={() => setSelectedJob({})}
                        />
                      </label>
                    </div>
                  </div>
                  <table className="p-2 table-auto w-full">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Rotate</th>
                        <th>Batch Count</th>
                        <th>Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchFile.map((e, index) => (
                        <tr
                          key={e.$comment}
                          onClick={() =>
                            setSelectedJob((prev) => {
                              const newSelectedJob = { ...prev }
                              newSelectedJob[index] = !(prev[index] ?? false)
                              return newSelectedJob
                            })
                          }
                          className={`${selectedJob[index] ? 'bg-slate-700' : ''} cursor-pointer hover:opacity-50`}
                        >
                          <td className="px-2 w-10">{index + 1}</td>
                          <td className="px-2">{e.$comment}</td>
                          <td className="px-2">
                            {e.rotate ? 'True' : 'False'}
                          </td>
                          <td className="px-2">{e.batchCount}</td>
                          <td className="px-2">
                            <input
                              type="checkbox"
                              checked={selectedJob[index] ?? false}
                              readOnly
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="sticky bottom-3">
                <SubmitButton
                  onSubmit={() => {
                    if (batchFile === undefined) {
                      return
                    }
                    jobSubmit(
                      batchFile.filter((_, i) => selectedJob[i] === true)
                    )
                  }}
                  totalNum={totalCount}
                  currentNum={currentNum}
                  isProcessing={isProcessing}
                  onClickAbort={() => {
                    abortSignal.current = true
                  }}
                />
              </div>
            </div>
          </TabPanel>
        </Tabs>
        {currentTab !== 2 && (
          <>
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
          </>
        )}
      </div>
      {currentTab !== 2 && (
        <>
          <SaveSetting
            folderName={folderName}
            onChangeFolderName={setFolderName}
            prefix={prefix}
            onChangePrefix={setPrefix}
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
        </>
      )}
    </div>
  )
}

export default SettingForm
