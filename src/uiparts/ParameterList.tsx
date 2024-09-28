'use client'
import { ExpandMore } from '@mui/icons-material'
import {
  FormControlLabel,
  MenuItem,
  Select,
  styled,
  TextField
} from '@mui/material'
import React from 'react'

export const CustomExpandMoreIcon = styled(ExpandMore)(() => ({
  fill: 'white', // 矢印の色を指定
  fontSize: '1em'
}))

type Props = {
  step: number
  scale: number
  seed: number | undefined
  samplerName: (typeof SAMPLER)[number]
  dyn: boolean
  smea: boolean
  rotate: boolean
  onChangeStep: (sRotate: number) => void
  onChangeScale: (scale: number) => void
  onChangeSeedValue: (seed: number | undefined) => void
  onChangeSampler: (sampler: (typeof SAMPLER)[number]) => void
  onChangeSMEA: (smea: boolean) => void
  onChangeDYN: (dyn: boolean) => void
  onChangeRotate: (rotate: boolean) => void
}
const SAMPLER = [
  {
    id: 1,
    name: 'Euler',
    value: 'k_euler'
  },
  {
    id: 2,
    name: 'Euler Ancestral',
    value: 'k_euler_ancestral'
  },
  {
    id: 3,
    name: 'DPM++ 2S Ancestral',
    value: 'k_dpmpp_2s_ancestral'
  },
  {
    id: 4,
    name: 'DPM++ 2M',
    value: 'k_dpmpp_2m'
  },
  {
    id: 5,
    name: 'DPM++ SDE',
    value: 'k_dpmpp_sde'
  },
  {
    id: 6,
    name: 'ddim',
    value: 'ddim_v3'
  }
] as const
export const DEFAULT_SAMPLER = SAMPLER[0]
export type Sampler = (typeof SAMPLER)[number]
const ParameterList = (props: Props) => {
  return (
    <div>
      <div className="p-6 py-2 flex flex-row">
        <div className="max-w-14 mr-2">
          <h4 className="pb-2 font-bold text-xs">Step</h4>
          <TextField
            className="w-full bg-slate-950 rounded-md"
            type="number"
            value={props.step}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              props.onChangeStep(value < 1 ? 1 : value > 50 ? 50 : value)
            }}
            inputProps={{ className: 'text-slate-50  py-2  text-xs' }}
          />{' '}
        </div>
        <div className="min-w-16 max-w-18 mr-2">
          <h4 className="pb-2 font-bold text-xs">Scale</h4>
          <TextField
            className="w-full bg-slate-950 rounded-md"
            type="number"
            value={props.scale}
            onChange={(e) => {
              const value = Number(e.target.value)
              props.onChangeScale(value < 0 ? 0 : value > 10 ? 10 : value)
            }}
            inputProps={{ className: 'text-slate-50  py-2  text-xs' }}
          />{' '}
        </div>
        <div className="min-w-8 mr-2">
          <h4 className="pb-2 font-bold text-xs">
            Seed
            <button
              className="text-[10px] rounded-sm p-1 mx-4 bg-slate-700"
              onClick={() => props.onChangeSeedValue(undefined)}
            >
              Clear
            </button>
          </h4>
          <TextField
            className="w-full bg-slate-950 rounded-md"
            type="number"
            value={props.seed ?? ''}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              props.onChangeSeedValue(value < 0 ? 0 : value)
            }}
            inputProps={{ className: 'text-slate-50  py-2  text-xs' }}
          />
        </div>
        <div className="min-w-8 mr-2 flex-grow">
          <h4 className="pb-2 font-bold text-xs">Sampler</h4>
          <Select
            id="custom-select-label"
            onChange={(e) => {
              const id = e.target.value as (typeof SAMPLER)[number]['id']
              const config = SAMPLER.find((e) => e.id === id)!
              props.onChangeSampler(config)
            }}
            value={props.samplerName.id}
            className={
              'bg-slate-950 rounded-md text-slate-50 flex-grow mr-5 w-full'
            }
            inputProps={{ className: ' py-2  text-xs' }}
            IconComponent={CustomExpandMoreIcon}
          >
            {SAMPLER.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="px-8 flex flex-row">
        <div className="min-w-8 mr-2">
          <FormControlLabel
            label="SMEA"
            control={
              <input
                className="m-2 scale-150"
                type="checkbox"
                checked={props.smea}
                onChange={(e) => props.onChangeSMEA(e.target.checked)}
              />
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.75rem'
              }
            }}
          />
        </div>
        <div className="min-w-8 mr-2">
          <FormControlLabel
            label="DYN"
            control={
              <input
                className="m-2 scale-150"
                type="checkbox"
                checked={props.dyn}
                onChange={(e) => props.onChangeDYN(e.target.checked)}
              />
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.75rem'
              }
            }}
          />
        </div>
        <div className="min-w-8 mr-2">
          <FormControlLabel
            label="rotate"
            control={
              <input
                className="m-2 scale-150"
                type="checkbox"
                checked={props.rotate}
                onChange={(e) => props.onChangeRotate(e.target.checked)}
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
    </div>
  )
}

export default ParameterList
