const { PrismaClient } = require("@prisma/client");

const prismadb = new PrismaClient();

const main = async () => {
  try {
    await prismadb.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Aeronautics" },
        { name: "Olympics" },
        { name: "Engineering" },
        { name: "Filming" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log(`[ERROR_FROM_SEED]`, error);
  }
};

main();
