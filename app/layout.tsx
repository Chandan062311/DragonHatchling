import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synapse Monitor",
  description:
    "Simulation dashboard contrasting dense transformer activations with sparse monosemantic signals."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
