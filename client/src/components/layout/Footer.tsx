'use client';
import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: <Github size={18} />, href: 'https://github.com/gfg-rit', label: 'GitHub' },
  { icon: <Twitter size={18} />, href: 'https://twitter.com/gfg_rit', label: 'Twitter' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/company/gfg-rit', label: 'LinkedIn' },
  { icon: <Instagram size={18} />, href: 'https://instagram.com/gfg_rit', label: 'Instagram' },
  { icon: <Mail size={18} />, href: 'mailto:gfg@ritchennai.edu.in', label: 'Email' },
];

const footerLinks = [
  { title: 'Platform', links: [{ label: 'Events', href: '/events' }, { label: 'Resources', href: '/resources' }, { label: 'Challenges', href: '/challenges' }, { label: 'Leaderboard', href: '/leaderboard' }] },
  { title: 'Community', links: [{ label: 'About Us', href: '/#about' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'AI Assistant', href: '/ai' }, { label: 'Feedback', href: '/feedback' }] },
  { title: 'Support', links: [{ label: 'Help Center', href: '/help' }, { label: 'Settings', href: '/settings' }, { label: 'Contact Us', href: '/help#contact' }, { label: 'FAQ', href: '/help#faq' }] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/25">
                GFG
              </div>
              <div>
                <h3 className="font-bold text-white">GFG RIT Campus Hub</h3>
                <p className="text-xs text-gray-500">Rajalakshmi Institute of Technology</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Empowering students with coding skills, technical knowledge, and a vibrant community to prepare for the tech industry.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-green-400 hover:bg-white/10 transition-all hover:scale-110"
                  title={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(section => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GFG RIT Campus Hub. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by GFG RIT Team
          </p>
        </div>
      </div>
    </footer>
  );
}
