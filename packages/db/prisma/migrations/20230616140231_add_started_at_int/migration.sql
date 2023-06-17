-- AlterTable
ALTER TABLE "Point" ADD COLUMN "startedAtInt" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC'
);
