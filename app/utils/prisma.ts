import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import { env } from './env'

const libsql = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
})

const adapter = new PrismaLibSQL(libsql)

const prismaGlobal = globalThis as typeof globalThis & {
    prisma?: PrismaClient
}

export const prisma: PrismaClient
    = prismaGlobal.prisma
    || new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

// if (process.env.NODE_ENV !== 'production') {
//     prismaGlobal.prisma = prisma
// }
