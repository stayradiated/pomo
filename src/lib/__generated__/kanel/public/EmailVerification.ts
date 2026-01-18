import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.email_verification */
export type EmailVerificationId = string & { __brand: 'public.email_verification' };

/** Represents the table public.email_verification */
export default interface EmailVerificationTable {
  id: ColumnType<EmailVerificationId, EmailVerificationId, EmailVerificationId>;

  email: ColumnType<string, string, string>;

  tokenHash: ColumnType<string, string, string>;

  expiresAt: ColumnType<number, number, number>;

  retryCount: ColumnType<number, number, number>;

  createdAt: ColumnType<number, number, number>;

  updatedAt: ColumnType<number, number, number>;
}

export type EmailVerification = Selectable<EmailVerificationTable>;

export type NewEmailVerification = Insertable<EmailVerificationTable>;

export type EmailVerificationUpdate = Updateable<EmailVerificationTable>;

export const emailVerificationId = z.string() as unknown as z.Schema<EmailVerificationId>;

export const emailVerification = z.object({
  id: emailVerificationId,
  email: z.string(),
  tokenHash: z.string(),
  expiresAt: z.number(),
  retryCount: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const emailVerificationInitializer = z.object({
  id: emailVerificationId,
  email: z.string(),
  tokenHash: z.string(),
  expiresAt: z.number(),
  retryCount: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const emailVerificationMutator = z.object({
  id: emailVerificationId.optional(),
  email: z.string().optional(),
  tokenHash: z.string().optional(),
  expiresAt: z.number().optional(),
  retryCount: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});