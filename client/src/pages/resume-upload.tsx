import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { StepProgress } from "@/components/step-progress";
import { useCareerState } from "@/hooks/use-career-state";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeUpload() {
  const [, setLocation] = useLocation();
  const { setSkills } = useCareerState();
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extracted, setExtracted] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB.");
      return;
    }
    setFile(selectedFile);
    setExtracted([]); // reset if new file
  };

  const processResume = () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate AI parsing with comprehensive skill extraction
    setTimeout(() => {
      // Simulate reading resume and extracting multiple skill categories
      // In production, this would use actual NLP/ML model to parse the file
      const allSkillCategories = {
        languages: ["Python", "Java", "C", "C++", "JavaScript", "TypeScript", "Dart", "SQL", "NoSQL"],
        frontend: ["React", "ReactJS", "Redux", "NextJS", "Flutter", "Tailwind CSS", "CSS", "HTML"],
        backend: ["Node.js", "Express", "Java Spring Boot", "Django", "FastAPI"],
        databases: ["PostgreSQL", "MongoDB", "MySQL", "NoSQL"],
        devOps: ["Docker", "Kubernetes", "AWS", "Git", "GitHub", "CI/CD", "Linux"],
        tools: ["VS Code", "Android Studio", "Figma", "Adobe XD", "Git"],
        frameworks: ["ExpressJS", "NextJS", "Redux", "Flask"]
      };
      
      // Randomly select 10-12 diverse skills across different categories
      const selectedSkills = [];
      const categories = Object.values(allSkillCategories);
      
      // Pick 1-2 skills from each category
      categories.forEach(category => {
        const count = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < count && selectedSkills.length < 12; i++) {
          const skill = category[Math.floor(Math.random() * category.length)];
          if (!selectedSkills.includes(skill)) {
            selectedSkills.push(skill);
          }
        }
      });
      
      setExtracted(selectedSkills);
      setSkills(selectedSkills);
      setIsProcessing(false);
    }, 2500);
  };

  const proceed = () => {
    setLocation("/assessment");
  };

  return (
    <Layout showNav={false}>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">Upload Your Resume</h1>
          <p className="text-muted-foreground">Our AI will analyze your experience to tailor the assessment.</p>
        </div>

        <StepProgress currentStep={2} />

        <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-xl border border-border/50 max-w-2xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!extracted.length ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Drag Drop Area */}
                <div 
                  className={`
                    relative rounded-2xl border-3 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all duration-300
                    ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    ${file ? 'border-success/50 bg-success/5' : ''}
                  `}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <FileText size={32} className="text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground">{file.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-4 text-xs font-semibold text-destructive hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-6 pointer-events-none">
                        <UploadCloud size={40} className="text-muted-foreground" />
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-2 pointer-events-none">Drag & drop your resume</h4>
                      <p className="text-muted-foreground pointer-events-none mb-6">Supports PDF, DOCX up to 5MB</p>
                      <button className="px-6 py-2.5 rounded-lg bg-white border border-border font-medium shadow-sm hover:bg-muted transition-colors pointer-events-none">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={processResume}
                  disabled={!file || isProcessing}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                    ${!file 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:-translate-y-1'}
                  `}
                >
                  {isProcessing ? (
                    <><Loader2 size={24} className="animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Cpu size={24} /> Start AI Analysis</>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center"
              >
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h3>
                  <p className="text-muted-foreground">We found the following core skills in your profile:</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 bg-muted/30 p-6 rounded-2xl border border-border/50">
                  {extracted.map((skill, i) => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-4 py-2 bg-white border border-primary/20 text-primary font-bold rounded-lg shadow-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                <button
                  onClick={proceed}
                  className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
                >
                  Proceed to Assessment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
