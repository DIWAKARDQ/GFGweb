'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, Briefcase, ExternalLink, Search, Filter, Shield, Database, Cloud, Server, Smartphone, Link, Gamepad2, PenTool, Cpu } from 'lucide-react';

const categories = [
  { key: 'webdev', label: 'Web Development', icon: <BookOpen size={18} />, color: 'from-blue-500 to-cyan-600' },
  { key: 'aiml', label: 'AI & ML', icon: <Brain size={18} />, color: 'from-purple-500 to-violet-600' },
  { key: 'cybersecurity', label: 'Cybersecurity', icon: <Shield size={18} />, color: 'from-red-500 to-rose-600' },
  { key: 'dsa', label: 'Data Structures & Algorithms', icon: <Code size={18} />, color: 'from-green-500 to-emerald-600' },
  { key: 'datascience', label: 'Data Science', icon: <Database size={18} />, color: 'from-teal-500 to-emerald-500' },
  { key: 'cloud', label: 'Cloud Computing', icon: <Cloud size={18} />, color: 'from-sky-400 to-blue-500' },
  { key: 'devops', label: 'DevOps', icon: <Server size={18} />, color: 'from-slate-500 to-gray-600' },
  { key: 'mobile', label: 'Mobile App Development', icon: <Smartphone size={18} />, color: 'from-pink-500 to-rose-500' },
  { key: 'blockchain', label: 'Blockchain', icon: <Link size={18} />, color: 'from-amber-500 to-yellow-600' },
  { key: 'gamedev', label: 'Game Development', icon: <Gamepad2 size={18} />, color: 'from-indigo-500 to-purple-600' },
  { key: 'uiux', label: 'UI/UX Design', icon: <PenTool size={18} />, color: 'from-fuchsia-500 to-pink-600' },
  { key: 'iot', label: 'Internet of Things', icon: <Cpu size={18} />, color: 'from-lime-500 to-green-600' },
];

const sampleResources = [
  { _id: '1', title: 'Data Structures Masterclass', description: 'Comprehensive guide to building optimized code with DSA.', category: 'dsa', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/data-structures/', tags: ['Arrays', 'Trees', 'Graphs'] },
  { _id: '2', title: 'Algorithms for Interviews', description: 'Learn DP, Backtracking, and Greedy techniques to ace MAANG interviews.', category: 'dsa', type: 'article', difficulty: 'advanced', url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', tags: ['DP', 'Sorting'] },
  { _id: '3', title: 'MERN Stack Web Development', description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.', category: 'webdev', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/web-development/', tags: ['React', 'NodeJS'] },
  { _id: '4', title: 'Machine Learning A-Z', description: 'Complete pipeline from data processing to model deployment using Python.', category: 'aiml', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/machine-learning/', tags: ['Python', 'Models'] },
  { _id: '5', title: 'Generative AI & LLMs', description: 'Deep dive into Transformers, GPT models, and prompt engineering.', category: 'aiml', type: 'article', difficulty: 'advanced', url: 'https://www.geeksforgeeks.org/generative-ai/', tags: ['LLM', 'AI'] },
  { _id: '6', title: 'Cybersecurity Basics', description: 'Learn about network security, cryptography, and ethical hacking.', category: 'cybersecurity', type: 'roadmap', difficulty: 'beginner', url: 'https://www.geeksforgeeks.org/cyber-security-tutorial/', tags: ['Security', 'Networking'] },
  { _id: '7', title: 'Data Science with Python', description: 'Master pandas, NumPy, Data Visualization, and statistical modeling.', category: 'datascience', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/data-science-tutorial/', tags: ['Python', 'Pandas'] },
  { _id: '8', title: 'Cloud Computing Fundamentals', description: 'Introduction to AWS, Azure, GCP and cloud architecture.', category: 'cloud', type: 'article', difficulty: 'beginner', url: 'https://www.geeksforgeeks.org/cloud-computing/', tags: ['AWS', 'Azure'] },
  { _id: '9', title: 'DevOps Engineering Guide', description: 'Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.', category: 'devops', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/devops-tutorial/', tags: ['Docker', 'Kubernetes'] },
  { _id: '10', title: 'React Native Development', description: 'Build cross-platform mobile apps using React and JS.', category: 'mobile', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/react-native-tutorial/', tags: ['React Native', 'Mobile'] },
  { _id: '11', title: 'Web3 & Blockchain Basics', description: 'Intro to Smart Contracts, Solidity, and decentralized app development.', category: 'blockchain', type: 'article', difficulty: 'advanced', url: 'https://www.geeksforgeeks.org/introduction-to-web3/', tags: ['Web3', 'Blockchain'] },
  { _id: '12', title: 'Game Development with Unity', description: 'Learn 2D/3D game development basics with Unity and C#.', category: 'gamedev', type: 'roadmap', difficulty: 'intermediate', url: 'https://www.geeksforgeeks.org/game-development/', tags: ['Unity', 'C#'] },
  { _id: '13', title: 'UI/UX Design Process', description: 'Fundamentals of user interfaces, user experience research, and wireframing.', category: 'uiux', type: 'article', difficulty: 'beginner', url: 'https://www.geeksforgeeks.org/ui-ux-design-tutorial/', tags: ['Design', 'Figma'] },
  { _id: '14', title: 'Internet of Things (IoT)', description: 'Introduction to IoT architecture, microcontrollers, and smart systems.', category: 'iot', type: 'article', difficulty: 'beginner', url: 'https://www.geeksforgeeks.org/internet-of-things-iot-tutorial/', tags: ['IoT', 'Hardware'] },
];

const diffColors: Record<string, string> = { beginner: 'text-green-400 bg-green-500/10', intermediate: 'text-amber-400 bg-amber-500/10', advanced: 'text-red-400 bg-red-500/10' };
const typeIcons: Record<string, string> = { article: '📄', roadmap: '🗺️', problem: '💻', collection: '📚' };

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('webdev');
  const [search, setSearch] = useState('');

  const filtered = sampleResources.filter(r =>
    r.category === activeCategory && (search === '' || r.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">📚 Learning Resources</h1>
          <p className="text-gray-400 mb-8">Curated resources to accelerate your learning journey</p>

          {/* Category Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.key ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` : 'glass text-gray-400 hover:text-white'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all max-w-md" />
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource, i) => (
              <motion.a key={resource._id} href={resource.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 card-hover group block">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{typeIcons[resource.type] || '📄'}</span>
                  <ExternalLink size={16} className="text-gray-500 group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[resource.difficulty]}`}>
                    {resource.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs">{resource.type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map(tag => (<span key={tag} className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">{tag}</span>))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
