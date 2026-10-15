import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gsap } from 'gsap';
import { MENU, SIGNATURE, formatPrice } from '../../config/brand';
import { sendOrder } from '../../lib/telegram';
import { startScroll, stopScroll } from '../../lib/scroll';
import { Button } from './Button';

type Props = { open: boolean; drinkId?: string; onClose: () => void };

const OPTIONS = [
  ...MENU.map((m) => ({ id: m.id, label: `${m.name} — ${formatPrice(m.price)}` })),
  { id: 'reserve', label: `${SIGNATURE.title} (250 g) — 189 000 so'm` },
];

const formatPhone = (raw: string) => {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('998')) d = d.slice(3);
  d = d.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return `+998 ${parts.join(' ')}`.trimEnd() + (parts.length ? '' : ' ');
};

/** Order form → Telegram bot. See src/config/telegram.ts for the token / chat ID. */
export function OrderModal({ open, drinkId, onClose }: Props) {
  const [mounted, setMounted] = useState(open);
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', phone: '+998 ', drink: drinkId ?? MENU[1].id, qty: 1, note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setStatus('idle');
      if (drinkId) setForm((f) => ({ ...f, drink: drinkId }));
    }
  }, [open, drinkId]);

  useEffect(() => {
    if (!mounted || !overlay.current || !panel.current) return;
    if (open) {
      stopScroll();
      gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo(panel.current, { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', onComplete: () => firstInput.current?.focus() });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    } else {
      gsap.to(panel.current, { y: 40, opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to(overlay.current, { opacity: 0, duration: 0.45, delay: 0.1, onComplete: () => { setMounted(false); startScroll(); } });
    }
  }, [open, mounted, onClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Ismingizni kiriting';
    if (form.phone.replace(/\D/g, '').length !== 12) e.phone = "Telefon raqam to'liq emas";
    if (!form.drink) e.drink = 'Ichimlikni tanlang';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const drink = OPTIONS.find((o) => o.id === form.drink)?.label ?? form.drink;
      const res = await sendOrder({ name: form.name.trim(), phone: form.phone, drink, qty: form.qty, note: form.note.trim() });
      setDemo(!!res.demo);
      setStatus(res.ok ? 'ok' : 'error');
      if (res.ok) setForm((f) => ({ ...f, name: '', phone: '+998 ', note: '', qty: 1 }));
    } catch {
      setStatus('error');
    }
  };

  if (!mounted) return null;

  return (
    <div ref={overlay} className="fixed inset-0 z-[80] flex items-end justify-center bg-espresso-900/70 p-0 backdrop-blur-md sm:items-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="order-title">
      <div ref={panel} onClick={(e) => e.stopPropagation()} data-lenis-prevent className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[32px] bg-cream p-7 text-espresso shadow-lift sm:rounded-[32px] sm:p-10">
        <button onClick={onClose} aria-label="Yopish" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-espresso/15 transition hover:rotate-90 hover:bg-espresso hover:text-cream">✕</button>

        {status === 'ok' ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-4xl">☕</div>
            <h3 id="order-title" className="h-display text-4xl">Rahmat!</h3>
            <p className="mt-4 text-espresso/70">Buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
            {demo && <p className="mt-3 text-xs text-caramel-600">Demo rejim: Telegram bot hali sozlanmagan (src/config/telegram.ts).</p>}
            <Button variant="dark" className="mt-8" onClick={onClose}>Yopish</Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="eyebrow !text-caramel-600">Buyurtma</span>
            <h3 id="order-title" className="h-display mt-3 text-4xl sm:text-5xl">Finjoningizni tanlang</h3>
            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-espresso/60" htmlFor="o-name">Ism</label>
                <input ref={firstInput} id="o-name" className="field" placeholder="Ismingiz" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-espresso/60" htmlFor="o-phone">Telefon</label>
                <input id="o-phone" className="field" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} autoComplete="tel" />
                {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-espresso/60" htmlFor="o-drink">Ichimlik</label>
                  <select id="o-drink" className="field" value={form.drink} onChange={(e) => setForm({ ...form, drink: e.target.value })}>
                    {OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <span className="mb-2 block text-xs uppercase tracking-widest text-espresso/60">Soni</span>
                  <div className="flex h-[58px] items-center rounded-2xl border border-espresso/15 bg-white/60">
                    <button type="button" className="h-full w-10 text-lg" onClick={() => setForm({ ...form, qty: Math.max(1, form.qty - 1) })} aria-label="Kamaytirish">−</button>
                    <span className="w-6 text-center tabular-nums">{form.qty}</span>
                    <button type="button" className="h-full w-10 text-lg" onClick={() => setForm({ ...form, qty: Math.min(20, form.qty + 1) })} aria-label="Ko'paytirish">+</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-espresso/60" htmlFor="o-note">Izoh (ixtiyoriy)</label>
                <textarea id="o-note" rows={2} className="field resize-none" placeholder="Masalan: shakarsiz, bodom suti bilan" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>
            {status === 'error' && <p className="mt-4 text-sm text-red-700">Xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki qo'ng'iroq qiling.</p>}
            <Button type="submit" variant="dark" className="mt-8 w-full" arrow disabled={status === 'sending'}>
              {status === 'sending' ? 'Yuborilmoqda…' : 'Buyurtma berish'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
