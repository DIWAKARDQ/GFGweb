'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const categories = ['general', 'events', 'challenges', 'resources', 'platform', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setRating(0); setMessage(''); }, 3000);
  };

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">💬 Feedback</h1>
          <p className="text-gray-400 mb-8">Help us improve your experience</p>

          {submitted ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-gray-400">Your feedback helps us improve the platform.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">How would you rate your experience?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110">
                      <Star size={32} className={`transition-colors ${star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && <p className="text-sm text-gray-500 mt-2">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${category === cat ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Your Feedback</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} required
                  placeholder="Tell us what you think — what's working well, what could be better..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all resize-none" rows={5} />
              </div>

              <button type="submit" disabled={rating === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Send size={16} /> Submit Feedback
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
