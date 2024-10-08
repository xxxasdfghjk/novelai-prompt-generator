'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
  Button,
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { insert } from '@/app/actions/variableInstanceElement'

const inputSchema = z.object({
  name: z.string().min(1, 'instance name required.'),
  instanceElementList: z.array(
    z.object({
      id: z.number(),
      value: z.string()
    })
  )
})
type InputSchema = z.infer<typeof inputSchema>

type Props = {
  typeId: number
  typeName: string
  typeElementList: {
    name: string
    id: number
  }[]
}

const VariableTypeInstanceRegisterButton = (props: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<InputSchema>({
    defaultValues: {
      name: '',
      instanceElementList: props.typeElementList.map((e) => ({
        value: '',
        id: e.id
      }))
    },
    resolver: zodResolver(inputSchema)
  })

  const { fields } = useFieldArray({
    control,
    name: 'instanceElementList'
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
  const [state, action] = useFormState(insert, {
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
                      Instance Name
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
                    <TableCell className="text-center  text-slate-100 font-bold bg-zinc-800">
                      {'Value'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((e, i) => (
                    <TableRow key={e.id + i} hover>
                      <TableCell className="text-slate-100 p-2">
                        {props.typeElementList[i].name}
                        <input
                          hidden
                          readOnly
                          {...register(`instanceElementList.${i}.id`)}
                          value={props.typeElementList[i].id}
                        />
                      </TableCell>
                      <TableCell className="text-slate-100 p-2">
                        <TextField
                          className="bg-slate-100 rounded-md"
                          {...register(`instanceElementList.${i}.value`)}
                          error={
                            !!errors.instanceElementList?.[i]?.value?.message
                          }
                          helperText={
                            errors.instanceElementList?.[i]?.value?.message
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="text-red-700">
              {errors.instanceElementList?.root?.message}
            </div>
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
        <input hidden name="variableTypeId" value={props.typeId} />
        {inputData?.instanceElementList.map((e, i) => (
          <Fragment key={e.id + i}>
            <input
              hidden
              name={`instanceElementList[${i}][value]`}
              value={e.value}
            />
            <input hidden name={`instanceElementList[${i}][id]`} value={e.id} />
          </Fragment>
        ))}
      </form>
    </div>
  )
}

export default VariableTypeInstanceRegisterButton
