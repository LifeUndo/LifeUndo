import ApiPageClient from "./ApiPageClient";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function ApiPage() {
  return <ApiPageClient />;
}
