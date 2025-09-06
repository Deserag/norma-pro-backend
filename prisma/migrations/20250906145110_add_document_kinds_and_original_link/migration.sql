-- CreateEnum
CREATE TYPE "public"."DocumentKind" AS ENUM ('ORIGINAL', 'TRANSLATED', 'FORMATTED');

-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "documentKind" "public"."DocumentKind" NOT NULL DEFAULT 'ORIGINAL',
ADD COLUMN     "language" TEXT,
ADD COLUMN     "original_document_id" TEXT;

-- CreateTable
CREATE TABLE "public"."tag_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT,

    CONSTRAINT "tag_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tag_category_tags" (
    "tagId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT,

    CONSTRAINT "tag_category_tags_pkey" PRIMARY KEY ("tagId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_categories_name_key" ON "public"."tag_categories"("name");

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_original_document_id_fkey" FOREIGN KEY ("original_document_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_categories" ADD CONSTRAINT "tag_categories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."tag_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tag_category_tags" ADD CONSTRAINT "tag_category_tags_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
