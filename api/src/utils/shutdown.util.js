import prisma from "../config/prisma.config.js"

export default async function(signal) {
  console.log(`\nReceive ${signal}, shutting down`)
  try {
    console.log('Prisma disconnect')
    await prisma.$disconnect()
  } catch (error) {
    console.log('Error when disconnect', error)
  } finally {
    process.exit(0)
  }
}
