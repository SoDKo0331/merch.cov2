// ContactModal.tsx
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  toEmail?: string; // default: contact@merchand.co
}

type ServiceOption =
  | 'Custom Design'
  | 'Swag Box'
  | 'Branding'
  | 'Bulk Order'
  | 'Other';

const DEFAULT_SERVICE: ServiceOption = 'Custom Design';

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  toEmail = 'contact@merchand.co',
}) => {
  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: DEFAULT_SERVICE as ServiceOption,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const nameOk = formData.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const msgOk = formData.message.trim().length >= 10;
    return nameOk && emailOk && msgOk && !isSending;
  }, [formData, isSending]);

  // Focus management + lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus first field (next tick for animation mount)
    const t = window.setTimeout(() => firstInputRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const resetAndClose = () => {
    setSubmitted(false);
    setIsSending(false);
    setErrorMsg(null);
    setFormData({ name: '', email: '', service: DEFAULT_SERVICE, message: '' });
    onClose();
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(`New Inquiry: ${formData.service}`);
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\nService: ${formData.service}\n\nMessage:\n${formData.message.trim()}`
    );

    // Safer than window.location.href (doesn't replace the current page)
    window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, '_self');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setErrorMsg(null);
    setIsSending(true);

    try {
      openMailClient();

      // NOTE: mailto cannot confirm delivery. We just show a success state.
      setSubmitted(true);

      window.setTimeout(() => {
        resetAndClose();
      }, 1800);
    } catch (err: any) {
      setSubmitted(false);
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={false}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-[#B9FF00]/15 backdrop-blur-md"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-white/20"
          >
            {/* header */}
            <div className="sticky top-0 z-20 bg-[#0042D2]/90 backdrop-blur-md text-white px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 id={titleId} className="text-xl font-display uppercase tracking-wide">
                    Contact Us
                  </h2>
                  <p id={descId} className="text-xs text-white/80 mt-1">
                    Tell us what you need — we’ll respond shortly.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/25"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">
                    close
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {!submitted ? (
                <>
                  {errorMsg && (
                    <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10">
                      <p className="text-xs text-red-700">{errorMsg}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wide text-[#0042D2] px-0.5">
                        Name
                      </label>
                      <input
                        ref={firstInputRef}
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl bg-gray-50 border border-[#0042D2]/20 p-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0042D2] focus:ring-4 focus:ring-[#0042D2]/10 transition"
                        placeholder="Enter your name"
                        disabled={isSending}
                        autoComplete="name"
                        inputMode="text"
                      />
                      <p className="text-[11px] text-gray-500">
                        Use your full name (min 2 characters).
                      </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wide text-[#0042D2] px-0.5">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl bg-gray-50 border border-[#0042D2]/20 p-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0042D2] focus:ring-4 focus:ring-[#0042D2]/10 transition"
                        placeholder="you@company.com"
                        disabled={isSending}
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>

                    {/* Service */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wide text-[#0042D2] px-0.5">
                        Service
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            service: e.target.value as ServiceOption,
                          })
                        }
                        className="w-full rounded-xl bg-gray-50 border border-[#0042D2]/20 p-3 text-sm text-gray-800 outline-none focus:border-[#0042D2] focus:ring-4 focus:ring-[#0042D2]/10 transition"
                        disabled={isSending}
                      >
                        <option>Custom Design</option>
                        <option>Swag Box</option>
                        <option>Branding</option>
                        <option>Bulk Order</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wide text-[#0042D2] px-0.5">
                        Message
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full h-28 rounded-xl bg-gray-50 border border-[#0042D2]/20 p-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0042D2] focus:ring-4 focus:ring-[#0042D2]/10 transition resize-none"
                        placeholder="Tell us what you’re looking for (min 10 characters)…"
                        disabled={isSending}
                      />
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>Be specific (timeline, quantity, budget if relevant).</span>
                        <span
                          className={
                            formData.message.trim().length < 10 ? 'text-red-600' : 'text-gray-500'
                          }
                        >
                          {formData.message.trim().length}/10
                        </span>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full rounded-xl py-3 text-[12px] font-bold uppercase tracking-wide text-white
                                   bg-[#0042D2] hover:bg-[#0042D2]/90 disabled:opacity-45 disabled:hover:bg-[#0042D2]
                                   transition focus:outline-none focus:ring-4 focus:ring-[#0042D2]/20"
                      >
                        {isSending ? 'Opening email…' : 'Send'}
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl py-3 text-[12px] font-bold uppercase tracking-wide
                                   border border-[#0042D2]/20 text-[#0042D2] hover:bg-[#0042D2]/5 transition"
                      >
                        Cancel
                      </button>

                      <p className="text-[11px] text-gray-500">
                        This opens your default email app (mailto). If nothing happens, copy our email:{' '}
                        <span className="font-medium text-gray-700">{toEmail}</span>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full grid place-items-center bg-[#B9FF00]/25 ring-1 ring-[#0042D2]/15">
                    <span className="material-symbols-outlined text-[#0042D2] text-xl">
                      check
                    </span>
                  </div>
                  <h3 className="text-lg font-display text-gray-900 uppercase tracking-wide">
                    Ready!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[28ch]">
                    Your email client should be open. We’ll get back to you soon.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="mt-2 px-6 py-2 rounded-xl bg-[#0042D2] text-white text-[12px] font-bold uppercase tracking-wide hover:bg-[#0042D2]/90 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;