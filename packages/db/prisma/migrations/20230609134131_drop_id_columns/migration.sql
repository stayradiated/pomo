/*
  Warnings:

  - You are about to drop the column `id` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `streamId` on the `Point` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Stream" ("createdAt", "name", "updatedAt", "uuid") SELECT "createdAt", "name", "updatedAt", "uuid" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
CREATE UNIQUE INDEX "Stream_name_key" ON "Stream"("name");
CREATE TABLE "new_Point" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "streamUuid" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Point_streamUuid_fkey" FOREIGN KEY ("streamUuid") REFERENCES "Stream" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "startedAt", "streamUuid", "updatedAt", "uuid", "value") SELECT "createdAt", "startedAt", "streamUuid", "updatedAt", "uuid", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamUuid_startedAt" ON "Point"("streamUuid", "startedAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
