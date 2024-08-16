export type RequestPayload = {
  input: string // prompt
  model: 'nai-diffusion-3'
  action: 'generate'
  parameters: {
    params_version: 1
    width: number
    height: number
    scale: number
    sampler: string // 'k_euler'
    steps: number // 28
    n_samples: 1 // 1
    ucPreset: 0 // 0
    qualityToggle: false // 品質タグを追加するか
    sm: boolean // smea
    sm_dyn: boolean // dyn
    dynamic_thresholding: false
    controlnet_strength: 1
    legacy: false
    add_original_image: true
    cfg_rescale: 0
    noise_schedule: string // 'native'
    legacy_v3_extend: false
    seed: number // 2701562552
    negative_prompt: string
    reference_image_multiple: []
    reference_information_extracted_multiple: []
    reference_strength_multiple: []
    prefix?: string
  }
}

export const sendRequest = async (props: RequestPayload) => {
  const requestPath = process.env.NEXT_PUBLIC_GENERATE_API_PATH!
  const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN
  return await fetch(requestPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(props)
  }).then(async (e) => {
    return await e.blob()
  })
}
