export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ display: 'none' }}>{children}</div>;
}
