'use client'
import { update } from '@/app/actions/variableInstanceElement'
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TextField,
  Button,
  Snackbar,
  Alert,
  Breadcrumbs
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
type Props = {
  variableTypeId: number
  variableTypeName: string
  variableInstanceId: number
  variableInstanceName: string
  variableInstanceElementList: {
    variableTypeElement: { name: string; variableTypeId: number }
    text: string
    id: number
  }[]
}

const VariableInstanceElementForm = ({
  variableTypeId,
  variableInstanceId,
  variableInstanceElementList,
  variableInstanceName,
  variableTypeName
}: Props) => {
  const [state, updateAction] = useFormState(update, {
    state: 'initial' as const
  })
  const router = useRouter()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (state.state === 'success') {
      setOpen(true)
      router.refresh()
    } else if (state.state === 'error') {
      setOpen(true)
    }
  }, [state])
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className="p-4 text-slate-100">
        <Link href={`/variables/`}>Variables</Link>
        <Link href={`/variables/${variableTypeId}`}>{variableTypeName}</Link>
        <Link href={`/variables/${variableTypeId}/${variableInstanceId}`}>
          {variableInstanceName}
        </Link>
      </Breadcrumbs>
      <section className="p-4 flex justify-center">
        <form action={updateAction}>
          <input
            hidden
            value={variableInstanceId}
            name="variableInstanceId"
            readOnly
          />
          <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
            <Table
              aria-label="simple table"
              className="bg-slate-500 text-slate-100"
            >
              <TableHead className="bg-slate-600 text-slate-100">
                <TableRow>
                  <TableCell className="text-center  text-slate-100 font-bold bg-zinc-800">
                    Type
                  </TableCell>
                  <TableCell className="text-center  text-slate-100 font-bold">
                    Text
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variableInstanceElementList.map(
                  ({ variableTypeElement: { name }, text, id }, index) => (
                    <TableRow hover key={name}>
                      <TableCell className="text-slate-100 bg-zinc-700">
                        {name}
                      </TableCell>
                      <TableCell className="text-slate-100">
                        <TextField
                          defaultValue={text}
                          name={`variableInstanceElement[${index}][text]`}
                          className="bg-slate-100 rounded-md"
                        />
                        <input
                          hidden
                          value={id}
                          name={`variableInstanceElement[${index}][id]`}
                          readOnly
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="m-4 flex justify-center">
            <Button type="submit" className="" variant="contained">
              SUBMIT
            </Button>
          </div>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={state.state === 'error' ? 'error' : 'success'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {state.state === 'error' ? 'Update failed.' : 'Update success!'}
          </Alert>
        </Snackbar>
      </section>
    </>
  )
}

export default VariableInstanceElementForm
