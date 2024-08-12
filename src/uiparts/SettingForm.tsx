'use client'
import React, { useRef, useState } from 'react'
import InputPrompt from './InputPrompt'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { useLocalStorage } from 'usehooks-ts'
import ImageSizeSelector, { DEFAULT_IMAGE_SIZE } from './ImageSizeSelector'
import BatchCount, { DEFAULT_NOISE, Noise } from './BatchCount'
import ParameterList, { DEFAULT_SAMPLER, Sampler } from './ParameterList'
import SaveSetting from './SaveSetting'
import SubmitButton from './SubmitButton'
import { Directory, ImageFile } from '@/types/File'
type Props = {
  onGenerateSuccess: (file: ImageFile, directory: Directory) => void
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
  const [step, setStep] = useLocalStorage('step', 28)
  const [accuracy, setAccuracy] = useLocalStorage('accuracy', 5)
  const [dyn, setDYN] = useLocalStorage<boolean>('dyn', false)
  const [smea, setSMEA] = useLocalStorage<boolean>('smea', true)

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
  const handleSubmit = async () => {
    try {
      setIsProcessing(true)
      setCurrentNum(0)
      abortSignal.current = false
      for (let i = 0; i < batchCount; i++) {
        if (abortSignal.current) {
          break
        }
        await new Promise((resolve) => setTimeout(() => resolve(1), 1000))
        setCurrentNum((e) => e + 1)
      }
      // TODO:imple
      props.onGenerateSuccess
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
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
          accuracy={accuracy}
          seed={seed}
          samplerName={sampler}
          onChangeDYN={(dyn) => setDYN(dyn)}
          onChangeSMEA={(smea) => setSMEA(smea)}
          onChangeStep={(step) => setStep(step)}
          onChangeAccuracy={(accuracy) => setAccuracy(accuracy)}
          onChangeSeedValue={(seed) => setSeed(seed)}
          onChangeSampler={(sampler) => setSampler(sampler)}
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
        totalNum={batchCount}
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
