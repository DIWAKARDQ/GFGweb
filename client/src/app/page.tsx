'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Code, Users, Trophy, Zap, BookOpen, Github, Star, Rocket } from 'lucide-react';

const stats = [
  { icon: <Users className="text-green-400" size={28} />, value: '500+', label: 'Active Members' },
  { icon: <Calendar className="text-blue-400" size={28} />, value: '50+', label: 'Events Hosted' },
  { icon: <Code className="text-purple-400" size={28} />, value: '1000+', label: 'Challenges Solved' },
  { icon: <Trophy className="text-amber-400" size={28} />, value: '20+', label: 'Hackathon Wins' },
];

const features = [
  { icon: <Code size={24} />, title: 'Daily Coding Challenges', desc: 'Sharpen your skills with curated daily problems across all difficulty levels.', color: 'from-green-500 to-emerald-600' },
  { icon: <Calendar size={24} />, title: 'Event Management', desc: 'Workshops, hackathons, and seminars — never miss a club event.', color: 'from-blue-500 to-cyan-600' },
  { icon: <BookOpen size={24} />, title: 'Learning Resources', desc: 'DSA, Web Dev, AI/ML, and Interview Prep curated by our community.', color: 'from-purple-500 to-violet-600' },
  { icon: <Trophy size={24} />, title: 'Leaderboard & Achievements', desc: 'Compete with peers, earn badges, and climb the rankings.', color: 'from-amber-500 to-orange-600' },
  { icon: <Github size={24} />, title: 'GitHub Integration', desc: 'Sync your GitHub profile and showcase your open source contributions.', color: 'from-gray-500 to-gray-600' },
  { icon: <Zap size={24} />, title: 'AI Coding Assistant', desc: 'Get instant help with debugging, code explanations, and learning recommendations.', color: 'from-pink-500 to-rose-600' },
];

const eventHighlights = [
  { title: 'Workshops & Bootcamps', desc: 'Hands-on sessions on DSA, Web Dev, and more — led by experts.', icon: '🛠️', color: 'from-blue-500/20 to-cyan-500/20' },
  { title: 'Hackathons', desc: 'Build amazing projects in intense 24-hour coding marathons.', icon: '🚀', color: 'from-purple-500/20 to-violet-500/20' },
  { title: 'Tech Talks & Seminars', desc: 'Industry leaders share insights on the latest in tech.', icon: '🎤', color: 'from-amber-500/20 to-orange-500/20' },
];

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  return (
    <div className="bg-grid">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
              <Star size={14} className="fill-green-400" />
              Official Campus Club
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">GeeksforGeeks</span>
              <br />
              <span className="text-white">Campus Club</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-green-400/80 font-medium mb-4">
              Rajalakshmi Institute of Technology
            </motion.p>
            
            <motion.p variants={fadeInUp} className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Empowering students with coding skills, tech knowledge, and community collaboration. 
              Join 500+ members building the future of technology.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all hover:scale-105 flex items-center gap-2">
                <Rocket size={20} />
                Join the Community
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/events"
                className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center gap-2">
                <Calendar size={20} />
                Explore Events
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="glass rounded-2xl p-6 text-center card-hover">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-white mb-6">About <span className="gradient-text">GFG RIT</span></h2>
              <p className="text-gray-400 text-lg mb-6">
                We are the official GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology, Chennai. 
                Our mission is to build a vibrant coding community that empowers every student to excel in technology.
              </p>
              <div className="space-y-4">
                {['Collaborative learning environment', 'Industry-ready skill development', 'Regular hackathons & workshops', 'Peer mentorship & guidance'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><Zap size={12} className="text-green-400" /></div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Our Mission & Vision</h3>
              <p className="text-gray-400 mb-4">
                To create a collaborative learning ecosystem where every student can enhance their 
                technical skills, build real-world projects, and prepare for the tech industry.
              </p>
              <p className="text-gray-400">
                We envision a campus where coding is a culture, innovation is the norm, 
                and every student is equipped to solve the world&apos;s toughest challenges.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-4">What We <span className="gradient-text">Offer</span></motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to level up your coding journey</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="glass rounded-2xl p-6 card-hover group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Upcoming <span className="gradient-text">Events</span></h2>
                <p className="text-gray-400">Don&apos;t miss out on these exciting opportunities</p>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {eventHighlights.map((item, i) => (
                <motion.div key={i} variants={fadeInUp}
                  className="glass rounded-2xl overflow-hidden card-hover group">
                  <div className={`h-40 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{item.desc}</p>
                    <Link href="/events" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all inline-block">
                      Browse Events
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10" />
            <div className="relative">
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-4">
                Ready to <span className="gradient-text">Level Up</span>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                Join the GFG RIT Campus Club and start your journey towards becoming a better programmer.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all hover:scale-105">
                  <Rocket size={20} />
                  Get Started Today
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
