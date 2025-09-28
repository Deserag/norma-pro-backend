-- DropForeignKey
ALTER TABLE "public"."memberships" DROP CONSTRAINT "memberships_company_id_fkey";

-- AlterTable
ALTER TABLE "public"."memberships" ALTER COLUMN "company_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."memberships" ADD CONSTRAINT "memberships_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
