/*
  Warnings:

  - You are about to alter the column `createdAt` on the `PointLabel` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `updatedAt` on the `PointLabel` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `createdAt` on the `Stream` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `updatedAt` on the `Stream` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `createdAt` on the `Point` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `startedAt` on the `Point` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `updatedAt` on the `Point` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `createdAt` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `updatedAt` on the `Label` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - Made the column `createdAtInt` on table `PointLabel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAtInt` on table `Stream` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAtInt` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startedAtInt` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAtInt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAtInt` on table `Label` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PointLabel" (
    "pointId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "createdAtInt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "updatedAtInt" INTEGER,

    PRIMARY KEY ("pointId", "labelId"),
    CONSTRAINT "PointLabel_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PointLabel" ("createdAt", "createdAtInt", "labelId", "pointId", "updatedAt", "updatedAtInt") SELECT "createdAt", "createdAtInt", "labelId", "pointId", "updatedAt", "updatedAtInt" FROM "PointLabel";
DROP TABLE "PointLabel";
ALTER TABLE "new_PointLabel" RENAME TO "PointLabel";
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "createdAtInt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "updatedAtInt" INTEGER
);
INSERT INTO "new_Stream" ("createdAt", "createdAtInt", "id", "name", "updatedAt", "updatedAtInt") SELECT "createdAt", "createdAtInt", "id", "name", "updatedAt", "updatedAtInt" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");
CREATE TABLE "new_Point" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streamId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "startedAt" INTEGER NOT NULL,
    "startedAtInt" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "createdAtInt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "updatedAtInt" INTEGER,
    CONSTRAINT "Point_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "createdAtInt", "id", "startedAt", "startedAtInt", "streamId", "updatedAt", "updatedAtInt", "value") SELECT "createdAt", "createdAtInt", "id", "startedAt", "startedAtInt", "streamId", "updatedAt", "updatedAtInt", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamId_startedAtInt" ON "Point"("streamId", "startedAtInt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" INTEGER NOT NULL,
    "createdAtInt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "updatedAtInt" INTEGER,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC'
);
INSERT INTO "new_User" ("createdAt", "createdAtInt", "id", "timeZone", "updatedAt", "updatedAtInt") SELECT "createdAt", "createdAtInt", "id", "timeZone", "updatedAt", "updatedAtInt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "createdAtInt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "updatedAtInt" INTEGER
);
INSERT INTO "new_Label" ("createdAt", "createdAtInt", "id", "name", "updatedAt", "updatedAtInt") SELECT "createdAt", "createdAtInt", "id", "name", "updatedAt", "updatedAtInt" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
