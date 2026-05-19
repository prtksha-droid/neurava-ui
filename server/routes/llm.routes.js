import express from "express";
import LLMProvider from "../models/LLMProvider.js";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

export default function createLLMRoutes({
  encryptApiKey,
}) {
  router.get(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    async (req, res) => {
      try {
        const llms = await LLMProvider.find().sort({
          createdAt: -1,
        });

        res.json(
          llms.map((llm) => ({
            id: llm._id,
            name: llm.name,
            provider: llm.provider,
            model: llm.model,
            isActive: llm.isActive,
            createdAt: llm.createdAt,
            keyMasked: "••••••••••••",
          }))
        );
      } catch (err) {
        console.error(err);

        res.status(500).json({
          error: "Failed to fetch LLM providers",
        });
      }
    }
  );

  router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    async (req, res) => {
      try {
        const { name, provider, model, apiKey } =
          req.body;

        if (
          !name ||
          !provider ||
          !model ||
          !apiKey
        ) {
          return res.status(400).json({
            error: "All fields are required",
          });
        }

        const llm = await LLMProvider.create({
          name,
          provider,
          model,
          apiKeyEncrypted:
            encryptApiKey(apiKey),
          isActive: true,
          createdBy: req.user.email,
        });

        res.status(201).json({
          id: llm._id,
          name: llm.name,
          provider: llm.provider,
          model: llm.model,
          isActive: llm.isActive,
        });
      } catch (err) {
        console.error(err);

        res.status(500).json({
          error: "Failed to create LLM provider",
        });
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

        const llm =
          await LLMProvider.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
          );

        res.json({
          success: true,
          llm,
        });
      } catch (err) {
        console.error(err);

        res.status(500).json({
          error: "Failed to update LLM status",
        });
      }
    }
  );

  return router;
}