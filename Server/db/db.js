// @ts-ignore: Ignore errors related to the global object not being defined

import { PrismaClient } from "@prisma/client"

// In development mode, we attach PrismaClient to the global object to prevent
// creating multiple instances and exhausting the database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global.__prisma || {};

// Create a new PrismaClient instance or use the existing one from the global object
const prisma = globalForPrisma.prisma || new PrismaClient();

// Attach the PrismaClient instance to the global object in development mode
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
