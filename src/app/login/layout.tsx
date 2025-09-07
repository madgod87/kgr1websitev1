import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | KGR-I",
  description: "Secure admin login portal for Krishnagar-I Development Block officials.",
  robots: "noindex, nofollow", // Prevent search engines from indexing admin pages
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
