import { JOB_DEFAULT_SETTING } from '@/const/const'
import { RequestPayload } from './request'

type Props = {
  width: number
  height: number
  prompt: string
  negativePrompt: string
  prefix?: string
}
export type Job = {
  width: number
  height: number
  prompt: string
  negativePrompt: string
  batchCount: number
  rotate?: boolean
  $comment: string
}

export const processJobList = (jobList: Job[]) => {
  return jobList.flatMap((e) => {
    const result = new Array(e.batchCount).fill(0).map((_) =>
      generateSetting({
        width: e.width,
        height: e.height,
        prompt: e.prompt,
        negativePrompt: e.negativePrompt,
        prefix: e.$comment
      })
    )
    if (e.rotate === true) {
      return [
        ...result,
        ...new Array(e.batchCount).fill(0).map((_) =>
          generateSetting({
            width: e.height,
            height: e.width,
            prompt: e.prompt,
            negativePrompt: e.negativePrompt,
            prefix: e.$comment
          })
        )
      ]
    } else {
      return result
    }
  })
}

export const generateImage = async (
  payload: RequestPayload,
  rotate?: boolean
) => {
  return await fetch('http://localhost:3000/api/sendRequest', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      parameters: {
        ...payload.parameters,
        seed: Math.floor(Math.random() * 9999999999),
        prefix: payload.parameters.prefix ?? '',
        width: rotate ? payload.parameters.height : payload.parameters.width,
        height: rotate ? payload.parameters.width : payload.parameters.height
      }
    })
  }).then((e) => e.json())
}

export const generateSetting = ({
  width,
  height,
  prompt,
  negativePrompt,
  prefix
}: Props): RequestPayload => {
  return {
    ...JOB_DEFAULT_SETTING,
    input: prompt,
    parameters: {
      ...JOB_DEFAULT_SETTING.parameters,
      reference_image_multiple: [],
      reference_information_extracted_multiple: [],
      reference_strength_multiple: [],
      width,
      height,
      prefix,
      seed: Math.floor(Math.random() * 9999999999),
      negative_prompt: negativePrompt
    }
  }
}
