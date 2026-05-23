import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { Award, Download, Linkedin, Sparkles, RefreshCw, PenTool, CheckCircle, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import GlowButton from './GlowButton';
import FloatingParticles from './FloatingParticles';
import { UserSession } from '../types';

interface CertificateProps {
  user?: UserSession | null;
}

export default function CertificateCard({ user }: CertificateProps) {
  const [studentName, setStudentName] = useState(() => user?.name?.toUpperCase() || 'ROHAN SHARMA');
  const [courseTitle, setCourseTitle] = useState('Autonomous Robotics & AI Integration Track');
  const [issueDate, setIssueDate] = useState('May 22, 2026');
  const [certID, setCertID] = useState('IF-ROB-99482');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const certContainerRef = useRef<HTMLDivElement>(null);
  const coreCertRef = useRef<HTMLDivElement>(null);

  // GSAP roll-in or unfold animation of the A4 layout on load
  useEffect(() => {
    if (user?.name) {
      setStudentName(user.name.toUpperCase());
    }
  }, [user]);

  useEffect(() => {
    if (!coreCertRef.current) return;
    
    // Smooth 3D unroll rotation representation
    gsap.fromTo(
      coreCertRef.current,
      { rotateY: -35, rotateX: 10, scale: 0.88, opacity: 0, transformPerspective: 1200 },
      { rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'power4.out' }
    );
  }, []);

// Helper to convert modern/unsupported CSS color functions (like oklch, oklab, color-mix)
// into standard RGB formats natively supported by html2canvas CSS parser.
function replaceModernColors(str: string): string {
  if (typeof str !== 'string') return str;
  if (!str.includes('oklch') && !str.includes('oklab') && !str.includes('color-mix') && !str.includes('color(')) {
    return str;
  }

  // Use an offscreen document canvas to natively resolve style colors via browser engine
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return str;

  const memo = new Map<string, string>();

  const getRgb = (color: string): string => {
    if (memo.has(color)) return memo.get(color)!;
    try {
      ctx.fillStyle = 'transparent';
      ctx.fillStyle = color;
      const res = ctx.fillStyle;
      if (res && res !== 'transparent') {
        memo.set(color, res);
        return res;
      }
    } catch (e) {
      // Keep original value if conversion fails
    }
    return color;
  };

  const keywords = ['oklch(', 'oklab(', 'color-mix(', 'color('];
  let result = str;
  let found = true;

  while (found) {
    found = false;
    let minIndex = -1;
    let selectedKeyword = '';

    for (const kw of keywords) {
      const idx = result.indexOf(kw);
      if (idx !== -1 && (minIndex === -1 || idx < minIndex)) {
        minIndex = idx;
        selectedKeyword = kw;
      }
    }

    if (minIndex !== -1) {
      // Locate matched closing parenthesis
      let depth = 1;
      let i = minIndex + selectedKeyword.length;
      while (i < result.length && depth > 0) {
        if (result[i] === '(') depth++;
        else if (result[i] === ')') depth--;
        i++;
      }

      if (depth === 0) {
        const fullColorExpr = result.substring(minIndex, i);
        const resolvedRgb = getRgb(fullColorExpr);
        result = result.substring(0, minIndex) + resolvedRgb + result.substring(i);
        found = true;
      }
    }
  }

  return result;
}

  // PDF Download Trigger
  const handleDownloadPDF = async () => {
    if (!coreCertRef.current) return;
    setIsGenerating(true);

    const originalGetComputedStyle = window.getComputedStyle;

    try {
      // Intercept computed styles requested by html2canvas to substitute modern colors with standards
      window.getComputedStyle = function (elt, pseudoElt) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string') {
                  return replaceModernColors(val);
                }
                return val;
              };
            }
            const val = Reflect.get(target, prop, receiver);
            if (typeof val === 'function') {
              return val.bind(target);
            }
            if (typeof val === 'string') {
              return replaceModernColors(val);
            }
            return val;
          }
        }) as any;
      };

      // Small delay to let rendering settle
      await new Promise((resolve) => setTimeout(resolve, 300));

      const element = coreCertRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution capture
        useCORS: true,
        backgroundColor: '#0A0A0F',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2.5, canvas.height / 2.5],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2.5, canvas.height / 2.5);
      pdf.save(`InternForge-Certificate-${studentName.replace(/\s+/g, '-')}.pdf`);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      // Revert window computed style to original behavior
      window.getComputedStyle = originalGetComputedStyle;
      setIsGenerating(false);
    }
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Excited to share my specialized internship completion in ${courseTitle} track through InternForge Labs! #engineering #robotics #internship`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://internforge.com&summary=${text}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 z-50 px-5 py-3 rounded-lg bg-cyber-green/90 text-white font-medium shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 border border-green-400/20"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Success! Certificate generated & downloaded.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Controls Overlay */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md z-10 font-sans">
        <div className="md:col-span-3 pb-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-cyber-cyan" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-display">
              Certificate Live Preview Customizer
            </h4>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">EDIT_FIELDS_ACTIVE</span>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-medium mb-1.5">Recipient Full Name</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value.toUpperCase())}
            maxLength={28}
            className="w-full px-3 py-2 text-xs rounded-lg bg-black/45 focus:outline-none focus:border-indigo-500/50 text-white border border-white/10 tracking-wide font-medium"
            placeholder="Recipient Full Name"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-medium mb-1.5">Specialization Track Program</label>
          <select
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
              const codes: Record<string, string> = {
                'Autonomous Robotics & AI Integration Track': 'IF-ROB-99482',
                'Deep Learning & Edge Computing Deployment': 'IF-ML-88320',
                'Industrial IoT & RTOS Kernel Firmware Module': 'IF-EMB-77203',
                'Full-Stack Distributed Systems Engineering Track': 'IF-CSE-11024',
                'Automotive Design & Static Structural FEA Track': 'IF-FEA-41038',
              };
              setCertID(codes[e.target.value] || 'IF-GEN-55102');
            }}
            className="w-full px-3 py-2 text-xs rounded-lg bg-black/45 focus:outline-none focus:border-indigo-500/50 text-white border border-white/10 font-medium"
          >
            <option>Autonomous Robotics & AI Integration Track</option>
            <option>Deep Learning & Edge Computing Deployment</option>
            <option>Industrial IoT & RTOS Kernel Firmware Module</option>
            <option>Full-Stack Distributed Systems Engineering Track</option>
            <option>Automotive Design & Static Structural FEA Track</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-medium mb-1.5">Date of Award</label>
          <input
            type="text"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-black/45 focus:outline-none focus:border-indigo-500/50 text-white border border-white/10 tracking-wide font-medium"
            placeholder="Date of Award"
          />
        </div>
      </div>

      {/* Frame of Certificate */}
      <div 
        ref={certContainerRef}
        className="w-full max-w-4xl aspect-[1.414/1] relative p-1.5 md:p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-transparent to-amber-600/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-amber-500/10 group select-none min-h-[310px] sm:min-h-[440px] md:min-h-[580px]"
      >
        {/* Golden dust backing ember scene */}
        <FloatingParticles count={25} color="rgba(245, 158, 11, 0.18)" speed={0.4} />

        {/* Certificate Card Body */}
        <div
          ref={coreCertRef}
          className="w-full h-full rounded-xl bg-gradient-to-tr from-[#0C0B12] via-[#10101B] to-[#0D0B13] border-4 border-double border-amber-500/40 p-6 md:p-14 flex flex-col justify-between items-center relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Detailed Guilloche Pattern Simulation lines */}
          <div className="absolute inset-2 border border-amber-500/10 rounded pointer-events-none" />
          <div className="absolute inset-3 border border-amber-500/5 rounded pointer-events-none" />
          
          {/* Gold Core Corner Filigrees */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />

          {/* TOP Block */}
          <div className="text-center mt-2 z-10 flex flex-col items-center">
            {/* Elegant Shield Spark Emblem */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 via-yellow-300 to-amber-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Award className="w-5 h-5 text-gray-950 stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-white text-sm md:text-lg tracking-widest uppercase">
                InternForge Labs
              </span>
            </div>
            
            <p className="font-mono text-[9px] md:text-[11px] text-amber-500/70 tracking-[0.35em] font-bold uppercase mt-1">
              Certificate of Completion & Merit
            </p>
          </div>

          {/* MIDDLE Text Context */}
          <div className="text-center my-4 md:my-0 z-10 w-full flex flex-col items-center max-w-2xl px-4">
            <span className="block text-[10px] md:text-[12px] text-gray-400 font-sans italic tracking-wider mb-2">
              This is to certify that engineering scholar
            </span>

            {/* Luxurious Student Name */}
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              {studentName || 'Recipient Full Name'}
            </h2>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-4" />

            <span className="block text-[10px] md:text-[12px] text-gray-400 font-sans italic tracking-wider mb-2">
              has successfully qualified and performed merit benchmarks in the program of
            </span>

            {/* Specialization program designation */}
            <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg text-indigo-200 tracking-wide">
              {courseTitle}
            </h3>

            <p className="text-[9px] md:text-[11px] text-gray-500 font-sans leading-relaxed max-w-lg mt-3">
              Comprising 300+ laboratory simulation hours, continuous firmware testing runs, event integration mapping, and the deployment of a real-world multi-agent capstone engineering showcase certified by lead industrial mentors.
            </p>
          </div>

          {/* BOTTOM Meta Signature Line / Seals */}
          <div className="w-full flex justify-between items-end z-10 font-sans px-4 md:px-12 mt-4">
            {/* Signature Left */}
            <div className="text-left w-24 sm:w-36 flex flex-col items-center">
              <span className="font-mono font-semibold text-gray-300 italic text-[11px] md:text-sm tracking-wide opacity-80 select-none pb-1 font-serif">
                Dr. Arjun Mehta
              </span>
              <div className="w-full h-[1.5px] bg-white/10" />
              <span className="text-[8px] md:text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1.5 text-center block">
                Lead Scientist, IFL
              </span>
            </div>

            {/* Holographic glowing seal center */}
            <div className="relative group/seal flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-amber-500/50 flex items-center justify-center"
              />
              {/* Outer seal teeth star vector decoration */}
              <div className="absolute w-12 h-12 md:w-15 md:h-15 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-black/50 overflow-hidden mix-blend-screen">
                <div className="absolute inset-0 holo-seal animate-pulse opacity-95" />
                <Award className="w-6 h-6 md:w-8 md:h-8 text-[#0A0A0F] absolute z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="absolute -top-6 text-[8px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                verified seal
              </span>
            </div>

            {/* Signature Right */}
            <div className="text-right w-24 sm:w-36 flex flex-col items-center">
              <span className="font-mono font-semibold text-gray-300 italic text-[11px] md:text-sm tracking-wide opacity-80 select-none pb-1 font-serif">
                Karan Malhotra
              </span>
              <div className="w-full h-[1.5px] bg-white/10" />
              <span className="text-[8px] md:text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1.5 text-center block">
                Registrar, Labs
              </span>
            </div>
          </div>

          {/* Decorative security ID strings */}
          <div className="absolute bottom-2.5 left-4 md:left-14 text-[8px] text-gray-600 font-mono tracking-wide">
            ID: {certID} — SECURITY_SECURE_AUTH
          </div>
          <div className="absolute bottom-2.5 right-4 md:right-14 text-[8px] text-gray-600 font-mono tracking-wide">
            ISSUED: {issueDate}
          </div>
        </div>
      </div>

      {/* Action export links row */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 z-10 w-full justify-center items-center">
        <GlowButton
          variant="gradient"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="text-xs py-3.5 px-7 w-full sm:w-56"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
              Compiling Files...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              Download PDF Core File
            </>
          )}
        </GlowButton>

        <GlowButton
          variant="outline"
          onClick={handleShareLinkedIn}
          className="text-xs py-3.5 px-7 border-indigo-400/20 hover:border-indigo-400/50 w-full sm:w-56"
        >
          <Linkedin className="w-4 h-4 text-cyan-400" />
          Publish on LinkedIn
        </GlowButton>
      </div>
    </div>
  );
}
