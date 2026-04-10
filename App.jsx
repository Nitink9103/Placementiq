import { useState, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SPECIALISATIONS = ["Marketing","Business Analytics","Operations","HR","International Business","Finance"];

const SKILLS = [
  "MS Excel (Advanced)","Power BI","Tableau","SQL","Python","R","Google Analytics",
  "SAP","Financial Modelling","Valuation","Consumer Research","Market Research",
  "Brand Management","Digital Marketing","SEO / SEM","Content Marketing",
  "Supply Chain Mgmt","Six Sigma","Project Management","HR Analytics",
  "Talent Acquisition","Payroll & Compliance","Public Speaking","Business Writing","CRM / Salesforce",
];

const CERTS = [
  "Google Data Analytics","Meta Marketing","CFA Level 1","FRM Part 1",
  "Six Sigma Green Belt","PMP","AWS Cloud Practitioner","Bloomberg Market Concepts",
  "NISM Certification","SHRM-CP","Google Digital Marketing","Coursera Business Analytics",
];

const COMPANIES = [
  "HUL","ITC","Dabur","Asian Paints","Marico","Nestle","P&G","Colgate","Britannia","Emami",
  "Deloitte","KPMG","PwC","EY","Grant Thornton","Cognizant","Wipro","Infosys BPM","TCS",
  "HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra","Amazon","Flipkart","Meesho","Nykaa",
  "Aon","Mercer","Willis Towers Watson",
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #09090b;
    --surface: #111113;
    --surface2: #18181b;
    --border: #27272a;
    --border2: #3f3f46;
    --text: #fafafa;
    --muted: #71717a;
    --muted2: #52525b;
    --accent: #f97316;
    --accent-dim: rgba(249,115,22,0.12);
    --accent-dim2: rgba(249,115,22,0.06);
    --green: #22c55e;
    --green-dim: rgba(34,197,94,0.1);
    --red: #ef4444;
    --red-dim: rgba(239,68,68,0.1);
    --yellow: #eab308;
    --yellow-dim: rgba(234,179,8,0.1);
    --blue: #3b82f6;
    --blue-dim: rgba(59,130,246,0.1);
    --radius: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
  }

  html, body, #root { height: 100%; width: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* ── LAYOUT ── */
  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .topbar {
    height: 56px;
    background: rgba(9,9,11,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
  }

  .logo {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: var(--text);
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    width: 28px; height: 28px;
    background: var(--accent);
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    color: white;
  }

  .logo-badge {
    font-size: 10px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(249,115,22,0.25);
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    margin-left: 4px;
  }

  .topbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }

  .step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border2);
    transition: background 0.3s;
  }

  .step-dot.active { background: var(--accent); }
  .step-dot.done { background: var(--green); }

  /* ── MAIN CONTENT ── */
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  /* ── FORM PAGE ── */
  .form-page {
    flex: 1;
    display: grid;
    grid-template-columns: 340px 1fr;
    min-height: calc(100vh - 56px);
  }

  .form-sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: sticky;
    top: 56px;
    height: calc(100vh - 56px);
    overflow-y: auto;
  }

  .sidebar-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.15s;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
  }

  .sidebar-step:hover { background: var(--surface2); color: var(--text); }
  .sidebar-step.active { background: var(--accent-dim); color: var(--accent); }
  .sidebar-step.complete { color: var(--green); }

  .sidebar-step-num {
    width: 24px; height: 24px;
    border-radius: 6px;
    border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .sidebar-step.active .sidebar-step-num {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }

  .sidebar-step.complete .sidebar-step-num {
    background: var(--green-dim);
    border-color: var(--green);
    color: var(--green);
  }

  .sidebar-cta {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .btn-primary {
    width: 100%;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 13px 20px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -0.2px;
  }

  .btn-primary:hover { background: #ea6c0a; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-ghost:hover { border-color: var(--border2); color: var(--text); }

  /* ── FORM MAIN ── */
  .form-main {
    padding: 40px 48px;
    max-width: 860px;
  }

  .section-header {
    margin-bottom: 28px;
  }

  .section-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }

  .section-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .section-sub {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
  }

  .form-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }

  .form-block:hover { border-color: var(--border2); }

  .block-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .block-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .field { margin-bottom: 14px; }
  .field:last-child { margin-bottom: 0; }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .field-label .req { color: var(--accent); }

  .inp, .sel, .ta {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }

  .inp:focus, .sel:focus, .ta:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  .inp::placeholder, .ta::placeholder { color: var(--muted2); }

  .ta { resize: vertical; min-height: 110px; line-height: 1.6; }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  /* ── TAGS ── */
  .tags { display: flex; flex-wrap: wrap; gap: 7px; }

  .tag {
    padding: 6px 13px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
    user-select: none;
  }

  .tag:hover { border-color: var(--border2); color: var(--text); }
  .tag.on-orange { background: var(--accent-dim); border-color: rgba(249,115,22,0.4); color: var(--accent); }
  .tag.on-blue { background: var(--blue-dim); border-color: rgba(59,130,246,0.4); color: var(--blue); }
  .tag.disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── SPEC TAGS ── */
  .spec-tags { display: flex; flex-wrap: wrap; gap: 8px; }

  .spec-tag {
    padding: 9px 18px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--muted);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
    user-select: none;
  }

  .spec-tag:hover { border-color: var(--accent); color: var(--accent); }
  .spec-tag.on { background: var(--accent); border-color: var(--accent); color: white; }
  .spec-tag.disabled { opacity: 0.3; cursor: not-allowed; }

  .spec-note {
    font-size: 12px;
    color: var(--green);
    font-weight: 600;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── FILE / PASTE TABS ── */
  .mode-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
  }

  .mode-tab {
    flex: 1;
    padding: 8px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
    text-align: center;
  }

  .mode-tab.active {
    background: var(--surface2);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }

  .upload-btn {
    width: 100%;
    background: var(--surface2);
    border: 1px dashed var(--border2);
    border-radius: var(--radius);
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s;
    display: block;
  }

  .upload-btn:hover { border-color: var(--accent); background: var(--accent-dim2); }
  .upload-btn-icon { font-size: 24px; margin-bottom: 8px; }
  .upload-btn-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .upload-btn-sub { font-size: 11px; color: var(--muted2); }

  .upload-done {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--green-dim);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: var(--radius);
    padding: 12px 14px;
  }

  .upload-done-name { flex: 1; font-size: 13px; font-weight: 600; color: var(--green); }
  .upload-done-remove { font-size: 11px; color: var(--muted); cursor: pointer; }
  .upload-done-remove:hover { color: var(--red); }

  /* ── ERROR ── */
  .error-bar {
    background: var(--red-dim);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: var(--radius);
    padding: 12px 16px;
    color: #fca5a5;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── LOADING ── */
  .loading-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 56px);
    padding: 40px;
    text-align: center;
  }

  .loading-ring {
    width: 56px; height: 56px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin-bottom: 28px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .loading-sub { font-size: 14px; color: var(--muted); margin-bottom: 36px; }

  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 360px;
  }

  .loading-step {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--muted);
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pulse-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    animation: pulse 1.4s ease-in-out infinite;
  }

  .d0{animation-delay:0s}.d1{animation-delay:0.25s}.d2{animation-delay:0.5s}.d3{animation-delay:0.75s}

  @keyframes pulse { 0%,100%{opacity:0.15;transform:scale(0.6)} 50%{opacity:1;transform:scale(1.2)} }

  /* ── REPORT PAGE ── */
  .report-page {
    flex: 1;
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: calc(100vh - 56px);
  }

  .report-sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 28px 20px;
    position: sticky;
    top: 56px;
    height: calc(100vh - 56px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .score-circle-wrap {
    text-align: center;
    padding: 20px 0 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
  }

  .score-ring {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 12px;
  }

  .score-ring svg { transform: rotate(-90deg); }

  .score-ring-num {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-num {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
  }

  .score-denom { font-size: 12px; color: var(--muted); }

  .score-label {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .score-name { font-size: 12px; color: var(--muted); }

  .sidebar-stat {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-stat-label { font-size: 11px; color: var(--muted); font-weight: 500; }
  .sidebar-stat-val { font-size: 15px; font-weight: 700; }

  .priority-card {
    background: var(--accent-dim);
    border: 1px solid rgba(249,115,22,0.25);
    border-radius: var(--radius);
    padding: 14px;
    margin-top: 4px;
  }

  .priority-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 7px;
  }

  .priority-text { font-size: 12px; color: var(--text); line-height: 1.6; }

  .report-reset {
    margin-top: auto;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px;
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
    text-align: center;
    width: 100%;
  }

  .report-reset:hover { border-color: var(--border2); color: var(--text); }

  /* ── REPORT MAIN ── */
  .report-main {
    padding: 32px 40px;
    overflow-y: auto;
  }

  .report-section {
    margin-bottom: 28px;
  }

  .report-section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .report-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Summary */
  .summary-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    font-size: 14px;
    color: #a1a1aa;
    line-height: 1.8;
  }

  /* Company cards */
  .co-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    margin-bottom: 10px;
    transition: border-color 0.2s;
  }

  .co-card:hover { border-color: var(--border2); }

  .co-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .co-name { font-size: 15px; font-weight: 700; }
  .co-role { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .co-pct { font-size: 26px; font-weight: 800; }
  .co-bar { height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 14px; overflow: hidden; }
  .co-fill { height: 100%; border-radius: 2px; }
  .co-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .co-col-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
  .col-have .co-col-label { color: var(--green); }
  .col-need .co-col-label { color: var(--red); }
  .co-item { font-size: 12px; color: #71717a; margin-bottom: 3px; }

  /* Gap cards */
  .gap-card {
    border-radius: var(--radius-lg);
    padding: 18px;
    margin-bottom: 10px;
    border: 1px solid;
  }

  .gap-high { background: var(--red-dim); border-color: rgba(239,68,68,0.25); }
  .gap-medium { background: var(--yellow-dim); border-color: rgba(234,179,8,0.25); }
  .gap-low { background: var(--green-dim); border-color: rgba(34,197,94,0.25); }

  .gap-top { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
  .gap-title-text { font-size: 14px; font-weight: 700; flex: 1; }

  .sev-badge {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 5px;
  }

  .sev-high { background: var(--red); color: white; }
  .sev-medium { background: var(--yellow); color: #1a1a1a; }
  .sev-low { background: var(--green); color: white; }

  .gap-affects { font-size: 12px; color: var(--muted); margin-bottom: 9px; }
  .gap-fix { font-size: 13px; color: #d4d4d8; line-height: 1.65; }
  .gap-time { font-size: 11px; color: var(--muted2); margin-top: 7px; display: flex; align-items: center; gap: 5px; }

  /* Week plan */
  .week-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    margin-bottom: 8px;
    display: flex;
    gap: 16px;
    transition: border-color 0.2s;
  }

  .week-card:hover { border-color: var(--border2); }

  .week-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    color: var(--accent);
    min-width: 64px;
    padding-top: 2px;
    text-transform: uppercase;
  }

  .week-focus { font-size: 13px; font-weight: 700; margin-bottom: 7px; }
  .week-task { font-size: 12px; color: var(--muted); margin-bottom: 3px; padding-left: 12px; position: relative; }
  .week-task::before { content: '→'; position: absolute; left: 0; color: var(--accent); }

  /* Strength */
  .strength-card {
    background: var(--green-dim);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: var(--radius-lg);
    padding: 18px;
  }

  .strength-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 8px;
  }

  .strength-text { font-size: 13px; color: #d4d4d8; line-height: 1.7; }

  /* JD match banner */
  .jd-banner {
    background: var(--blue-dim);
    border: 1px solid rgba(59,130,246,0.25);
    border-radius: var(--radius);
    padding: 12px 16px;
    font-size: 12px;
    color: #93c5fd;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .form-page { grid-template-columns: 1fr; }
    .form-sidebar { display: none; }
    .form-main { padding: 24px 16px; }
    .grid2, .grid3 { grid-template-columns: 1fr; }
    .report-page { grid-template-columns: 1fr; }
    .report-sidebar { position: static; height: auto; }
    .report-main { padding: 20px 16px; }
    .co-cols { grid-template-columns: 1fr; }
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.4s ease both; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scoreColor(n) {
  if (n >= 75) return "var(--green)";
  if (n >= 50) return "var(--yellow)";
  return "var(--red)";
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
}

function ScoreRing({ score }) {
  const r = 48, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const dash = pct * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  return (
    <div className="score-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="score-ring-num">
        <span className="score-num" style={{ color }}>{score}</span>
        <span className="score-denom">/100</span>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function PlacementIQ() {
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [college, setCollege] = useState("Jaipuria Institute of Management");
  const [specs, setSpecs] = useState([]);
  const [cgpa, setCgpa] = useState("");
  const [grad, setGrad] = useState("");
  const [xii, setXii] = useState("");
  const [x, setX] = useState("");
  const [internships, setInternships] = useState("0");
  const [projects, setProjects] = useState("");
  const [extra, setExtra] = useState("");
  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [targets, setTargets] = useState([]);

  // Resume
  const [resumeMode, setResumeMode] = useState("paste");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  // JD
  const [jdMode, setJdMode] = useState("paste");
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");

  const resumeRef = useRef();
  const jdRef = useRef();

  function togSpec(s) {
    setSpecs(p => p.includes(s) ? p.filter(i => i !== s) : p.length >= 2 ? p : [...p, s]);
  }

  function tog(list, set, item) {
    set(p => p.includes(item) ? p.filter(i => i !== item) : [...p, item]);
  }

  async function handleFile(file, setText, setFile) {
    if (!file) return;
    setFile(file);
    try {
      const t = await readFileAsText(file);
      setText(t.slice(0, 4000));
    } catch {
      setText(`[File: ${file.name} — could not extract text. Please use Paste Text instead.]`);
    }
  }

  function buildPrompt() {
    const hasResume = resumeText.trim().length > 20;
    const hasJD = jdText.trim().length > 20;

    return `You are an elite B-school placement consultant and career strategist specializing in Indian tier-2 MBA placements. Your task: produce a brutally honest, hyper-specific placement readiness gap report.

═══ STUDENT PROFILE ═══
Name: ${name || "Student"}
College: ${college}
Specialisations: ${specs.length ? specs.join(" + ") : "Not specified"}
PGDM CGPA: ${cgpa || "not provided"}/10
Graduation %: ${grad || "not provided"}
Class 12 %: ${xii || "not provided"}
Class 10 %: ${x || "not provided"}
Skills: ${skills.length ? skills.join(", ") : "none selected"}
Certifications: ${certs.length ? certs.join(", ") : "none"}
Internships: ${internships}
Projects/Case Studies: ${projects || "none mentioned"}
Extracurriculars/Leadership: ${extra || "none"}
Target Companies: ${targets.length ? targets.join(", ") : "not specified"}

${hasResume ? `═══ RESUME CONTENT ═══\n${resumeText}\n` : ""}
${hasJD ? `═══ JOB DESCRIPTION (Student's Target Role) ═══\n${jdText.trim()}\n` : ""}

${hasJD && hasResume ? `
CRITICAL INSTRUCTIONS:
1. Do a line-by-line comparison of the RESUME vs the JOB DESCRIPTION.
2. For every requirement in the JD, state clearly: does the resume show evidence of this or not?
3. Make gaps extremely specific to THIS JD — not generic advice.
4. The readiness score should reflect how well this resume matches this specific JD.
` : hasJD ? `
CRITICAL INSTRUCTIONS:
1. Analyze the profile against the specific JD provided.
2. Every gap must reference specific JD requirements.
3. Action plan must be tailored to land THIS specific role.
` : hasResume ? `
CRITICAL INSTRUCTIONS:
1. Cross-reference resume content with the stated profile for accuracy.
2. Note any inconsistencies between what the student stated and what the resume shows.
3. Identify hidden strengths visible in the resume that the student may have undersold.
` : ""}

Return ONLY raw valid JSON. No markdown, no code fences, no extra text. Exactly this structure:
{"readinessScore":72,"scoreLabel":"Developing","summary":"2-3 sentence brutally honest assessment mentioning the student by name and their specific situation.","salaryRange":"5.5-7 LPA","gapsCount":4,"jdMatchNote":"${hasJD ? "Brief note on how well the profile matches the specific JD" : ""}","companyMatches":[{"company":"Company Name","matchPct":65,"role":"Specific Role Title","studentHas":["specific evidence from profile/resume"],"studentNeeds":["specific gap vs this company JD"]}],"gaps":[{"title":"Specific Gap Name","severity":"high","affects":"Company1, Company2","fix":"Very specific actionable fix with resource or method","timeline":"X weeks"}],"weekPlan":[{"label":"Week 1-2","focus":"Focus Theme","tasks":["specific task 1","specific task 2","specific task 3"]},{"label":"Week 3-4","focus":"Focus Theme","tasks":["specific task 1","specific task 2","specific task 3"]},{"label":"Week 5-6","focus":"Focus Theme","tasks":["specific task 1","specific task 2","specific task 3"]}],"topPriority":"The single most critical action this student must take in the next 30 days — be extremely specific","hiddenStrength":"One genuine underrated strength to leverage — be specific"}`;
  }

  async function analyze() {
    if (specs.length === 0 || !cgpa) {
      setError("Please select at least one specialisation and enter your CGPA to continue.");
      return;
    }
    setError("");
    setStep("loading");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed " + res.status);
      const raw = (data.text || "").trim();
      const clean = raw.replace(/^```[a-z]*\n?/i, "").replace(/```\s*$/m, "").trim();
      const parsed = JSON.parse(clean);
      setReport(parsed);
      setStep("report");
    } catch (err) {
      setError("Analysis failed: " + err.message);
      setStep("form");
    }
  }

  function reset() {
    setStep("form"); setReport(null); setError("");
    setName(""); setCgpa(""); setSpecs([]); setGrad(""); setXii(""); setX("");
    setProjects(""); setExtra(""); setSkills([]); setCerts([]); setTargets([]);
    setInternships("0"); setResumeFile(null); setResumeText(""); setResumeMode("paste");
    setJdFile(null); setJdText(""); setJdMode("paste");
  }

  const hasResume = resumeText.trim().length > 20;
  const hasJD = jdText.trim().length > 20;

  // sidebar steps completion
  const sidebarSteps = [
    { num: "01", label: "Profile", done: !!name && specs.length > 0 },
    { num: "02", label: "Academics", done: !!cgpa },
    { num: "03", label: "Skills", done: skills.length > 0 },
    { num: "04", label: "Certifications", done: certs.length > 0 },
    { num: "05", label: "Experience", done: internships !== "0" || !!projects },
    { num: "06", label: "Resume", done: hasResume },
    { num: "07", label: "Job Description", done: hasJD },
    { num: "08", label: "Target Companies", done: targets.length > 0 },
  ];

  // ── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <style>{G}</style>

      {/* TOP BAR */}
      <nav className="topbar">
        <div className="logo">
          <div className="logo-icon">P</div>
          PlacementIQ
          <span className="logo-badge">BETA</span>
        </div>
        {step === "form" && (
          <div className="topbar-right">
            <div className="step-indicator">
              {sidebarSteps.map((s, i) => (
                <div key={i} className={`step-dot ${s.done ? "done" : ""}`} title={s.label} />
              ))}
            </div>
          </div>
        )}
        {step === "report" && (
          <div className="topbar-right">
            <button className="btn-ghost" onClick={reset} style={{ fontSize: "12px", padding: "7px 14px" }}>
              ← New Analysis
            </button>
          </div>
        )}
      </nav>

      <div className="content">

        {/* ── FORM ── */}
        {step === "form" && (
          <div className="form-page">

            {/* Sidebar */}
            <aside className="form-sidebar">
              <div className="sidebar-title">Profile Checklist</div>
              {sidebarSteps.map((s, i) => (
                <div key={i} className={`sidebar-step ${s.done ? "complete" : ""}`}>
                  <div className="sidebar-step-num">{s.done ? "✓" : s.num}</div>
                  {s.label}
                </div>
              ))}
              <div className="sidebar-cta">
                {error && <div className="error-bar" style={{ marginBottom: "12px", fontSize: "12px" }}>⚠ {error}</div>}
                <button className="btn-primary" onClick={analyze}>
                  Analyze My Profile →
                </button>
                <div style={{ fontSize: "11px", color: "var(--muted2)", textAlign: "center", marginTop: "10px" }}>
                  {sidebarSteps.filter(s => s.done).length}/{sidebarSteps.length} sections filled
                </div>
              </div>
            </aside>

            {/* Main form */}
            <main className="form-main">
              <div className="section-header">
                <div className="section-eyebrow">Placement Readiness Analyzer</div>
                <h1 className="section-title">Know exactly what's stopping your placement.</h1>
                <p className="section-sub">Fill your profile below. Add your resume + JD for a laser-focused analysis.</p>
              </div>

              {error && <div className="error-bar">⚠ {error}</div>}

              {/* 01 Profile */}
              <div className="form-block">
                <div className="block-label">01 — Profile</div>
                <div className="grid2">
                  <div className="field">
                    <div className="field-label">Full Name</div>
                    <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nitin Sharma" />
                  </div>
                  <div className="field">
                    <div className="field-label">College / Institute</div>
                    <input className="inp" value={college} onChange={e => setCollege(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">Specialisation <span className="req">*</span> <span style={{ color: "var(--muted2)", fontWeight: 400 }}>— Choose up to 2 (Double Specialisation)</span></div>
                  <div className="spec-tags">
                    {SPECIALISATIONS.map(s => {
                      const on = specs.includes(s);
                      const dis = !on && specs.length >= 2;
                      return (
                        <button key={s} className={`spec-tag ${on ? "on" : ""} ${dis ? "disabled" : ""}`}
                          onClick={() => !dis && togSpec(s)}>{s}</button>
                      );
                    })}
                  </div>
                  {specs.length === 2 && (
                    <div className="spec-note">✓ {specs[0]} + {specs[1]}</div>
                  )}
                </div>
              </div>

              {/* 02 Academics */}
              <div className="form-block">
                <div className="block-label">02 — Academics</div>
                <div className="grid2">
                  <div className="field">
                    <div className="field-label">PGDM CGPA <span className="req">*</span></div>
                    <input className="inp" type="number" min="0" max="10" step="0.1" value={cgpa} onChange={e => setCgpa(e.target.value)} placeholder="e.g. 7.6" />
                  </div>
                  <div className="field">
                    <div className="field-label">Graduation %</div>
                    <input className="inp" type="number" value={grad} onChange={e => setGrad(e.target.value)} placeholder="e.g. 68" />
                  </div>
                  <div className="field">
                    <div className="field-label">Class 12 %</div>
                    <input className="inp" type="number" value={xii} onChange={e => setXii(e.target.value)} placeholder="e.g. 78" />
                  </div>
                  <div className="field">
                    <div className="field-label">Class 10 %</div>
                    <input className="inp" type="number" value={x} onChange={e => setX(e.target.value)} placeholder="e.g. 85" />
                  </div>
                </div>
              </div>

              {/* 03 Skills */}
              <div className="form-block">
                <div className="block-label">03 — Skills</div>
                <div className="tags">
                  {SKILLS.map(s => (
                    <button key={s} className={`tag ${skills.includes(s) ? "on-orange" : ""}`} onClick={() => tog(skills, setSkills, s)}>{s}</button>
                  ))}
                </div>
              </div>

              {/* 04 Certifications */}
              <div className="form-block">
                <div className="block-label">04 — Certifications</div>
                <div className="tags">
                  {CERTS.map(c => (
                    <button key={c} className={`tag ${certs.includes(c) ? "on-orange" : ""}`} onClick={() => tog(certs, setCerts, c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* 05 Experience */}
              <div className="form-block">
                <div className="block-label">05 — Experience</div>
                <div className="field">
                  <div className="field-label">Internships Completed</div>
                  <select className="sel" value={internships} onChange={e => setInternships(e.target.value)}>
                    <option value="0">None yet</option>
                    <option value="1">1 internship</option>
                    <option value="2">2 internships</option>
                    <option value="3+">3 or more</option>
                  </select>
                </div>
                <div className="field">
                  <div className="field-label">Projects / Case Studies</div>
                  <input className="inp" value={projects} onChange={e => setProjects(e.target.value)} placeholder="e.g. Pricing strategy for HUL, Excel sales dashboard…" />
                </div>
                <div className="field">
                  <div className="field-label">Extracurriculars / Leadership</div>
                  <input className="inp" value={extra} onChange={e => setExtra(e.target.value)} placeholder="e.g. Marketing Club Head, B-Plan 1st place…" />
                </div>
              </div>

              {/* 06 Resume */}
              <div className="form-block">
                <div className="block-label">
                  06 — Resume
                  <span style={{ fontSize: "10px", background: "var(--green-dim)", border: "1px solid rgba(34,197,94,0.25)", color: "var(--green)", padding: "2px 8px", borderRadius: "5px", letterSpacing: "1px", fontWeight: 700, marginLeft: "4px" }}>RECOMMENDED</span>
                </div>
                <div className="mode-tabs">
                  {["paste", "upload"].map(m => (
                    <button key={m} className={`mode-tab ${resumeMode === m ? "active" : ""}`} onClick={() => setResumeMode(m)}>
                      {m === "paste" ? "📋 Paste Text" : "📁 Upload File"}
                    </button>
                  ))}
                </div>
                {resumeMode === "paste" ? (
                  <textarea className="ta" value={resumeText} onChange={e => setResumeText(e.target.value)}
                    placeholder="Paste your full resume text here — name, education, experience, skills, projects, certifications…&#10;&#10;Tip: Open your resume PDF → Select All → Copy → Paste here" style={{ minHeight: "140px" }} />
                ) : resumeFile ? (
                  <div className="upload-done">
                    <span>✅</span>
                    <span className="upload-done-name">{resumeFile.name}</span>
                    <span className="upload-done-remove" onClick={() => { setResumeFile(null); setResumeText(""); }}>Remove</span>
                  </div>
                ) : (
                  <>
                    <input ref={resumeRef} type="file" accept=".txt,.pdf,.doc,.docx"
                      style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }}
                      onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0], setResumeText, setResumeFile); e.target.value = ""; }} />
                    <button className="upload-btn" onClick={() => resumeRef.current?.click()}>
                      <div className="upload-btn-icon">📄</div>
                      <div className="upload-btn-title">Tap to browse phone storage</div>
                      <div className="upload-btn-sub">.txt, .pdf, .doc, .docx · Note: .txt works best on mobile</div>
                    </button>
                  </>
                )}
                {hasResume && <div style={{ fontSize: "11px", color: "var(--green)", marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>✓ Resume loaded ({resumeText.length} characters)</div>}
              </div>

              {/* 07 JD */}
              <div className="form-block">
                <div className="block-label">
                  07 — Job Description
                  <span style={{ fontSize: "10px", background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)", color: "var(--blue)", padding: "2px 8px", borderRadius: "5px", letterSpacing: "1px", fontWeight: 700, marginLeft: "4px" }}>BOOSTS ACCURACY</span>
                </div>
                <div className="mode-tabs">
                  {["paste", "upload"].map(m => (
                    <button key={m} className={`mode-tab ${jdMode === m ? "active" : ""}`} onClick={() => setJdMode(m)}>
                      {m === "paste" ? "📋 Paste Text" : "📁 Upload File"}
                    </button>
                  ))}
                </div>
                {jdMode === "paste" ? (
                  <textarea className="ta" value={jdText} onChange={e => setJdText(e.target.value)}
                    placeholder="Paste the full Job Description here…&#10;&#10;e.g. Role: Sales Officer – HUL&#10;Requirements: 60%+ academics, Excel proficiency, consumer goods experience, strong communication skills, willingness to relocate…" />
                ) : jdFile ? (
                  <div className="upload-done">
                    <span>✅</span>
                    <span className="upload-done-name">{jdFile.name}</span>
                    <span className="upload-done-remove" onClick={() => { setJdFile(null); setJdText(""); }}>Remove</span>
                  </div>
                ) : (
                  <>
                    <input ref={jdRef} type="file" accept=".txt,.pdf,.doc,.docx"
                      style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }}
                      onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0], setJdText, setJdFile); e.target.value = ""; }} />
                    <button className="upload-btn" onClick={() => jdRef.current?.click()}>
                      <div className="upload-btn-icon">📋</div>
                      <div className="upload-btn-title">Tap to browse phone storage</div>
                      <div className="upload-btn-sub">.txt, .pdf, .doc, .docx · Note: .txt works best on mobile</div>
                    </button>
                  </>
                )}
                {hasJD && <div style={{ fontSize: "11px", color: "var(--blue)", marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>✓ JD loaded — analysis will be role-specific</div>}
              </div>

              {/* 08 Companies */}
              <div className="form-block">
                <div className="block-label">08 — Target Companies</div>
                <div style={{ fontSize: "12px", color: "var(--muted2)", marginBottom: "12px" }}>More companies will be added as your campus placement list is finalised</div>
                <div className="tags">
                  {COMPANIES.map(c => (
                    <button key={c} className={`tag ${targets.includes(c) ? "on-blue" : ""}`} onClick={() => tog(targets, setTargets, c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <button className="btn-primary" onClick={analyze} style={{ marginTop: "8px", display: "none" }}
                id="mobile-cta">
                Analyze My Profile →
              </button>
              <button className="btn-primary" onClick={analyze} style={{ marginTop: "8px" }}>
                Analyze My Placement Readiness →
              </button>

            </main>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === "loading" && (
          <div className="loading-page fade-up">
            <div className="loading-ring" />
            <h2 className="loading-title">Analyzing your profile…</h2>
            <p className="loading-sub">
              {hasJD && hasResume
                ? "Comparing your resume against the JD line by line"
                : hasJD
                ? "Mapping your profile against the specific JD"
                : hasResume
                ? "Deep-reading your resume for insights"
                : `Matching against JD patterns from ${targets.length > 0 ? targets.join(", ") : "top campus companies"}`}
            </p>
            <div className="loading-steps">
              {[
                hasResume ? "📄 Reading resume content" : "📊 Scanning academic benchmarks",
                hasJD ? "🎯 Parsing target Job Description" : "🏢 Mapping skills to company JDs",
                "🔍 Identifying placement gaps",
                "📅 Building your 6-week action plan",
              ].map((s, i) => (
                <div className="loading-step" key={i}>
                  <span className={`pulse-dot d${i}`} />{s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REPORT ── */}
        {step === "report" && report && (
          <div className="report-page fade-up">

            {/* Report sidebar */}
            <aside className="report-sidebar">
              <div className="score-circle-wrap">
                <ScoreRing score={report.readinessScore} />
                <div className="score-label" style={{ color: scoreColor(report.readinessScore) }}>{report.scoreLabel}</div>
                <div className="score-name">{name || "Your"} Readiness</div>
              </div>

              <div className="sidebar-stat">
                <span className="sidebar-stat-label">Gaps Found</span>
                <span className="sidebar-stat-val" style={{ color: "var(--red)" }}>{report.gapsCount ?? report.gaps?.length ?? "—"}</span>
              </div>
              <div className="sidebar-stat">
                <span className="sidebar-stat-label">Companies Analyzed</span>
                <span className="sidebar-stat-val" style={{ color: "var(--blue)" }}>{report.companyMatches?.length ?? "—"}</span>
              </div>
              <div className="sidebar-stat">
                <span className="sidebar-stat-label">Expected CTC</span>
                <span className="sidebar-stat-val" style={{ color: "var(--green)", fontSize: "13px" }}>{report.salaryRange ?? "—"}</span>
              </div>

              {report.topPriority && (
                <div className="priority-card">
                  <div className="priority-label">⚡ #1 Priority</div>
                  <div className="priority-text">{report.topPriority}</div>
                </div>
              )}

              <button className="report-reset" onClick={reset}>← New Analysis</button>
            </aside>

            {/* Report main */}
            <main className="report-main">

              {/* JD match banner */}
              {hasJD && report.jdMatchNote && (
                <div className="jd-banner">
                  🎯 <strong>JD Analysis:</strong> {report.jdMatchNote}
                </div>
              )}

              {/* Summary */}
              <div className="report-section">
                <div className="report-section-title">Assessment Summary</div>
                <div className="summary-card">{report.summary}</div>
              </div>

              {/* Company matches */}
              {report.companyMatches?.length > 0 && (
                <div className="report-section">
                  <div className="report-section-title">Company Match Analysis</div>
                  {report.companyMatches.map((c, i) => (
                    <div className="co-card" key={i}>
                      <div className="co-top">
                        <div>
                          <div className="co-name">{c.company}</div>
                          <div className="co-role">{c.role}</div>
                        </div>
                        <div className="co-pct" style={{ color: scoreColor(c.matchPct) }}>{c.matchPct}%</div>
                      </div>
                      <div className="co-bar">
                        <div className="co-fill" style={{ width: `${c.matchPct}%`, background: c.matchPct >= 75 ? "#22c55e" : c.matchPct >= 50 ? "#eab308" : "#ef4444" }} />
                      </div>
                      <div className="co-cols">
                        <div className="col-have">
                          <div className="co-col-label">✓ You Have</div>
                          {c.studentHas?.map((h, j) => <div className="co-item" key={j}>• {h}</div>)}
                        </div>
                        <div className="col-need">
                          <div className="co-col-label">✗ You Need</div>
                          {c.studentNeeds?.map((n, j) => <div className="co-item" key={j}>• {n}</div>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gaps */}
              {report.gaps?.length > 0 && (
                <div className="report-section">
                  <div className="report-section-title">Gap Analysis</div>
                  {report.gaps.map((g, i) => (
                    <div className={`gap-card gap-${g.severity}`} key={i}>
                      <div className="gap-top">
                        <div className="gap-title-text">{g.title}</div>
                        <span className={`sev-badge sev-${g.severity}`}>{g.severity}</span>
                      </div>
                      <div className="gap-affects">Affects: {g.affects}</div>
                      <div className="gap-fix">💡 {g.fix}</div>
                      <div className="gap-time">⏱ {g.timeline}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Week plan */}
              {report.weekPlan?.length > 0 && (
                <div className="report-section">
                  <div className="report-section-title">6-Week Action Plan</div>
                  {report.weekPlan.map((w, i) => (
                    <div className="week-card" key={i}>
                      <div className="week-label">{w.label}</div>
                      <div>
                        <div className="week-focus">{w.focus}</div>
                        {w.tasks?.map((t, j) => <div className="week-task" key={j}>{t}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden strength */}
              {report.hiddenStrength && (
                <div className="report-section">
                  <div className="report-section-title">Hidden Strength</div>
                  <div className="strength-card">
                    <div className="strength-label">💎 Leverage This</div>
                    <div className="strength-text">{report.hiddenStrength}</div>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
}
