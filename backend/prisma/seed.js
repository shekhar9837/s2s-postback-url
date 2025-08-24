import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  const affiliates = await prisma.affiliate.createMany({
    data: [{ name: 'Alpha Media' }, { name: 'Beta Partners' }],
    skipDuplicates: true,
  });

  const campaigns = await prisma.campaign.createMany({
    data: [{ name: 'Summer Sale' }, { name: 'Black Friday' }],
    skipDuplicates: true,
  });

  console.log('Seeded:', { affiliates, campaigns });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); return prisma.$disconnect(); });
