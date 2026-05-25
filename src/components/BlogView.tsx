import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Clock, Tag, ChevronRight, User, Calendar, ArrowLeft, Heart, MessageSquare, Send } from 'lucide-react';
import GlowButton from './GlowButton';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Compiling the Core: Secrets of Distributed Sandbox Execution",
    excerpt: "Discover the architectural principles behind building highly isolated, sandboxed runtimes for instant multi-tenant engineering laboratory tests.",
    category: "Engineering Labs",
    author: "Dr. Vikram Sen",
    role: "Dean of Architecture",
    date: "May 20, 2026",
    readTime: "7 min read",
    views: 1420,
    likes: 312,
    tags: ["Docker", "Sandbox", "Distributed Systems", "Security"],
    content: [
      "In modern professional training simulators, student programs run inside multi-tenant infrastructure. Providing absolute host isolation while offering millisecond-level compile feedbacks remains a challenging engineering hurdle.",
      "At InternForge Research, we developed an orchestration design where lightweight sandboxes are pre-warmed using secure system pools. These sandboxes execute isolated scripts using gVisor secure container kernels, disabling unsafe system calls while virtualizing IPC primitives.",
      "Memory segments are monitored in real-time. If a candidate simulation exceeds 250MB, a memory watchdog gracefully logs execution telemetry, prints core dumps, and recycles resources in less than 40 milliseconds.",
      "The results have been transformative. Candidates receive precise compilers feedbacks without risking hypervisor compromises, setting a new paradigm for industrial systems instruction and engineering laboratory safety."
    ]
  },
  {
    id: "post-2",
    title: "Mastering Mapped Memory: Inside High-Availability Fallback Stores",
    excerpt: "How InternForge implements a seamless in-memory fallback store to guarantee 100% platform availability even during cloud database migrations.",
    category: "Systems Design",
    author: "Arjun Dev",
    role: "Core Infra Lead",
    date: "May 18, 2026",
    readTime: "5 min read",
    views: 985,
    likes: 214,
    tags: ["MongoDB", "RAM Stores", "Data Structures", "TypeScript"],
    content: [
      "Database resilience is paramount. During live cohort evaluations, even 10 seconds of MongoDB connectivity fluctuations can interrupt student lab evaluations.",
      "Our solution is an elegant dual-routing active fallback engine. When MongoDB enters an unstable state, our middleware dynamically captures state mutations and transfers them to a thread-safe, hot in-memory fallback store.",
      "This RAM-mapped store mimics MongoDB schemas exactly. Transactions continue to commit instantly locally. When connectivity restores, a background worker reconciles mutations using idempotent conflict-free replicated data types (CRDTs).",
      "By engineering around transient network failures instead of merely alerting administrators, we maintain flawless sandbox performance with zero platform outages logged."
    ]
  },
  {
    id: "post-3",
    title: "Rust vs C++: System Sandbox Compilation Benchmarks",
    excerpt: "Rigorous research comparing compiled language performance, memory footprints, and security profiles inside isolated container systems.",
    category: "CS Theory",
    author: "Prof. Priya Nair",
    role: "Systems Research Advisor",
    date: "May 15, 2026",
    readTime: "9 min read",
    views: 2450,
    likes: 689,
    tags: ["Rust", "C++", "Compilers", "Benchmarks"],
    content: [
      "System level languages form the bedrock of InternForge. When deciding between Rust and modern C++ for our low-level network instrumentation modules, we compiled an extensive telemetry benchmark matrix.",
      "Over 10,000 distinct parallel simulation trials were executed. Warm-start compilations under gcc-13 and rustc-1.78 showed fascinating memory overhead trends.",
      "While C++ compiled binary sizes remained on average 12% smaller, the memory footprint of Rust binaries was significantly more predictable at runtime under extreme concurrency pressure due to the borrow checker eliminating dynamic allocations.",
      "Security compliance was the final deciding factor: Rust's compile-time memory safety guarantees eliminated 100% of out-of-bounds pointer exploits during sandbox penetration testing vectors. We have fully standardized our kernel telemetry agents in Rust."
    ]
  },
  {
    id: "post-4",
    title: "The Road to DevOps Excellence: Streamlining Telemetry Probes",
    excerpt: "How a unified metrics collection structure empowers active candidates to diagnose network latency during cloud-native laboratory tests.",
    category: "DevOps & Cloud",
    author: "Kabir Mehta",
    role: "Site Reliability Architect",
    date: "May 10, 2026",
    readTime: "6 min read",
    views: 840,
    likes: 128,
    tags: ["Telemetry", "DevOps", "Prometheus", "SRE"],
    content: [
      "Diagnostic latency in Cloud Native environments blocks engineer productivity. It is common for students to lose time debugging connection dropouts instead of writing logical scripts.",
      "To counter this, InternForge integrated a micro-telemetry parser that streams container logs directly to the dashboard, providing exact timing data on socket handshakes, TCP retransmissions, and memory pool allocations.",
      "By exposing standard SRE tools right in the classroom environment, candidates learn to inspect network traces and diagnose bugs like real systems engineers.",
      "Ultimately, DevOps is about visibility. Empowering students with the same rich debugging graphs used by senior engineers turns frustrating roadblocks into rapid learning feedback loops."
    ]
  }
];

