'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
  Button,
  Checkbox,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { RemoveCircleOutline } from '@mui/icons-material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { createVariableType } from '@/app/actions/variableType'
import { useRouter } from 'next/navigation'

const inputSchema = z.object({
  name: z.string().min(1, 'instance name required.'),
  typeList: z
    .array(
      z.object({
        name: z.string().min(1, 'instance element name required.'),
        canEmpty: z.boolean().optional().default(false)
      })
    )
    .refine(
      (arr) => new Set([...arr.map((e) => e.name)]).size === arr.length,
      'non unique element name'
    )
})
type InputSchema = z.infer<typeof inputSchema>

const VariableTypeRegisterButton = () => {
  // React Hook Form を使うための基本設定
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<InputSchema>({
    // input の value の 初期値を設置
    defaultValues: {
      name: '',
      typeList: [{ name: '', canEmpty: false }]
    },
    resolver: zodResolver(inputSchema)
  })

  // input を動的に増減させるための設定
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'typeList'
  })
  const [open, setOpen] = useState<boolean>(false)
  const ref = useRef<HTMLFormElement>(null)
  const [inputData, setInputData] = useState<InputSchema>()
  const onSubmit: SubmitHandler<InputSchema> = (inputData) => {
    setInputData(inputData)
  }
  useEffect(() => {
    if (inputData !== undefined) ref.current?.requestSubmit()
  }, [inputData])
  const [state, action] = useFormState(createVariableType, {
    state: 'initial'
  } as const)
  const router = useRouter()
  useEffect(() => {
    if (state.state === 'success') {
      setInputData(undefined)
      router.refresh()
      router.push('/variables/' + state.insertedId)
    } else if (state.state === 'error') {
      alert('An error occured')
    }
  }, [state])
  return (
    <div className="sticky -bottom-2 h-16 bg-slate-600 z-40 hover:bg-slate-800 rounded-md cursor-pointer">
      <a
        className="flex items-center h-full justify-center"
        onClick={() => {
          setOpen(true)
        }}
      >
        <span className="text-lg">{'Add Variable Type '}</span>
        <AddIcon fontSize="large" />
      </a>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form action={action} onSubmit={handleSubmit(onSubmit)}>
          <section className="p-2">
            <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
              <Table
                aria-label="simple table"
                className="bg-slate-500 text-slate-100"
              >
                <TableBody>
                  <TableRow hover>
                    <TableCell className="text-slate-100 bg-zinc-700">
                      Type Name
                    </TableCell>
                    <TableCell className="text-slate-100">
                      <TextField
                        className="bg-slate-100 rounded-md"
                        {...register('name')}
                        error={!!errors.name?.message}
                        helperText={errors.name?.message}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </section>
          <section className="p-2">
            <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
              <Table
                aria-label="simple table"
                className="bg-slate-500 text-slate-100"
              >
                <TableHead className="bg-slate-600 text-slate-100">
                  <TableRow>
                    <TableCell className="text-center  text-slate-100 font-bold bg-zinc-800">
                      {'Element Name'}
                    </TableCell>
                    <TableCell className="text-center  text-slate-100 font-bold">
                      {'Allow Empty'}
                    </TableCell>
                    <TableCell className="text-center  text-slate-100 font-bold">
                      {'Remove'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((e, i) => (
                    <TableRow key={e.name + i} hover>
                      <TableCell className="text-slate-100 p-2">
                        <TextField
                          className="bg-slate-100 rounded-md"
                          {...register(`typeList.${i}.name`)}
                          error={!!errors.typeList?.[i]?.name?.message}
                          helperText={errors.typeList?.[i]?.name?.message}
                        />
                      </TableCell>
                      <TableCell className="text-slate-100 bg-slate-100 text-center p-0">
                        <Checkbox
                          className="p-4"
                          {...register(`typeList.${i}.canEmpty`)}
                        />
                      </TableCell>
                      <TableCell
                        className="text-slate-100 bg-slate-100 text-center hover:opacity-80 hover:cursor-pointer"
                        onClick={() => (fields.length !== 1 ? remove(i) : null)}
                      >
                        <RemoveCircleOutline sx={{ fill: '#C93329' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="bg-slate-800 text-slate-100  hover:opacity-50 cursor-pointer"
                      onClick={() => append({ name: '', canEmpty: false })}
                    >
                      <div className="w-full h-full flex justify-center items-center rounded-lg">
                        Add Row
                        <AddIcon />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <div className="text-red-700">{errors.typeList?.root?.message}</div>
          </section>
          <div className="flex justify-center items-center p-2">
            <Button type="submit" variant="contained" className="h-16 w-48">
              SUBMIT
            </Button>
          </div>
        </form>
      </Dialog>
      <form action={action} ref={ref}>
        <input hidden name="name" value={inputData?.name} />
        {inputData?.typeList.map((e, i) => (
          <Fragment key={e.name + i}>
            <input hidden name={`typeList[${i}][name]`} value={e.name} />
            <input
              hidden
              name={`typeList[${i}][canEmpty]`}
              value={e.canEmpty ? 'true' : 'false'}
            />
          </Fragment>
        ))}
      </form>
    </div>
  )
}

export default VariableTypeRegisterButton
