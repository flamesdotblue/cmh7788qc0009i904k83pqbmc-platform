import { useEffect, useMemo, useState } from 'react';
import { Save, Trash, List, Eye, Settings } from 'lucide-react';
import { backend } from '../lib/supabaseService';

export default function FormsPanel({ current, onLoad, onUpdateId }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState(() => backend.getConfig());

  const loadForms = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await backend.listForms();
      setForms(list);
    } catch (e) {
      setError(e?.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, [config.mode]);

  const isValidCurrent = useMemo(() => {
    return !!(current && current.name && Array.isArray(current.fields));
  }, [current]);

  const save = async () => {
    if (!isValidCurrent) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        id: current.id || crypto.randomUUID(),
        name: current.name,
        fields: current.fields,
        updated_at: new Date().toISOString(),
      };
      const saved = await backend.upsertForm(payload);
      onUpdateId(saved.id);
      await loadForms();
    } catch (e) {
      setError(e?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError('');
    try {
      await backend.deleteForm(id);
      if (current.id === id) onUpdateId(null);
      await loadForms();
    } catch (e) {
      setError(e?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSave = () => {
    backend.setConfig(config);
    setShowConfig(false);
    loadForms();
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2"><List className="h-4 w-4" /> My Forms</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(true)}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-zinc-50 flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Backend
          </button>
          <button
            onClick={save}
            disabled={!isValidCurrent || loading}
            className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded-md bg-rose-50 text-rose-700 text-sm border border-rose-200">{error}</div>
      )}

      <div className="max-h-[420px] overflow-auto divide-y border rounded-md">
        {loading && forms.length === 0 && (
          <div className="p-4 text-sm text-zinc-500">Loading...</div>
        )}
        {!loading && forms.length === 0 && (
          <div className="p-4 text-sm text-zinc-500">No forms saved yet.</div>
        )}
        {forms.map((f) => (
          <div key={f.id} className="p-3 flex items-center justify-between gap-3 hover:bg-zinc-50">
            <div className="min-w-0">
              <div className="font-medium truncate">{f.name}</div>
              <div className="text-xs text-zinc-500">{new Date(f.updated_at || Date.now()).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2.5 py-1.5 rounded-md border text-sm hover:bg-zinc-50 flex items-center gap-1"
                onClick={() => onLoad(f)}
              >
                <Eye className="h-4 w-4" /> Edit
              </button>
              <button
                className="px-2.5 py-1.5 rounded-md border text-sm hover:bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1"
                onClick={() => remove(f.id)}
              >
                <Trash className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfig(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-xl border shadow-lg p-5">
            <h4 className="font-semibold text-lg">Backend configuration</h4>
            <p className="text-sm text-zinc-600 mt-1">
              Use Supabase REST credentials to persist forms or stay on local storage. Create a table named <span className="font-mono bg-zinc-100 px-1 rounded">forms</span> with columns: id (uuid PK), name (text), fields (jsonb), updated_at (timestamptz).
            </p>
            <div className="mt-4 grid gap-3">
              <div>
                <label className="text-xs text-zinc-500">Mode</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-md border"
                  value={config.mode}
                  onChange={(e) => setConfig((c) => ({ ...c, mode: e.target.value }))}
                >
                  <option value="local">Local (browser storage)</option>
                  <option value="supabase">Supabase (REST)</option>
                </select>
              </div>
              {config.mode === 'supabase' && (
                <>
                  <div>
                    <label className="text-xs text-zinc-500">Supabase URL</label>
                    <input
                      className="mt-1 w-full px-3 py-2 rounded-md border"
                      placeholder="https://YOUR-PROJECT.supabase.co"
                      value={config.url || ''}
                      onChange={(e) => setConfig((c) => ({ ...c, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500">Supabase anon key</label>
                    <input
                      className="mt-1 w-full px-3 py-2 rounded-md border font-mono"
                      placeholder="ey..."
                      value={config.key || ''}
                      onChange={(e) => setConfig((c) => ({ ...c, key: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShowConfig(false)}>Cancel</button>
              <button className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-sm" onClick={handleConfigSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-zinc-500">
        Mode: <span className="font-medium">{config.mode}</span>
      </div>
    </div>
  );
}
