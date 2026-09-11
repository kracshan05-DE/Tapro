import { createClient } from '@/lib/supabase-server';
import type { Product } from '@/lib/products';
import ProductManager from '@/components/admin/ProductManager';
import LogoutButton from '@/components/admin/LogoutButton';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  const products = (data ?? []) as Product[];

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <span className="logo-mark" style={{ fontSize: '1.2rem' }}>
          Tapro <span>Admin</span>
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" target="_blank" rel="noreferrer">
            View Site ↗
          </a>
          <LogoutButton />
        </div>
      </div>
      <main className="admin-main">
        <h1 className="admin-h1">Product Collection</h1>
        <p className="admin-sub">
          Add, edit, or remove products. Changes appear on the live site immediately.
        </p>
        <ProductManager initialProducts={products} />
      </main>
    </div>
  );
}
