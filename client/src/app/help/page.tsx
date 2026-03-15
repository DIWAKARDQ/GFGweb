'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, Send, Bot, Mail, Phone, MapPin } from 'lucide-react';

const faqs = [
  { q: 'How do I join the GFG RIT Campus Club?', a: 'Simply register on this platform with your college email. You can also visit our club coordinator during club hours.' },
  { q: 'How does the daily coding challenge work?', a: 'A new coding challenge is posted every day. Solve it and mark it as completed to build your streak and earn points on the leaderboard.' },
  { q: 'Can I connect my GitHub account?', a: 'Yes! Go to Settings → GitHub Connection and enter your GitHub username. We\'ll sync your contribution data automatically.' },
  { q: 'How are leaderboard points calculated?', a: 'Points are based on three categories: Daily Challenge completion, GitHub contributions, and Event participation. Each category contributes to your total score.' },
  { q: 'How can I become a club admin?', a: 'Club admins are selected by the faculty coordinator. Show your dedication through active participation and contributions to the community.' },
  { q: 'Are the events free for all students?', a: 'Most events are free for registered club members. Some special workshops or certifications may have a nominal fee.' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">🆘 Help & Support</h1>
          <p className="text-gray-400 mb-8">Find answers to common questions or reach out to us</p>

          {/* FAQ */}
          <div id="faq" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><HelpCircle size={24} /> Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-all">
                    <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4">
                      <p className="text-sm text-gray-400">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><MessageCircle size={24} /> Contact Us</h2>
              <div className="glass rounded-2xl p-6">
                <form onSubmit={e => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); }} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Name</label>
                    <input type="text" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email</label>
                    <input type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} required placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Message</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all resize-none" rows={4} />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2">
                    {sent ? '✓ Sent!' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">📍 Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3"><Mail size={18} className="text-green-400 mt-0.5" /><div><div className="text-sm text-white">Email</div><div className="text-sm text-gray-400">gfg@ritchennai.edu.in</div></div></div>
                  <div className="flex items-start gap-3"><Phone size={18} className="text-green-400 mt-0.5" /><div><div className="text-sm text-white">Phone</div><div className="text-sm text-gray-400">+91 98765 43210</div></div></div>
                  <div className="flex items-start gap-3"><MapPin size={18} className="text-green-400 mt-0.5" /><div><div className="text-sm text-white">Address</div><div className="text-sm text-gray-400">Rajalakshmi Institute of Technology, Kuthambakkam, Chennai - 602 124</div></div></div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Bot size={18} /> AI Support</h3>
                <p className="text-sm text-gray-400 mb-4">Need quick help with coding? Try our AI assistant!</p>
                <a href="/ai" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg transition-all inline-flex items-center gap-2">
                  <Bot size={16} /> Open AI Assistant
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
