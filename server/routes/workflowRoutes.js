import express from "express";
import Workflow from "../models/Workflow.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const workflow = await Workflow.create({
      name: req.body.name,
      nodes: req.body.nodes || [],
      edges: req.body.edges || [],
      status: req.body.status || "DRAFT",
      createdBy: req.body.createdBy || null,
    });

    res.status(201).json(workflow);
  } catch (err) {
    res.status(500).json({
      message: "Failed to save workflow",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const workflows = await Workflow.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(workflows);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch workflows",
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json(workflow);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch workflow",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        nodes: req.body.nodes || [],
        edges: req.body.edges || [],
        status: req.body.status || "DRAFT",
      },
      { returnDocument: "after" }
    );

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json(workflow);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update workflow",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json({
      message: "Workflow deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete workflow",
      error: err.message,
    });
  }
});

export default router;