import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | KGR-I",
  description: "Latest notifications, announcements, and important updates from Krishnagar-I Development Block for citizens and stakeholders.",
  keywords: "Notifications, Announcements, Updates, Krishnagar-I, Government Notices",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
