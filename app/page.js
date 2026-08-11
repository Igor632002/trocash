"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const areas = ["Faro","Albufeira","Portimão","Loulé","Lagos","Silves","Tavira","Olhão","Outro Algarve"];

export default function Home(){
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("pt");
  const [tab, setTab] = useState("home");
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({title:"",description:"",area:"Faro",kind:"Objeto",wish:"",notes:""});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // // 🔐 Перевірити залогованого користувача
  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     if (!session?.user) {
  //       router.push("/auth");
  //     } else {
  //       setUser(session.user);
  //     }
  //   });
  // }, [router]);


    // 🔐 Перевірити залогованого користувача
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        setNotice("❌ Користувач не залогований");
        router.push("/auth");
      } else {
        setNotice(
          `✅ Користувач залогований:\n📧 Email: ${session.user.email}\n🆔 ID: ${session.user.id}\n🔑 Токен: ${session.access_token ? "✅ Присутній" : "❌ Відсутній"}`
        );
        setUser(session.user);
      }
    });
  }, [router]);




  // 📥 Завантажити офери з БД
  useEffect(() => {
    if (!user) return;
    fetchOffers();
  }, [user]);

  async function fetchOffers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*, profiles(display_name, area)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error("Помилка завантаження:", err);
      setNotice("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // ➕ Додати нову офер
  async function addOffer(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setNotice("⚠️ Indica o que tens para trocar.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("offers").insert([
        {
          owner_id: user.id,
          title: form.title,
          description: form.description,
          area: form.area,
          kind: form.kind,
          wish: form.wish,
          notes: form.notes,
          status: "active"
        }
      ]);

      if (error) throw error;

      setForm({title:"",description:"",area:"Faro",kind:"Objeto",wish:"",notes:""});
      setNotice("✅ Oferta criada e visível para todos os testers!");
      await fetchOffers();
    } catch (err) {
      console.error("Erro:", err);
      setNotice("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔄 Propor troca
  async function proposeExchange(offerId) {
    if (!user) {
      setNotice("❌ Inicia sessão para propor uma troca");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("exchange_requests").insert([
        {
          offer_id: offerId,
          proposer_id: user.id,
          proposal_type: "Objeto",
          proposal_text: "Quero trocar contigo!",
          status: "pending"
        }
      ]);

      if (error) throw error;
      setNotice("✅ Pedido de troca criado! O proprietário será notificado.");
    } catch (err) {
      console.error("Erro:", err);
      setNotice("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const pt = lang === "pt";

  return (
    <main style={{fontFamily:"system-ui",maxWidth:1100,margin:"0 auto",padding:20}}>
      <div style={{background:"#292521",color:"#fff",padding:"10px 14px",borderRadius:12,marginBottom:18,textAlign:"center"}}>
        🧪 <b>troCASH BETA</b> · Algarve · gratuito · sem pagamentos
        {user && <div style={{fontSize:12,marginTop:5}}>👤 {user.email}</div>}
      </div>

      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15}}>
        <h1 style={{margin:0}}>troCASH 🎁</h1>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {["pt","en","ru"].map(x=><button key={x} onClick={()=>setLang(x)} style={{marginLeft:5}}>{x==="ru"?"☭":" "+x.toUpperCase()}</button>)}
          <button onClick={() => supabase.auth.signOut()} style={{background:"#999",color:"#fff",padding:"6px 12px",border:"none",borderRadius:6,cursor:"pointer"}}>🚪 Sair</button>
        </div>
      </header>

      <p>{pt?"Troca coisas, serviços e horas no Algarve.":"Exchange items, services and time in the Algarve."}</p>

      <nav style={{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"}}>
        <button onClick={()=>setTab("home")}>🏠 {pt?"Início":"Home"}</button>
        <button onClick={()=>setTab("add")} disabled={!user}>➕ {pt?"Adicionar oferta":"Add offer"}</button>
        <button onClick={()=>setTab("wish")}>❤️ Wish List</button>
      </nav>

      {notice && <div style={{padding:12,background:notice.includes("✅")?"#d4edda":"#f8d7da",borderRadius:10,marginBottom:15,color:notice.includes("✅")?"#155724":"#721c24"}}>{notice}</div>}

      {tab==="home" && <section>
        <h2>{pt?"Ofertas no Algarve":"Offers in Algarve"}</h2>
        {loading && <p>⏳ Carregando...</p>}
        {!loading && offers.length===0 && <p>Ainda não há ofertas neste navegador.</p>}
        {!loading && offers.length > 0 && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:15}}>
            {offers.map(o=>(
              <article key={o.id} style={{border:"1px solid #ddd",borderRadius:14,padding:16}}>
                <small>{o.area} · {o.kind}</small>
                <h3>{o.title}</h3>
                <p>{o.description}</p>
                <small>por: <b>{o.profiles?.display_name || "Anónimo"}</b></small>
                <p><b>❤️ Procura:</b> {o.wish||"—"}</p>
                <p><b>📝 Notas:</b> {o.notes||"—"}</p>
                <button onClick={() => proposeExchange(o.id)} disabled={loading || o.owner_id === user?.id}>
                  🔄 {pt?"Propor troca":"Propose exchange"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>}

      {tab==="add" && user ? (
        <section>
          <h2>{pt?"O que tens para trocar?":"What do you have to exchange?"}</h2>
          <form onSubmit={addOffer} style={{display:"grid",gap:10,maxWidth:650}}>
            <input placeholder={pt?"Título":"Title"} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
            <textarea placeholder={pt?"Descrição":"Description"} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option>Objeto</option><option>Serviço</option><option>Horas</option></select>
            <select value={form.area} onChange={e=>setForm({...form,area:e.target.value})}>{areas.map(a=><option key={a}>{a}</option>)}</select>
            <input placeholder={pt?"O que procuras?":"What do you want?"} value={form.wish} onChange={e=>setForm({...form,wish:e.target.value})}/>
            <textarea placeholder={pt?"Observações":"Notes"} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
            <button type="submit" disabled={loading}>💾 {loading?"Enviando...":"Publicar oferta"}</button>
          </form>
        </section>
      ) : tab==="add" ? (
        <section><p>❌ Inicia sessão para adicionar ofertas</p></section>
      ) : null}

      {tab==="wish" && <section>
        <h2>❤️ Wish List</h2>
        <p>{pt?"Aqui ficará a tua lista de desejos. No backend, cada desejo será pesquisável pelo algoritmo de matching.":"Your wishes will be searchable by the matching engine."}</p>
      </section>}

      <footer style={{marginTop:50,paddingTop:20,borderTop:"1px solid #ddd",fontSize:13}}>
        troCASH Beta · Teste privado · Algarve · sem cobrança.
      </footer>
    </main>
  );
}