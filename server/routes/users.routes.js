import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      res.json(
        users.map((user) => ({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        }))
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { fullName, email, password, role } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          error: "fullName, email and password are required",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        fullName,
        email,
        passwordHash,
        role: role || "VIEWER",
        isActive: true,
      });

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

router.patch(
  "/:id/role",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );

      res.json({
        success: true,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update role" });
    }
  }
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      );

      res.json({
        success: true,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

export default router;