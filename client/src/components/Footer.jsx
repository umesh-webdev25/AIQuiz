import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-orange-400" />
          <span className="font-bold text-lg text-white">AI Quiz Master</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} AI Quiz Master. Built with MERN & Gemini.</p>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
