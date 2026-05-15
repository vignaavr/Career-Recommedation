import { z } from 'zod';
import { insertProfileSchema, insertAssessmentSchema, profiles, assessments } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  profiles: {
    create: {
      method: 'POST' as const,
      path: '/api/profiles' as const,
      input: insertProfileSchema,
      responses: {
        201: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/profiles/:id' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  assessments: {
    create: {
      method: 'POST' as const,
      path: '/api/assessments' as const,
      input: insertAssessmentSchema,
      responses: {
        201: z.custom<typeof assessments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/assessments/:id' as const,
      responses: {
        200: z.custom<typeof assessments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  questions: {
    list: {
      method: 'GET' as const,
      path: '/api/questions' as const,
      responses: {
        200: z.array(z.object({
          id: z.number(),
          domain: z.string(),
          text: z.string(),
          options: z.array(z.string()),
          correctAnswer: z.number()
        })),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
