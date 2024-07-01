import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import TemplateGenerator from '@/uiparts/TemplateGenerator'
import React from 'react'
import Content from '@/uiparts/Content'

const TemplateGeneratorPage = () => {
  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Template List">
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
        <HeaderMenu selected="Setting" />
        <TemplateGenerator />
      </Content>
    </section>
  )
}

export default TemplateGeneratorPage