export default function BlogView() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Custom user feedback/comments store
  const [comments, setComments] = useState<{ [postId: string]: { name: string; text: string; time: string }[] }>({
    "post-1": [
      { name: "Suresh K.", text: "Wow, using gVisor for fast warm-start bounds explains how the simulator compiles so quickly!", time: "2 hrs ago" }
    ]
  });
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = {
      name: commentName.trim(),
      text: commentText.trim(),
      time: "Just now"
    };

    setComments({
      ...comments,
      [postId]: [newComment, ...(comments[postId] || [])]
    });
    setCommentName('');
    setCommentText('');
  };

  return (
    <div className="w-full flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 font-sans select-none">
      
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-mono font-bold text-indigo-300 tracking-widest uppercase">
                  RESEARCH & TECHNICAL BLOGS
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
                InternForge Engineering Hub
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
                Explore deep architectural system articles, developer tutorials, and research labs reports straight from our Core Infrastructure and Systems Engineering teams.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111827]/70 border border-white/5 p-4 rounded-2xl relative backdrop-blur-md">
              <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all select-none cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Query architecture tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => {
                const isLiked = likedPosts.includes(post.id);
                return (
                  <motion.div
                    key={post.id}
                    layoutId={`card-${post.id}`}
                    onClick={() => setSelectedPost(post)}
                    className="group bg-[#111827]/45 border border-white/5 p-6 rounded-2xl text-left hover:border-indigo-500/25 transition-all duration-300 flex flex-col justify-between cursor-pointer backdrop-blur-sm relative hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 select-none">
                      <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1 rounded-full font-bold">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-white group-hover:underline tracking-tight transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs text-indigo-300 font-bold uppercase">
                          {post.author.charAt(4)}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-gray-300">{post.author}</div>
                          <div className="text-[9px] text-gray-500 font-mono uppercase">{post.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleLike(post.id, e)}
                          className={`flex items-center gap-1 text-[11px] font-mono transition-colors cursor-pointer ${
                            isLiked ? 'text-rose-400' : 'text-gray-500 hover:text-rose-400'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
                          <span>{post.likes + (isLiked ? 1 : 0)}</span>
                        </button>

                        <span className="text-gray-500 flex items-center gap-1 text-[11px] font-mono">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                          <span>{(comments[post.id] || []).length}</span>
                        </span>

                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-left"
          >
            {/* Back action */}
            <div>
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                RETURN_TO_LOBBY
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Full Article Content */}
              <div className="lg:col-span-2 space-y-6 bg-[#111827]/50 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                
                {/* Meta header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest bg-indigo-500/15 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
                      {selectedPost.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPost.readTime}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center gap-3.5 pt-2 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center text-indigo-300 font-bold uppercase">
                      {selectedPost.author.charAt(4)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-200">{selectedPost.author}</div>
                      <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{selectedPost.role}</div>
                    </div>
                    <span className="text-gray-700 ml-auto">|</span>
                    <span className="text-xs text-gray-400 font-mono">{selectedPost.date}</span>
                  </div>
                </div>

                {/* Main Body paragraphs with formatting */}
                <div className="space-y-5 text-sm md:text-base text-gray-300 font-sans leading-relaxed">
                  {selectedPost.content.map((para, pIdx) => (
                    <p key={pIdx}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Embedded dynamic code preview illustrative module */}
                <div className="bg-[#09070F] border border-white/5 rounded-xl p-4 font-mono text-[11px] md:text-xs text-indigo-300 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 bg-white/5 rounded-bl text-[8px] text-gray-600 font-mono tracking-wider">LAB_MODULE::PREVIEW</div>
                  <div className="text-gray-600">// InternForge System Sandboxed Integration Metrics</div>
                  <div>{"#include <system_orchestration>"}</div>
                  <div>{"void execute_sandbox(Candidate& user) {"}</div>
                  <div className="pl-4 text-emerald-400">{"  user.status = STATUS_ISOLATED;"}</div>
                  <div className="pl-4 text-emerald-400">{"  if (user.get_memory_use() > CRITICAL_THRESHOLD) {"}</div>
                  <div className="pl-8 text-cyan-400">{"    watchdog_trigger_coredump(user.id);"}</div>
                  <div className="pl-8 text-cyan-400">{"    recyle_sandbox_pool(user.id);"}</div>
                  <div className="pl-4">{"  }"}</div>
                  <div>{"}"}</div>
                </div>

                {/* Tags lists */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/5 py-1 px-2.5 rounded hover:border-indigo-500/30 transition-all select-none flex items-center gap-1">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Comments sidebar section */}
              <div className="space-y-6">
                
                {/* Statistics Box */}
                <div className="bg-[#111827]/50 border border-white/5 p-5 rounded-2xl backdrop-blur-md text-left">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Article Analytics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/35 p-3 rounded-xl border border-white/5">
                      <span className="block text-[10px] text-gray-500 font-mono uppercase">Views Visited</span>
                      <span className="font-mono text-lg font-bold text-cyan-400">{selectedPost.views}</span>
                    </div>
                    <div className="bg-black/35 p-3 rounded-xl border border-white/5">
                      <span className="block text-[10px] text-gray-500 font-mono uppercase">Reactions</span>
                      <span className="font-mono text-lg font-bold text-rose-400">{selectedPost.likes + (likedPosts.includes(selectedPost.id) ? 1 : 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Discussions Board Box */}
                <div className="bg-[#111827]/50 border border-white/5 p-6 rounded-3xl backdrop-blur-md text-left flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h3 className="text-sm font-bold text-gray-200 border-b border-white/5 pb-2.5 mb-4 font-mono uppercase tracking-wider flex items-center justify-between">
                      <span>💬 Laboratory Q&A Feed</span>
                      <span className="text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">
                        {(comments[selectedPost.id] || []).length} comments
                      </span>
                    </h3>

                    {/* Comments list */}
                    <div className="space-y-3.5 max-h-[250px] overflow-y-auto scrollbar-none pr-1">
                      {(comments[selectedPost.id] || []).length === 0 ? (
                        <div className="text-center py-8 text-gray-650 text-xs font-mono">
                          NO_COMMENTS_SUBMITTED_YET
                        </div>
                      ) : (
                        (comments[selectedPost.id] || []).map((cmt, idx) => (
                          <div key={idx} className="bg-black/25 p-3 rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-indigo-300 font-bold">{cmt.name}</span>
                              <span className="text-gray-600">{cmt.time}</span>
                            </div>
                            <p className="text-xs text-gray-300 font-sans leading-relaxed">
                              {cmt.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={(e) => handleAddComment(selectedPost.id, e)} className="mt-6 pt-4 border-t border-white/5 space-y-2.5">
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name (e.g. Rahul)"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full bg-black/45 border border-white/10 rounded-lg py-1 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <textarea
                        required
                        placeholder="Ask an architectural system question..."
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-black/45 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Send className="w-3 h-3" />
                      SUBMIT_QUESTION
                    </button>
                  </form>

                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
