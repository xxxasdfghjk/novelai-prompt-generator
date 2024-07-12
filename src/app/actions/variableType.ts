'use server'

import prisma from '@/utils/db'
import { formDataToObject } from '@/utils/formData'
import { z } from 'zod'

export type State =
  | {
      state: 'initial' | 'error'
    }
  | {
      state: 'success'
      insertedId: number
    }

const insertFormSchema = z.object({
  name: z.string().min(1),
  typeList: z.array(
    z.object({
      name: z.string().min(1),
      canEmpty: z
        .string()
        .optional()
        .default('true')
        .transform((e) => e === 'true')
    })
  )
})

export const createVariableType = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = insertFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { name, typeList } = parsed.data
  try {
    const insertData = await prisma.$transaction(async (prisma) => {
      const insertData = await prisma.variableType.create({
        data: { name }
      })
      await prisma.variableTypeElement.createMany({
        data: typeList.map((e, i) => ({
          variableTypeId: insertData.id,
          name: e.name,
          order: i,
          canEmpty: e.canEmpty
        }))
      })
      return insertData
    })
    return { state: 'success', insertedId: insertData.id }
  } catch {
    return { state: 'error' }
  }
}
