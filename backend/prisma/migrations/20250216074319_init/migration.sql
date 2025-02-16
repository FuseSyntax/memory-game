-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerName" TEXT NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "moves" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);
