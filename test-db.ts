import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to database...')
    try {
        await prisma.$connect()
        console.log('Successfully connected to database')

        console.log('Testing User query...')
        const count = await prisma.user.count()
        console.log(`Found ${count} users in the database`)

    } catch (e) {
        console.error('Database connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
