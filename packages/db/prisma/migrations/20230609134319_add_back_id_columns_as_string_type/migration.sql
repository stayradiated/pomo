-- AlterTable
ALTER TABLE "Point" ADD COLUMN "id" TEXT;
ALTER TABLE "Point" ADD COLUMN "streamId" TEXT;

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN "id" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Label" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
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
