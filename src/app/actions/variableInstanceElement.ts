'use server'

import prisma from '@/utils/db'
import { formDataToObject } from '@/utils/formData'
import { z } from 'zod'

export type State = {
  state: 'initial' | 'success' | 'error'
}

const updateFormSchema = z.object({
  variableInstanceId: z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10)),
  variableInstanceElement: z.array(
    z.object({
      text: z.string(),
      id: z
        .string()
        .regex(/[0-9]+/)
        .transform((e) => parseInt(e, 10))
    })
  )
})

const deleteFormSchema = z.object({
  variableInstanceId: z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10))
})

const insertFormSchema = z.object({
  variableTypeId: z
    .string()
    .regex(/[0-9]+/)
    .transform((e) => parseInt(e, 10)),
  name: z.string(),
  instanceElementList: z.array(
    z.object({
      id: z
        .string()
        .regex(/[0-9]+/)
        .transform((e) => parseInt(e, 10)),
      value: z.string()
    })
  )
})

export const update = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = updateFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { variableInstanceElement } = parsed.data
  try {
    prisma.$transaction(
      variableInstanceElement.map(({ text, id }) =>
        prisma.variableInstanceElement.update({ data: { text }, where: { id } })
      )
    )
    return { state: 'success' }
  } catch {
    return { state: 'error' }
  }
}

export const deleteInstanceElement = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = deleteFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { variableInstanceId } = parsed.data
  try {
    await prisma.variableInstanceElement.deleteMany({
      where: { variableInstanceId }
    })
    await prisma.variableInstance.deleteMany({
      where: { id: variableInstanceId }
    })
    return { state: 'success' }
  } catch {
    return { state: 'error' }
  }
}

export const insert = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = insertFormSchema.safeParse(formObject)
  if (!parsed.success) {
    return { state: 'error' }
  }
  const { name, instanceElementList, variableTypeId } = parsed.data
  return prisma.$transaction(async (prisma) => {
    try {
      const insertData = await prisma.variableInstance.create({
        data: { name: name, order: 1000, variableTypeId: variableTypeId }
      })
      await prisma.variableInstanceElement.createMany({
        data: instanceElementList.map((e) => ({
          text: e.value,
          variableInstanceId: insertData.id,
          variableTypeElementId: e.id
        }))
      })
      return { state: 'success' }
    } catch {
      return { state: 'error' }
    }
  })
}
