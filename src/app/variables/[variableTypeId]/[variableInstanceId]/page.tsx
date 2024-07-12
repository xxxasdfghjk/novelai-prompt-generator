import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import React from 'react'
import Content from '@/uiparts/Content'
import { z } from 'zod'
import VariableTypeList from '../../../../uiparts/VariableTypeList'
import VariableInstanceElement from '@/uiparts/VariableInstanceElement'

const VariablesPage = async ({
  params: { variableTypeId, variableInstanceId }
}: {
  params: { variableTypeId: unknown; variableInstanceId: unknown }
}) => {
  const variableTypeIdParsed = z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10))
    .safeParse(variableTypeId)
  const variableInstanceIdParsed = z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10))
    .safeParse(variableInstanceId)

  if (!variableTypeIdParsed.success || !variableInstanceIdParsed.success) {
    return <div>ERROR</div>
  }
  const variableInstanceIdChecked = variableInstanceIdParsed.data
  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Variable Type List">
        <VariableTypeList />
      </SideBar>
      <Content>
        <HeaderMenu selected="Variables" />
        <VariableInstanceElement
          variableInstanceId={variableInstanceIdChecked}
        />
      </Content>
    </section>
  )
}
export const dynamic = 'force-dynamic'
export default VariablesPage
