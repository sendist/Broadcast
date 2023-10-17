import prisma from "../../../src/utils/prisma.util"; // Sesuaikan jalur dengan lokasi prisma.util.ts

describe("PrismaClient Instance", () => {
  it("Should create an instance of PrismaClient", () => {
    expect(prisma).toBeDefined();
  });

  it("Should be able to connect to the database", async () => {
    try {
      await prisma.$connect();
    } catch (error) {
      // Handle any connection errors here
      fail("Failed to connect to the database: " + (error as Error).message);
    }
  });

  it("Should be able to disconnect from the database", async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      // Handle any disconnection errors here
      fail(
        "Failed to disconnect from the database: " + (error as Error).message
      );
    }
  });
});
