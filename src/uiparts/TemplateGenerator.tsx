'use client'
import React, { useState } from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material'
import TemplateEditButton from './TemplateEditButton'

type VariableTypeElement = {
  id: number
  name: string
}

type VariableInstanceElement = {
  id: number
  text: string
  variableTypeElement: VariableTypeElement
}
type VariableInstance = {
  id: number
  name: string
  variableInstanceElement: VariableInstanceElement[]
}
type VariableType = {
  id: number
  name: string
  variableInstance: VariableInstance[]
}

type Props = {
  templateId: number
  name: string
  text: string
  variableTypeList: { id: number; name: string }[]
  availableVariableType: VariableType[]
}
const TemplateGenerator = (props: Props) => {
  const [selectedInstanceList, setSelectedInstanceList] = useState<{
    [variableTypeId: number]: number
  }>({})
  const [generatedText, setGeneratedText] = useState<string>('')
  const generateText = () => {
    const mapping = Object.entries(selectedInstanceList).map(([key, val]) => ({
      typeId: parseInt(key, 10),
      instanceId: val
    }))
    const replaceMap = mapping.flatMap(({ typeId, instanceId }) => {
      const targetType = props.availableVariableType.find(
        (e) => e.id === typeId
      )!
      const targetInstance = targetType.variableInstance.find(
        (e) => e.id === instanceId
      )!
      return targetInstance!.variableInstanceElement.map((e) => ({
        from: `<${targetType?.name}.${e.variableTypeElement.name}>`,
        to: e.text
      }))
    })
    return replaceMap
      .reduce((prev, cur) => prev.replaceAll(cur.from, cur.to), props.text)
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0)
      .join(' , ')
  }
  return (
    <section className="p-6">
      <TemplateEditButton
        defaultVariableTypeList={props.availableVariableType}
        name={props.name}
        text={props.text}
        templateId={props.templateId}
        variableTypeList={props.variableTypeList}
      />
      <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
        <Table
          aria-label="simple table"
          className="bg-slate-500 text-slate-100"
        >
          <TableHead className="bg-slate-600 text-slate-100">
            <TableRow>
              <TableCell className="text-center  text-slate-100 font-bold bg-zinc-800">
                Name
              </TableCell>
              <TableCell className="text-center  text-slate-100 font-bold">
                Text
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="text-slate-100 bg-zinc-700">
                {props.name}
              </TableCell>
              <TableCell className="text-slate-100">{props.text}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
        <Table
          aria-label="simple table"
          className="bg-slate-500 text-slate-100"
        >
          <TableHead className="bg-slate-600 text-slate-100">
            <TableRow>
              <TableCell className="text-center  text-slate-100 font-bold bg-zinc-800">
                Value
              </TableCell>
              <TableCell className="text-center  text-slate-100 font-bold">
                Instance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.availableVariableType.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-slate-100 bg-zinc-700">
                  {e.name}
                </TableCell>
                <TableCell>
                  <Select
                    className="w-full bg-slate-100"
                    inputProps={{ disableScrollLock: true }}
                    onChange={(elem) => {
                      setSelectedInstanceList((prev) => {
                        prev[e.id] = parseInt(String(elem.target.value), 10)
                        return { ...prev }
                      })
                    }}
                    value={selectedInstanceList[e.id] ?? 0}
                  >
                    {e.variableInstance.map((variable) => (
                      <MenuItem key={variable.id} value={variable.id}>
                        {variable.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        onClick={() => {
          setGeneratedText(generateText())
        }}
      >
        Submit
      </Button>
      <TextField
        value={generatedText}
        multiline
        className="bg-slate-100 text-slate-900"
      />
    </section>
  )
}

export default TemplateGenerator
