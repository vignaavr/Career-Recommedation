import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArrowRight, BrainCircuit, FileSearch, Target, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useCareerState } from "@/hooks/use-career-state";

export default function Landing() {
  const { resetState } = useCareerState();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden pb-32 pt-24 lg:pt-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-8">
                <Award size={16} className="text-purple-300" />
                Next-Generation Career Intelligence
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight"
            >
              Discover Your Optimal <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
                Career Trajectory
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Our adaptive platform combines AI resume analysis with dynamic skill assessments to match you with career paths that fit your unique profile.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link 
                href="/profile" 
                onClick={() => resetState()}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#1E3A8A] rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                data-testid="button-start-journey"
              >
                Start Your Career Journey
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute top-[40%] right-[10%] w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileSearch size={32} className="text-primary" />}
              title="AI Resume Analysis"
              description="Instantly extract your core competencies and hidden strengths using our advanced natural language processor."
              delay={0.1}
            />
            <FeatureCard 
              icon={<BrainCircuit size={32} className="text-secondary" />}
              title="Adaptive Assessment"
              description="A dynamic 60-question technical evaluation that adjusts to your identified skill domains."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Target size={32} className="text-blue-500" />}
              title="Precision Matching"
              description="Receive your top 3 career paths with percent-match certainty and a personalized gap-closing learning plan."
              delay={0.3}
            />
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="max-w-4xl mx-auto text-center px-4">
          <ShieldCheck size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Enterprise-Grade Evaluation</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Built on industry standards to ensure you are assessed fairly, comprehensively, and mapped to real-world market demands.
          </p>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 cursor-default"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
