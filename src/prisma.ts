import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient(/*{ log: ['query'] }*/);
export type PrismaTransaction = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

export default prisma;