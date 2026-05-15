import { useState, useEffect } from 'react';
import type { InsertProfile } from '@shared/schema';

export interface CareerState {
  profile: Partial<InsertProfile>;
  extractedSkills: string[];
  answers: Record<number, number>;
  timeRemaining: number;
  assessmentComplete: boolean;
  score: number | null;
}

const DEFAULT_STATE: CareerState = {
  profile: {
    education: "",
    degreeType: "",
    specialization: "",
    graduationYear: undefined,
    coreSubjectStrength: 5,
    resumeScore: 5,
    interests: [],
    extractedSkills: [],
  },
  extractedSkills: [],
  answers: {},
  timeRemaining: 40 * 60, // 40 minutes
  assessmentComplete: false,
  score: null,
};

export function useCareerState() {
  const [state, setState] = useState<CareerState>(() => {
    try {
      const stored = localStorage.getItem('career_state');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load state', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('career_state', JSON.stringify(state));
  }, [state]);

  const updateProfile = (updates: Partial<InsertProfile>) => {
    setState(s => ({ ...s, profile: { ...s.profile, ...updates } }));
  };

  const setSkills = (skills: string[]) => {
    setState(s => ({ ...s, extractedSkills: skills }));
  };

  const setAnswer = (questionId: number, answerIndex: number) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, [questionId]: answerIndex }
    }));
  };

  const updateTime = (time: number) => {
    setState(s => ({ ...s, timeRemaining: time }));
  };

  const completeAssessment = (score: number) => {
    setState(s => ({ ...s, assessmentComplete: true, score }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem('career_state');
  };

  return {
    state,
    updateProfile,
    setSkills,
    setAnswer,
    updateTime,
    completeAssessment,
    resetState,
  };
}
