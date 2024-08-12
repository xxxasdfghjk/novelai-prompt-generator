'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
  Button,
  Dialog,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createTemplate } from '@/app/actions/template'

const inputSchema = z.object({
  name: z.string().min(1, 'template name required.'),
  text: z.string().min(1, 'text required.'),
  variableTypeList: z.array(z.object({ typeId: z.number() }))
})
type InputSchema = z.infer<typeof inputSchema>

type Props = {
  variableTypeList: {
    name: string
    id: number
  }[]
}

const TemplateRegisterButton = (props: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<InputSchema>({
    defaultValues: {
      name: '',
      text: '',
      variableTypeList: []
    },
    resolver: zodResolver(inputSchema)
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'variableTypeList'
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
  const [state, action] = useFormState(createTemplate, {
    state: 'initial'
  } as const)
  const router = useRouter()
  useEffect(() => {
    if (state.state === 'success') {
      setInputData(undefined)
      router.refresh()
      setOpen(false)
    } else if (state.state === 'error') {
      alert('An error occured')
    }
  }, [state])
  return (
    <div className="sticky -bottom-2 h-16 bg-slate-600 z-40 hover:bg-slate-800 rounded-md cursor-pointer m-8">
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
                      Template Name
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
              <Table
                aria-label="simple table"
                className="bg-slate-500 text-slate-100"
              >
                <TableBody>
                  <TableRow hover>
                    <TableCell className="text-slate-100 bg-zinc-700">
                      Text
                    </TableCell>
                    <TableCell className="text-slate-100 w-full">
                      <TextField
                        className="bg-slate-100 rounded-md w-full"
                        {...register('text')}
                        error={!!errors.text?.message}
                        helperText={errors.text?.message}
                        multiline={true}
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
                      {'Use VariableType'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((e, i) => (
                    <TableRow key={e.id + i} hover>
                      <TableCell className="text-slate-100 p-2">
                        <Select
                          MenuProps={{ disableScrollLock: true }}
                          defaultValue=""
                          {...register(`variableTypeList.${i}.typeId`)}
                          className="w-full bg-slate-50"
                        >
                          {props.variableTypeList
                            .filter(
                              (variableType) =>
                                fields.find(
                                  (field) => field.typeId === variableType.id
                                ) === undefined || e.typeId === variableType.id
                            )
                            .map((e) => (
                              <MenuItem key={e.id} value={e.id}>
                                {e.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="bg-slate-800 text-slate-100  hover:opacity-50 cursor-pointer"
                      onClick={() => append({ typeId: -1 })}
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
        <input hidden name="text" value={inputData?.text} />
        {inputData?.variableTypeList.map((e, i) => (
          <Fragment key={e.typeId + i}>
            <input hidden name={`variableTypeIdList[${i}]`} value={e.typeId} />
          </Fragment>
        ))}
      </form>
    </div>
  )
}

export default TemplateRegisterButton
