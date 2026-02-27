#!/bin/bash
cd /root/.openclaw/workspace/jove-gate

# Common page style template
read -r -d '' STYLE << 'STYLEEOF'
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Noto+Serif+KR:wght@200;300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #060606; --fg: #e8e4df;
    --fg-dim: rgba(232,228,223,0.45); --fg-subtle: rgba(232,228,223,0.12);
    --gold: #c4a96a; --gold-dim: rgba(196,169,106,0.25);
    --serif: 'Cormorant Garamond', serif; --serif-kr: 'Noto Serif KR', serif;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--fg); font-family: var(--serif-kr); line-height: 1.8; }
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 3rem; background: rgba(6,6,6,0.6);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(196,169,106,0.06);
    transition: background 0.4s, padding 0.4s;
  }
  nav.scrolled { background: rgba(6,6,6,0.92); padding: 1rem 3rem; }
  .nav-left, .nav-right { flex: 1; }
  .nav-right { text-align: right; }
  .nav-center img { height: 24px; }
  .nav-left a, .nav-right a {
    color: var(--fg-dim); text-decoration: none; font-family: var(--serif);
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; transition: color 0.3s;
  }
  .nav-left a:hover, .nav-right a:hover { color: var(--fg); }
  .hamburger { font-size: 1.2rem; cursor: pointer; color: var(--fg-dim); }
  .page { max-width: 800px; margin: 0 auto; padding: 8rem 3rem 5rem; }
  .page-title {
    font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 300; letter-spacing: 0.1em; margin-bottom: 1rem;
  }
  .page-subtitle {
    font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--gold-dim); margin-bottom: 3rem;
  }
  .page h2 {
    font-family: var(--serif); font-size: 1.3rem; font-weight: 400;
    letter-spacing: 0.08em; margin: 3rem 0 1.5rem;
    padding-bottom: 0.8rem; border-bottom: 1px solid rgba(196,169,106,0.08);
  }
  .page h3 {
    font-family: var(--serif); font-size: 1rem; font-weight: 400;
    color: var(--fg); margin: 2rem 0 1rem; letter-spacing: 0.05em;
  }
  .page p, .page li {
    font-size: 0.85rem; font-weight: 300; color: rgba(232,228,223,0.6);
    line-height: 2; margin-bottom: 1rem;
  }
  .page ul, .page ol { padding-left: 1.2rem; margin-bottom: 1.5rem; }
  .page li { margin-bottom: 0.5rem; }
  .page a { color: var(--gold); text-decoration: none; border-bottom: 1px solid rgba(196,169,106,0.2); transition: border-color 0.3s; }
  .page a:hover { border-color: var(--gold); }
  .page table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  .page th, .page td {
    text-align: left; padding: 0.8rem 1rem; font-size: 0.8rem; font-weight: 300;
    color: rgba(232,228,223,0.55); border-bottom: 1px solid rgba(196,169,106,0.06);
  }
  .page th { color: var(--fg-dim); font-weight: 400; letter-spacing: 0.05em; }
  .info-box {
    background: rgba(196,169,106,0.04); border: 1px solid rgba(196,169,106,0.08);
    padding: 1.5rem 2rem; margin: 2rem 0;
  }
  .info-box p { margin-bottom: 0.5rem; }
  footer {
    border-top: 1px solid rgba(196,169,106,0.06); padding: 3rem;
    display: flex; justify-content: space-between; align-items: center;
    max-width: 800px; margin: 0 auto;
  }
  footer .footer-logo img { height: 18px; opacity: 0.4; }
  footer .copyright { font-size: 0.55rem; color: rgba(232,228,223,0.15); }
  @media (max-width: 768px) {
    nav { padding: 1.2rem 1.5rem; }
    .page { padding: 7rem 1.5rem 3rem; }
    .page table { font-size: 0.75rem; }
  }
STYLEEOF

echo "Template ready"
