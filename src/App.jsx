import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import FormsPanel from './components/FormsPanel';

function App() {
  const [formName, setFormName] = useState('Untitled Form');
  const [fields, setFields] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('current_form_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormName(parsed.name || 'Untitled Form');
        setFields(Array.isArray(parsed.fields) ? parsed.fields : []);
        setSelectedFormId(parsed.id || null);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const draft = { id: selectedFormId, name: formName, fields };
    localStorage.setItem('current_form_draft', JSON.stringify(draft));
  }, [formName, fields, selectedFormId]);

  const schema = useMemo(() => ({ name: formName, fields }), [formName, fields]);

  const handleLoadForm = (form) => {
    setSelectedFormId(form.id || null);
    setFormName(form.name || 'Untitled Form');
    setFields(Array.isArray(form.fields) ? form.fields : []);
  };

  const handleReset = () => {
    setSelectedFormId(null);
    setFormName('Untitled Form');
    setFields([]);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Hero />
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700" />
            <div>
              <h1 className="font-semibold">Form Forge</h1>
              <p className="text-xs text-zinc-500">Drag, drop, preview, and publish</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="px-3 py-1.5 rounded-md border text-sm hover:bg-zinc-50">New</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-20 grid grid-cols-1 xl:grid-cols-4 gap-6">
        <section className="xl:col-span-3 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <input
                className="flex-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Form name"
              />
              <div className="text-xs text-zinc-500">{selectedFormId ? 'Editing saved form' : 'Draft'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormBuilder fields={fields} setFields={setFields} />
            <FormPreview schema={schema} />
          </div>
        </section>

        <aside className="xl:col-span-1">
          <FormsPanel
            current={{ id: selectedFormId, name: formName, fields }}
            onLoad={handleLoadForm}
            onUpdateId={setSelectedFormId}
          />
        </aside>
      </main>

      <footer className="border-t border-zinc-200 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-sm text-zinc-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Form Forge</span>
          <span>Built with React, Tailwind, and Supabase</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
