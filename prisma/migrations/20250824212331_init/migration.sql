/*
  Warnings:

  - You are about to drop the `Carrera` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interaccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progreso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestDiagnostico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'teacher', 'student');

-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'in_progress', 'completed');

-- DropForeignKey
ALTER TABLE "public"."Interaccion" DROP CONSTRAINT "Interaccion_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Progreso" DROP CONSTRAINT "Progreso_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Progreso" DROP CONSTRAINT "Progreso_temaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tema" DROP CONSTRAINT "Tema_unidadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestDiagnostico" DROP CONSTRAINT "TestDiagnostico_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestDiagnostico" DROP CONSTRAINT "TestDiagnostico_carreraId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Unidad" DROP CONSTRAINT "Unidad_carreraId_fkey";

-- DropTable
DROP TABLE "public"."Carrera";

-- DropTable
DROP TABLE "public"."Interaccion";

-- DropTable
DROP TABLE "public"."Progreso";

-- DropTable
DROP TABLE "public"."Tema";

-- DropTable
DROP TABLE "public"."TestDiagnostico";

-- DropTable
DROP TABLE "public"."Unidad";

-- DropTable
DROP TABLE "public"."Usuario";

-- DropEnum
DROP TYPE "public"."Estado";

-- DropEnum
DROP TYPE "public"."Nivel";

-- DropEnum
DROP TYPE "public"."Rol";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Career" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "careerId" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiagnosticTest" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "level" "public"."Level" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "careerId" INTEGER NOT NULL,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Progress" (
    "id" SERIAL NOT NULL,
    "status" "public"."Status" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Unit" ADD CONSTRAINT "Unit_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "public"."Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiagnosticTest" ADD CONSTRAINT "DiagnosticTest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiagnosticTest" ADD CONSTRAINT "DiagnosticTest_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "public"."Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
