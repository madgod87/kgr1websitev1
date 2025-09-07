import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Block Profile | KGR-I",
  description: "Comprehensive profile of Krishnagar-I Development Block - area, population, gram panchayats, officials, and government schemes.",
  keywords: "Block Profile, Krishnagar-I, Gram Panchayats, BDO, Government Officials, Schemes",
};

export default function BlockProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
