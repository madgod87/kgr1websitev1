import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | KGR-I",
  description: "Administrative dashboard for Krishnagar-I Development Block officials and staff.",
  robots: "noindex, nofollow", // Prevent search engines from indexing admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
