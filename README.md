# LeadFlow AI

A portfolio-grade AI engineering project built around a real operational workflow:

**Lead intake → AI qualification → structured analysis → personalized follow-up → human approval → task creation → dashboard → activity log**

The workflow logic lives in application code and the AI API.

## Stack

- React + Vite
- Node.js + Express
- Google Gemini Developer API (free tier where available)
- Supabase/PostgreSQL
- MCP server
- JavaScript
- Git/GitHub


## Project structure

leadflow-ai/
├── client/ React frontend
├── server/ Express backend + AI workflow
├── mcp-server/ MCP tools for LeadFlow
├── supabase/
│ └── schema.sql Database schema
├── .gitignore
└── README.md

| Method | Endpoint                    | Purpose                 |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/health`               | Health check            |
| POST   | `/api/leads`                | Create and analyze lead |
| GET    | `/api/leads`                | List leads              |
| GET    | `/api/leads/:id`            | Lead details            |
| POST   | `/api/leads/:id/regenerate` | Regenerate follow-up    |
| POST   | `/api/leads/:id/approve`    | Human approval          |
| POST   | `/api/leads/:id/task`       | Create task             |
| GET    | `/api/activity`             | AI activity log         |

## AI workflow

Lead form
↓
Express API
↓
Gemini
↓
Structured lead analysis
↓
Supabase
↓
Human review
↓
Approve follow-up
↓
Task creation
↓
Dashboard + activity log

Live demo : https://client-delta-five-29.vercel.app/
