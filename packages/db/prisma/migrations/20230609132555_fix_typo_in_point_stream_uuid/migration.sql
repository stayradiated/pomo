/*
  Warnings:

  - You are about to drop the column `streamUiud` on the `Point` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point" (
    "uuid" TEXT,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "streamId" INTEGER NOT NULL,
    "streamUuid" TEXT,
    "value" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Point_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("createdAt", "id", "startedAt", "streamId", "updatedAt", "uuid", "value") SELECT "createdAt", "id", "startedAt", "streamId", "updatedAt", "uuid", "value" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE INDEX "streamId_startedAt" ON "Point"("streamId", "startedAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
