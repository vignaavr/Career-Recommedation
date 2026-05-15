import { pgTable, text, serial, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  education: text("education").notNull(),
  degreeType: text("degree_type").notNull(),
  specialization: text("specialization").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  coreSubjectStrength: integer("core_subject_strength").notNull(),
  resumeScore: integer("resume_score").notNull(),
  interests: json("interests").$type<string[]>().notNull(),
  extractedSkills: json("extracted_skills").$type<string[]>().notNull(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id).notNull(),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  recommendations: json("recommendations").notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
