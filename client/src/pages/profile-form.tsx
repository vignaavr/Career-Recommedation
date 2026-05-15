import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { StepProgress } from "@/components/step-progress";
import { useCareerState } from "@/hooks/use-career-state";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const EDUCATION_LEVELS = ["Diploma", "Bachelor's", "Master's", "PhD"];
const DOMAINS = ["Web Development", "Cloud Computing", "AI & ML", "Cybersecurity", "Data Science", "Mobile Apps"];

export default function ProfileForm() {
  const [, setLocation] = useLocation();
  const { state, updateProfile } = useCareerState();
  const [formData, setFormData] = useState({
    education: "",
    degreeType: "",
    specialization: "",
    graduationYear: "",
    coreSubjectStrength: state.profile.coreSubjectStrength || 5,
    resumeScore: state.profile.resumeScore || 5,
    interests: state.profile.interests || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.education) newErrors.education = "Required";
    if (!formData.degreeType) newErrors.degreeType = "Required";
    if (!formData.specialization) newErrors.specialization = "Required";
    if (!formData.graduationYear || formData.graduationYear < 1950 || formData.graduationYear > 2100) {
      newErrors.graduationYear = "Invalid year";
    }
    if (formData.interests.length === 0) newErrors.interests = "Select at least one interest";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateProfile(formData);
      setLocation("/resume");
    }
  };

  const toggleInterest = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(domain)
        ? prev.interests.filter(i => i !== domain)
        : [...prev.interests, domain]
    }));
  };

  return (
    <Layout showNav={false}>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">Tell us about yourself</h1>
          <p className="text-muted-foreground">This helps us personalize your assessment and career paths.</p>
        </div>

        <StepProgress currentStep={1} />

        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Academic Info */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground border-b pb-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Academic Background
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Highest Education</label>
                <select 
                  className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.education ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-primary focus:ring-primary/10'} focus:outline-none focus:ring-4 transition-all`}
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                >
                  <option value="" disabled>Select Level</option>
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.education && <p className="text-xs text-destructive mt-1">{errors.education}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Degree Type (e.g. B.Tech, B.Sc)</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.degreeType ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-primary focus:ring-primary/10'} focus:outline-none focus:ring-4 transition-all`}
                  placeholder="Enter degree type"
                  value={formData.degreeType}
                  onChange={(e) => setFormData({...formData, degreeType: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Specialization</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.specialization ? 'border-destructive' : 'border-border focus:border-primary'} focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all`}
                    placeholder="e.g. Computer Science"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Graduation Year</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`w-full px-4 py-3 rounded-xl bg-background border-2 ${errors.graduationYear ? 'border-destructive' : 'border-border focus:border-primary'} focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all`}
                    placeholder="YYYY"
                    value={formData.graduationYear}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({...formData, graduationYear: val ? parseInt(val) : ""});
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Strengths & Interests */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground border-b pb-2">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">2</span>
                Strengths & Interests
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Core Subject Strength</label>
                  <span className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-full text-sm">{formData.coreSubjectStrength}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.coreSubjectStrength}
                  onChange={(e) => setFormData({...formData, coreSubjectStrength: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Self-Rated Practical Skill</label>
                  <span className="text-secondary font-bold px-3 py-1 bg-secondary/10 rounded-full text-sm">{formData.resumeScore}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.resumeScore}
                  onChange={(e) => setFormData({...formData, resumeScore: parseInt(e.target.value)})}
                  className="accent-secondary"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  Domains of Interest
                  {errors.interests && <span className="text-xs text-destructive font-normal">{errors.interests}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(domain => (
                    <button
                      key={domain}
                      onClick={() => toggleInterest(domain)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2
                        ${formData.interests.includes(domain) 
                          ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105' 
                          : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}
                      `}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-foreground text-background rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group"
            >
              Continue to Upload <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
