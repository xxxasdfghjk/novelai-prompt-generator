export const MAX_TOKEN_SIZE = 225

export const JOB_DEFAULT_SETTING = {
  model: 'nai-diffusion-3',
  action: 'generate',
  parameters: {
    params_version: 1,
    width: 832,
    height: 1216,
    scale: 6.0,
    sampler: 'k_euler', // 'k_euler'
    steps: 28, // 28
    n_samples: 1, // 1
    ucPreset: 0, // 0
    qualityToggle: false, // 品質タグを追加するか
    sm: true, // smea
    sm_dyn: false, // dyn
    dynamic_thresholding: false,
    controlnet_strength: 1,
    legacy: false,
    add_original_image: true,
    cfg_rescale: 0,
    noise_schedule: 'native', // 'native'
    legacy_v3_extend: false,
    seed: Math.floor(Math.random() * 9999999999), // 2701562552
    negative_prompt: '',
    reference_image_multiple: [],
    reference_information_extracted_multiple: [],
    reference_strength_multiple: []
  }
} as const
