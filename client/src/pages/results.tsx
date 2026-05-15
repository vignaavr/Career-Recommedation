import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useCareerState } from "@/hooks/use-career-state";
import { Award, Target, BookOpen, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Results() {
  const [, setLocation] = useLocation();
  const { state, resetState } = useCareerState();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch or layout shift
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && state.score === null && state.assessmentComplete === false) {
      setLocation("/");
    }
  }, [mounted, state.score, state.assessmentComplete, setLocation]);

  const score = state.score !== null ? state.score : 0;
  const passed = score >= 45; // out of 60
  const percentage = Math.round((score / 60) * 100);

  // Use resources from the provided JSON for failed candidates
  const getRecommendations = () => {
    if (passed) {
      return [
        { 
          title: "Software Engineer", 
          match: "94%", 
          skills: ["Problem Solving", "Data Structures", "Web Technologies"],
          link: "https://roadmap.sh/software-design-architecture"
        },
        { 
          title: "Data Scientist", 
          match: "88%", 
          skills: ["Python", "Statistics", "Machine Learning"],
          link: "https://roadmap.sh/ai-data-scientist"
        },
        { 
          title: "Cloud Architect", 
          match: "85%", 
          skills: ["Cloud Infrastructure", "System Design", "Networking"],
          link: "https://roadmap.sh/cloud-native"
        }
      ];
    }
    
    // Mapped from learningResources_1772294086599.json
    return [
      { title: "Programming Logic Fundamentals", type: "Tutorial", link: "https://www.programiz.com/article/flowchart-programming" },
      { title: "DBMS Deep Dive", type: "Tutorial", link: "https://www.javatpoint.com/dbms-tutorial" },
      { title: "Object Oriented Programming (OOPS)", type: "Tutorial", link: "https://www.javatpoint.com/java-oops-concepts" },
      { title: "Quantitative Aptitude Preparation", type: "Practice", link: "https://Indiabix.com/aptitude/questions-and-answers/" }
    ];
  };

  const recommendations = getRecommendations();

  useEffect(() => {
    if (mounted && passed) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [mounted, passed]);

  if (!mounted) return null;

  const handleRetake = () => {
    resetState();
    setLocation("/");
  };

  return (
    <Layout>
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Score Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-white shadow-sm mb-6 border border-border/50">
            <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${passed ? 'border-success text-success' : 'border-destructive text-destructive'} bg-white shadow-inner`}>
              <span className="text-4xl font-display font-black">{percentage}%</span>
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Score</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            {passed ? "Assessment Passed!" : "Assessment Complete"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {passed 
              ? "Exceptional performance. We've matched you with optimal career paths based on your unique skill matrix."
              : "You're on the right track, but we identified a few critical skill gaps. Review your personalized learning path below."}
          </p>
        </motion.div>

        {passed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-foreground">
              <Target className="text-primary" /> Top Recommended Paths
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((path: any, i) => (
                <a 
                  key={i} 
                  href={path.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-2xl p-6 border-t-4 border-t-primary shadow-lg hover:-translate-y-1 transition-transform block"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Award size={28} className="text-primary opacity-20" />
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-bold">{path.match} Match</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{path.title}</h3>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Aligned Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((s: string) => <span key={s} className="px-2 py-1 bg-muted rounded text-xs font-medium">{s}</span>)}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-primary text-sm font-bold group">
                    View Roadmap <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-destructive">
                <AlertCircle /> Identified Skill Gaps
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-border">
                  <h4 className="font-bold mb-1">Foundational Logic</h4>
                  <p className="text-sm text-muted-foreground">Scored below target in programming logic and problem solving.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-border">
                  <h4 className="font-bold mb-1">Computer Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">Needs improvement in core CS concepts and DBMS.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-foreground mt-12">
                <BookOpen className="text-secondary" /> Recommended Learning Path
              </h2>
              <div className="space-y-4">
                {recommendations.map((res: any, i) => (
                  <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white border border-border rounded-xl hover:border-secondary hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-secondary transition-colors">{res.title}</h4>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{res.type}</span>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-16 text-center border-t border-border pt-12">
          <button 
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-border transition-colors"
          >
            <RefreshCw size={18} /> Start New Assessment
          </button>
        </div>
      </div>
    </Layout>
  );
}
