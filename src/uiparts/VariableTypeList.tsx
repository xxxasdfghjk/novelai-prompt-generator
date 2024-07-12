import prisma from '@/utils/db'
import Link from 'next/link'
import React from 'react'
import VariableTypeRegisterButton from './VariableTypeRegisterButton'
const VariableTypeList = async () => {
  const variableTypeList = await prisma.variableType.findMany({
    include: { variableInstance: true },
    orderBy: [{ createdAt: 'desc' }]
  })

  return (
    <section className="relative">
      {variableTypeList.map((e) => (
        <Link href={'/variables/' + e.id} key={e.id}>
          <div
            key={e.id}
            className="py-1 pl-2 hover:bg-slate-800 duration-100 rounded-md"
          >
            {e.name}
          </div>
        </Link>
      ))}
      <VariableTypeRegisterButton />
    </section>
  )
}

export default VariableTypeList
