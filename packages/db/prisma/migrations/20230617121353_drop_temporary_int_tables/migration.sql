/*
  Warnings:

  - You are about to drop the column `createdAtInt` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `startedAtInt` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtInt` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `createdAtInt` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtInt` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `createdAtInt` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtInt` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `createdAtInt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtInt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAtInt` on the `PointLabel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtInt` on the `PointLabel` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streamId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "startedAt" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    CONSTRAINT "Point_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "id", "startedAt", "streamId", "updatedAt", "value") SELECT "createdAt", "id", "startedAt", "streamId", "updatedAt", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamId_startedAt" ON "Point"("streamId", "startedAt");
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER
);
INSERT INTO "new_Stream" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");
CREATE TABLE "new_Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER
);
INSERT INTO "new_Label" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC'
);
INSERT INTO "new_User" ("createdAt", "id", "timeZone", "updatedAt") SELECT "createdAt", "id", "timeZone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_PointLabel" (
    "pointId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER,

    PRIMARY KEY ("pointId", "labelId"),
    CONSTRAINT "PointLabel_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PointLabel" ("createdAt", "labelId", "pointId", "updatedAt") SELECT "createdAt", "labelId", "pointId", "updatedAt" FROM "PointLabel";
DROP TABLE "PointLabel";
ALTER TABLE "new_PointLabel" RENAME TO "PointLabel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
