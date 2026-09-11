'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { ProductInput } from '@/lib/products';

export type ActionResult = { ok: true } | { ok: false; error: string };

function requireFields(input: ProductInput): string | null {
  if (!input.name.trim()) return 'Product name is required.';
  return null;
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  const fieldError = requireFields(input);
  if (fieldError) return { ok: false, error: fieldError };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You must be logged in.' };

  const { error } = await supabase.from('products').insert(input);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  const fieldError = requireFields(input);
  if (fieldError) return { ok: false, error: fieldError };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You must be logged in.' };

  const { error } = await supabase.from('products').update(input).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

export async function deleteProduct(id: string, imagePath?: string | null): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You must be logged in.' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  if (imagePath) {
    await supabase.storage.from('product-images').remove([imagePath]);
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { ok: true };
}
