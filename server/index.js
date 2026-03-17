import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || "hydroscan-secret-change-in-production";

// ── Database (lowdb → users.json) ─────────────────────────────────────────
const file    = join(__dirname, "users.json");
const adapter = new JSONFile(file);
const db      = new Low(adapter, { users: [] });
await db.read();
db.data ||= { users: [] };

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// POST /api/signup
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  const existing = db.data.users.find(u => u.email === email);
  if (existing)
    return res.status(409).json({ error: "An account with this email already exists." });
  const hash = await bcrypt.hash(password, 12);
  const newUser = { id: Date.now(), name, email, password: hash, created_at: new Date().toISOString() };
  db.data.users.push(newUser);
  await db.write();
  res.status(201).json({ message: "Account created successfully.", userId: newUser.id });
});

// POST /api/signin
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });
  const user = db.data.users.find(u => u.email === email);
  if (!user)
    return res.status(401).json({ error: "No account found with that email." });
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ error: "Incorrect password." });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// GET /api/me (protected)
app.get("/api/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided." });
  try {
    const payload = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const user = db.data.users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    const { password: _, ...safe } = user;
    res.json({ user: safe });
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

// GET /api/admin/users (view all users — remove in production)
app.get("/api/admin/users", (req, res) => {
  const safeUsers = db.data.users.map(({ password: _, ...u }) => u);
  res.json(safeUsers);
});

app.listen(PORT, () => {
  console.log(`\n🚀 HydroScan API running → http://localhost:${PORT}`);
  console.log(`   Database → ${file}\n`);
});
