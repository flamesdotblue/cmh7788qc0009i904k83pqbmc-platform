import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';

export default function FormPreview({ schema }) {
  const [values, setValues] = useState({});

  const inputs = useMemo(() => schema.fields || [], [schema.fields]);

  const setVal = (id, val) => setValues((v) => ({ ...v, [id]: val }));

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Preview</h3>
        <div className="text-xs text-zinc-500 flex items-center gap-1"><Eye className="h-4 w-4" /> Live</div>
      </div>
      <div className="space-y-4">
        {inputs.length === 0 ? (
          <div className="text-sm text-zinc-500">No fields yet. Add components in the builder.</div>
        ) : (
          inputs.map((f) => (
            <div key={f.id} className="grid gap-1.5">
              <label className="text-sm text-zinc-700">{f.label || 'Field'}</label>
              {f.type === 'text' && (
                <input
                  type="text"
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  placeholder={f.placeholder || ''}
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                />
              )}
              {f.type === 'email' && (
                <input
                  type="email"
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  placeholder={f.placeholder || ''}
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                />
              )}
              {f.type === 'number' && (
                <input
                  type="number"
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  placeholder={f.placeholder || ''}
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                />
              )}
              {f.type === 'date' && (
                <input
                  type="date"
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                />
              )}
              {f.type === 'textarea' && (
                <textarea
                  rows={4}
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  placeholder={f.placeholder || ''}
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                />
              )}
              {f.type === 'checkbox' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!values[f.id]}
                    onChange={(e) => setVal(f.id, e.target.checked)}
                  />
                  <span className="text-sm">{f.label || 'Checkbox'}</span>
                </div>
              )}
              {f.type === 'select' && (
                <select
                  className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  value={values[f.id] || ''}
                  onChange={(e) => setVal(f.id, e.target.value)}
                >
                  <option value="" disabled>
                    {f.placeholder || 'Select...'}
                  </option>
                  {(f.options || []).map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {f.type === 'radio' && (
                <div className="flex flex-wrap gap-3">
                  {(f.options || []).map((opt, i) => (
                    <label key={i} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={f.id}
                        value={opt}
                        checked={values[f.id] === opt}
                        onChange={(e) => setVal(f.id, e.target.value)}
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {inputs.length > 0 && (
        <div className="mt-6 p-3 rounded-lg bg-zinc-50 border text-xs text-zinc-600 break-words">
          <div className="font-medium text-zinc-700 mb-1">Form values (mock)</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(values, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
