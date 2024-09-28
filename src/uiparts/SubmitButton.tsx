import React, { useEffect, useRef } from 'react'
import CircularProgressWithLabel from './CircularProgressWithLabel'

type Props = {
  onSubmit: () => void
  totalNum: number
  currentNum: number
  isProcessing: boolean
  onClickAbort: () => void
}
const SubmitButton = (props: Props) => {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'Enter') {
        ref?.current?.click()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // クリーンアップ
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return (
    <div className="h-20 mt-4">
      {!props.isProcessing && (
        <button
          disabled={props.isProcessing}
          className="h-full w-full bg-amber-100 text-black font-bold text-xl hover:opacity-60 transition rounded-md"
          onClick={() => props.onSubmit()}
          ref={ref}
        >
          SUBMIT
        </button>
      )}
      {props.isProcessing && (
        <div className="flex flex-row justify-center h-full w-full bg-amber-100 text-black font-bold text-xl transition rounded-md">
          <CircularProgressWithLabel
            className="p-2 m-4"
            currentNum={props.currentNum}
            totalNum={props.totalNum}
          />

          <button
            className="bg-slate-800 text-slate-50 p-2 m-4 rounded-md cursor-pointer hover:opacity-50"
            onClick={() => props.onClickAbort()}
          >
            ABORT
          </button>
        </div>
      )}
    </div>
  )
}

export default SubmitButton
