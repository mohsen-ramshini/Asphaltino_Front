export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="dashboard-layout">
      {children}
    </section>
  );
}
