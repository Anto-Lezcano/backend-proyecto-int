-- CreateEnum
CREATE TYPE "public"."TestType" AS ENUM ('diagnostic', 'theoretical', 'practical');

-- AlterTable
ALTER TABLE "public"."DiagnosticTest" ADD COLUMN     "type" "public"."TestType" NOT NULL DEFAULT 'diagnostic';

-- AlterTable
ALTER TABLE "public"."Interaction" ADD COLUMN     "levelHigh" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "levelLow" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "levelMedium" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."StudentModel" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "levelLow" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "levelMedium" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "levelHigh" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentModel_studentId_key" ON "public"."StudentModel"("studentId");

-- AddForeignKey
ALTER TABLE "public"."StudentModel" ADD CONSTRAINT "StudentModel_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
