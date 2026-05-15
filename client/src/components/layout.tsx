import { Link, useLocation } from "wouter";
import { Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Abstract background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      
      {showNav && (
        <header className="sticky top-0 z-50 glass-panel border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Briefcase size={20} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Path<span className="text-primary">Finder</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <span className="text-sm font-medium text-muted-foreground cursor-not-allowed">About</span>
              <span className="text-sm font-medium text-muted-foreground cursor-not-allowed">Enterprise</span>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Removed Start Assessment button from header */}
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-grow flex flex-col relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="flex-grow flex flex-col"
        >
          {children}
        </motion.div>
      </main>
      
      {showNav && (
        <footer className="border-t border-border/50 bg-white/50 backdrop-blur-sm py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              <span className="font-display font-bold text-lg">PathFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PathFinder Adaptive Career Platform. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
