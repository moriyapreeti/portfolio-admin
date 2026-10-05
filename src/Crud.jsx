import { useEffect, useState } from 'react';
import { api, upload, url } from './api';

export const inputCls = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-pine/25';
export const btn = 'rounded-md bg-pine px-4 py-2 text-sm font-medium text-white hover:bg-pine/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine disabled:opacity-60';
const ghost = 'rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50';

export function Field({ f, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const v = value ?? '';
  let input;
  if (f.type === 'textarea') {
    input = <textarea rows={f.rows || 4} className={inputCls} value={v} onChange={(e) => onChange(e.target.value)} />;
  } else if (f.type === 'checkbox') {
    input = <input type="checkbox" className="size-4 accent-pine" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  } else if (f.type === 'tags') {
    input = <input className={inputCls} placeholder="Java, React, PostgreSQL" value={(value || []).join(', ')}
      onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trimStart()))} />;
  } else if (f.type === 'image') {
    input = (
      <div className="flex items-center gap-3">
        {v && <img src={url(v)} alt="" className="size-16 rounded-md object-cover" />}
        <label className={ghost + ' cursor-pointer'}>
          {busy ? 'Uploading…' : v ? 'Replace image' : 'Upload image'}
          <input type="file" accept="image/*" hidden onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setBusy(true);
            try { onChange((await upload(file)).url); } catch (err) { alert(err.message); }
            setBusy(false);
          }} />
        </label>
        {v && <button type="button" className="text-sm text-brick" onClick={() => onChange('')}>Remove</button>}
      </div>
    );
  } else {
    input = <input type={f.type || 'text'} className={inputCls} value={v}
      onChange={(e) => onChange(f.type === 'number' ? Number(e.target.value) : e.target.value)} />;
  }
  return <label className="block"><span className="mb-1 block text-sm font-medium">{f.label}</span>{input}</label>;
}

function Cell({ v }) {
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (v == null || v === '') return <span className="text-slate-400">-</span>;
  return <span className="line-clamp-2">{String(v)}</span>;
}

export default function Crud({ cfg }) {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api(cfg.list || cfg.path).then(setRows).catch((e) => setErr(e.message));
  useEffect(() => { setRows(null); setEdit(null); setErr(''); load(); }, [cfg.path]);

  const blank = () => Object.fromEntries(cfg.fields.map((f) =>
    [f.name, f.type === 'checkbox' ? false : f.type === 'tags' ? [] : f.type === 'number' ? 0 : '']));
  const label = (n) => cfg.fields.find((f) => f.name === n)?.label.replace(/ \(.*\)/, '') || n;

  async function save(e) {
    e.preventDefault();
    setErr('');
    const body = { ...edit };
    cfg.fields.forEach((f) => {
      if (f.type === 'tags') body[f.name] = body[f.name].map((s) => s.trim()).filter(Boolean);
      if (f.type === 'date' && !body[f.name]) body[f.name] = null;
    });
    try {
      await api(edit.id ? `${cfg.path}/${edit.id}` : cfg.path, { method: edit.id ? 'PUT' : 'POST', body });
      setEdit(null);
      load();
    } catch (x) { setErr(x.message); }
  }

  async function remove(r) {
    if (!confirm(`Delete this ${cfg.singular}? This can't be undone.`)) return;
    try { await api(`${cfg.path}/${r.id}`, { method: 'DELETE' }); load(); } catch (x) { setErr(x.message); }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">{rows ? `${rows.length} ${rows.length === 1 ? 'item' : 'items'}` : 'Loading…'}</p>
        {!cfg.readOnly && <button className={btn} onClick={() => { setErr(''); setEdit(blank()); }}>Add {cfg.singular}</button>}
      </div>
      {err && !edit && <p role="alert" className="mb-3 text-sm text-brick">{err}</p>}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>{cfg.columns.map((c) => <th key={c} className="px-4 py-3 font-medium">{label(c)}</th>)}<th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows && rows.length === 0 && (
              <tr><td colSpan={cfg.columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                {cfg.readOnly ? 'No messages yet. Contact form submissions will show up here.' : `No ${cfg.title.toLowerCase()} yet. Add your first ${cfg.singular} to get started.`}
              </td></tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id}>
                {cfg.columns.map((c) => <td key={c} className="max-w-xs px-4 py-3"><Cell v={r[c]} /></td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {!cfg.readOnly && <button className="mr-4 font-medium text-pine hover:underline" onClick={() => { setErr(''); setEdit({ ...blank(), ...r }); }}>Edit</button>}
                  <button className="text-brick hover:underline" onClick={() => remove(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-20 flex justify-end bg-ink/40" onClick={() => setEdit(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
            <h2 className="border-b border-slate-200 px-6 py-4 text-lg font-semibold">{edit.id ? 'Edit' : 'Add'} {cfg.singular}</h2>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {cfg.fields.map((f) => <Field key={f.name} f={f} value={edit[f.name]} onChange={(v) => setEdit({ ...edit, [f.name]: v })} />)}
              {err && <p role="alert" className="text-sm text-brick">{err}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button type="button" className={ghost} onClick={() => setEdit(null)}>Cancel</button>
              <button className={btn}>Save {cfg.singular}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
