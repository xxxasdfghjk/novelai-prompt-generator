import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import React from 'react'
type Props = {
  saveDest: undefined | string
  useCustomSave: boolean
  onChange: (dest: string) => void
  onChangeUseCustom: (use: boolean) => void
}
const SaveSetting = (props: Props) => {
  return (
    <div className="px-6 py-4 pb-2 bg-slate-900 mt-4">
      <h2 className="pb-2 font-bold">Save Destination</h2>
      <div className="flex flex-row justify-between">
        <FormControlLabel
          label="Custom"
          control={
            <Checkbox
              checked={props.useCustomSave}
              onChange={(_, checked) => props.onChangeUseCustom(checked)}
            />
          }
        />
        <div className="flex-grow">
          <TextField
            disabled={!props.useCustomSave}
            className="bg-slate-950 rounded-md w-full"
            onChange={(e) => props.onChange(e.target.value)}
            value={props.saveDest}
            inputProps={{ className: 'py-2 w-full  text-slate-50' }}
          />
        </div>
      </div>
    </div>
  )
}

export default SaveSetting
