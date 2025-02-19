/*
  Warnings:

  - You are about to drop the column `playerName` on the `GameSession` table. All the data in the column will be lost.
  - Added the required column `userId` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameSession" DROP COLUMN "playerName",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
