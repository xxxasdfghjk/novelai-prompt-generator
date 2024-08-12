import HeaderMenu from '@/uiparts/HeaderMenu'
import React from 'react'
import Content from '@/uiparts/Content'
import Generate from '@/uiparts/Generate'

const GeneratePage = async () => {
  return (
    <section className="flex flex-row justify-center">
      <Content>
        <HeaderMenu selected="Generate" />
        <Generate />
      </Content>
    </section>
  )
}

export default GeneratePage
