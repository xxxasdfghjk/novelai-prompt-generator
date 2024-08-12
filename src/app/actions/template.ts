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
  text: z.string().min(1),
  variableTypeIdList: z.array(
    z
      .string()
      .regex(/[0-9]+/)
      .transform((e) => parseInt(e, 10))
  )
})

const updateFormSchema = z.object({
  templateId: z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10)),
  name: z.string().min(1),
  text: z.string().min(1),
  variableTypeIdList: z.array(
    z
      .string()
      .regex(/[0-9]+/)
      .transform((e) => parseInt(e, 10))
  )
})

export const createTemplate = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = insertFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { name, variableTypeIdList, text } = parsed.data
  try {
    const insertData = await prisma.$transaction(async (prisma) => {
      const insertData = await prisma.template.create({
        data: { name, text }
      })
      await prisma.templateVariableRelation.createMany({
        data: variableTypeIdList.map((e) => ({
          templateId: insertData.id,
          variableTypeId: e
        }))
      })
      return insertData
    })
    return { state: 'success', insertedId: insertData.id }
  } catch (e) {
    return { state: 'error' }
  }
}

export const updateTemplate = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = updateFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { name, variableTypeIdList, text, templateId } = parsed.data
  try {
    const insertData = await prisma.$transaction(async (prisma) => {
      const insertData = await prisma.template.update({
        where: { id: templateId },
        data: { name, text }
      })
      await prisma.templateVariableRelation.deleteMany({
        where: {
          templateId
        }
      })
      await prisma.templateVariableRelation.createMany({
        data: variableTypeIdList.map((e) => ({
          templateId: insertData.id,
          variableTypeId: e
        }))
      })
      return insertData
    })
    return { state: 'success', insertedId: insertData.id }
  } catch (e) {
    return { state: 'error' }
  }
}
