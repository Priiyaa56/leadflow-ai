const { createClient } = require("@supabase/supabase-js");
const config = require("./config");

const supabase = config.supabaseUrl && config.supabaseServiceRoleKey
  ? createClient(config.supabaseUrl, config.supabaseServiceRoleKey)
  : null;

module.exports = supabase;
