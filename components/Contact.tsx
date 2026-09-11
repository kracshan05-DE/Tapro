'use client';

import { useRef, useState, useTransition } from 'react';
import Reveal from './Reveal';
import { submitInquiry } from '@/app/actions/inquiries';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleMagnet(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  }
  function resetMagnet() {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)';
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitInquiry(formData);
      if (result.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <section id="contact">
      <div className="inner wrap">
        <Reveal delay={0} className="eyebrow">
          Get in Touch
        </Reveal>
        <Reveal as="h2" delay={1}>
          Bring Sri Lanka
          <br />
          to your table.
        </Reveal>
        <Reveal as="p" delay={2}>
          For trade enquiries, stockist information, or export partnerships — the Tapro team
          would love to hear from you.
        </Reveal>

        {status === 'sent' ? (
          <Reveal as="p" delay={3} className="form-status">
            Thank you — your enquiry has been sent. We&apos;ll be in touch soon.
          </Reveal>
        ) : (
          <Reveal as="form" delay={3} className="contact-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required />
            </div>
            <button
              type="submit"
              className="magnet-btn"
              disabled={isPending}
              ref={btnRef}
              onMouseMove={handleMagnet}
              onMouseLeave={resetMagnet}
            >
              {isPending ? 'Sending…' : 'Send Enquiry →'}
            </button>
            {status === 'error' && <p className="error-text">{errorMsg}</p>}
          </Reveal>
        )}
      </div>
    </section>
  );
}
