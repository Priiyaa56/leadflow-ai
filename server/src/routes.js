const express = require("express");
const { leadInputSchema } = require("./validation");
const { analyzeLead } = require("./aiService");

const {
  createLead,
  listLeads,
  getLead,
  updateLead,
  createTask,
  listTasks,
  completeTask,
  deleteLead,
  listActivity
} = require("./services/leadService");

const { logActivity } = require("./services/activityService");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "LeadFlow AI API" });
});


// CREATE LEAD
router.post("/leads", async (req, res) => {
  try {
    const lead = leadInputSchema.parse(req.body);

    const analysis = await analyzeLead(lead);

    const saved = await createLead(lead, analysis);

    await logActivity(saved.id, "lead_analyzed", {
      score: analysis.score,
      intent: analysis.intent
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


// GET ALL LEADS
router.get("/leads", async (req, res) => {
  try {
    res.json(await listLeads());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET SINGLE LEAD
router.get("/leads/:id", async (req, res) => {
  try {
    res.json(await getLead(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


// REGENERATE AI ANALYSIS
router.post("/leads/:id/regenerate", async (req, res) => {
  try {
    const lead = await getLead(req.params.id);

    const analysis = await analyzeLead(lead);

    const updated = await updateLead(req.params.id, analysis);

    await logActivity(req.params.id, "follow_up_regenerated", {
      score: analysis.score
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// APPROVE FOLLOW-UP
router.post("/leads/:id/approve", async (req, res) => {
  try {
    const updated = await updateLead(req.params.id, {
      approval_status: "approved",
      status: "approved"
    });

    await logActivity(req.params.id, "follow_up_approved");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// CREATE TASK
router.post("/leads/:id/task", async (req, res) => {
  try {
    const task = await createTask(req.params.id, {
      title: req.body.title || "Follow up with lead",
      description: req.body.description || "",
      priority: req.body.priority || "medium",
      due_date: req.body.due_date || null,
      status: "pending"
    });

    await logActivity(req.params.id, "task_created", {
      task_id: task.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// GET ALL TASKS
router.get("/tasks", async (req, res) => {
  try {
    res.json(await listTasks());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// COMPLETE TASK
router.post("/tasks/:id/complete", async (req, res) => {
  try {
    const task = await completeTask(req.params.id);

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// DELETE LEAD
router.delete("/leads/:id", async (req, res) => {
  try {
    await deleteLead(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// ACTIVITY
router.get("/activity", async (req, res) => {
  try {
    res.json(await listActivity());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;