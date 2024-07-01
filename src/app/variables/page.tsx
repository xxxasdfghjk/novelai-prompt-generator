import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import TemplateGenerator from '@/uiparts/TemplateGenerator'
import React from 'react'
import Content from '@/uiparts/Content'

const VariablesPage = () => {
  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Variable Type List">
        <section>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
          <div>aaa</div>
        </section>
      </SideBar>
      <Content>
        <HeaderMenu selected="Variables" />
        <TemplateGenerator />
      </Content>
    </section>
  )
}

export default VariablesPage
