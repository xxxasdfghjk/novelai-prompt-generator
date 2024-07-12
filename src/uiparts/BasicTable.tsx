import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import React from 'react'
type Props = {
  variableIntanceId: number
  variableInstanceElementList: { name: string; text: string }[]
}
/**
 * 縦方向の テーブル
 * | A | e.A|
 * | B | e.B|
 * @param param0
 * @returns
 */
export const VariableInstanceElementTable = ({
  variableInstanceElementList
}: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {variableInstanceElementList.map(({ name, text }) => (
            <TableRow
              key={name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default VariableInstanceElementTable
