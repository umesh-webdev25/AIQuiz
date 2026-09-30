
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mt-auto">
  <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3">
    
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="AIQuizMaster Logo" className="w-8 h-8 object-contain" />
      <span className="font-bold text-base text-white">
        AIQuizMaster
      </span>
    </div>

    <p className="text-xs">
      © {new Date().getFullYear()} AIQuizMaster. Built with MERN & Gemini.
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
