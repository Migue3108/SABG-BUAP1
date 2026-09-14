export const ROLES = {
  MUNICIPAL: "municipal",
  STUDENT: "student",
  TEACHER: "teacher",
  COORDINATOR: "coordinator",
  ADMIN: "admin",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
