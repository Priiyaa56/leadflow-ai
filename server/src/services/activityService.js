const supabase = require("../db");

async function logActivity(leadId, action, details = {}) {
  if (!supabase) return;
  const { error } = await supabase
    .from("ai_activity")
    .insert({ lead_id: leadId, action, details });

  if (error) console.error("Activity log error:", error.message);
}

module.exports = { logActivity };
