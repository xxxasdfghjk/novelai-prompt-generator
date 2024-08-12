import prisma from '@/utils/db'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Breadcrumbs
} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import VariableTypeInstanceRegisterButton from './VariableInstanceRegisterButton'
type Props = {
  variableTypeId: number
}
const VariableInstanceList = async ({ variableTypeId }: Props) => {
  const variableType = await prisma.variableType.findFirst({
    where: { id: variableTypeId },
    include: { variableTypeElement: true }
  })
  const variableInstanceList = await prisma.variableInstance.findMany({
    include: {
      variableInstanceElement: {
        include: { variableTypeElement: true }
      }
    },
    where: { variableTypeId: variableTypeId }
  })
  if (variableType === null) {
    return <div>ERROR</div>
  }
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className="p-4 text-slate-100">
        <Link href={`/variables/`}>Variables</Link>
        <Link href={`/variables/${variableTypeId}`}>{variableType.name}</Link>
      </Breadcrumbs>
      <section className="p-4 flex justify-center">
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            className="bg-slate-500 text-slate-100"
          >
            <TableHead className="bg-slate-600 text-slate-100">
              <TableRow className="flex">
                <TableCell className="text-slate-100 bg-zinc-900 w-48">
                  Instance Name
                </TableCell>
                {variableType.variableTypeElement.map(({ name }) => (
                  <TableCell
                    className="text-slate-100 text-center border-l-slate-400 border-l flex-1"
                    key={name}
                  >
                    {name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {variableInstanceList.map(
                ({ variableInstanceElement, name, id, variableTypeId }) => (
                  <TableRow hover key={id} className="flex">
                    <TableCell className="text-slate-100 bg-zinc-600 w-48">
                      <Link href={`/variables/${variableTypeId}/${id}`}>
                        {name}
                      </Link>
                    </TableCell>
                    {variableInstanceElement.map((e) => (
                      <TableCell className="text-slate-100 flex-1" key={e.id}>
                        {e.text}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      <VariableTypeInstanceRegisterButton
        typeId={variableTypeId}
        typeName={variableType.name}
        typeElementList={variableType.variableTypeElement.map((e) => ({
          name: e.name,
          id: e.id
        }))}
      />
    </>
  )
}

export default VariableInstanceList
