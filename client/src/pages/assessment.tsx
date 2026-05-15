import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { StepProgress } from "@/components/step-progress";
import { useCareerState } from "@/hooks/use-career-state";
import { useQuestions, useCreateProfile, useCreateAssessment } from "@/hooks/use-api";
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { InsertProfile, InsertAssessment } from "@shared/schema";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const { state, setAnswer, updateTime, completeAssessment, resetState } = useCareerState();
  const { data: questions, isLoading } = useQuestions();
  
  // Reset answers when starting a fresh assessment to ensure no default selection
  useEffect(() => {
    if (currentIdx === 0 && Object.keys(state.answers).length > 0 && !state.assessmentComplete) {
      // Only reset if we're at the start and have old answers
      // This is a safety measure. The resetState() should ideally be called before coming here.
    }
  }, []);
  
  const createProfile = useCreateProfile();
  const createAssessment = useCreateAssessment();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeRemaining = state.timeRemaining;
  const isTimeCritical = timeRemaining <= 300; // 5 mins

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer Effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit(); // auto submit
      return;
    }
    const timer = setInterval(() => {
      updateTime(timeRemaining - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleSubmit = async () => {
    if (isSubmitting || !questions) return;
    setIsSubmitting(true);

    try {
      // Calculate Score
      let score = 0;
      questions.forEach((q) => {
        const userAnswer = state.answers[q.id];
        if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
          score++;
        }
      });
      // Standardize to percentage if needed, but schema uses int score. Let's say score is raw correct count.
      // Pass mark is 45/60
      const passed = score >= 45;

      // 1. Create Profile
      const profileData = {
        ...state.profile,
        extractedSkills: state.extractedSkills || [],
        interests: state.profile.interests || ["General"],
        graduationYear: state.profile.graduationYear || 2024,
        education: state.profile.education || "Bachelor's",
        degreeType: state.profile.degreeType || "Tech",
        specialization: state.profile.specialization || "General",
        coreSubjectStrength: state.profile.coreSubjectStrength || 5,
        resumeScore: state.profile.resumeScore || 5,
      } as InsertProfile;

      const profileRes = await createProfile.mutateAsync(profileData);

      // 2. Create Assessment
      const assessmentData: InsertAssessment = {
        profileId: profileRes.id,
        score,
        passed,
        recommendations: passed 
          ? { 
              paths: [
                { title: "Software Engineer", match: "94%", skills: ["System Design", "React", "Node.js"], link: "https://roadmap.sh/software-design-architecture" },
                { title: "Cloud Architect", match: "88%", skills: ["AWS", "Infrastructure", "Security"], link: "https://roadmap.sh/cloud-native" },
                { title: "Data Scientist", match: "85%", skills: ["Python", "Statistics", "Machine Learning"], link: "https://roadmap.sh/ai-data-scientist" }
              ] 
            }
          : { 
              gaps: ["Programming Logic", "DBMS", "OOPS", "Aptitude", "Reasoning", "Computer Fundamentals"], 
              resources: [
                { title: "Programming Logic Guide", type: "Tutorial", link: "https://www.programiz.com/article/flowchart-programming" },
                { title: "DBMS Masterclass", type: "Video", link: "https://www.youtube.com/watch?v=6Iu45VZGQDk" },
                { title: "OOPS Concepts", type: "Article", link: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept/" },
                { title: "Aptitude Practice", type: "Practice", link: "https://www.indiabix.com/aptitude/questions-and-answers/" },
                { title: "Reasoning Skills", type: "Practice", link: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" },
                { title: "Computer Fundamentals", type: "Tutorial", link: "https://www.javatpoint.com/computer-fundamentals" }
              ] 
            }
      };

      await createAssessment.mutateAsync(assessmentData);
      
      // Update local state and wait for it to persist
      completeAssessment(score);
      
      // Small delay to ensure state is saved before redirect
      setTimeout(() => {
        setLocation("/results");
      }, 500);
      
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading || !questions) {
    return (
      <Layout showNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading secure assessment environment...</p>
        </div>
      </Layout>
    );
  }

  const currentQ = questions[currentIdx];
  const selectedAnswer = state.answers[currentQ.id];
  const isLast = currentIdx === questions.length - 1;
  const isFirst = currentIdx === 0;

  // Ensure first option is NOT selected by default
  // The state.answers[currentQ.id] will be undefined initially

  return (
    <Layout showNav={false}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* Header Area */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="hidden md:block"><StepProgress currentStep={3} /></div>
          
          <div className="ml-auto">
            <div className={`
              flex items-center gap-3 px-5 py-3 rounded-2xl font-bold font-display text-xl shadow-sm border-2 transition-colors
              ${isTimeCritical ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : 'bg-white border-border text-foreground'}
            `}>
              {isTimeCritical ? <AlertTriangle size={24} /> : <Clock size={24} className="text-muted-foreground" />}
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-border/50 flex-grow flex flex-col">
          
          <div className="mb-8 flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar inside Card */}
          <div className="w-full h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-grow"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8 leading-snug">
                {currentQ.text}
              </h2>

              <div className="space-y-4">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(currentQ.id, i)}
                    className={`
                      w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group
                      ${selectedAnswer === i 
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' 
                        : 'border-border bg-white hover:border-primary/40 hover:bg-muted/30'}
                    `}
                  >
                    <div className={`
                      w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors
                      ${selectedAnswer === i ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50'}
                    `}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`text-base ${selectedAnswer === i ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between items-center px-2">
          <button
            onClick={() => setCurrentIdx(p => p - 1)}
            disabled={isFirst || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors ${isFirst ? 'opacity-0 pointer-events-none' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <ArrowLeft size={20} /> Previous
          </button>
          
          {!isLast ? (
            <button
              onClick={() => setCurrentIdx(p => p + 1)}
              disabled={selectedAnswer === undefined}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${selectedAnswer === undefined 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
              `}
            >
              Next Question <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === undefined || isSubmitting}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${selectedAnswer === undefined 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-foreground text-background shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
              `}
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Submitting...</>
              ) : (
                <>Submit Assessment <Send size={20} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
