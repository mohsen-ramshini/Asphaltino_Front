export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="auth-layout">
      {children}
    </section>
  );
}
