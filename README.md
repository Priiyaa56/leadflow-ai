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

Google currently documents a free Gemini API tier with free input/output tokens for eligible models, subject to rate limits. Check the current limits before heavy use.
Supabase currently offers a free plan with a 500 MB database and 1 GB file storage.

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

## Important

This project is a learning/portfolio implementation. AI output must be reviewed by a human before real customer communication. Do not place private customer data into a development account unless you understand the provider's data-use terms.

## Resume skills demonstrated

React, REST APIs, Node.js, Express, PostgreSQL, Supabase, LLM API integration, structured outputs, AI workflow design, tool calling concepts, MCP, human-in-the-loop systems, validation, error handling, logging, Git/GitHub.
