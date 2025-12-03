// Root layout - minimal wrapper, locale-specific layout handles html/body
// This file exists to satisfy Next.js requirements but delegates to [locale]/layout.tsx

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
