import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}
// eslint-disable-next-line prefer-const
prisma = globalForPrisma.prisma

export default prisma
