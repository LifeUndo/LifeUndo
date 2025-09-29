import Hero from '@/components/Hero';
import FreeKassaBanner from '@/components/FreeKassaBanner';

export default function HomePage() {
  const USE_NEW_FEATURES = process.env.NEWSITE_MODE === 'true';
  
  return (
    <main className="min-h-screen bg-[#0B1220] text-white pt-20">
      <Hero />
      
      {/* FreeKassa баннер только на главной, только если включен фича-флаг */}
      {USE_NEW_FEATURES && <FreeKassaBanner />}
      
      {/* TODO: add Features, Use-cases, Pricing sections */}
    </main>
  );
}