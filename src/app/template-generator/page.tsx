import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import React from 'react'
import Content from '@/uiparts/Content'
import prisma from '@/utils/db'
import Link from 'next/link'
import TemplateRegisterButton from '@/uiparts/TemplateRegisterButton'

const TemplateGeneratorPage = async () => {
  const template = await prisma.template.findMany({
    select: {
      name: true,
      id: true
    }
  })
  const variableTypeList = await prisma.variableType.findMany({
    select: {
      name: true,
      id: true
    }
  })

  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Template List">
        <section>
          {template.map((e) => (
            <Link key={e.id} href={`/template-generator/${e.id}`}>
              <div>{e.name}</div>
            </Link>
          ))}
        </section>
        <TemplateRegisterButton variableTypeList={variableTypeList} />
      </SideBar>
      <Content>
        <HeaderMenu selected="Template" />
      </Content>
    </section>
  )
}

export default TemplateGeneratorPage
