-- AlterTable
ALTER TABLE "public"."roles" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "description" TEXT;
