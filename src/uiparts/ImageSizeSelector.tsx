import { ExpandMore } from '@mui/icons-material'
import { FormControl, MenuItem, Select, styled } from '@mui/material'
import React from 'react'
type Props = {
  onChange: ({ width, height }: { width: number; height: number }) => void
  width: number
  height: number
}
export const CustomExpandMoreIcon = styled(ExpandMore)(() => ({
  fill: 'white', // 矢印の色を指定
  fontSize: '1.8em'
}))
const IMAGE_SIZE = [
  { id: 1, name: '普通サイズ 縦型', width: 832, height: 1216 },
  { id: 2, name: '普通サイズ 横型', width: 1216, height: 832 },
  { id: 3, name: '普通サイズ 正方形', width: 1024, height: 1024 },
  { id: 4, name: '大サイズ 縦型', width: 1024, height: 1536 },
  { id: 5, name: '大サイズ 横型', width: 1536, height: 1024 },
  { id: 6, name: '大サイズ 正方形', width: 1472, height: 1472 },
  { id: 7, name: '壁紙 縦型', width: 1088, height: 1920 },
  { id: 8, name: '壁紙 横型', width: 1920, height: 1088 },
  { id: 9, name: '小サイズ 縦型', width: 512, height: 768 },
  { id: 10, name: '小サイズ 横型', width: 768, height: 512 },
  { id: 11, name: '小サイズ 正方形', width: 640, height: 640 }
] as const
export const DEFAULT_IMAGE_SIZE = IMAGE_SIZE[0]
const ImageSizeSelector = (props: Props) => {
  const selected = IMAGE_SIZE.find(
    (e) => e.width === props.width && e.height === props.height
  )!
  return (
    <div className="px-6 py-4 pb-2">
      <h2 className="pb-2 font-bold">Image Size</h2>
      <div className="flex flex-row items-center justify-between">
        <FormControl fullWidth variant="outlined">
          <Select
            id="custom-select-label"
            onChange={(e) => {
              const id = e.target.value as (typeof IMAGE_SIZE)[number]['id']
              const config = IMAGE_SIZE.find((e) => e.id === id)!
              props.onChange({ width: config.width, height: config.height })
            }}
            value={selected.id}
            className={'bg-slate-950 rounded-md text-slate-50 flex-grow mr-5'}
            inputProps={{ className: ' py-2' }}
            IconComponent={CustomExpandMoreIcon}
          >
            {IMAGE_SIZE.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          className="cursor-pointer w-36 text-center"
          onClick={() =>
            props.onChange({ width: props.height, height: props.width })
          }
        >
          {props.width} × {props.height}
        </div>
      </div>
    </div>
  )
}

export default ImageSizeSelector
