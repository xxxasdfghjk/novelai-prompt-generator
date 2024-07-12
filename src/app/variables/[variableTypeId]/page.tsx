import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import React from 'react'
import Content from '@/uiparts/Content'
import { z } from 'zod'
import VariableTypeList from '@/uiparts/VariableTypeList'
import VariableInstanceList from '@/uiparts/VariableInstanceList'

const VariablesPage = async ({
  params: { variableTypeId }
}: {
  params: { variableTypeId: unknown }
}) => {
  const variableTypeIdParsed = z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10))
    .safeParse(variableTypeId)
  if (!variableTypeIdParsed.success) {
    return <div>ERROR</div>
  }
  const variableTypeIdChecked = variableTypeIdParsed.data

  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Variable Type List">
        <VariableTypeList />
      </SideBar>
      <Content>
        <HeaderMenu selected="Variables" />
        <VariableInstanceList variableTypeId={variableTypeIdChecked} />
      </Content>
    </section>
  )
}
export const dynamic = 'force-dynamic'
export default VariablesPage
