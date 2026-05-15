import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

async function loadQuestions() {
  try {
    const jsonPath = path.resolve(process.cwd(), 'attached_assets/questions_domainwise_1772182475851.json');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    const questions = [];
    
    const shuffle = (array: any[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    // Pick 10 random questions from each domain to ensure mandatory 60 questions
    for (const domain of data.domains) {
      const domainQuestions = domain.questions.map((q: any) => {
        const correctIdx = q.options.indexOf(q.answer);
        return {
          domain: domain.domain_name,
          text: q.question,
          options: q.options,
          correctAnswer: correctIdx !== -1 ? correctIdx : 0
        };
      });

      // Shuffle within domain and take 10
      const shuffledDomain = shuffle(domainQuestions).slice(0, 10);
      questions.push(...shuffledDomain);
    }

    // Now shuffle the final 60 questions so domains are mixed
    return shuffle(questions).map((q, idx) => ({ ...q, id: idx + 1 }));
  } catch (error) {
    console.error("Failed to load questions from JSON:", error);
    // Fallback to generated mock questions if file fails to load
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i + 1,
      domain: ["Programming Logic", "DBMS", "OOPS", "Aptitude", "Reasoning", "Computer Fundamentals"][Math.floor(i / 10)],
      text: `Sample Question ${i + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: Math.floor(Math.random() * 4)
    }));
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const questions = await loadQuestions();

  app.post(api.profiles.create.path, async (req, res) => {
    try {
      const input = api.profiles.create.input.parse(req.body);
      const profile = await storage.createProfile(input);
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.profiles.get.path, async (req, res) => {
    const profile = await storage.getProfile(Number(req.params.id));
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.assessments.create.path, async (req, res) => {
    try {
      const input = api.assessments.create.input.parse(req.body);
      const assessment = await storage.createAssessment(input);
      res.status(201).json(assessment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.assessments.get.path, async (req, res) => {
    const assessment = await storage.getAssessment(Number(req.params.id));
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json(assessment);
  });

  app.get(api.questions.list.path, (req, res) => {
    res.json(questions);
  });

  return httpServer;
}
