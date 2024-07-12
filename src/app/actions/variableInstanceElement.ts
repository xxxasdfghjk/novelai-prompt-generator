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
