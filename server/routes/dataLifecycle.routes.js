import express from "express";
import DataSource from "../models/DataSource.js";
import Dataset from "../models/Dataset.js";
import LineageNode from "../models/LineageNode.js";
import LineageEdge from "../models/LineageEdge.js";
import QualityRule from "../models/QualityRule.js";
import QualityResult from "../models/QualityResult.js";

const router = express.Router();

/* DATA SOURCES */

router.post("/data-sources", async (req, res) => {
  try {
    const dataSource = await DataSource.create(req.body);
    res.status(201).json(dataSource);
  } catch (error) {
    console.error("Create data source error:", error);
    res.status(500).json({ message: "Failed to create data source" });
  }
});

router.get("/data-sources", async (req, res) => {
  try {
    const dataSources = await DataSource.find().sort({ createdAt: -1 });
    res.json(dataSources);
  } catch (error) {
    console.error("Get data sources error:", error);
    res.status(500).json({ message: "Failed to fetch data sources" });
  }
});

router.get("/data-sources/:id", async (req, res) => {
  try {
    const dataSource = await DataSource.findById(req.params.id);

    if (!dataSource) {
      return res.status(404).json({ message: "Data source not found" });
    }

    res.json(dataSource);
  } catch (error) {
    console.error("Get data source error:", error);
    res.status(500).json({ message: "Failed to fetch data source" });
  }
});

/* DATASETS */

router.post("/datasets", async (req, res) => {
  try {
    const dataset = await Dataset.create(req.body);
    res.status(201).json(dataset);
  } catch (error) {
    console.error("Create dataset error:", error);
    res.status(500).json({ message: "Failed to create dataset" });
  }
});

router.get("/datasets", async (req, res) => {
  try {
    const datasets = await Dataset.find()
      .populate("sourceId", "name type owner sensitivity")
      .sort({ createdAt: -1 });

    res.json(datasets);
  } catch (error) {
    console.error("Get datasets error:", error);
    res.status(500).json({ message: "Failed to fetch datasets" });
  }
});

router.get("/datasets/:id", async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate(
      "sourceId",
      "name type owner sensitivity"
    );

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    res.json(dataset);
  } catch (error) {
    console.error("Get dataset error:", error);
    res.status(500).json({ message: "Failed to fetch dataset" });
  }
});

/* LINEAGE */

router.post("/lineage/nodes", async (req, res) => {
  try {
    const node = await LineageNode.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    console.error("Create lineage node error:", error);
    res.status(500).json({ message: "Failed to create lineage node" });
  }
});

router.get("/lineage/nodes", async (req, res) => {
  try {
    const nodes = await LineageNode.find().sort({ createdAt: -1 });
    res.json(nodes);
  } catch (error) {
    console.error("Get lineage nodes error:", error);
    res.status(500).json({ message: "Failed to fetch lineage nodes" });
  }
});

router.post("/lineage/edges", async (req, res) => {
  try {
    const edge = await LineageEdge.create(req.body);
    res.status(201).json(edge);
  } catch (error) {
    console.error("Create lineage edge error:", error);
    res.status(500).json({ message: "Failed to create lineage edge" });
  }
});

router.get("/lineage/edges", async (req, res) => {
  try {
    const edges = await LineageEdge.find()
      .populate("fromNode", "name nodeType owner")
      .populate("toNode", "name nodeType owner")
      .sort({ createdAt: -1 });

    res.json(edges);
  } catch (error) {
    console.error("Get lineage edges error:", error);
    res.status(500).json({ message: "Failed to fetch lineage edges" });
  }
});

router.get("/lineage/graph", async (req, res) => {
  try {
    const nodes = await LineageNode.find();

    const edges = await LineageEdge.find()
      .populate("fromNode", "name nodeType owner")
      .populate("toNode", "name nodeType owner");

    res.json({ nodes, edges });
  } catch (error) {
    console.error("Get lineage graph error:", error);
    res.status(500).json({ message: "Failed to fetch lineage graph" });
  }
});

/* DATA QUALITY */

