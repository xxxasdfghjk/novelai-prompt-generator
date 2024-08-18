import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import React from 'react'
type Props = {
  folderName: string
  onChangeFolderName: (folderName: string) => void
  prefix: string
  onChangePrefix: (prefix: string) => void
}
const SaveSetting = (props: Props) => {
  return (
    <div className="px-6 py-4 pb-2 bg-slate-900 mt-4">
      <h2 className="pb-2 font-bold">Save Destination</h2>
      <div className="flex flex-row items-center justify-between p-2">
        <p className="p-2 w-36">Folder Name</p>
        <div className="flex-grow">
          <TextField
            className="bg-slate-950 rounded-md w-full"
            onChange={(e) => props.onChangeFolderName(e.target.value)}
            value={props.folderName}
            inputProps={{ className: 'py-2 w-full  text-slate-50' }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-2">
        <p className="p-2 w-36">Prefix</p>
        <div className="flex-grow">
          <TextField
            className="bg-slate-950 rounded-md w-full"
            onChange={(e) => props.onChangePrefix(e.target.value)}
            value={props.prefix}
            inputProps={{ className: 'py-2 w-full  text-slate-50' }}
          />
        </div>
      </div>
    </div>
  )
}

export default SaveSetting
