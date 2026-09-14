import { prisma } from "../lib/prisma";

async function main() {
    const tables = ["user", "session", "account", "verification"];
    for (const table of tables) {
        await prisma.$executeRawUnsafe(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;`);
        console.log(`RLS activado en tabla: ${table}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());

