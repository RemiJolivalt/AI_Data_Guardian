import type { ReactNode } from "react";

export const metadata = {
  title: "AI Data Guardian",
  description: "AI Trust Platform — can I trust this data for this use?",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
