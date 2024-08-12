import { MAX_TOKEN_SIZE } from '@/const/const'
import { TextField, Tooltip, LinearProgress } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import _debounce from 'lodash/debounce'

type Props = {
  prompt: string
  promptTokenNum: number
  onChange: (prompt: string) => void
  onGetPromptTokenNum: (tokenNum: number) => void
}
const InputPrompt = (props: Props) => {
  const getPromptTokenNum = useCallback(
    _debounce((value) => {
      fetch(`http://localhost:3000/api/tokenize?text=${value}`)
        .then((e) => e.json())
        .then((e) => props.onGetPromptTokenNum(e.count))
    }, 500),
    []
  )
  useEffect(() => getPromptTokenNum(props.prompt), [])

  return (
    <div className="px-3">
      <TextField
        multiline
        className="p-2 w-full "
        inputProps={{ className: 'text-slate-50' }}
        rows={10}
        onChange={(e) => {
          props.onChange(e.target.value)
          getPromptTokenNum(e.target.value)
        }}
        value={props.prompt}
      />
      <div className="px-4">
        <Tooltip
          arrow
          disableFocusListener
          disableTouchListener
          placement="top"
          title={`${props.promptTokenNum} / ${MAX_TOKEN_SIZE}`}
        >
          <LinearProgress
            className="px-"
            variant="determinate"
            value={(100 * props.promptTokenNum) / MAX_TOKEN_SIZE}
            color={
              (100 * props.promptTokenNum) / MAX_TOKEN_SIZE > 100
                ? 'error'
                : undefined
            }
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default InputPrompt
