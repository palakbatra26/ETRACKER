import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';

const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  const accessToken = signAccess({ sub: user._id });
  const refreshToken = signRefresh({ sub: user._id });
  res.cookie('rt', refreshToken, refreshCookieOpts);
  res.status(201).json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.compare(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = signAccess({ sub: user._id });
  const refreshToken = signRefresh({ sub: user._id });
  res.cookie('rt', refreshToken, refreshCookieOpts);
  res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.rt;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = verifyRefresh(token);
    const accessToken = signAccess({ sub: payload.sub });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('rt', { path: '/api/auth' });
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
});
