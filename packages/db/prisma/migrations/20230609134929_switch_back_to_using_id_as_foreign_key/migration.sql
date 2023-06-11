/*
  Warnings:

  - The primary key for the `Stream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Label` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PointLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `labelUuid` on the `PointLabel` table. All the data in the column will be lost.
  - You are about to drop the column `pointUuid` on the `PointLabel` table. All the data in the column will be lost.
  - Made the column `id` on table `Stream` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streamId` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `labelId` to the `PointLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointId` to the `PointLabel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "uuid" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Stream" ("createdAt", "id", "name", "updatedAt", "uuid") SELECT "createdAt", "id", "name", "updatedAt", "uuid" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");
CREATE TABLE "new_Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Label" ("createdAt", "id", "name", "updatedAt", "uuid") SELECT "createdAt", "id", "name", "updatedAt", "uuid" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");
CREATE TABLE "new_Point" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "streamUuid" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Point_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "id", "startedAt", "streamId", "streamUuid", "updatedAt", "uuid", "value") SELECT "createdAt", "id", "startedAt", "streamId", "streamUuid", "updatedAt", "uuid", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamId_startedAt" ON "Point"("streamId", "startedAt");
CREATE TABLE "new_PointLabel" (
    "pointId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,

    PRIMARY KEY ("pointId", "labelId"),
    CONSTRAINT "PointLabel_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PointLabel" ("createdAt", "updatedAt") SELECT "createdAt", "updatedAt" FROM "PointLabel";
DROP TABLE "PointLabel";
ALTER TABLE "new_PointLabel" RENAME TO "PointLabel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
