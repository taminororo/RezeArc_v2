import { PrismaClient, TicketStatus, CongestionStatus } from "@prisma/client";

const prisma = new PrismaClient();

const EVENTS = [
  {
    eventId: 1,
    eventName: "お化け屋敷",
    isDistributingTicket: true,
    ticketStatus: TicketStatus.limited,
    congestionStatus: CongestionStatus.crowded,
    eventText: null,
    imagePath: "/event_photo1.svg",
  },
  {
    eventId: 2,
    eventName: "ゲスト企画",
    isDistributingTicket: true,
    ticketStatus: TicketStatus.limited,
    congestionStatus: CongestionStatus.offtime,
    eventText: null,
    imagePath: "/event_photo2.svg",
  },
  {
    eventId: 3,
    eventName: "ワークショップ",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.crowded,
    eventText: null,
    imagePath: "/event_photo3.svg",
  },
  {
    eventId: 4,
    eventName: "8番出口",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.slightly_crowded,
    eventText: null,
    imagePath: "/event_photo4.svg",
  },
  {
    eventId: 5,
    eventName: "二人羽織",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.free,
    eventText: null,
    imagePath: "/event_photo5.svg",
  },
  {
    eventId: 6,
    eventName: "技大でバッティング",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.free,
    eventText: null,
    imagePath: "/event_photo6.svg",
  },
  {
    eventId: 7,
    eventName: "ビンゴ大会",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.offtime,
    eventText: null,
    imagePath: "/event_photo7.svg",
  },
  {
    eventId: 8,
    eventName: "ゲーム大会",
    isDistributingTicket: false,
    ticketStatus: null,
    congestionStatus: CongestionStatus.offtime,
    eventText: null,
    imagePath: "/event_photo8.svg",
  },
];

async function main() {
  for (const e of EVENTS) {
    await prisma.event.upsert({
      where: { eventId: e.eventId },
      update: {
        eventName: e.eventName,
        isDistributingTicket: e.isDistributingTicket,
        ticketStatus: e.ticketStatus,
        congestionStatus: e.congestionStatus,
        eventText: e.eventText,
        imagePath: e.imagePath,
      },
      create: e,
    });
  }
  console.log(`Seeded ${EVENTS.length} events`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
