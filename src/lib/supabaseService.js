const LOCAL_KEY = 'formforge_forms_v1';
const CFG_KEY = 'formforge_backend_cfg_v1';

function listLocal() {
  const raw = localStorage.getItem(LOCAL_KEY);
  const list = raw ? JSON.parse(raw) : [];
  return list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

function upsertLocal(form) {
  const list = listLocal();
  const idx = list.findIndex((f) => f.id === form.id);
  if (idx >= 0) list[idx] = form; else list.unshift(form);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  return form;
}

function deleteLocal(id) {
  const list = listLocal().filter((f) => f.id !== id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}

async function listRemote(cfg) {
  if (!cfg.url || !cfg.key) throw new Error('Supabase not configured');
  const url = `${cfg.url.replace(/\/$/, '')}/rest/v1/forms?select=*`;
  const res = await fetch(url, { headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` } });
  if (!res.ok) throw new Error('Supabase list error');
  const data = await res.json();
  return (data || []).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

async function upsertRemote(cfg, form) {
  if (!cfg.url || !cfg.key) throw new Error('Supabase not configured');
  const url = `${cfg.url.replace(/\/$/, '')}/rest/v1/forms`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify([form]),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Supabase upsert error: ${t}`);
  }
  const data = await res.json();
  return data?.[0] || form;
}

async function deleteRemote(cfg, id) {
  if (!cfg.url || !cfg.key) throw new Error('Supabase not configured');
  const url = `${cfg.url.replace(/\/$/, '')}/rest/v1/forms?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` },
  });
  if (!res.ok) throw new Error('Supabase delete error');
}

export const backend = {
  getConfig() {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) return JSON.parse(raw);
    return { mode: 'local', url: '', key: '' };
  },
  setConfig(cfg) {
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  },
  async listForms() {
    const cfg = this.getConfig();
    if (cfg.mode === 'supabase') return listRemote(cfg);
    return listLocal();
  },
  async upsertForm(form) {
    const cfg = this.getConfig();
    if (cfg.mode === 'supabase') return upsertRemote(cfg, form);
    return upsertLocal(form);
  },
  async deleteForm(id) {
    const cfg = this.getConfig();
    if (cfg.mode === 'supabase') return deleteRemote(cfg, id);
    return deleteLocal(id);
  },
};
