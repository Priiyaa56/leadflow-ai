import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const server = new McpServer({
  name: "leadflow-ai",
  version: "1.0.0"
});

server.registerTool(
  "list_leads",
  {
    description: "List recent LeadFlow AI leads.",
    inputSchema: {
      limit: z.number().int().min(1).max(50).default(10)
    }
  },
  async ({ limit }) => {
    const { data, error } = await supabase
      .from("leads")
      .select("id,name,email,company,score,intent,urgency,status,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.registerTool(
  "get_lead",
  {
    description: "Get a specific lead.",
    inputSchema: {
      id: z.string().uuid()
    }
  },
  async ({ id }) => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.registerTool(
  "create_task",
  {
    description: "Create a follow-up task for a lead.",
    inputSchema: {
      lead_id: z.string().uuid(),
      title: z.string().min(2),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).default("medium")
    }
  },
  async ({ lead_id, title, description = "", priority }) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ lead_id, title, description, priority })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.registerTool(
  "update_lead_status",
  {
    description: "Update the operational status of a lead.",
    inputSchema: {
      id: z.string().uuid(),
      status: z.enum(["new", "approved", "contacted", "qualified", "closed"])
    }
  },
  async ({ id, status }) => {
    const { data, error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
