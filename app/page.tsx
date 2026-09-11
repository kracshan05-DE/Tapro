import { createClient } from '@/lib/supabase-server';
import type { Product } from '@/lib/products';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import Marquee from '@/components/Marquee';
import ProductGrid from '@/components/ProductGrid';
import Heritage from '@/components/Heritage';
import Values from '@/components/Values';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  const products = (data ?? []) as Product[];

  return (
    <>
      <Header />
      <Hero />
      <Manifesto productCount={products.length} />
      <Marquee />
      <ProductGrid products={products} />
      <Heritage />
      <Values />
      <Contact />
      <Footer />
    </>
  );
}
