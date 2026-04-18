import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { HttpError } from "../middleware/error-handler";

type UserRecord = { id: string; email: string; passwordHash: string; name: string };
const users = new Map<string, UserRecord>();
const DEMO_AUTH_WARNING = "Auth is running in scaffold mode with in-memory users; configure persistent storage for production.";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authRouter = Router();

authRouter.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid signup payload");
  }

  if (users.has(parsed.data.email)) {
    throw new HttpError(409, "User already exists");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user: UserRecord = {
    id: `user_${users.size + 1}`,
    email: parsed.data.email,
    passwordHash,
    name: parsed.data.name
  };

  users.set(user.email, user);

  const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "1h" });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    warning: DEMO_AUTH_WARNING
  });
});

authRouter.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid login payload");
  }

  const user = users.get(parsed.data.email);
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "1h" });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    warning: DEMO_AUTH_WARNING
  });
});
