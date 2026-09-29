import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mt-auto">
  <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3">
    
    <div className="flex items-center gap-2">
      <BrainCircuit className="w-5 h-5 text-orange-400" />
      <span className="font-bold text-base text-white">
        AI Quiz Master
      </span>
    </div>

    <p className="text-xs">
      © {new Date().getFullYear()} AI Quiz Master. Built with MERN & Gemini.
    </p>

    <div className="flex gap-4 text-xs">
      <a href="#" className="hover:text-white transition-colors">
        Privacy
      </a>
      <a href="#" className="hover:text-white transition-colors">
        Terms
      </a>
    </div>

  </div>
</footer>
  );
}
