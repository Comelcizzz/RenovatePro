import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface UserJWTPayload extends JoseJWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function signJWT(payload: UserJWTPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET));
  return token;
}

export async function verifyJWT(token: string): Promise<UserJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
    );
    return payload as UserJWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserJWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function setSession(payload: UserJWTPayload) {
  const token = await signJWT(payload);
  const cookieStore = cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete("token");
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return payload;
}
