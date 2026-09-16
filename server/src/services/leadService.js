const supabase = require("../db");

function ensureDb() {
  if (!supabase) throw new Error("Supabase environment variables are not configured.");
}

async function createLead(lead, analysis) {
  ensureDb();

  const payload = {
    ...lead,
    score: analysis.score,
    intent: analysis.intent,
    urgency: analysis.urgency,
    summary: analysis.summary,
    services: analysis.services,
    recommended_action: analysis.recommended_action,
    follow_up_subject: analysis.follow_up_subject,
    follow_up_message: analysis.follow_up_message
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function listLeads() {
  ensureDb();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function getLead(id) {
  ensureDb();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function updateLead(id, updates) {
  ensureDb();

  const { data, error } = await supabase
    .from("leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function createTask(leadId, task) {
  ensureDb();

  const { data, error } = await supabase
    .from("tasks")
    .insert({ lead_id: leadId, ...task })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function listActivity() {
  ensureDb();

  const { data, error } = await supabase
    .from("ai_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  createLead,
  listLeads,
  getLead,
  updateLead,
  createTask,
  listActivity
};
