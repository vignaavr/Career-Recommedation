import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { num: 1, title: "Profile Details" },
    { num: 2, title: "Resume Analysis" },
    { num: 3, title: "Skill Assessment" },
    { num: 4, title: "Career Match" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0">
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Indicators */}
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;
          
          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-3 w-32">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' : 
                    isActive ? 'bg-background border-primary text-primary shadow-lg shadow-primary/20 scale-110' : 
                    'bg-background border-muted text-muted-foreground'}
                `}
              >
                {isCompleted ? <Check size={16} /> : step.num}
              </div>
              <span className={`text-xs font-medium hidden sm:block text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
