'use server';

import { createClient } from '@/lib/supabase-server';

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in every field.' };
  }
  if (!email.includes('@')) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('inquiries').insert({ name, email, message });

  if (error) {
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return { ok: true };
}
