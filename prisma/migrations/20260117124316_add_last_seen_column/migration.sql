/*
  Warnings:

  - The values [rejected_by_admin,canceled_by_user] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `link` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('pending', 'approved', 'rejected');
ALTER TABLE "BookingRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BookingRequest" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "BookingRequest" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
