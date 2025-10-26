import { useMemo, useState } from 'react';
import { Plus, Trash, ArrowUp, ArrowDown, Edit3 } from 'lucide-react';

const PALETTE = [
  { type: 'text', label: 'Text' },
  { type: 'email', label: 'Email' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'select', label: 'Dropdown' },
  { type: 'radio', label: 'Radio' },
  { type: 'date', label: 'Date' },
  { type: 'number', label: 'Number' },
];

function newField(type) {
  const id = crypto.randomUUID();
  const base = { id, type, label: `${type[0].toUpperCase()}${type.slice(1)} field` };
  if (type === 'select' || type === 'radio') {
    return { ...base, options: ['Option 1', 'Option 2', 'Option 3'] };
  }
  if (type === 'checkbox') {
    return { ...base, checked: false };
  }
  return base;
}

export default function FormBuilder({ fields, setFields }) {
  const [draggingType, setDraggingType] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;
    setFields((prev) => [...prev, newField(type)]);
    setDraggingType(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const move = (index, dir) => {
    setFields((prev) => {
      const copy = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= copy.length) return prev;
      const [item] = copy.splice(index, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    });
  };

  const remove = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (id, patch) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const paletteItems = useMemo(
    () =>
      PALETTE.map((p) => (
        <button
          key={p.type}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', p.type);
            setDraggingType(p.type);
          }}
          onDragEnd={() => setDraggingType(null)}
          className="w-full text-left px-3 py-2 rounded-md border bg-white hover:bg-zinc-50 active:scale-[0.99] transition grid grid-cols-[20px_1fr] gap-2 items-center"
        >
          <Plus className="h-4 w-4 text-rose-600" />
          <span>{p.label}</span>
        </button>
      )),
    []
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="font-medium mb-3">Builder</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <p className="text-xs text-zinc-500 mb-2">Components</p>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">{paletteItems}</div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`min-h-[280px] rounded-lg border border-dashed ${draggingType ? 'border-rose-400 bg-rose-50/40' : 'border-zinc-300'} p-4 transition`}
          >
            {fields.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-zinc-500">
                Drag components here to build your form
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((f, idx) => (
                  <div key={f.id} className="bg-white border rounded-md p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          className="p-1 rounded border hover:bg-zinc-50"
                          onClick={() => move(idx, -1)}
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 rounded border hover:bg-zinc-50"
                          onClick={() => move(idx, 1)}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                          {f.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded border hover:bg-zinc-50" onClick={() => setEditingId(editingId === f.id ? null : f.id)}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded border hover:bg-rose-50 text-rose-600 border-rose-200" onClick={() => remove(idx)}>
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500">Label</label>
                        <input
                          className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                          value={f.label || ''}
                          onChange={(e) => updateField(f.id, { label: e.target.value })}
                        />
                      </div>
                      {(f.type === 'text' || f.type === 'email' || f.type === 'number' || f.type === 'date') && (
                        <div>
                          <label className="text-xs text-zinc-500">Placeholder</label>
                          <input
                            className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                            value={f.placeholder || ''}
                            onChange={(e) => updateField(f.id, { placeholder: e.target.value })}
                          />
                        </div>
                      )}
                      {f.type === 'textarea' && (
                        <div className="md:col-span-2">
                          <label className="text-xs text-zinc-500">Placeholder</label>
                          <input
                            className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                            value={f.placeholder || ''}
                            onChange={(e) => updateField(f.id, { placeholder: e.target.value })}
                          />
                        </div>
                      )}
                      {(f.type === 'select' || f.type === 'radio') && (
                        <div className="md:col-span-2">
                          <label className="text-xs text-zinc-500">Options (comma separated)</label>
                          <input
                            className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                            value={(f.options || []).join(', ')}
                            onChange={(e) => updateField(f.id, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                          />
                        </div>
                      )}
                      {f.type === 'checkbox' && (
                        <div className="flex items-center gap-2 mt-5">
                          <input
                            type="checkbox"
                            checked={!!f.defaultChecked}
                            onChange={(e) => updateField(f.id, { defaultChecked: e.target.checked })}
                          />
                          <span className="text-sm text-zinc-700">Checked by default</span>
                        </div>
                      )}
                    </div>

                    {editingId === f.id && (
                      <div className="mt-3 p-3 rounded-md bg-zinc-50 border text-xs text-zinc-600">
                        Field ID: {f.id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