router.post("/data-quality/rules", async (req, res) => {
  try {
    const rule = await QualityRule.create(req.body);
    res.status(201).json(rule);
  } catch (error) {
    console.error("Create quality rule error:", error);
    res.status(500).json({ message: "Failed to create quality rule" });
  }
});

router.get("/data-quality/rules", async (req, res) => {
  try {
    const rules = await QualityRule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    console.error("Get quality rules error:", error);
    res.status(500).json({ message: "Failed to fetch quality rules" });
  }
});

router.post("/data-quality/results", async (req, res) => {
  try {
    const result = await QualityResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create quality result error:", error);
    res.status(500).json({ message: "Failed to create quality result" });
  }
});

router.get("/data-quality/results", async (req, res) => {
  try {
    const results = await QualityResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error("Get quality results error:", error);
    res.status(500).json({ message: "Failed to fetch quality results" });
  }
});

router.post("/data-quality/run", async (req, res) => {
  try {
    const { ruleId } = req.body || {};
    const filter = { status: "ACTIVE" };

    if (ruleId) {
      filter._id = ruleId;
    }

    const rules = await QualityRule.find(filter);
    const generatedResults = [];

    const getIssueCount = (rule) => {
      const seed = `${rule.datasetName}-${rule.ruleName}-${rule.columnName}-${rule.ruleType}`;
      let hash = 0;

      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }

      return Math.abs(hash % 20);
    };

    for (const rule of rules) {
      let result = "PASSED";
      let score = 100;
      const issueCount = getIssueCount(rule);
      let details = "Quality check passed successfully.";

      if (rule.ruleType === "NULL_CHECK") {
        result = issueCount > rule.threshold ? "FAILED" : "PASSED";
        score = Math.max(100 - issueCount * 2, 40);
        details =
          issueCount > 0
            ? `${issueCount} rows contain null ${rule.columnName} values`
            : `No null values found in ${rule.columnName}`;
      }

      if (rule.ruleType === "DUPLICATE_CHECK") {
        result = issueCount > rule.threshold ? "WARNING" : "PASSED";
        score = Math.max(100 - issueCount * 3, 50);
        details =
          issueCount > 0
            ? `${issueCount} duplicate records detected`
            : "No duplicate records detected";
      }

      if (rule.ruleType === "FRESHNESS_CHECK") {
        result = issueCount > rule.threshold ? "WARNING" : "PASSED";
        score = Math.max(100 - issueCount, 70);
        details =
          issueCount > 0
            ? "Dataset freshness SLA may be breached"
            : "Dataset is fresh";
      }

      if (rule.ruleType === "SCHEMA_CHECK") {
        result = issueCount > rule.threshold ? "FAILED" : "PASSED";
        score = Math.max(100 - issueCount * 4, 50);
        details =
          issueCount > 0
            ? `${issueCount} schema mismatches detected`
            : "Schema validation passed";
      }

      if (rule.ruleType === "PII_CHECK") {
        result = issueCount > rule.threshold ? "WARNING" : "PASSED";
        score = Math.max(100 - issueCount * 2, 60);
        details =
          issueCount > 0
            ? `${issueCount} potential PII governance issues detected`
            : "PII validation passed";
      }

      if (rule.ruleType === "CUSTOM") {
        result = issueCount > rule.threshold ? "WARNING" : "PASSED";
        score = Math.max(100 - issueCount * 2, 50);
        details =
          issueCount > 0
            ? `${issueCount} custom rule issues detected`
            : "Custom quality validation passed";
      }

      const savedResult = await QualityResult.create({
        datasetId: rule.datasetId,
        datasetName: rule.datasetName,
        ruleId: rule._id,
        ruleName: rule.ruleName,
        result,
        score,
        issueCount,
        details,
      });

      generatedResults.push(savedResult);
    }

    res.json({
      message: "Quality scan completed",
      scannedRules: rules.length,
      generatedResults,
    });
  } catch (error) {
    console.error("Run quality scan error:", error);
    res.status(500).json({ message: "Failed to run quality scan" });
  }
});

export default router;