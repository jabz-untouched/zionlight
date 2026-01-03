import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ============================================
// CONSTANTS
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const TOKEN_NAME = "zionlight-admin-token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// ============================================
// TYPES
// ============================================

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

// ============================================
// PASSWORD UTILITIES
// ============================================

/**
 * Hash a plain text password
 * Uses bcrypt with cost factor of 12
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// JWT UTILITIES
// ============================================

/**
 * Generate a JWT token for an admin user
 */
export function generateToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_MAX_AGE,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

// ============================================
// COOKIE UTILITIES
// ============================================

/**
 * Set the auth cookie with the JWT token
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/**
 * Get the auth token from cookies
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

/**
 * Remove the auth cookie (logout)
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// ============================================
// SESSION UTILITIES
// ============================================

/**
 * Get the current admin user from the session
 */
export async function getCurrentAdmin(): Promise<AdminTokenPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Check if the current request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return admin !== null;
}
