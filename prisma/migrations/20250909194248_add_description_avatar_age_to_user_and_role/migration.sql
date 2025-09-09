/*
  Warnings:

  - The primary key for the `document_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `document_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `document_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notification_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `package_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscription_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscription_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tag_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tag_category_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."document_tags" DROP CONSTRAINT "document_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."memberships" DROP CONSTRAINT "memberships_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."packages" DROP CONSTRAINT "packages_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "subscriptions_status_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tag_category_tags" DROP CONSTRAINT "tag_category_tags_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tag_category_tags" DROP CONSTRAINT "tag_category_tags_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."document_statuses" DROP CONSTRAINT "document_statuses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "document_statuses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "document_statuses_id_seq";

-- AlterTable
ALTER TABLE "public"."document_tags" DROP CONSTRAINT "document_tags_pkey",
ALTER COLUMN "tag_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "document_tags_pkey" PRIMARY KEY ("document_id", "tag_id");

-- AlterTable
ALTER TABLE "public"."document_types" DROP CONSTRAINT "document_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "document_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "document_types_id_seq";

-- AlterTable
ALTER TABLE "public"."documents" ALTER COLUMN "type_id" SET DATA TYPE TEXT,
ALTER COLUMN "status_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."memberships" ALTER COLUMN "role_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."notification_types" DROP CONSTRAINT "notification_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notification_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notification_types_id_seq";

-- AlterTable
ALTER TABLE "public"."notifications" ALTER COLUMN "type_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."order_statuses" DROP CONSTRAINT "order_statuses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "order_statuses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "order_statuses_id_seq";

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "status_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."package_statuses" DROP CONSTRAINT "package_statuses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "package_statuses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "package_statuses_id_seq";

-- AlterTable
ALTER TABLE "public"."packages" ALTER COLUMN "status_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "roles_id_seq";

-- AlterTable
ALTER TABLE "public"."subscription_plans" DROP CONSTRAINT "subscription_plans_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscription_plans_id_seq";

-- AlterTable
ALTER TABLE "public"."subscription_statuses" DROP CONSTRAINT "subscription_statuses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscription_statuses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscription_statuses_id_seq";

-- AlterTable
ALTER TABLE "public"."subscriptions" ALTER COLUMN "plan_id" SET DATA TYPE TEXT,
ALTER COLUMN "status_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."tag_categories" DROP CONSTRAINT "tag_categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tag_categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tag_categories_id_seq";

-- AlterTable
ALTER TABLE "public"."tag_category_tags" DROP CONSTRAINT "tag_category_tags_pkey",
ALTER COLUMN "tagId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "tag_category_tags_pkey" PRIMARY KEY ("tagId", "categoryId");

-- AlterTable
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tags_id_seq";

-- AddForeignKey
ALTER TABLE "public"."memberships" ADD CONSTRAINT "memberships_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."document_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."tag_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_tags" ADD CONSTRAINT "document_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."order_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."package_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."subscription_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."notification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
