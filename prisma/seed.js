import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const variableTypeIdList = await prisma.variableType
    .createManyAndReturn({
      data: new Array(100)
        .fill(0)
        .map((_, index) => ({ name: faker.word.noun() + index }))
    })
    .then((e) => e.flatMap((e) => e.id))

  const variableTypeElementIdList = await prisma.variableTypeElement
    .createManyAndReturn({
      data: variableTypeIdList.flatMap((id, index) => {
        const elementNum = faker.number.int({ min: 2, max: 6 })
        return new Array(elementNum).fill(0).map(() => ({
          canEmpty: faker.datatype.boolean(),
          variableTypeId: id,
          name: faker.word.noun() + index + faker.word.noun(),
          order: index
        }))
      })
    })
    .then((e) =>
      e.flatMap((e) => ({
        variableTypeId: e.variableTypeId,
        variableTypeElementId: e.id
      }))
    )

  const variableInstanceIdList = await prisma.variableInstance
    .createManyAndReturn({
      data: variableTypeIdList.flatMap((id, index) => {
        const num = faker.number.int({ min: 2, max: 10 })
        return new Array(num).fill(0).map(() => ({
          variableTypeId: id,
          name: faker.word.noun(),
          order: index
        }))
      })
    })
    .then((e) =>
      e.flatMap((e) => ({
        variableInstanceId: e.id,
        variableTypeId: e.variableTypeId,
        variableTypeElementIdList: variableTypeElementIdList
          .filter((vte) => e.variableTypeId === vte.variableTypeId)
          .map((e) => e.variableTypeElementId)
      }))
    )

  await prisma.variableInstanceElement.createManyAndReturn({
    data: variableInstanceIdList.flatMap((e1) =>
      e1.variableTypeElementIdList.map((e2) => ({
        variableInstanceId: e1.variableInstanceId,
        variableTypeElementId: e2,
        text: faker.animal.fish()
      }))
    )
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
