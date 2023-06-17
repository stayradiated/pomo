-- AlterTable
ALTER TABLE "Label" ADD COLUMN "createdAtInt" INTEGER;
ALTER TABLE "Label" ADD COLUMN "updatedAtInt" INTEGER;

-- AlterTable
ALTER TABLE "Point" ADD COLUMN "createdAtInt" INTEGER;
ALTER TABLE "Point" ADD COLUMN "updatedAtInt" INTEGER;

-- AlterTable
ALTER TABLE "PointLabel" ADD COLUMN "createdAtInt" INTEGER;
ALTER TABLE "PointLabel" ADD COLUMN "updatedAtInt" INTEGER;

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN "createdAtInt" INTEGER;
ALTER TABLE "Stream" ADD COLUMN "updatedAtInt" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "createdAtInt" INTEGER;
ALTER TABLE "User" ADD COLUMN "updatedAtInt" INTEGER;
