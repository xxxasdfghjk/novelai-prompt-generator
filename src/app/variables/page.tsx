import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import TemplateGenerator from '@/uiparts/TemplateGenerator'
import React from 'react'
import Content from '@/uiparts/Content'
import VariableTypeList from '@/uiparts/VariableTypeList'

const VariablesPage = async () => {
  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Variable Type List">
        <VariableTypeList />
      </SideBar>
      <Content>
        <HeaderMenu selected="Variables" />
        <TemplateGenerator />
      </Content>
    </section>
  )
}
export const dynamic = 'force-dynamic'
export default VariablesPage
