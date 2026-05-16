export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <h3 className="font-bold text-lg text-slate-900">MMUSTCare</h3>

          <p className="text-sm text-slate-500 mt-1">
            Digital Cognitive Behavioural Therapy Platform
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-blue-600 transition">
            Privacy
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Support
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}