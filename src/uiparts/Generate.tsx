'use client'
import { Dialog, IconButton, Tooltip } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import FileImageList from './FileImageList'
import { ImageFile, Directory } from '@/types/File'
import Image from 'next/image'
import { getExifData } from '@/utils/exif'
import { z } from 'zod'
import { ContentPaste, CopyAll } from '@mui/icons-material'
import { copyToClipboard } from '@/utils/clipboard'
import SettingForm from './SettingForm'
import InfoIcon from '@mui/icons-material/Info'
import {
  folderNameAtom,
  imageSizeAtom,
  negativePromptAtom,
  prefixAtom,
  promptAtom,
  seedAtom
} from '@/utils/atoms'
import { useAtom } from 'jotai/react'
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

const extractFolderName = (path: string) => {
  return path.split('/')[1] ?? ''
}

const extractPrefix = (fileName: string) => {
  return fileName.match(/(.*)[0-9]{4}-[0-9]{2}-[0-9]{2}.*/)?.[1] ?? ''
}

type ExifSchema = z.infer<typeof exifSchema>
const Generate = () => {
  const [path, setPath] = useState<string>('/')
  const [fileList, setFileList] = useState<(ImageFile | Directory)[]>([])
  const [selectedFile, setSelectedFile] = useState<ImageFile | undefined>(
    undefined
  )
  const [openCopyTip, setOpenCopyTip] = useState(false)
  const [openAllCopyTip, setOpenAllCopyTip] = useState(false)

  const [exif, setExif] = useState<ExifSchema | undefined>()
  const [openInfo, setOpenInfo] = useState(false)
  const [, setPrompt] = useAtom(promptAtom)
  const [, setNegativePrompt] = useAtom(negativePromptAtom)
  const [, setFolderName] = useAtom(folderNameAtom)
  const [, setPrefix] = useAtom(prefixAtom)
  const [, setSeed] = useAtom(seedAtom)
  const [, setImageSize] = useAtom(imageSizeAtom)

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
  const onGenerateSuccess = (file: ImageFile, directory: string) => {
    onClickFile(file)
    setPath(directory)
    updatePath()
  }
  const updatePath = useCallback(() => {
    fetch(
      `http://localhost:3000/api/imageList${path === undefined ? '' : '?imagePath=' + path}`
    )
      .then((e) => e.json())
      .then((e) => setFileList(e))
  }, [path])
  useEffect(() => {
    updatePath()
  }, [path])
  return (
    <section className="p-2 flex justify-between flex-row">
      <section className="w-[38%]">
        <SettingForm onGenerateSuccess={onGenerateSuccess} />
      </section>
      <section className="w-[40%] flex flex-col items-center">
        <div className="w-full text-sm h-32 p-2 m-2 overflow-y-scroll relative">
          {exif && (
            <>
              <Tooltip
                arrow
                open={openCopyTip}
                onClose={() => setOpenCopyTip(false)}
                disableHoverListener
                placement="top"
                title="Copied!"
              >
                <IconButton
                  size="small"
                  className="absolute right-4  hover:opacity-50"
                  onClick={() => {
                    setOpenCopyTip(true)
                    copyToClipboard(exif.prompt)
                  }}
                >
                  <CopyAll className="fill-white" />
                </IconButton>
              </Tooltip>
              <Tooltip
                arrow
                open={openAllCopyTip}
                onClose={() => setOpenAllCopyTip(false)}
                disableHoverListener
                placement="top"
                title="Copied!"
              >
                <IconButton
                  size="small"
                  className="absolute right-4 bottom-1  hover:opacity-50"
                  onClick={() => {
                    setPrompt(exif.prompt)
                    setNegativePrompt(exif.uc)
                    setImageSize({ height: exif.height, width: exif.width })
                    setSeed(exif.seed)
                    setFolderName(extractFolderName(selectedFile!.path) ?? '')
                    setPrefix(extractPrefix(selectedFile!.name) ?? '')
                  }}
                >
                  <ContentPaste className="fill-white" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {exif ? exif.prompt : 'No Prompt'}
        </div>
        <div className="relative">
          {selectedFile && (
            <div>
              <IconButton
                size="large"
                className="absolute right-2 top-2"
                onClick={() => setOpenInfo(true)}
              >
                <InfoIcon />
              </IconButton>
              <Image
                width={500}
                height={300}
                src={`http://localhost:3000/api/image/?imagePath=${selectedFile?.path}`}
                alt={''}
              />
            </div>
          )}
        </div>
      </section>
      <section className="w-[20%]">
        <FileImageList
          path={path ?? '/'}
          fileList={fileList}
          onClickDirectory={(path) => setPath(path)}
          onClickFile={onClickFile}
          onSuccessDelete={() => updatePath()}
        />
      </section>
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)}>
        <section className="p-6">
          <table>
            <tbody className="">
              <tr>
                <td>{'prompt'}</td>
                <td>{exif?.prompt}</td>
              </tr>
              <tr>
                <td>{'steps'}</td>
                <td>{exif?.steps}</td>
              </tr>

              <tr>
                <td>{'height'}</td>
                <td>{exif?.height}</td>
              </tr>

              <tr>
                <td>{'width'}</td>
                <td>{exif?.width}</td>
              </tr>

              <tr>
                <td>{'scale'}</td>
                <td>{exif?.scale}</td>
              </tr>

              <tr>
                <td>{'uncond_scale'}</td>
                <td>{exif?.uncond_scale}</td>
              </tr>

              <tr>
                <td>{'cfg_rescale'}</td>
                <td>{exif?.cfg_rescale}</td>
              </tr>

              <tr>
                <td>{'seed'}</td>
                <td>{exif?.seed}</td>
              </tr>

              <tr>
                <td>{'n_samples'}</td>
                <td>{exif?.n_samples}</td>
              </tr>

              <tr>
                <td>{'hide_debug_overlay'}</td>
                <td>{exif?.hide_debug_overlay}</td>
              </tr>

              <tr>
                <td>{'noise_schedule'}</td>
                <td>{exif?.noise_schedule}</td>
              </tr>

              <tr>
                <td>{'legacy_v3_extend'}</td>
                <td>{exif?.legacy_v3_extend}</td>
              </tr>

              <tr>
                <td>{'sampler'}</td>
                <td>{exif?.sampler}</td>
              </tr>

              <tr>
                <td>{'controlnet_strength'}</td>
                <td>{exif?.controlnet_strength}</td>
              </tr>

              <tr>
                <td>{'dynamic_thresholding'}</td>
                <td>{exif?.dynamic_thresholding}</td>
              </tr>

              <tr>
                <td>{'dynamic_thresholding_percentile'}</td>
                <td>{exif?.dynamic_thresholding_percentile}</td>
              </tr>

              <tr>
                <td>{'dynamic_thresholding_mimic_scale'}</td>
                <td>{exif?.dynamic_thresholding_mimic_scale}</td>
              </tr>

              <tr>
                <td>{'sm'}</td>
                <td>{exif?.sm}</td>
              </tr>

              <tr>
                <td>{'sm_dyn'}</td>
                <td>{exif?.sm_dyn}</td>
              </tr>

              <tr>
                <td>{'skip_cfg_below_sigma'}</td>
                <td>{exif?.skip_cfg_below_sigma}</td>
              </tr>

              <tr>
                <td>{'uc'}</td>
                <td>{exif?.uc}</td>
              </tr>

              <tr>
                <td>{'request_type'}</td>
                <td>{exif?.request_type}</td>
              </tr>
              <tr>
                <td>{'signed_hash'}</td>
                <td>{exif?.signed_hash}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </Dialog>
    </section>
  )
}

export default Generate
