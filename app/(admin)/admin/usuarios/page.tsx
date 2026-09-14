import { prisma } from "@/lib/prisma";
import { UsersManagerClient } from "@/components/admin/users-manager-client";

export const metadata = {
  title: "Gestión de Usuarios · Administración SABG-BUAP",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      mustChangePassword: true,
      institution: true,
      phone: true,
      title: true,
      createdAt: true,
    },
  });

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <UsersManagerClient initialUsers={JSON.parse(JSON.stringify(users))} />
      </div>
    </main>
  );
}
