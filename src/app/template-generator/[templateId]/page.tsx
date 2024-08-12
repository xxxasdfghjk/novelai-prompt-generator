import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import TemplateGenerator from '@/uiparts/TemplateGenerator'
import React from 'react'
import Content from '@/uiparts/Content'
import prisma from '@/utils/db'
import Link from 'next/link'
import TemplateRegisterButton from '@/uiparts/TemplateRegisterButton'
import { z } from 'zod'

const TemplateGeneratorPage = async ({
  params: { templateId }
}: {
  params: { templateId: string }
}) => {
  const parsedTemplateId = z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10))
    .safeParse(templateId)
  if (!parsedTemplateId.success) {
    return <div>error</div>
  }
  const id = parsedTemplateId.data
  const template = await prisma.template.findFirst({
    where: {
      id
    },
    include: {
      templateVariableRelation: true
    }
  })
  if (template === null) {
    return <div>error</div>
  }
  const templateList = await prisma.template.findMany({})
  const variableTypeList = await prisma.variableType.findMany({})
  const availableVariableType = await prisma.variableType.findMany({
    where: {
      id: {
        in: template.templateVariableRelation.map((e) => e.variableTypeId)
      }
    },
    include: {
      variableInstance: {
        include: {
          variableInstanceElement: { include: { variableTypeElement: true } }
        }
      }
    }
  })

  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Template List">
        <section>
          {templateList.map((e) => (
            <Link key={e.id} href={`/template-generator/${e.id}`}>
              <div>{e.name}</div>
            </Link>
          ))}
        </section>
        <TemplateRegisterButton variableTypeList={variableTypeList} />
      </SideBar>
      <Content>
        <HeaderMenu selected="Template" />
        <TemplateGenerator
          name={template?.name}
          text={template?.text}
          availableVariableType={availableVariableType}
          templateId={template.id}
          variableTypeList={variableTypeList}
        />
      </Content>
    </section>
  )
}

export default TemplateGeneratorPage
