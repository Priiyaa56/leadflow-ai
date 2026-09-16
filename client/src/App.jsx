import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const initialForm = {
  name: "",
  email: "",
  company: "",
  website: "",
  budget: "",
  timeline: "",
  requirement: "",
};

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    spark: (
      <>
        <path d="m12 3-1.1 4.2L7 8.3l3.9 1.1L12 13l1.1-3.6L17 8.3l-3.9-1.1L12 3Z" />
        <path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7L19 14Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </>
    ),
    moon: (
      <path d="M20.8 15.1A8.7 8.7 0 0 1 8.9 3.2 8.8 8.8 0 1 0 20.8 15.1Z" />
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    trend: (
      <>
        <path d="M3 17 9 11l4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4L3 10" />
        <path d="M3 5v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4L21 14" />
        <path d="M21 19v-5h-5" />
      </>
    ),
    task: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h4a2 2 0 0 1 2 2v10" />
        <path d="M8 7h4M8 11h4M8 15h4M8 19h4" />
      </>
    ),
    zap: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(
    () => localStorage.getItem("leadflow-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("leadflow-theme", dark ? "dark" : "light");
  }, [dark]);

  async function refresh() {
    try {
      const [leadData, activityData] = await Promise.all([
        api.leads(),
        api.activity(),
      ]);

      setLeads(leadData);
      setActivity(activityData);

      if (selected) {
        const fresh = leadData.find((lead) => lead.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(
    () => ({
      total: leads.length,
      high: leads.filter((x) => x.intent === "high").length,
      medium: leads.filter((x) => x.intent === "medium").length,
      low: leads.filter((x) => x.intent === "low").length,
    }),
    [leads],
  );

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const created = await api.createLead({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
      });

      setForm(initialForm);
      setSelected(created);
      setMessage("Lead analyzed successfully.");
      await refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!selected) return;

    try {
      const updated = await api.approve(selected.id);
      setSelected(updated);
      setMessage("Follow-up approved.");
      await refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function regenerate() {
    if (!selected) return;

    setLoading(true);

    try {
      const updated = await api.regenerate(selected.id);
      setSelected(updated);
      setMessage("AI analysis regenerated.");
      await refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    if (!selected) return;

    try {
      await api.createTask(selected.id, {
        title: `Follow up with ${selected.name}`,
        description: selected.recommended_action,
        priority: selected.urgency,
      });

      setMessage("Task created.");
      await refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <Icon name="spark" size={21} />
          </div>

          <div>
            <div className="brand-name">
              LeadFlow <span>AI</span>
            </div>

            <div className="brand-sub">Intelligent lead operations</div>
          </div>
        </div>

        <div className="top-actions">
          <div className="live-pill">
            <span className="live-dot" />
            AI workflow online
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            <Icon name={dark ? "sun" : "moon"} size={17} />
            <span>{dark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero-row">
          <div>
            <div className="eyebrow">
              <Icon name="zap" size={13} />
              AI OPERATIONS
            </div>

            <h1>
              Turn inbound leads into <span>actionable opportunities.</span>
            </h1>

            <p className="hero-copy">
              Qualify business inquiries, generate personalized follow-ups, and
              keep every AI decision visible in one workspace.
            </p>
          </div>

          <div className="hero-badge">
            <span className="shield-dot">
              <Icon name="check" size={14} />
            </span>
            Human review before outreach
          </div>
        </section>

        <section className="stats">
          <Stat
            label="Total leads"
            value={stats.total}
            icon="users"
            hint="All captured inquiries"
          />

          <Stat
            label="High intent"
            value={stats.high}
            icon="trend"
            hint="Priority opportunities"
            tone="high"
          />

          <Stat
            label="Medium"
            value={stats.medium}
            icon="clock"
            hint="Needs qualification"
            tone="medium"
          />

          <Stat
            label="Low"
            value={stats.low}
            icon="users"
            hint="Lower priority"
            tone="low"
          />
        </section>

        {message && (
          <div className="notice">
            <span>
              <Icon name="check" size={16} />
            </span>
            {message}
          </div>
        )}

        <div className="workspace-grid">
          <section className="panel form-panel">
            <div className="section-heading">
              <div className="heading-icon">
                <Icon name="plus" size={19} />
              </div>

              <div>
                <h2>New lead</h2>
                <p>Capture a business inquiry for AI qualification.</p>
              </div>
            </div>

            <form onSubmit={submit}>
              <div className="field-row">
                <Input
                  name="name"
                  label="Name"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={updateField}
                  required
                />

                <Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="rahul@company.com"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="field-row">
                <Input
                  name="company"
                  label="Company"
                  placeholder="Company name"
                  value={form.company}
                  onChange={updateField}
                />

                <Input
                  name="website"
                  label="Website"
                  placeholder="https://example.com"
                  value={form.website}
                  onChange={updateField}
                />
              </div>

              <div className="field-row">
                <Input
                  name="budget"
                  label="Budget"
                  type="number"
                  placeholder="5000"
                  value={form.budget}
                  onChange={updateField}
                />

                <Input
                  name="timeline"
                  label="Timeline"
                  placeholder="e.g. 2 weeks"
                  value={form.timeline}
                  onChange={updateField}
                />
              </div>

              <label className="field-label">
                Requirement
                <textarea
                  name="requirement"
                  placeholder="Describe what the business needs help with..."
                  value={form.requirement}
                  onChange={updateField}
                  required
                  minLength={10}
                />
                <span className="field-help">
                  AI will extract intent, urgency, services, and the recommended
                  next action.
                </span>
              </label>

              <button className="primary-button" disabled={loading}>
                <Icon name="spark" size={17} />

                {loading ? "Analyzing lead..." : "Analyze lead with AI"}

                <Icon name="arrow" size={16} />
              </button>
            </form>
          </section>

          <section className="panel leads-panel">
            <div className="section-heading between">
              <div className="heading-icon purple">
                <Icon name="users" size={19} />
              </div>

              <div>
                <h2>Lead pipeline</h2>
                <p>AI-qualified business opportunities.</p>
              </div>

              <span className="count-pill">{leads.length} total</span>
            </div>

            <div className="lead-list">
              {leads.map((lead) => (
                <button
                  className={`lead-row ${
                    selected?.id === lead.id ? "active" : ""
                  }`}
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                >
                  <div className="lead-avatar">
                    {lead.name?.charAt(0)?.toUpperCase() || "L"}
                  </div>

                  <div className="lead-main">
                    <strong>{lead.name}</strong>

                    <span>
                      {lead.company || "Unknown company"} · {lead.email}
                    </span>
                  </div>

                  <div className={`intent-mini ${lead.intent}`}>
                    <b>{lead.score}</b>
                    <small>{lead.intent}</small>
                  </div>

                  <Icon name="arrow" size={16} />
                </button>
              ))}

              {!leads.length && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon name="spark" size={22} />
                  </div>

                  <strong>No leads yet</strong>

                  <span>
                    Submit your first inquiry and let AI qualify it for you.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>

        {selected && (
          <section className="panel detail-panel">
            <div className="detail-head">
              <div className="detail-title">
                <div className="eyebrow">
                  AI ANALYSIS · {selected.id?.slice(0, 8)}
                </div>

                <h2>
                  {selected.name}{" "}
                  <span>· {selected.company || "Unknown company"}</span>
                </h2>

                <p>{selected.email}</p>
              </div>

              <div className={`intent ${selected.intent}`}>
                {selected.intent} intent
              </div>
            </div>

            <div className="analysis-grid">
              <Metric
                label="Lead score"
                value={`${selected.score}/100`}
                emphasis
              />

              <Metric label="Urgency" value={selected.urgency} />

              <Metric label="Approval" value={selected.approval_status} />

              <Metric label="Timeline" value={selected.timeline || "Unknown"} />
            </div>

            <div className="content-grid">
              <div className="analysis-copy">
                <InfoBlock title="AI summary">
                  <p>{selected.summary}</p>
                </InfoBlock>

                <InfoBlock title="Recommended action">
                  <p>{selected.recommended_action}</p>
                </InfoBlock>

                <InfoBlock title="Services detected">
                  <div className="chips">
                    {(selected.services || []).map((service) => (
                      <span key={service}>{service}</span>
                    ))}
                  </div>
                </InfoBlock>
              </div>

              <div className="email-card">
                <div className="email-top">
                  <div className="email-icon">
                    <Icon name="mail" size={18} />
                  </div>

                  <div>
                    <span className="eyebrow">GENERATED FOLLOW-UP</span>

                    <small>AI drafted · Human approval required</small>
                  </div>
                </div>

                <h3>{selected.follow_up_subject}</h3>

                <p>{selected.follow_up_message}</p>

                <div className="actions">
                  <button className="primary-button compact" onClick={approve}>
                    <Icon name="check" size={16} />
                    Approve follow-up
                  </button>

                  <button
                    className="secondary-button"
                    onClick={regenerate}
                    disabled={loading}
                  >
                    <Icon name="refresh" size={16} />
                    Regenerate
                  </button>

                  <button className="secondary-button" onClick={createTask}>
                    <Icon name="task" size={16} />
                    Create task
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="panel activity-panel">
          <div className="section-heading">
            <div className="heading-icon green">
              <Icon name="trend" size={19} />
            </div>

            <div>
              <h2>AI activity</h2>
              <p>Transparent record of workflow actions.</p>
            </div>
          </div>

          <div className="activity">
            {activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <span className="activity-dot" />

                <div>
                  <strong>{item.action}</strong>

                  <span>{new Date(item.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}

            {!activity.length && (
              <p className="muted">
                Activity will appear after your first AI workflow.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer>
        LeadFlow AI <span>·</span> AI-assisted operations with human oversight
      </footer>
    </div>
  );
}

function Input({ label, name, ...props }) {
  return (
    <label className="field-label">
      {label}
      <input name={name} {...props} />
    </label>
  );
}

function Stat({ label, value, icon, hint, tone = "blue" }) {
  return (
    <div className={`stat ${tone}`}>
      <div className="stat-top">
        <span>{label}</span>

        <div className="stat-icon">
          <Icon name={icon} size={17} />
        </div>
      </div>

      <strong>{value}</strong>

      <small>{hint}</small>
    </div>
  );
}

function Metric({ label, value, emphasis }) {
  return (
    <div className="metric">
      <span>{label}</span>

      <strong className={emphasis ? "emphasis" : ""}>{value}</strong>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="info-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default App;
