'use client'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
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

const VariableTypeInstanceRegisterButton = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="fixed bottom-2 w-96 h-16 bg-slate-600 z-40 hover:bg-slate-900 rounded-md cursor-pointer duration-150">
      <a
        className="flex items-center h-full justify-center"
        onClick={() => {
          setOpen(true)
        }}
      >
        <span className="text-lg">{'Add Variable Instance '}</span>
        <AddIcon fontSize="large" />
      </a>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <section className="p-2">
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
                <TableRow hover>
                  <TableCell className="text-slate-100 bg-zinc-700" />
                  <TableCell className="text-slate-100">
                    <TextField className="bg-slate-100 rounded-md" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </Dialog>
    </div>
  )
}

export default VariableTypeInstanceRegisterButton
