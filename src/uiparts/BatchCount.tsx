import { ExpandMore } from '@mui/icons-material'
import { MenuItem, Select, styled, TextField } from '@mui/material'
import React from 'react'
const CustomExpandMoreIcon = styled(ExpandMore)(() => ({
  fill: 'white', // 矢印の色を指定
  fontSize: '1.4em'
}))
type Props = {
  onChangeNoise: (noise: (typeof NOISE)[number]) => void
  onChangeCount: (count: number) => void
  noise: (typeof NOISE)[number]
  count: number
}
export type Noise = (typeof NOISE)[number]
const NOISE = [
  {
    id: 1,
    name: 'native',
    value: 'native'
  },
  {
    id: 2,
    name: 'karras',
    value: 'exponential'
  },
  {
    id: 3,
    name: 'exponential',
    value: 'exponential'
  },
  {
    id: 4,
    name: 'polyexponential',
    value: 'polyexponential'
  }
] as const
export const DEFAULT_NOISE = NOISE[0]
const BatchCount = (props: Props) => {
  return (
    <div className="px-6 flex flex-row justify-between">
      <div className="mr-4">
        <h2 className="pb-2 font-bold">Batch Size</h2>
        <TextField
          className="w-full bg-slate-950 rounded-md"
          type="number"
          value={props.count}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10)
            props.onChangeCount(value)
          }}
          inputProps={{ className: 'text-slate-50  py-2' }}
        />
      </div>
      <div className="min-w-40 flex-grow">
        <h2 className="pb-2 font-bold">Noise</h2>
        <Select
          id="custom-select-label"
          onChange={(e) => {
            const id = e.target.value as (typeof NOISE)[number]['id']
            const config = NOISE.find((e) => e.id === id)!
            props.onChangeNoise(config)
          }}
          value={props.noise.id}
          className={
            'bg-slate-950 rounded-md text-slate-50 flex-grow mr-5 w-full'
          }
          inputProps={{ className: ' py-2' }}
          IconComponent={CustomExpandMoreIcon}
          defaultValue={DEFAULT_NOISE.id}
        >
          {NOISE.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.name}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default BatchCount
