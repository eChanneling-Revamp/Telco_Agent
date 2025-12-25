import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export type AuthPayload = {
  userId: number;
  role: 'superadmin' | 'admin' | 'agent';
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}