-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('distributing', 'limited', 'ended');

-- CreateEnum
CREATE TYPE "CongestionStatus" AS ENUM ('free', 'slightly_crowded', 'crowded', 'offtime');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "isDistributingTicket" BOOLEAN NOT NULL DEFAULT false,
    "ticketStatus" "TicketStatus",
    "congestionStatus" "CongestionStatus" NOT NULL,
    "eventText" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");
