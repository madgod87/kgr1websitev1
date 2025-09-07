import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Gallery | KGR-I",
  description: "Visual documentation of development activities, events, and progress in Krishnagar-I Development Block.",
  keywords: "Gallery, Images, Photos, Development Activities, Events, Krishnagar-I",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
