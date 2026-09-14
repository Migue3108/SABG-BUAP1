import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const email = process.env.SMART_COP_EMAIL ?? "smartcop@sabg.local";
const password = process.env.SMART_COP_PASSWORD ?? "SabgDemo2026!";
const name = process.env.SMART_COP_NAME ?? "Smart Cop";

async function main() {
    try {
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const result = await auth.api.signUpEmail({
                body: { name, email, password },
            });

            user = await prisma.user.findUniqueOrThrow({
                where: { id: result.user.id },
            });
        }

        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                role: "admin",
                active: true,
                mustChangePassword: false,
                emailVerified: true,
            },
        });

        console.log("Usuario mockup listo:");
        console.log({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
        });
    } catch (error) {
        console.error("No se pudo crear el usuario:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();