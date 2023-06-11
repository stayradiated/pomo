/*
  Warnings:

  - The primary key for the `Stream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PointLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `labelId` on the `PointLabel` table. All the data in the column will be lost.
  - You are about to drop the column `pointId` on the `PointLabel` table. All the data in the column will be lost.
  - The primary key for the `Label` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `uuid` on table `Stream` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streamUuid` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `labelUuid` to the `PointLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointUuid` to the `PointLabel` table without a default value. This is not possible if the table is not empty.
  - Made the column `uuid` on table `Label` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Stream" ("createdAt", "id", "name", "updatedAt", "uuid") SELECT "createdAt", "id", "name", "updatedAt", "uuid" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");
CREATE TABLE "new_Point" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "streamId" INTEGER NOT NULL,
    "streamUuid" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Point_streamUuid_fkey" FOREIGN KEY ("streamUuid") REFERENCES "Stream" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "id", "startedAt", "streamId", "streamUuid", "updatedAt", "uuid", "value") SELECT "createdAt", "id", "startedAt", "streamId", "streamUuid", "updatedAt", "uuid", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamId_startedAt" ON "Point"("streamId", "startedAt");
CREATE TABLE "new_PointLabel" (
    "pointUuid" TEXT NOT NULL,
    "labelUuid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,

    PRIMARY KEY ("pointUuid", "labelUuid"),
    CONSTRAINT "PointLabel_pointUuid_fkey" FOREIGN KEY ("pointUuid") REFERENCES "Point" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointLabel_labelUuid_fkey" FOREIGN KEY ("labelUuid") REFERENCES "Label" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PointLabel" ("createdAt", "updatedAt") SELECT "createdAt", "updatedAt" FROM "PointLabel";
DROP TABLE "PointLabel";
ALTER TABLE "new_PointLabel" RENAME TO "PointLabel";
CREATE TABLE "new_Label" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Label" ("createdAt", "id", "name", "updatedAt", "uuid") SELECT "createdAt", "id", "name", "updatedAt", "uuid" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
