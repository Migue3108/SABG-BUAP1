"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Building,
  CheckCircle2,
  Clock,
  RefreshCw,
  Edit2,
  Trash2,
  KeyRound,
  Shield,
} from "lucide-react";
import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { DeleteUserModal } from "./delete-user-modal";
import { ResetPasswordModal } from "./reset-password-modal";

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  mustChangePassword: boolean;
  institution?: string | null;
  phone?: string | null;
  title?: string | null;
  createdAt: string | Date;
};

const ROLE_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  admin: { label: "Administrador", badgeClass: "bg-purple-100 text-purple-800 border-purple-200" },
  coordinator: { label: "Coordinador", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
  teacher: { label: "Docente", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  student: { label: "Estudiante", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  municipal: { label: "Municipal", badgeClass: "bg-sky-100 text-sky-800 border-sky-200" },
};

export function UsersManagerClient({ initialUsers }: { initialUsers: AdminUserItem[] }) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [userToReset, setUserToReset] = useState<AdminUserItem | null>(null);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchUsers() {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error("Error refreshing users:", e);
    } finally {
      setIsRefreshing(false);
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.institution && u.institution.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.active) ||
      (statusFilter === "inactive" && !u.active) ||
      (statusFilter === "pending_password" && u.mustChangePassword);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const pendingPasswordUsers = users.filter((u) => u.mustChangePassword).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-primary font-semibold text-xs uppercase tracking-wider">
              <Users className="h-4 w-4" />
              <span>Administración de Cuentas</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-text-primary md:text-3xl">
              Gestión de Usuarios
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary">
              Control integral de usuarios: alta institucional, edición de perfiles, cambio de roles, restablecimiento de contraseñas temporales y eliminación de cuentas.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover active:scale-[0.98] shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Registrar Usuario
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-6">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <span className="text-xs text-text-muted">Total Cuentas</span>
            <p className="text-xl font-bold text-text-primary mt-0.5">{totalUsers}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5">
            <span className="text-xs text-text-muted">Cuentas Activas</span>
            <p className="text-xl font-bold text-success mt-0.5">{activeUsers}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5">
            <span className="text-xs text-text-muted">Primer Acceso Pendiente</span>
            <p className="text-xl font-bold text-amber-600 mt-0.5">{pendingPasswordUsers}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5">
            <span className="text-xs text-text-muted">Sistema</span>
            <p className="text-xs font-bold text-primary mt-1">Acceso Cerrado BUAP</p>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o institución..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Filter className="h-3.5 w-3.5" />
              <span>Rol:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="all">Todos los roles</option>
              <option value="municipal">Municipal</option>
              <option value="student">Estudiante</option>
              <option value="teacher">Docente</option>
              <option value="coordinator">Coordinador</option>
              <option value="admin">Administrador</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="pending_password">Primer acceso pendiente</option>
              <option value="inactive">Inactivos</option>
            </select>

            <button
              onClick={fetchUsers}
              disabled={isRefreshing}
              title="Actualizar lista"
              className="rounded-lg border border-border p-2 text-text-muted hover:bg-background hover:text-text-primary transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-background text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Institución / Dependencia</th>
                <th className="px-6 py-4 font-semibold">Estado de Clave</th>
                <th className="px-6 py-4 font-semibold">Estatus</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-text-muted">
                    No se encontraron usuarios registrados con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleConfig = ROLE_CONFIG[user.role] || {
                    label: user.role,
                    badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
                  };
                  const dateStr =
                    typeof user.createdAt === "string"
                      ? new Date(user.createdAt).toLocaleDateString("es-MX")
                      : user.createdAt.toLocaleDateString("es-MX");

                  return (
                    <tr key={user.id} className="hover:bg-background/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                        {user.title && (
                          <p className="text-[11px] text-text-muted mt-0.5">{user.title}</p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleConfig.badgeClass}`}
                        >
                          {roleConfig.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {user.institution ? (
                          <span className="flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-text-muted shrink-0" />
                            {user.institution}
                          </span>
                        ) : (
                          <span className="text-text-muted italic">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {user.mustChangePassword ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            Primer acceso pendiente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Contraseña activa
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            user.active ? "text-success" : "text-danger"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.active ? "bg-success" : "bg-danger"
                            }`}
                          />
                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Editar */}
                          <button
                            onClick={() => setUserToEdit(user)}
                            title="Editar usuario y rol"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Restablecer Contraseña */}
                          <button
                            onClick={() => setUserToReset(user)}
                            title="Restablecer contraseña temporal"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:border-amber-500 hover:text-amber-600 transition"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => setUserToDelete(user)}
                            title="Eliminar usuario"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:border-danger hover:text-danger transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Crear Usuario */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUserCreated={fetchUsers}
      />

      {/* Modal: Editar Usuario */}
      <EditUserModal
        isOpen={Boolean(userToEdit)}
        user={userToEdit}
        onClose={() => setUserToEdit(null)}
        onUserUpdated={fetchUsers}
      />

      {/* Modal: Restablecer Contraseña */}
      <ResetPasswordModal
        isOpen={Boolean(userToReset)}
        user={userToReset}
        onClose={() => setUserToReset(null)}
        onPasswordReset={fetchUsers}
      />

      {/* Modal: Eliminar Usuario */}
      <DeleteUserModal
        isOpen={Boolean(userToDelete)}
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onUserDeleted={fetchUsers}
      />
    </div>
  );
}
