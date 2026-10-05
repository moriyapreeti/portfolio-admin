import { useEffect, useState } from 'react';
import { api, login, logout, isLoggedIn, upload, url } from './api';
import Crud, { Field, inputCls, btn } from './Crud';
import { resources, aboutFields } from './resources';

const nav = [['dashboard', 'Dashboard'], ['about', 'About'], ['projects', 'Projects'], ['skills', 'Skills'], ['blogs', 'Blogs'],
  ['experience', 'Experience'], ['testimonials', 'Testimonials'], ['services', 'Services'], ['messages', 'Messages'], ['media', 'Media']];

function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await login(email, password); onDone(); } catch (x) { setErr(x.message); }
    setBusy(false);
  }
  return (
    <div className="grid min-h-screen md:grid-cols-[1fr_1.1fr]">
      <div className="hidden bg-pine p-12 text-white md:flex md:flex-col md:justify-end">
        <h1 className="max-w-sm text-4xl font-semibold leading-tight">Your portfolio, edited from one place.</h1>
        <p className="mt-3 max-w-sm text-white/70">Projects, posts and profile details you save here show up on your site right away.</p>
      </div>
      <form onSubmit={submit} className="m-auto w-full max-w-sm space-y-4 p-8">
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <label className="block"><span className="mb-1 block text-sm font-medium">Email</span>
          <input type="email" required autoFocus className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium">Password</span>
          <input type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <p role="alert" className="text-sm text-brick">{err}</p>}
        <button className={btn + ' w-full'} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

function Dashboard({ go }) {
  const [counts, setCounts] = useState(null);
  const items = [['projects', '/projects'], ['skills', '/skills'], ['blogs', '/blogs/all'], ['experience', '/experience'],
    ['testimonials', '/testimonials'], ['services', '/services'], ['messages', '/messages']];
  useEffect(() => {
    Promise.all(items.map(([, p]) => api(p).then((r) => r.length).catch(() => '?'))).then(setCounts);
  }, []);
  return (
    <dl className="max-w-md divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {items.map(([key], i) => (
        <button key={key} onClick={() => go(key)} className="flex w-full items-baseline justify-between px-5 py-3 text-left hover:bg-slate-50">
          <dt className="capitalize">{key}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{counts ? counts[i] : '…'}</dd>
        </button>
      ))}
    </dl>
  );
}

function About() {
  const [d, setD] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/about').then(setD).catch((e) => setMsg(e.message)); }, []);
  if (!d) return <p className="text-sm">{msg || 'Loading…'}</p>;
  async function save(e) {
    e.preventDefault();
    try { setD(await api('/about', { method: 'PUT', body: d })); setMsg('Saved.'); } catch (x) { setMsg(x.message); }
  }
  return (
    <form onSubmit={save} className="max-w-xl space-y-4">
      {aboutFields.map((f) => <Field key={f.name} f={f} value={d[f.name]} onChange={(v) => setD({ ...d, [f.name]: v })} />)}
      <div className="flex items-center gap-3"><button className={btn}>Save changes</button><span role="status" className="text-sm">{msg}</span></div>
    </form>
  );
}

function Media() {
  const [items, setItems] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => api('/upload/media').then(setItems).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  async function add(e) {
    const file = e.target.files[0];
    if (!file) return;
    try { await upload(file); setMsg(''); load(); } catch (x) { setMsg(x.message); }
  }
  return (
    <div>
      <label className={btn + ' inline-block cursor-pointer'}>Upload image<input type="file" accept="image/*" hidden onChange={add} /></label>
      {msg && <p role="alert" className="mt-3 text-sm text-brick">{msg}</p>}
      {items && items.length === 0 && <p className="mt-6 text-sm text-slate-500">No images yet. Upload one to see it here.</p>}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items?.map((m) => (
          <figure key={m.id}>
            <img src={url(m.url)} alt="" className="aspect-square w-full rounded-md object-cover" />
            <button className="mt-1 text-xs text-pine hover:underline"
              onClick={() => { navigator.clipboard.writeText(m.url); setMsg(''); }}>Copy path</button>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [page, setPage] = useState('dashboard');
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  const title = nav.find(([k]) => k === page)[1];
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col bg-pine text-white md:w-56">
        <p className="px-5 py-4 text-lg font-semibold">Portfolio CMS</p>
        <nav className="flex overflow-x-auto md:flex-1 md:flex-col md:overflow-visible">
          {nav.map(([k, l]) => (
            <button key={k} onClick={() => setPage(k)}
              className={'whitespace-nowrap border-b-2 px-5 py-2 text-left text-sm md:border-b-0 md:border-l-4 ' +
                (page === k ? 'border-saffron bg-white/10 font-medium' : 'border-transparent text-white/75 hover:bg-white/5')}>{l}</button>
          ))}
        </nav>
        <button onClick={() => { logout(); setAuthed(false); }} className="px-5 py-3 text-left text-sm text-white/75 hover:text-white">Sign out</button>
      </aside>
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
        {page === 'dashboard' && <Dashboard go={setPage} />}
        {page === 'about' && <About />}
        {page === 'media' && <Media />}
        {resources[page] && <Crud cfg={resources[page]} />}
      </main>
    </div>
  );
}
