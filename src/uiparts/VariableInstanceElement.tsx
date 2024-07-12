import prisma from '@/utils/db'
import React from 'react'
import VariableInstanceElementForm from './VariableInstanceElementForm'
type Props = {
  variableInstanceId: number
}

const VariableInstanceElement = async ({ variableInstanceId }: Props) => {
  const variableInstanceElementList =
    await prisma.variableInstanceElement.findMany({
      where: {
        variableInstanceId: variableInstanceId
      },
      include: {
        variableTypeElement: true
      },
      orderBy: { variableTypeElement: { order: 'desc' } }
    })
  const variableInstance = await prisma.variableInstance.findFirst({
    where: {
      id: variableInstanceId
    },
    include: {
      variableType: true
    }
  })
  if (variableInstance === null) {
    return <div>ERROR</div>
  }

  return (
    <VariableInstanceElementForm
      variableInstanceName={variableInstance.name}
      variableTypeName={variableInstance.variableType.name}
      variableInstanceId={variableInstanceId}
      variableInstanceElementList={variableInstanceElementList}
      variableTypeId={variableInstance.variableTypeId}
    />
  )
}

export default VariableInstanceElement
