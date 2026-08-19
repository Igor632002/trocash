"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchActiveOffers, insertOffer, createExchangeRequest } from "@/lib/dal";
import { uploadPhotosAndGetUrls } from "@/lib/storage";
import { LANGUAGES, areas, CATEGORIES } from "@/lib/constants";
import demoListings from "@/lib/data/demoListings";
import HomeView from "./components/HomeView";

// --- ГОЛОВНИЙ КОМПОНЕНТ ---

export default function Home() {
  const router = useRouter();

  // Стан Auth та Supabase
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  // Стан інтерфейсу та закладок
  const [lang, setLang] = useState("pt");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [searchTab, setSearchTab] = useState("Tenho");

  // Панелі та модалки
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [newOfferOpen, setNewOfferOpen] = useState(false);

  // Стан пошуку
  const [category, setCategory] = useState("Todas");
  const [have, setHave] = useState("");
  const [want, setWant] = useState("");
  const [radius, setRadius] = useState("10 km");
  const [searchOpen, setSearchOpen] = useState(false);

  // Форма створення оголошення
  const [form, setForm] = useState({
    title: "",
    description: "",
    area: "Faro",
    kind: "Objeto",
    wish: "",
    notes: "",
  });
  // photos: масив обʼєктів { file: File, preview: string, name: string }
  const [photos, setPhotos] = useState([]);

  // 1. Supabase Auth Listener
  useEffect(() => {
    let mounted = true;

    async function ensureProfile(user) {
      if (!user) return;
      try {
        await supabase.from("profiles").upsert([{
          id: user.id,
          display_name: user.email ? user.email.split("@")[0] : user.id.slice(0, 8),
          area: "Faro"
        }]);
      } catch (e) {
        console.error("ensureProfile error", e);
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) await ensureProfile(u);
    });

    // Temporarily expose supabase client on window for debugging in dev only
    try {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-undef
        window.supabase = supabase;
      }
    } catch (e) { /* ignore in non-browser */ }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) await ensureProfile(u);
    });

    return () => {
      mounted = false;
      try { listener.subscription.unsubscribe(); } catch (e) { }
    };
  }, []);

  async function fetchOffers() {
    setLoading(true);
    try {
      const data = await fetchActiveOffers();
      console.debug("fetchActiveOffers ->", data);
      setOffers(data);
    } catch (err) {
      console.error("fetchActiveOffers error", err);
      setNotice(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  // Refetch when auth changes (optional but recommended)
  useEffect(() => {
    if (!user) {
      setOffers([]);
      return;
    }
    fetchOffers();
  }, [user]);

  // Очищуємо ObjectURL старих превʼю при зміні photos / на unmount
  useEffect(() => {
    return () => {
      photos.forEach(p => {
        try { URL.revokeObjectURL(p.preview); } catch (e) { }
      });
    };
  }, [photos]);

  // Обробник допуску кількох фото — зберігаємо реальні File + preview
  const addPhotos = (e) => {
    const fs = Array.from(e.target.files || []);
    const items = fs.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }));
    setPhotos(prev => [...prev, ...items]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const p = prev[index];
      if (p?.preview) {
        try { URL.revokeObjectURL(p.preview); } catch (e) { }
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Публікація пропозиції в БД
  async function addOffer(e) {
    e.preventDefault();
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!form.title.trim()) {
      setNotice("Indica o que tens para trocar.");
      return;
    }
    setLoading(true);
    try {

      // app/page.js (в тілі addOffer, перед збіркою files)
      const sessionResp = await supabase.auth.getSession();
      const sessionUser = sessionResp?.data?.session?.user ?? sessionResp?.session?.user ?? null; // handle possible shapes
      if (!sessionUser) {
        setNotice("Não autenticado — entra na tua conta.");
        setLoading(false);
        return;
      }
      if (sessionUser.id !== user.id) {
        console.error("Session/user mismatch", sessionUser.id, user.id);
        setNotice("Erro de sessão — por favor entra novamente.");
        setLoading(false);
        return;
      }

      // збираємо реальні File з стану
      const files = photos.map(p => p.file).filter(Boolean);

      // завантажуємо в storage і отримуємо public URLs

      const s = await supabase.auth.getSession();
      console.log("session", s);
      console.log("access_token", s?.data?.session?.access_token);



      const urls = files.length ? await uploadPhotosAndGetUrls(user.id, files) : [];
      // формуємо payload: зберігаємо масив і перший URL для сумісності
      const payload = { ...form, photo_urls: urls, image_url: urls[0] || null };
      // вставляємо офер
      await insertOffer(payload, user);

      // відміняємо тимчасові ObjectURL
      photos.forEach(p => { try { URL.revokeObjectURL(p.preview); } catch (e) { } });
      setForm({ title: "", description: "", area: "Faro", kind: "Objeto", wish: "", notes: "" });
      setPhotos([]);
      setNotice("Oferta publicada com sucesso.");
      setNewOfferOpen(false);
      await fetchOffers();
      setTab("home");
    } catch (err) {
      console.error("addOffer error", err);
      setNotice(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  // Запит на обмін
  async function proposeExchange(offerId) {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (String(offerId).startsWith("demo-")) {
      setNotice("Entra na tua conta para transformar esta oportunidade numa troca real.");
      return;
    }
    setLoading(true);
    try {
      await createExchangeRequest(offerId, user.id);
      setNotice("Pedido de troca enviado. O proprietário será notificado.");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Динамічні підказки та фільтрація
  const placeholder = useMemo(() => {
    return (CATEGORIES[category] || CATEGORIES.Outros)[0];
  }, [category]);

  const visibleListings = useMemo(() => {
    const real = offers.map(o => ({
      ...o,
      image: o.image_url || (o.photo_urls && o.photo_urls[0]) || demoListings[(o.id || "").toString().length % demoListings.length].image,
    }));
    const all = [...real, ...demoListings];

    return all.filter(item => {
      const matchesCategory = category === "Todas" || item.kind === category || item.area === category || item.title?.toLowerCase().includes(category.toLowerCase());
      const queryFilter = (have || want).toLowerCase();
      const hay = `${item.title || ""} ${item.description || ""} ${item.wish || ""} ${item.area || ""}`.toLowerCase();
      return matchesCategory && hay.includes(queryFilter);
    }).slice(0, 8);
  }, [offers, category, have, want]);

  // Переклади інтерфейсу
const copy = {
  pt: {
    navExplore: "Explorar", navMine: "Meus Anúncios", navWish: "Wish List", navMessages: "Mensagens", navHow: "Como funciona", navAbout: "Sobre",
    hero1: "Swap more", hero2: "Keep your cash", heroSub: "Turn what you have into what you want — without spending", dream: "Realiza os teus sonhos a custo 0 ✦", explore: "Explorar ofertas", publish: "Publicar anúncio",
    searchTitle: "O que você procura?", have: "Eu tenho", want: "Procuro", distance: "Até", matches: "Encontros para si", trust: "Confiança que se conquista", premium: "troCASH PREMIUM",
    trustLong: "A confiança nasce de regras claras, perfis verificados e boas experiências.",
    slogan2: "More swapping. Less spending.",
    verificationTitle: "Verificação de membros",
    verificationSub: "Mais segurança para todos.",
    noMoneyTitle: "Sem dinheiro entre membros",
    noMoneySub: "Troca valor por valor.",
    supportTitle: "Suporte dedicado",
    supportSub: "Ajuda quando precisares.",
    privacyTitle: "Privacidade",
    privacySub: "Os teus dados protegidos."
  },
  en: {
    navExplore: "Explore", navMine: "My Listings", navWish: "Wish List", navMessages: "Messages", navHow: "How it works", navAbout: "About",
    hero1: "Swap more", hero2: "Keep your cash", heroSub: "Turn what you have into what you want — without spending", dream: "Make your dreams happen at zero cost ✦", explore: "Explore offers", publish: "Post an offer",
    searchTitle: "What are you looking for?", have: "I have", want: "I want", distance: "Within", matches: "Matches for you", trust: "Trust is earned", premium: "troCASH PREMIUM",
    trustLong: "Trust grows from clear rules, verified profiles and good experiences.",
    slogan2: "More swapping. Less spending.",
    verificationTitle: "Member verification",
    verificationSub: "More safety for everyone.",
    noMoneyTitle: "No money between members",
    noMoneySub: "Trade value for value.",
    supportTitle: "Dedicated support",
    supportSub: "Help when you need it.",
    privacyTitle: "Privacy",
    privacySub: "Your data is protected."
  },
  ru: {
    navExplore: "Исследовать", navMine: "Мои объявления", navWish: "Желания", navMessages: "Сообщения", navHow: "Как это работает", navAbout: "О нас",
    hero1: "Меняй больше", hero2: "Сохраняй свои деньги", heroSub: "Превращай то, что у тебя есть, в то, чего ты хочешь — без лишних расходов", dream: "Исполняй мечты с нулевой стоимостью ✦", explore: "Смотреть предложения", publish: "Создать объявление",
    searchTitle: "Что ты ищешь?", have: "У меня есть", want: "Мне нужно", distance: "До", matches: "Подобрано для тебя", trust: "Доверие создаётся", premium: "troCASH PREMIUM",
    trustLong: "Доверие возникает з понятных правил, проверенных профилей и хорошего опыта.",
    slogan2: "Больше обменов. Меньше трат.",
    verificationTitle: "Проверка участников",
    verificationSub: "Больше безопасности для всех.",
    noMoneyTitle: "Без денег между участниками",
    noMoneySub: "Обменивай ценность на ценность.",
    supportTitle: "Выделенная поддержка",
    supportSub: "Помощь, когда нужно.",
    privacyTitle: "Конфиденциальность",
    privacySub: "Ваши данные защищены."
  },
  fr: {
    navExplore: "Explorer", navMine: "Mes Annonces", navWish: "Liste de souhaits", navMessages: "Messages", navHow: "Comment ça marche", navAbout: "À propos",
    hero1: "Échangez plus", hero2: "Gardez votre argent", heroSub: "Transformez ce que vous avez en ce que vous voulez — sans dépenser", dream: "Réalisez vos rêves à coût zéro ✦", explore: "Explorer les offres", publish: "Publier une annonce",
    searchTitle: "Que cherchez-vous ?", have: "J'ai", want: "Je veux", distance: "Dans", matches: "Correspondances pour vous", trust: "La confiance se mérite", premium: "troCASH PREMIUM",
    trustLong: "La confiance naît de règles claires, de profils vérifiés et de bonnes expériences.",
    slogan2: "Plus d'échanges. Moins de dépenses.",
    verificationTitle: "Vérification des membres",
    verificationSub: "Plus de sécurité pour tout le monde.",
    noMoneyTitle: "Pas d'argent entre les membres",
    noMoneySub: "Échange valeur contre valeur.",
    supportTitle: "Support dédié",
    supportSub: "Aide quand vous en avez besoin.",
    privacyTitle: "Confidentialité",
    privacySub: "Vos données sont protégées."
  },
  it: {
    navExplore: "Esplora", navMine: "I miei annunci", navWish: "Lista dei desideri", navMessages: "Messaggi", navHow: "Come funziona", navAbout: "Informazioni",
    hero1: "Scambia di più", hero2: "Risparmia denaro", heroSub: "Trasforma ciò che hai in ciò che desideri — senza spendere", dream: "Realizza i tuoi sogni a costo zero ✦", explore: "Esplora le offerte", publish: "Pubblica un annuncio",
    searchTitle: "Cosa stai cercando?", have: "Ho", want: "Cerco", distance: "Entro", matches: "Abbinamenti per te", trust: "La fiducia si guadagna", premium: "troCASH PREMIUM",
    trustLong: "La fiducia nasce da regole chiare, profili verificati e buone esperienze.",
    slogan2: "Più scambi. Meno spese.",
    verificationTitle: "Verifica dei membri",
    verificationSub: "Più sicurezza per tutti.",
    noMoneyTitle: "Niente soldi tra i membri",
    noMoneySub: "Scambia valore per valore.",
    supportTitle: "Supporto dedicato",
    supportSub: "Aiuto quando ne hai bisogno.",
    privacyTitle: "Privacy",
    privacySub: "I tuoi dati sono protetti."
  },
  uk: {
    navExplore: "Досліджувати", navMine: "Мої оголошення", navWish: "Список бажань", navMessages: "Повідомлення", navHow: "Як це працює", navAbout: "Про нас",
    hero1: "Міняй більше", hero2: "Зберігай гроші", heroSub: "Перетвори те, що маєш, на те, що хочеш — без витрат", dream: "Здійснюй мрії без витрат ✦", explore: "Переглянути оголошення", publish: "Додати оголошення",
    searchTitle: "Що ти шукаєш?", have: "У мене є", want: "Мені потрібно", distance: "Поблизу", matches: "Підходить для вас", trust: "Довіра заробляється", premium: "troCASH PREMIUM",
    trustLong: "Довіра виникає з чітких правил, перевірених профілів і хорошого досвіду.",
    slogan2: "Більше обмінів. Менше витрат.",
    verificationTitle: "Перевірка учасників",
    verificationSub: "Більше безпеки для всіх.",
    noMoneyTitle: "Без грошей між учасниками",
    noMoneySub: "Обмінюй цінність за цінність.",
    supportTitle: "Присвячена підтримка",
    supportSub: "Допомога коли потрібно.",
    privacyTitle: "Конфіденційність",
    privacySub: "Ваші дані захищені."
  },
  de: {
    navExplore: "Entdecken", navMine: "Meine Anzeigen", navWish: "Wunschliste", navMessages: "Nachrichten", navHow: "Wie es funktioniert", navAbout: "Über",
    hero1: "Mehr tauschen", hero2: "Geld behalten", heroSub: "Verwandle, was du hast, in das, was du willst — ohne zu bezahlen", dream: "Erfülle deine Träume kostenfrei ✦", explore: "Angebote durchsuchen", publish: "Anzeige veröffentlichen",
    searchTitle: "Wonach suchst du?", have: "Ich habe", want: "Ich möchte", distance: "Innerhalb", matches: "Vorschläge für dich", trust: "Vertrauen wird aufgebaut", premium: "troCASH PREMIUM",
    trustLong: "Vertrauen entsteht durch klare Regeln, verifizierte Profile und gute Erfahrungen.",
    slogan2: "Mehr tauschen. Weniger ausgeben.",
    verificationTitle: "Mitglieder-Verifizierung",
    verificationSub: "Mehr Sicherheit für alle.",
    noMoneyTitle: "Kein Geld zwischen Mitgliedern",
    noMoneySub: "Tausch Wert gegen Wert.",
    supportTitle: "Dedizierter Support",
    supportSub: "Hilfe, wenn du sie brauchst.",
    privacyTitle: "Privatsphäre",
    privacySub: "Deine Daten sind geschützt."
  },
  zh: {
    navExplore: "探索", navMine: "我的刊登", navWish: "愿望清单", navMessages: "消息", navHow: "如何运作", navAbout: "关于",
    hero1: "更多交换", hero2: "省下你的钱", heroSub: "把你拥有的变成你想要的——无需花钱", dream: "以零成本实现你的梦想 ✦", explore: "浏览商品", publish: "发布商品",
    searchTitle: "你在找什么？", have: "我有", want: "我想要", distance: "范围内", matches: "为你匹配", trust: "信任需要建立", premium: "troCASH PREMIUM",
    trustLong: "信任来自明确的规则、经过验证的资料和良好的体验。",
    slogan2: "更多交换。更少花费。",
    verificationTitle: "會員驗證",
    verificationSub: "為所有人提供更多安全保障。",
    noMoneyTitle: "成員間無現金交易",
    noMoneySub: "以物易物，物物相值。",
    supportTitle: "專屬支援",
    supportSub: "需要時提供幫助。",
    privacyTitle: "隱私",
    privacySub: "您的資料受到保護。"
  },
  es: {
    navExplore: "Explorar", navMine: "Mis Anuncios", navWish: "Lista de deseos", navMessages: "Mensajes", navHow: "Cómo funciona", navAbout: "Acerca de",
    hero1: "Cambia más", hero2: "Ahorra tu dinero", heroSub: "Convierte lo que tienes en lo que quieres — sin gastar", dream: "Haz realidad tus sueños sin coste ✦", explore: "Explorar ofertas", publish: "Publicar anuncio",
    searchTitle: "¿Qué buscas?", have: "Tengo", want: "Quiero", distance: "En", matches: "Coincidencias para ti", trust: "La confianza se gana", premium: "troCASH PREMIUM",
    trustLong: "La confianza nace de reglas claras, perfiles verificados y buenas experiencias.",
    slogan2: "Más intercambios. Menos gastos.",
    verificationTitle: "Verificación de miembros",
    verificationSub: "Más seguridad para todos.",
    noMoneyTitle: "Sin dinero entre miembros",
    noMoneySub: "Intercambia valor por valor.",
    supportTitle: "Soporte dedicado",
    supportSub: "Ayuda cuando la necesites.",
    privacyTitle: "Privacidad",
    privacySub: "Tus datos están protegidos."
  }
}[lang] || {
  navExplore: "Explorar", navMine: "Meus Anúncios", navWish: "Wish List", navMessages: "Mensagens", navHow: "Como funciona", navAbout: "Sobre",
  hero1: "Swap more", hero2: "Keep your cash", heroSub: "Turn what you have into what you want — without spending", dream: "Realiza os teus sonhos a custo 0 ✦", explore: "Explorar ofertas", publish: "Publicar anúncio",
  searchTitle: "O que você procura?", have: "Eu tenho", want: "Procuro", distance: "Até", matches: "Encontros para si", trust: "Confiança que se conquista", premium: "troCASH PREMIUM"
};

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <HomeView
      copy={copy}
      LANGUAGES={LANGUAGES}
      lang={lang}
      setLang={setLang}
      languageOpen={languageOpen}
      setLanguageOpen={setLanguageOpen}
      user={user}
      router={router}
      offers={offers}
      loading={loading}
      notice={notice}
      placeholder={placeholder}
      category={category}
      setCategory={setCategory}
      have={have}
      setHave={setHave}
      want={want}
      setWant={setWant}
      radius={radius}
      setRadius={setRadius}
      searchTab={searchTab}
      setSearchTab={setSearchTab}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
      visibleListings={visibleListings}
      addPhotos={addPhotos}
      photos={photos}
      removePhoto={removePhoto}
      form={form}
      setForm={setForm}
      addOffer={addOffer}
      proposeExchange={proposeExchange}
      premiumOpen={premiumOpen}
      setPremiumOpen={setPremiumOpen}
      accountOpen={accountOpen}
      setAccountOpen={setAccountOpen}
      wishlistOpen={wishlistOpen}
      setWishlistOpen={setWishlistOpen}
      newOfferOpen={newOfferOpen}
      setNewOfferOpen={setNewOfferOpen}
      scrollTo={scrollTo}
    />
  );
}