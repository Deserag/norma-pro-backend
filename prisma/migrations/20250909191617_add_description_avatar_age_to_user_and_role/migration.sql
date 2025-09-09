/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_created_by_id_fkey";

-- AlterTable
ALTER TABLE "public"."roles" DROP COLUMN "created_by_id";
