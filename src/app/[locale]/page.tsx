import Hero from '@/components/Hero';

export default function HomePage() {
  // ВНИМАНИЕ: Header/Footer рендерятся в layout.tsx — здесь только контент страницы.
  return (
    <main className="min-h-screen bg-[#0B1220] text-white pt-20">
      <Hero />
      {/* TODO: add Features, Use-cases, Pricing sections */}
    </main>
  );
}