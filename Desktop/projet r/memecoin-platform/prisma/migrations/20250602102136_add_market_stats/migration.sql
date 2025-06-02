-- AlterTable
ALTER TABLE "User" ALTER COLUMN "zth" SET DEFAULT 100;

-- CreateTable
CREATE TABLE "MarketStats" (
    "id" TEXT NOT NULL,
    "pspSupply" INTEGER NOT NULL DEFAULT 0,
    "zthReserve" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketStats_pkey" PRIMARY KEY ("id")
);
