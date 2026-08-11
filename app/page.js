"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const areas = ["Faro", "Albufeira", "Portimão", "Loulé", "Lagos", "Silves", "Tavira", "Olhão", "Outro Algarve"];
const categories = ["Todas", "Casa", "Moda", "Eletrónica", "Livros", "Desporto", "Serviços", "Tempo", "Outros"];

const demoListings = [
  { id: "demo-1", title: "Bicicleta urbana", area: "Portimão", kind: "Objeto", wish: "Sofá ou móvel pequeno", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-2", title: "Câmara fotográfica", area: "Lagos", kind: "Objeto", wish: "Mesa de madeira", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-3", title: "Aulas de inglês", area: "Albufeira", kind: "Serviço", wish: "Serviço ou objeto útil", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-4", title: "Guitarra acústica", area: "Lagos", kind: "Objeto", wish: "Bicicleta", image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-5", title: "Serviço de design", area: "Online", kind: "Serviço", wish: "Fotografia ou consultoria", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80" },
];

function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`} aria-label="troCASH">
      <svg className="brand-mark" viewBox="0 0 100 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="goldLogo" x1="0" x2="1">
            <stop offset="0" stopColor="#C58A20" />
            <stop offset="0.5" stopColor="#F2D08A" />
            <stop offset="1" stopColor="#B87810" />
          </linearGradient>
        </defs>
        <circle cx="25" cy="12" r="5.5" fill="url(#goldLogo)" />
        <circle cx="75" cy="12" r="5.5" fill="url(#goldLogo)" />
        <path d="M47 35 C36 18, 10 18, 10 36 C10 54, 36 54, 50 36 C64 18, 90 18, 90 36 C90 54, 64 54, 50 36 C36 18, 10 18, 10 36" fill="none" stroke="url(#goldLogo)" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <div className="brand-wordmark"><span>tro</span><b>CASH</b><small>JUNTOS CRIAMOS VALOR.</small></div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("pt");
  const [tab, setTab] = useState("home");
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", area: "Faro", kind: "Objeto", wish: "", notes: "" });
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { fetchOffers(); }, []);

  async function fetchOffers() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("offers").select("*, profiles(display_name, area)").eq("status", "active").order("created_at", { ascending: false });
      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addOffer(e) {
    e.preventDefault();
    if (!user) { router.push("/auth"); return; }
    if (!form.title.trim()) { setNotice("Indica o que tens para trocar."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("offers").insert([{ owner_id: user.id, ...form, status: "active" }]);
      if (error) throw error;
      setForm({ title: "", description: "", area: "Faro", kind: "Objeto", wish: "", notes: "" });
      setNotice("Oferta publicada com sucesso.");
      await fetchOffers();
      setTab("home");
    } catch (err) {
      setNotice(err.message);
    } finally { setLoading(false); }
  }

  async function proposeExchange(offerId) {
    if (!user) { router.push("/auth"); return; }
    if (String(offerId).startsWith("demo-")) { setNotice("Entra na tua conta para transformar esta oportunidade numa troca real."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("exchange_requests").insert([{ offer_id: offerId, proposer_id: user.id, proposal_type: "Objeto", proposal_text: "Quero trocar contigo!", status: "pending" }]);
      if (error) throw error;
      setNotice("Pedido de troca enviado. O proprietário será notificado.");
    } catch (err) { setNotice(err.message); }
    finally { setLoading(false); }
  }

  const visibleListings = useMemo(() => {
    const real = offers.map(o => ({ ...o, image: o.image_url || demoListings[(o.id || "").toString().length % demoListings.length].image }));
    const all = [...real, ...demoListings];
    return all.filter(item => {
      const matchesCategory = category === "Todas" || item.kind === category || item.area === category || item.title?.toLowerCase().includes(category.toLowerCase());
      const hay = `${item.title || ""} ${item.description || ""} ${item.wish || ""} ${item.area || ""}`.toLowerCase();
      return matchesCategory && hay.includes(query.toLowerCase());
    }).slice(0, 8);
  }, [offers, category, query]);

  const copy = {
    pt: {
      navExplore: "Explorar", navMine: "Meus Anúncios", navWish: "Wish List", navMessages: "Mensagens", navHow: "Como funciona", navAbout: "Sobre",
      hero1: "Swap more.", hero2: "Keep your cash.", heroSub: "Turn what you have into what you want — without spending.", dream: "Realiza os teus sonhos a custo 0 ✦", explore: "Explorar ofertas", publish: "Publicar anúncio",
      searchTitle: "O que você procura?", have: "Eu tenho", want: "Procuro", distance: "Até", matches: "Encontros para si", trust: "Confiança que se conquista", premium: "troCASH PREMIUM"
    },
    en: {
      navExplore: "Explore", navMine: "My Listings", navWish: "Wish List", navMessages: "Messages", navHow: "How it works", navAbout: "About",
      hero1: "Swap more.", hero2: "Keep your cash.", heroSub: "Turn what you have into what you want — without spending.", dream: "Make your dreams happen at zero cost ✦", explore: "Explore offers", publish: "Post an offer",
      searchTitle: "What are you looking for?", have: "I have", want: "I want", distance: "Within", matches: "Matches for you", trust: "Trust is earned", premium: "troCASH PREMIUM"
    },
    ru: {
      navExplore: "Исследовать", navMine: "Мои объявления", navWish: "Желания", navMessages: "Сообщения", navHow: "Как это работает", navAbout: "О нас",
      hero1: "Меняй больше.", hero2: "Сохраняй свои деньги.", heroSub: "Превращай то, что у тебя есть, в то, чего ты хочешь — без лишних расходов.", dream: "Исполняй мечты с нулевой стоимостью ✦", explore: "Смотреть предложения", publish: "Создать объявление",
      searchTitle: "Что ты ищешь?", have: "У меня есть", want: "Мне нужно", distance: "До", matches: "Подобрано для тебя", trust: "Доверие создаётся", premium: "troCASH PREMIUM"
    }
  }[lang];

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="site-shell">
      <header className="topbar">
        <button className="logo-button" onClick={() => { setTab("home"); scrollTo("top"); }}><Logo /></button>
        <nav className="desktop-nav">
          <button onClick={() => { setTab("home"); scrollTo("explore"); }}>{copy.navExplore}</button>
          <button onClick={() => { if (!user) router.push("/auth"); else { setTab("add"); scrollTo("workspace"); } }}>{copy.navMine}</button>
          <button onClick={() => { setTab("wish"); scrollTo("workspace"); }}>{copy.navWish}</button>
          <button onClick={() => scrollTo("trust")}>{copy.navMessages}</button>
          <button onClick={() => scrollTo("how")}>{copy.navHow}</button>
          <button onClick={() => scrollTo("premium")}>{copy.navAbout}</button>
        </nav>
        <div className="top-actions">
          <select value={lang} onChange={e => setLang(e.target.value)} aria-label="Language"><option value="pt">PT</option><option value="en">EN</option><option value="ru">RU</option></select>
          {user ? <button className="avatar" onClick={() => setTab("wish")}>{(user.email || "U")[0].toUpperCase()}</button> : <button className="ghost-btn" onClick={() => router.push("/auth")}>Entrar</button>}
          <button className="gold-btn" onClick={() => { if (!user) router.push("/auth"); else { setTab("add"); scrollTo("workspace"); } }}>＋ {copy.publish}</button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow">TROCA MAIS. PRECISA DE MENOS.</div>
          <h1><span>{copy.hero1}</span><strong>{copy.hero2}</strong></h1>
          <p className="hero-copy">{copy.heroSub}</p>
          <div className="dream-pill">{copy.dream}</div>
          <div className="hero-actions"><button className="gold-btn large" onClick={() => scrollTo("explore")}>{copy.explore} →</button><button className="light-btn large" onClick={() => { if (!user) router.push("/auth"); else setTab("add"); scrollTo("workspace"); }}>{copy.publish} ＋</button></div>
          <div className="trust-row"><span>◈ <b>Seguro</b><small>Verificado</small></span><span>◌ <b>Comunidade</b><small>Confiável</small></span><span>◇ <b>Sustentável</b><small>Consciente</small></span><span>⌂ <b>Local</b><small>Algarve</small></span></div>
        </div>
      </section>

      <section className="search-panel" id="explore">
        <div className="search-heading"><b>{copy.searchTitle}</b><span>Encontra uma troca que faça sentido para ti.</span></div>
        <div className="search-tabs"><button className="active">Viver (coisas)</button><button>Serviço</button><button>Troca</button><button>Desejo</button></div>
        <label>{copy.have}<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>{copy.want}<input value={query} onChange={e => setQuery(e.target.value)} placeholder="bicicleta, sofá, aulas..." /></label>
        <label>{copy.distance}<select><option>10 km</option><option>25 km</option><option>50 km</option><option>Todo o Algarve</option></select></label>
        <button className="search-btn" aria-label="Pesquisar">⌕</button>
      </section>

      <section className="content-section" id="matches">
        <div className="section-head"><div><span className="eyebrow">SMART MATCHES</span><h2>{copy.matches} ✦</h2><p>O sistema aproxima pessoas com desejos compatíveis.</p></div><button className="text-btn" onClick={() => setCategory("Todas")}>Ver todas →</button></div>
        <div className="listing-grid">
          {visibleListings.map((o, i) => <article className="listing-card" key={o.id || i}>
            <div className="listing-image" style={{ backgroundImage: `url(${o.image})` }}><span>{o.kind === "Serviço" ? "Serviço" : "Troca"}</span><button>♡</button></div>
            <div className="listing-body"><small>{o.area || "Algarve"} · {i + 2} km</small><h3>{o.title}</h3><div className="swap-line"><span>Oferece</span><b>{o.wish || "algo que procuras"}</b></div><button className="mini-btn" onClick={() => proposeExchange(o.id)}>Ver troca</button></div>
          </article>)}
        </div>
        {loading && <div className="soft-notice">A atualizar ofertas…</div>}
        {notice && <div className="soft-notice">{notice}</div>}
      </section>

      <section className="trust-strip" id="trust">
        <div className="trust-lead"><div className="trust-icon">◎</div><div><h3>{copy.trust}</h3><p>A confiança nasce de regras claras, perfis verificados e boas experiências.</p><small className="slogan-note">More swapping. Less spending.</small></div></div>
        <div className="metric"><b>{offers.length || "—"}</b><span>ofertas reais</span></div><div className="metric"><b>100%</b><span>foco local</span></div><div className="metric"><b>4,9/5</b><span>meta de comunidade</span></div>
      </section>

      <section className="benefits" id="how">
        <div><span>✓</span><b>Verificação de membros</b><small>Mais segurança para todos.</small></div><div><span>↔</span><b>Sem dinheiro entre membros</b><small>Troca valor por valor.</small></div><div><span>◎</span><b>Suporte dedicado</b><small>Ajuda quando precisares.</small></div><div><span>⌁</span><b>Privacidade</b><small>Os teus dados protegidos.</small></div>
      </section>

      <section className="slogan-band">
        <span>Get what you want. Keep your cash.</span>
        <b>Exchange more. Spend less. Live more.</b>
        <span>Your things. Your wishes. Your cash stays.</span>
      </section>

      <section className="premium" id="premium">
        <div><span className="premium-badge">troCASH PREMIUM</span><h2>Mais oportunidades. Menos esforço.</h2><p>Destaca as tuas ofertas, encontra correspondências mais depressa e navega sem distrações.</p></div>
        <div className="premium-price"><b>€4,99</b><span>/ mês</span><button className="gold-btn" onClick={() => setPremiumOpen(true)}>Quero Premium</button></div>
      </section>

      <section className="workspace" id="workspace">
        {tab === "add" && user ? <div className="workspace-card"><div className="section-head"><div><span className="eyebrow">PUBLICAR</span><h2>O que tens para trocar?</h2></div></div><form className="offer-form" onSubmit={addOffer}><input placeholder="Título do anúncio" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><textarea placeholder="Conta um pouco mais…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><div className="form-row"><select value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value })}><option>Objeto</option><option>Serviço</option><option>Horas</option></select><select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>{areas.map(a => <option key={a}>{a}</option>)}</select></div><input placeholder="O que procuras em troca?" value={form.wish} onChange={e => setForm({ ...form, wish: e.target.value })} /><textarea placeholder="Notas adicionais" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /><button className="gold-btn large" disabled={loading}>{loading ? "A publicar…" : "Publicar oferta →"}</button></form></div> : <div className="dream-workspace"><div className="dream-bg" /><div className="dream-copy"><span className="eyebrow">A TUA WISH LIST</span><h2>O que gostarias de ter, viver ou aprender?</h2><p>Guarda desejos. O troCASH procura pessoas que tenham exatamente o que precisas — e que possam querer aquilo que tens.</p><div className="dream-slogan">Get what you want. Keep your cash.</div><button className="gold-btn" onClick={() => setTab("wish")}>Criar desejo →</button></div><div className="wish-card"><span>✦</span><b>Desejos que podem acontecer</b><p>Viagens · aulas · casa · experiências · objetos · tempo</p></div></div>}
      </section>

      <footer className="footer">
        <div><Logo compact /><p>Swap more. Keep your cash.</p><small>Realiza os teus sonhos a custo 0.</small><small>Exchange more. Spend less. Live more.</small></div>
        <div><b>troCASH</b><button>Sobre nós</button><button>Como funciona</button><button>Regras da comunidade</button></div>
        <div><b>Suporte</b><button>Centro de ajuda</button><button>Segurança</button><button>Privacidade</button></div>
        <div><b>Comunidade</b><button>Sustentabilidade</button><button>Dicas e artigos</button><button>Eventos locais</button></div>
        <div className="footer-news"><b>Recebe novidades</b><p>Ideias para trocar melhor, gastar menos e viver mais.</p><div><input placeholder="O teu email" /><button className="gold-btn">→</button></div></div>
      </footer>
      <div className="copyright">© 2026 troCASH · Algarve, Portugal <span>Comunidade · Confiança · Liberdade</span></div>

      {premiumOpen && <div className="modal-backdrop" onClick={() => setPremiumOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setPremiumOpen(false)}>×</button><span className="premium-badge">troCASH PREMIUM</span><h2>Mais trocas. Menos gastos.</h2><p>O preço de €4,99/mês foi desenhado para ser simples e transparente. A ligação ao pagamento será ativada quando o checkout estiver ligado ao teu MB WAY.</p><ul><li>Ofertas destacadas</li><li>Correspondências prioritárias</li><li>Sem publicidade</li><li>Suporte prioritário</li></ul><button className="gold-btn large" onClick={() => setPremiumOpen(false)}>Continuar →</button></div></div>}
    </main>
  );
}
