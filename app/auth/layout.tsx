export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth-theme-forced min-h-screen bg-background text-text-primary">
      {children}
    </div>
  );
}
