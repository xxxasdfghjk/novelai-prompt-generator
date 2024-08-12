'use client'
import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FileImageList from './FileImageList'
import { ImageFile, Directory } from '@/types/File'
import Image from 'next/image'
import { getExifData } from '@/utils/exif'
import { z } from 'zod'
import { CopyAll } from '@mui/icons-material'
import { copyToClipboard } from '@/utils/clipboard'
import SettingForm from './SettingForm'
const exifSchema = z.object({
  prompt: z.string(),
  steps: z.number(),
  height: z.number(),
  width: z.number(),
  scale: z.number(),
  uncond_scale: z.number(),
  cfg_rescale: z.number(),
  seed: z.number(),
  n_samples: z.number(),
  hide_debug_overlay: z.boolean(),
  noise_schedule: z.string(),
  legacy_v3_extend: z.boolean(),
  sampler: z.string(),
  controlnet_strength: z.number(),
  dynamic_thresholding: z.boolean(),
  dynamic_thresholding_percentile: z.number(),
  dynamic_thresholding_mimic_scale: z.number(),
  sm: z.boolean(),
  sm_dyn: z.boolean(),
  skip_cfg_below_sigma: z.number(),
  // lora_unet_weights: z.boolean(),
  uc: z.string(),
  request_type: z.string(),
  signed_hash: z.string()
})
type ExifSchema = z.infer<typeof exifSchema>
const Generate = () => {
  const [path, setPath] = useState<string>('/')
  const [fileList, setFileList] = useState<(ImageFile | Directory)[]>([])
  const [selectedFile, setSelectedFile] = useState<ImageFile | undefined>(
    undefined
  )
  const [openTip, setOpenTip] = useState(false)
  const [exif, setExif] = useState<ExifSchema | undefined>()

  const onClickFile = async (file: ImageFile) => {
    setSelectedFile(file)
    fetch(`http://localhost:3000/api/image?imagePath=${file.path}`)
      .then((e) => e.arrayBuffer())
      .then((e) =>
        getExifData(e).then((e) => {
          const exif = JSON.parse(
            (e?.png?.['Comment']?.value as string) ?? '{}'
          )
          const parsed = exifSchema.safeParse(exif)
          if (parsed.success) {
            setExif(parsed.data)
          } else {
            setExif(undefined)
          }
        })
      )
  }
  const onGenerateSuccess = (file: ImageFile, directory: Directory) => {
    onClickFile(file)
    setPath(directory.path)
  }
  useEffect(() => {
    fetch(
      `http://localhost:3000/api/imageList${path === undefined ? '' : '?imagePath=' + path}`
    )
      .then((e) => e.json())
      .then((e) => setFileList(e))
  }, [path])
  return (
    <section className="p-2 flex justify-between flex-row">
      <section className="w-[38%]">
        <SettingForm onGenerateSuccess={onGenerateSuccess} />
      </section>
      <section className="w-[40%] flex flex-col items-center">
        <div className="w-full text-sm h-32 p-2 m-2 overflow-y-scroll relative">
          {exif && (
            <Tooltip
              arrow
              open={openTip}
              onClose={() => setOpenTip(false)}
              disableHoverListener
              placement="top"
              title="Copied!"
            >
              <IconButton
                size="small"
                className="absolute right-4  hover:opacity-50"
                onClick={() => {
                  setOpenTip(true)
                  copyToClipboard(exif.prompt)
                }}
              >
                <CopyAll className="fill-white" />
              </IconButton>
            </Tooltip>
          )}
          {exif ? exif.prompt : 'No Prompt'}
        </div>
        {selectedFile && (
          <Image
            width={500}
            height={300}
            src={`http://localhost:3000/api/image/?imagePath=${selectedFile?.path}`}
            alt={''}
          />
        )}
      </section>
      <section className="w-[20%]">
        <FileImageList
          path={path ?? '/'}
          fileList={fileList}
          onClickDirectory={(path) => setPath(path)}
          onClickFile={onClickFile}
        />
      </section>
    </section>
  )
}

export default Generate
