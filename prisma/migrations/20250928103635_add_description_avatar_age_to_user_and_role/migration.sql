/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inn]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,company_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_by_id` on table `company_documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `document_statuses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `document_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `document_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `document_versions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `notification_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `order_statuses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `package_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `package_statuses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `packages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `project_documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `subscription_plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `subscription_statuses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `tag_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `tag_category_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `tags` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('PRIVATE', 'GROUP', 'COMPANY');

-- DropForeignKey
ALTER TABLE "public"."company_documents" DROP CONSTRAINT "company_documents_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_statuses" DROP CONSTRAINT "document_statuses_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_tags" DROP CONSTRAINT "document_tags_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_types" DROP CONSTRAINT "document_types_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_versions" DROP CONSTRAINT "document_versions_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notification_types" DROP CONSTRAINT "notification_types_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_statuses" DROP CONSTRAINT "order_statuses_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."package_items" DROP CONSTRAINT "package_items_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."package_statuses" DROP CONSTRAINT "package_statuses_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."packages" DROP CONSTRAINT "packages_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."project_documents" DROP CONSTRAINT "project_documents_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subscription_plans" DROP CONSTRAINT "subscription_plans_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subscription_statuses" DROP CONSTRAINT "subscription_statuses_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "subscriptions_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tag_categories" DROP CONSTRAINT "tag_categories_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tag_category_tags" DROP CONSTRAINT "tag_category_tags_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_created_by_id_fkey";

-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "responsible_user_id" TEXT;

-- AlterTable
ALTER TABLE "public"."company_documents" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."document_statuses" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."document_tags" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."document_types" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."document_versions" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."documents" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."notification_types" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."notifications" ADD COLUMN     "entity_id" TEXT,
ADD COLUMN     "entity_type" TEXT;

-- AlterTable
ALTER TABLE "public"."order_statuses" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."package_items" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."package_statuses" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."packages" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."project_documents" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "created_by_id";

-- AlterTable
ALTER TABLE "public"."subscription_plans" ADD COLUMN     "durationMonths" INTEGER,
ADD COLUMN     "price" DOUBLE PRECISION,
ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."subscription_statuses" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."subscriptions" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tag_categories" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tag_category_tags" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tags" ALTER COLUMN "created_by_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."chats" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "type" "public"."ChatType" NOT NULL DEFAULT 'PRIVATE',
    "company_id" TEXT,
    "project_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_participants" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_company_id_project_id_idx" ON "public"."chats"("company_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_chat_id_user_id_key" ON "public"."chat_participants"("chat_id", "user_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "public"."messages"("chat_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_inn_key" ON "public"."companies"("inn");

-- CreateIndex
CREATE INDEX "companies_name_inn_idx" ON "public"."companies"("name", "inn");

-- CreateIndex
CREATE INDEX "company_documents_company_id_document_id_idx" ON "public"."company_documents"("company_id", "document_id");

-- CreateIndex
CREATE INDEX "document_versions_document_id_idx" ON "public"."document_versions"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_code_key" ON "public"."documents"("code");

-- CreateIndex
CREATE INDEX "documents_code_title_idx" ON "public"."documents"("code", "title");

-- CreateIndex
CREATE INDEX "memberships_user_id_company_id_idx" ON "public"."memberships"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_company_id_key" ON "public"."memberships"("user_id", "company_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "orders_company_id_idx" ON "public"."orders"("company_id");

-- CreateIndex
CREATE INDEX "package_items_package_id_idx" ON "public"."package_items"("package_id");

-- CreateIndex
CREATE INDEX "packages_order_id_idx" ON "public"."packages"("order_id");

-- CreateIndex
CREATE INDEX "project_documents_project_id_document_id_idx" ON "public"."project_documents"("project_id", "document_id");

-- CreateIndex
CREATE INDEX "projects_company_id_idx" ON "public"."projects"("company_id");

-- CreateIndex
CREATE INDEX "subscriptions_company_id_idx" ON "public"."subscriptions"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_responsible_user_id_fkey" FOREIGN KEY ("responsible_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_types" ADD CONSTRAINT "document_types_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_statuses" ADD CONSTRAINT "document_statuses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_versions" ADD CONSTRAINT "document_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_categories" ADD CONSTRAINT "tag_categories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_tags" ADD CONSTRAINT "document_tags_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_documents" ADD CONSTRAINT "project_documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_documents" ADD CONSTRAINT "company_documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_statuses" ADD CONSTRAINT "order_statuses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."package_statuses" ADD CONSTRAINT "package_statuses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."package_items" ADD CONSTRAINT "package_items_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription_plans" ADD CONSTRAINT "subscription_plans_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription_statuses" ADD CONSTRAINT "subscription_statuses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_types" ADD CONSTRAINT "notification_types_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chats" ADD CONSTRAINT "chats_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_participants" ADD CONSTRAINT "chat_participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
