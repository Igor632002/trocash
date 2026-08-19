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
    trustBadge1Title: "Seguro",
    trustBadge1Sub: "Verificado",
    trustBadge2Title: "Comunidade",
    trustBadge2Sub: "Confiável",
    trustBadge3Title: "Sustentável",
    trustBadge3Sub: "Consciente",
    trustBadge4Title: "Local",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Verificação de membros",
    verificationSub: "Mais segurança para todos.",
    noMoneyTitle: "Sem dinheiro entre membros",
    noMoneySub: "Troca valor por valor.",
    supportTitle: "Suporte dedicado",
    supportSub: "Ajuda quando precisares.",
    privacyTitle: "Privacidade",
    privacySub: "Os teus dados protegidos.",
    premiumHeading: "Mais oportunidades. Menos esforço.",
    premiumSub: "Destaca as tuas ofertas, encontra correspondências mais depressa e navega sem distrações.",
    viewAll: "Ver todas →",
    searchButton: "Pesquisar",
    smartMatches: "Smart Matches: a pesquisar trocas compatíveis para {have} → {want}.",
    wishlistAria: "Lista de deseos",
    premiumPriceLabel: "€4,99 / mês",
    premiumButton: "Quero Premium",
    premiumModalHeading: "Mais trocas. Menos gastos.",
    premiumModalBody: "O preço de €4,99/mês foi desenhado para ser simples e transparente. A ligação ao pagamento será ativada quando o checkout estiver ligado ao teu MB WAY.",
    premiumModalList: "Ofertas destacadas|Correspondências prioritárias|Sem publicidade|Suporte prioritário",
    footerBrandline: "JUNTOS CRIAMOS VALOR.",
    footerLine1: "Swap more. Keep your cash.",
    footerLine2: "Realiza os teus sonhos a custo 0.",
    footerLine3: "Exchange more. Spend less. Live more.",
    footerTroCASH: "troCASH",
    footerAbout: "Sobre nós",
    footerHow: "Como funciona",
    footerRules: "Regras da comunidade",
    footerSupportTitle: "Suporte",
    footerSupportHelp: "Centro de ajuda",
    footerSupportSecurity: "Segurança",
    footerSupportPrivacy: "Privacidade",
    footerCommunityTitle: "Comunidade",
    footerCommunityItems: "Sustentabilidade|Dicas e artigos|Eventos locais",
    footerNewsTitle: "Recebe novidades",
    footerNewsSub: "Ideias para trocar melhor, gastar menos e viver mais."
  },
  en: {
    navExplore: "Explore", navMine: "My Listings", navWish: "Wish List", navMessages: "Messages", navHow: "How it works", navAbout: "About",
    hero1: "Swap more", hero2: "Keep your cash", heroSub: "Turn what you have into what you want — without spending", dream: "Make your dreams happen at zero cost ✦", explore: "Explore offers", publish: "Post an offer",
    searchTitle: "What are you looking for?", have: "I have", want: "I want", distance: "Within", matches: "Matches for you", trust: "Trust is earned", premium: "troCASH PREMIUM",
    trustLong: "Trust grows from clear rules, verified profiles and good experiences.",
    slogan2: "More swapping. Less spending.",
    trustBadge1Title: "Safe",
    trustBadge1Sub: "Verified",
    trustBadge2Title: "Community",
    trustBadge2Sub: "Trusted",
    trustBadge3Title: "Sustainable",
    trustBadge3Sub: "Conscious",
    trustBadge4Title: "Local",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Member verification",
    verificationSub: "More safety for everyone.",
    noMoneyTitle: "No money between members",
    noMoneySub: "Trade value for value.",
    supportTitle: "Dedicated support",
    supportSub: "Help when you need it.",
    privacyTitle: "Privacy",
    privacySub: "Your data is protected.",
    premiumHeading: "More opportunities. Less effort.",
    premiumSub: "Highlight your offers, find matches faster, and browse distraction-free.",
    premiumPriceLabel: "€4.99 / month",
    premiumButton: "Get Premium",
    searchButton: "Search",
    smartMatches: "Smart Matches: searching compatible swaps for {have} → {want}.",
    wishlistAria: "Wishlist",
    premiumModalHeading: "More swaps. Less spending.",
    premiumModalBody: "The €4.99/month price is designed to be simple and transparent. Payment will be enabled when checkout is connected to your payment method.",
    premiumModalList: "Featured offers|Priority matches|No ads|Priority support",
    footerBrandline: "TOGETHER WE CREATE VALUE.",
    footerLine1: "Swap more. Keep your cash.",
    footerLine2: "Make your dreams happen at zero cost.",
    footerLine3: "Exchange more. Spend less. Live more.",
    footerTroCASH: "troCASH",
    footerAbout: "About us",
    footerHow: "How it works",
    footerRules: "Community rules",
    footerSupportTitle: "Support",
    footerSupportHelp: "Help center",
    footerSupportSecurity: "Security",
    footerSupportPrivacy: "Privacy",
    footerCommunityTitle: "Community",
    footerCommunityItems: "Sustainability|Tips & articles|Local events",
    footerNewsTitle: "Get updates",
    footerNewsSub: "Ideas to swap better, spend less and live more."
  },
  ru: {
    navExplore: "Исследовать", navMine: "Мои объявления", navWish: "Желания", navMessages: "Сообщения", navHow: "Как это работает", navAbout: "О нас",
    hero1: "Меняй больше", hero2: "Сохраняй свои деньги", heroSub: "Превращай то, что у тебя есть, в то, чего ты хочешь — без лишних расходов", dream: "Исполняй мечты с нулевой стоимостью ✦", explore: "Смотреть предложения", publish: "Создать объявление",
    searchTitle: "Что ты ищешь?", have: "У меня есть", want: "Мне нужно", distance: "До", matches: "Подобрано для тебя", trust: "Доверие создаётся", premium: "troCASH PREMIUM",
    trustLong: "Доверие возникает з понятных правил, проверенных профилей и хорошего опыта.",
    viewAll: "Показать все →",
    slogan2: "Больше обменов. Меньше трат.",
    trustBadge1Title: "Безопасно",
    trustBadge1Sub: "Проверено",
    trustBadge2Title: "Сообщество",
    trustBadge2Sub: "Надежно",
    trustBadge3Title: "Устойчиво",
    trustBadge3Sub: "Сознательно",
    trustBadge4Title: "Локально",
    trustBadge4Sub: "Альгарве",
    verificationTitle: "Проверка участников",
    verificationSub: "Больше безопасности для всех.",
    noMoneyTitle: "Без денег между участниками",
    noMoneySub: "Обменивай ценность на ценность.",
    supportTitle: "Выделенная поддержка",
    supportSub: "Помощь, когда нужно.",
    privacyTitle: "Конфиденциальность",
    privacySub: "Ваши данные защищены.",
    premiumHeading: "Больше возможностей. Меньше усилий.",
    premiumSub: "Выделите свои объявления, находите совпадения быстрее и просматривайте без отвлечений.",
    premiumPriceLabel: "€4,99 / месяц",
    premiumButton: "Хочу Premium",
    premiumModalHeading: "Больше обменов. Меньше трат.",
    premiumModalBody: "Цена €4,99/мес рассчитана так, чтобы быть простой и прозрачной. Оплата будет доступна, когда оформление заказа подключено к вашему способу оплаты.",
    premiumModalList: "Выделенные объявления|Приоритетные совпадения|Без рекламы|Приоритетная поддержка",
    footerBrandline: "МЫ СОЗДАЕМ ЦЕННОСТЬ ВМЕСТЕ.",
    footerLine1: "Меняй больше. Сохраняй деньги.",
    footerLine2: "Исполняй мечты с нулевой стоимостью.",
    footerLine3: "Обменивай больше. Трать меньше. Живи лучше.",
    footerTroCASH: "troCASH",
    footerAbout: "О нас",
    footerHow: "Как это работает",
    footerRules: "Правила сообщества",
    footerSupportTitle: "Поддержка",
    footerSupportHelp: "Центр помощи",
    footerSupportSecurity: "Безопасность",
    footerSupportPrivacy: "Конфиденциальность",
    footerCommunityTitle: "Сообщество",
    footerCommunityItems: "Устойчивость|Советы и статьи|Мероприятия",
    footerNewsTitle: "Получать новости",
    footerNewsSub: "Идеи для лучшего обмена, меньших трат и лучшей жизни."
  },
  fr: {
    navExplore: "Explorer", navMine: "Mes Annonces", navWish: "Liste de souhaits", navMessages: "Messages", navHow: "Comment ça marche", navAbout: "À propos",
    hero1: "Échangez plus", hero2: "Gardez votre argent", heroSub: "Transformez ce que vous avez en ce que vous voulez — sans dépenser", dream: "Réalisez vos rêves à coût zéro ✦", explore: "Explorer les offres", publish: "Publier une annonce",
    searchTitle: "Que cherchez-vous ?", have: "J'ai", want: "Je veux", distance: "Dans", matches: "Correspondances pour vous", trust: "La confiance se mérite", premium: "troCASH PREMIUM",
    trustLong: "La confiance naît de règles claires, de profils vérifiés et de bonnes expériences.",
    viewAll: "Voir tout →",
    slogan2: "Plus d'échanges. Moins de dépenses.",
    trustBadge1Title: "Sûr",
    trustBadge1Sub: "Vérifié",
    trustBadge2Title: "Communauté",
    trustBadge2Sub: "Fiable",
    trustBadge3Title: "Durable",
    trustBadge3Sub: "Conscient",
    trustBadge4Title: "Local",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Vérification des membres",
    verificationSub: "Plus de sécurité pour tout le monde.",
    noMoneyTitle: "Pas d'argent entre les membres",
    noMoneySub: "Échange valeur contre valeur.",
    supportTitle: "Support dédié",
    supportSub: "Aide quand vous en avez besoin.",
    privacyTitle: "Confidentialité",
    privacySub: "Vos données sont protégées.",
    premiumHeading: "Plus d'échanges. Moins d'efforts.",
    premiumSub: "Mettez en avant vos offres, trouvez des correspondances plus rapidement et naviguez sans distractions.",
    premiumPriceLabel: "€4,99 / mois",
    premiumButton: "Je veux Premium",
    premiumModalHeading: "Plus d'échanges. Moins de dépenses.",
    premiumModalBody: "Le prix de 4,99€/mois a été conçu pour être simple et transparent. Le paiement sera activé lorsque le checkout sera connecté à votre méthode de paiement.",
    premiumModalList: "Offres mises en avant|Correspondances prioritaires|Sans publicité|Support prioritaire",
    footerBrandline: "ENSUITE NOUS CREEONS DE LA VALEUR.",
    footerLine1: "Échangez plus. Gardez votre argent.",
    footerLine2: "Réalisez vos rêves à coût zéro.",
    footerLine3: "Échangez plus. Dépensez moins. Vivez plus.",
    footerTroCASH: "troCASH",
    footerAbout: "À propos",
    footerHow: "Comment ça marche",
    footerRules: "Règles de la communauté",
    footerSupportTitle: "Support",
    footerSupportHelp: "Centre d'aide",
    footerSupportSecurity: "Sécurité",
    footerSupportPrivacy: "Confidentialité",
    footerCommunityTitle: "Communauté",
    footerCommunityItems: "Durabilité|Conseils et articles|Événements locaux",
    footerNewsTitle: "Recevez des nouvelles",
    footerNewsSub: "Idées pour échanger mieux, dépenser moins et vivre plus."
  },
  it: {
    navExplore: "Esplora", navMine: "I miei annunci", navWish: "Lista dei desideri", navMessages: "Messaggi", navHow: "Come funziona", navAbout: "Informazioni",
    hero1: "Scambia di più", hero2: "Risparmia denaro", heroSub: "Trasforma ciò che hai in ciò che desideri — senza spendere", dream: "Realizza i tuoi sogni a costo zero ✦", explore: "Esplora le offerte", publish: "Pubblica un annuncio",
    searchTitle: "Cosa stai cercando?", have: "Ho", want: "Cerco", distance: "Entro", matches: "Abbinamenti per te", trust: "La fiducia si guadagna", premium: "troCASH PREMIUM",
    trustLong: "La fiducia nasce da regole chiare, profili verificati e buone esperienze.",
    viewAll: "Vedi tutto →",
    slogan2: "Più scambi. Meno spese.",
    trustBadge1Title: "Sicuro",
    trustBadge1Sub: "Verificato",
    trustBadge2Title: "Comunità",
    trustBadge2Sub: "Affidabile",
    trustBadge3Title: "Sostenibile",
    trustBadge3Sub: "Consapevole",
    trustBadge4Title: "Locale",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Verifica dei membri",
    verificationSub: "Più sicurezza per tutti.",
    noMoneyTitle: "Niente soldi tra i membri",
    noMoneySub: "Scambia valore per valore.",
    supportTitle: "Supporto dedicato",
    supportSub: "Aiuto quando ne hai bisogno.",
    privacyTitle: "Privacy",
    privacySub: "I tuoi dati sono protetti.",
    premiumHeading: "Più opportunità. Meno sforzo.",
    premiumSub: "Metti in evidenza i tuoi annunci, trova corrispondenze più velocemente e naviga senza distrazioni.",
    premiumPriceLabel: "€4,99 / mese",
    premiumButton: "Voglio Premium",
    premiumModalHeading: "Più scambi. Meno spese.",
    premiumModalBody: "Il prezzo di €4,99/mese è pensato per essere semplice e trasparente. Il pagamento sarà abilitato quando il checkout sarà connesso al tuo metodo di pagamento.",
    premiumModalList: "Annunci in evidenza|Corrispondenze prioritarie|Nessuna pubblicità|Supporto prioritario",
    footerBrandline: "INSIEME CREIAMO VALORE.",
    footerLine1: "Scambia di più. Risparmia denaro.",
    footerLine2: "Realizza i tuoi sogni a costo zero.",
    footerLine3: "Scambia di più. Spendi meno. Vivi di più.",
    footerTroCASH: "troCASH",
    footerAbout: "Informazioni",
    footerHow: "Come funziona",
    footerRules: "Regole della community",
    footerSupportTitle: "Supporto",
    footerSupportHelp: "Centro assistenza",
    footerSupportSecurity: "Sicurezza",
    footerSupportPrivacy: "Privacy",
    footerCommunityTitle: "Community",
    footerCommunityItems: "Sostenibilità|Consigli e articoli|Eventi locali",
    footerNewsTitle: "Ricevi aggiornamenti",
    footerNewsSub: "Idee per scambiare meglio, spendere meno e vivere di più."
  },
  uk: {
    navExplore: "Досліджувати", navMine: "Мої оголошення", navWish: "Список бажань", navMessages: "Повідомлення", navHow: "Як це працює", navAbout: "Про нас",
    hero1: "Міняй більше", hero2: "Зберігай гроші", heroSub: "Перетвори те, що маєш, на те, що хочеш — без витрат", dream: "Здійснюй мрії без витрат ✦", explore: "Переглянути оголошення", publish: "Додати оголошення",
    searchTitle: "Що ти шукаєш?", have: "У мене є", want: "Мені потрібно", distance: "Поблизу", matches: "Підходить для вас", trust: "Довіра заробляється", premium: "troCASH PREMIUM",
    trustLong: "Довіра виникає з чітких правил, перевірених профілів і хорошого досвіду.",
    viewAll: "Показати всі →",
    slogan2: "Більше обмінів. Менше витрат.",
    trustBadge1Title: "Безпечно",
    trustBadge1Sub: "Перевірено",
    trustBadge2Title: "Спільнота",
    trustBadge2Sub: "Надійна",
    trustBadge3Title: "Стійко",
    trustBadge3Sub: "Свідомо",
    trustBadge4Title: "Локально",
    trustBadge4Sub: "Альгарве",
    verificationTitle: "Перевірка учасників",
    verificationSub: "Більше безпеки для всіх.",
    noMoneyTitle: "Без грошей між учасниками",
    noMoneySub: "Обмінюй цінність за цінність.",
    supportTitle: "Присвячена підтримка",
    supportSub: "Допомога коли потрібно.",
    privacyTitle: "Конфіденційність",
    privacySub: "Ваші дані захищені.",
    premiumHeading: "Більше можливостей. Менше зусиль.",
    premiumSub: "Виділяйте свої оголошення, знаходьте відповідності швидше та переглядайте без відволікань.",
    premiumPriceLabel: "€4,99 / місяць",
    premiumButton: "Хочу Premium",
    premiumModalHeading: "Більше обмінів. Менше витрат.",
    premiumModalBody: "Ціна €4,99/міс створена так, щоб бути простою і прозорою. Оплата буде доступна, коли оформлення замовлення буде підключене до вашого способу оплати.",
    premiumModalList: "Виділені оголошення|Пріоритетні відповідності|Без реклами|Пріоритетна підтримка",
    footerBrandline: "МИ РАЗОМ СТВОРЮЄМО ЦІННІСТЬ.",
    footerLine1: "Міняй більше. Зберігай гроші.",
    footerLine2: "Здійснюй мрії без витрат.",
    footerLine3: "Міняй більше. Трать менше. Живи більше.",
    footerTroCASH: "troCASH",
    footerAbout: "Про нас",
    footerHow: "Як це працює",
    footerRules: "Правила спільноти",
    footerSupportTitle: "Підтримка",
    footerSupportHelp: "Центр допомоги",
    footerSupportSecurity: "Безпека",
    footerSupportPrivacy: "Конфіденційність",
    footerCommunityTitle: "Спільнота",
    footerCommunityItems: "Стійкість|Поради та статті|Місцеві події",
    footerNewsTitle: "Отримувати новини",
    footerNewsSub: "Ідеї для кращого обміну, менших витрат і більш повноцінного життя."
  },
  de: {
    navExplore: "Entdecken", navMine: "Meine Anzeigen", navWish: "Wunschliste", navMessages: "Nachrichten", navHow: "Wie es funktioniert", navAbout: "Über",
    hero1: "Mehr tauschen", hero2: "Geld behalten", heroSub: "Verwandle, was du hast, in das, was du willst — ohne zu bezahlen", dream: "Erfülle deine Träume kostenfrei ✦", explore: "Angebote durchsuchen", publish: "Anzeige veröffentlichen",
    searchTitle: "Wonach suchst du?", have: "Ich habe", want: "Ich möchte", distance: "Innerhalb", matches: "Vorschläge für dich", trust: "Vertrauen wird aufgebaut", premium: "troCASH PREMIUM",
    trustLong: "Vertrauen entsteht durch klare Regeln, verifizierte Profile und gute Erfahrungen.",
    viewAll: "Alle anzeigen →",
    slogan2: "Mehr tauschen. Weniger ausgeben.",
    trustBadge1Title: "Sicher",
    trustBadge1Sub: "Verifiziert",
    trustBadge2Title: "Community",
    trustBadge2Sub: "Vertrauenswürdig",
    trustBadge3Title: "Nachhaltig",
    trustBadge3Sub: "Bewusst",
    trustBadge4Title: "Lokal",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Mitglieder-Verifizierung",
    verificationSub: "Mehr Sicherheit für alle.",
    noMoneyTitle: "Kein Geld zwischen Mitgliedern",
    noMoneySub: "Tausch Wert gegen Wert.",
    supportTitle: "Dedizierter Support",
    supportSub: "Hilfe, wenn du sie brauchst.",
    privacyTitle: "Privatsphäre",
    privacySub: "Deine Daten sind geschützt.",
    premiumHeading: "Mehr Möglichkeiten. Weniger Aufwand.",
    premiumSub: "Hebe deine Angebote hervor, finde schneller passende Treffer und surfe ohne Ablenkung.",
    premiumPriceLabel: "€4,99 / Monat",
    premiumButton: "Ich will Premium",
    premiumModalHeading: "Mehr tauschen. Weniger ausgeben.",
    premiumModalBody: "Der Preis von €4,99/Monat ist einfach und transparent gestaltet. Die Zahlung wird aktiviert, wenn der Checkout mit deiner Zahlungsmethode verbunden ist.",
    premiumModalList: "Hervorgehobene Angebote|Prioritäre Treffer|Keine Werbung|Priorisierter Support",
    footerBrandline: "ZUSAMMEN SCHAFFEN WIR WERT.",
    footerLine1: "Mehr tauschen. Geld behalten.",
    footerLine2: "Erfülle deine Träume kostenfrei.",
    footerLine3: "Mehr tauschen. Weniger ausgeben. Mehr leben.",
    footerTroCASH: "troCASH",
    footerAbout: "Über uns",
    footerHow: "Wie es funktioniert",
    footerRules: "Gemeinschaftsregeln",
    footerSupportTitle: "Support",
    footerSupportHelp: "Hilfezentrum",
    footerSupportSecurity: "Sicherheit",
    footerSupportPrivacy: "Privatsphäre",
    footerCommunityTitle: "Community",
    footerCommunityItems: "Nachhaltigkeit|Tipps & Artikel|Lokale Veranstaltungen",
    footerNewsTitle: "Erhalte Neuigkeiten",
    footerNewsSub: "Ideen, um besser zu tauschen, weniger auszugeben und mehr zu leben."
  },
  zh: {
    navExplore: "探索", navMine: "我的刊登", navWish: "愿望清单", navMessages: "消息", navHow: "如何运作", navAbout: "关于",
    hero1: "更多交换", hero2: "省下你的钱", heroSub: "把你拥有的变成你想要的——无需花钱", dream: "以零成本实现你的梦想 ✦", explore: "浏览商品", publish: "发布商品",
    searchTitle: "你在找什么？", have: "我有", want: "我想要", distance: "范围内", matches: "为你匹配", trust: "信任需要建立", premium: "troCASH PREMIUM",
    trustLong: "信任来自明确的规则、经过验证的资料和良好的体验。",
    viewAll: "查看全部 →",
    slogan2: "更多交换。更少花费。",
    trustBadge1Title: "安全",
    trustBadge1Sub: "已验证",
    trustBadge2Title: "社群",
    trustBadge2Sub: "值得信赖",
    trustBadge3Title: "永續",
    trustBadge3Sub: "有意識",
    trustBadge4Title: "在地",
    trustBadge4Sub: "阿爾加維",
    verificationTitle: "會員驗證",
    verificationSub: "為所有人提供更多安全保障。",
    noMoneyTitle: "成員間無現金交易",
    noMoneySub: "以物易物，物物相值。",
    supportTitle: "專屬支援",
    supportSub: "需要時提供幫助。",
    privacyTitle: "隱私",
    privacySub: "您的資料受到保護。",
    premiumHeading: "更多機會。更少努力。",
    premiumSub: "突顯你的刊登、更快找到配對、並無干擾地瀏覽。",
    premiumButton: "我要 Premium",
    premiumModalHeading: "更多交換。更少花費。",
    premiumModalBody: "€4,99/月 的價格設計為簡單且透明。當結帳連接到你的付款方式時，付款功能將啟用。",
    premiumModalList: "精選刊登|優先配對|無廣告|優先支援",
    footerBrandline: "我們一起創造價值。",
    footerLine1: "更多交換。省下你的錢。",
    footerLine2: "以零成本實現你的夢想。",
    footerLine3: "更多交換。更少花費。更好生活。",
    footerTroCASH: "troCASH",
    footerAbout: "關於我們",
    footerHow: "如何運作",
    footerRules: "社群守則",
    footerSupportTitle: "支援",
    footerSupportHelp: "說明中心",
    footerSupportSecurity: "安全性",
    footerSupportPrivacy: "隱私",
    footerCommunityTitle: "社群",
    footerCommunityItems: "永續|技巧與文章|在地活動",
    footerNewsTitle: "接收最新消息",
    footerNewsSub: "關於如何更會交換、少花錢與充實生活的想法。",
  },
  es: {
    navExplore: "Explorar", navMine: "Mis Anuncios", navWish: "Lista de deseos", navMessages: "Mensajes", navHow: "Cómo funciona", navAbout: "Acerca de",
    hero1: "Cambia más", hero2: "Ahorra tu dinero", heroSub: "Convierte lo que tienes en lo que quieres — sin gastar", dream: "Haz realidad tus sueños sin coste ✦", explore: "Explorar ofertas", publish: "Publicar anuncio",
    searchTitle: "¿Qué buscas?", have: "Tengo", want: "Quiero", distance: "En", matches: "Coincidencias para ti", trust: "La confianza se gana", premium: "troCASH PREMIUM",
    viewAll: "Ver todas →",
    trustLong: "La confianza nace de reglas claras, perfiles verificados y buenas experiencias.",
    slogan2: "Más intercambios. Menos gastos.",
    trustBadge1Title: "Seguro",
    trustBadge1Sub: "Verificado",
    trustBadge2Title: "Comunidad",
    trustBadge2Sub: "Confiable",
    trustBadge3Title: "Sostenible",
    trustBadge3Sub: "Consciente",
    trustBadge4Title: "Local",
    trustBadge4Sub: "Algarve",
    verificationTitle: "Verificación de miembros",
    verificationSub: "Más seguridad para todos.",
    noMoneyTitle: "Sin dinero entre miembros",
    noMoneySub: "Intercambia valor por valor.",
    supportTitle: "Soporte dedicado",
    supportSub: "Ayuda cuando la necesites.",
    privacyTitle: "Privacidad",
    privacySub: "Tus datos están protegidos.",
    premiumHeading: "Más oportunidades. Menos esfuerzo.",
    premiumSub: "Destaca tus ofertas, encuentra coincidencias más rápido y navega sin distracciones.",
    premiumPriceLabel: "€4,99 / mes",
    premiumButton: "Quiero Premium",
    premiumModalHeading: "Más intercambios. Menos gastos.",
    premiumModalBody: "El precio de €4,99/mes está diseñado para ser simple y transparente. El pago se habilitará cuando el checkout esté conectado a tu método de pago.",
    premiumModalList: "Ofertas destacadas|Coincidencias prioritarias|Sin anuncios|Soporte prioritario",
    footerBrandline: "JUNTOS CREAMOS VALOR.",
    footerLine1: "Más intercambios. Menos gastos.",
    footerLine2: "Haz realidad tus sueños sin coste.",
    footerLine3: "Intercambia más. Gasta menos. Vive más.",
    footerTroCASH: "troCASH",
    footerAbout: "Acerca de",
    footerHow: "Cómo funciona",
    footerRules: "Reglas de la comunidad",
    footerSupportTitle: "Soporte",
    footerSupportHelp: "Centro de ayuda",
    footerSupportSecurity: "Seguridad",
    footerSupportPrivacy: "Privacidad",
    footerCommunityTitle: "Comunidad",
    footerCommunityItems: "Sostenibilidad|Consejos y artículos|Eventos locales",
    footerNewsTitle: "Recibe novedades",
    footerNewsSub: "Ideas para intercambiar mejor, gastar menos y vivir más."
  }
}[lang] || {
  navExplore: "Explorar", navMine: "Meus Anúncios", navWish: "Wish List", navMessages: "Mensagens", navHow: "Como funciona", navAbout: "Sobre",
  hero1: "Swap more", hero2: "Keep your cash", heroSub: "Turn what you have into what you want — without spending", dream: "Realiza os teus sonhos a custo 0 ✦", explore: "Explorar ofertas", publish: "Publicar anúncio",
  searchTitle: "O que você procura?", have: "Eu tenho", want: "Procuro", distance: "Até", matches: "Encontros para si", trust: "Confiança que se conquista", premium: "troCASH PREMIUM",
  viewAll: "Ver todas →"
};

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Keep `searchTab` label in sync with current language
  useEffect(() => {
    try {
      const current = (copy && copy.have) || "Tenho";
      setSearchTab(current);
    } catch (e) { }
  }, [lang]);

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