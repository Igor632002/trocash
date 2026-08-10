-- =========================================================
-- 🧹 ОЧИЩЕННЯ ДАНИХ
-- =========================================================

TRUNCATE TABLE
    public.reports,
    public.exchange_requests,
    public.wishes,
    public.offers,
    public.profiles
RESTART IDENTITY CASCADE;


-- =========================================================
-- 👤 ПРОФІЛІ КОРИСТУВАЧІВ
-- =========================================================
-- UUID потрібно замінити на реальні UUID з auth.users

INSERT INTO public.profiles
    (id, display_name, area)
VALUES
(
    '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a',
    'Ana',
    'Faro'
),
(
    'b85df707-a7c9-4a90-9b05-d7776d6dc63c',
    'João',
    'Albufeira'
),
(
    '5c05b746-38d2-4256-9677-1ebc95560bc3',
    'Maria',
    'Lagos'
);


-- =========================================================
-- 🎁 ПРОПОЗИЦІЇ
-- =========================================================

INSERT INTO public.offers
    (owner_id, title, description, kind, area, wish, notes)
VALUES

(
    '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a',
    'Bicicleta usada',
    'Boa para passeios curtos',
    'Objeto',
    'Faro',
    'Livro de viagens',
    'Em bom estado'
),

(
    'b85df707-a7c9-4a90-9b05-d7776d6dc63c',
    'Aulas de guitarra',
    'Ensino básico de acordes',
    'Serviço',
    'Albufeira',
    'Troca por aulas de inglês',
    'Disponível fins de semana'
),

(
    '5c05b746-38d2-4256-9677-1ebc95560bc3',
    '2 horas de babysitting',
    'Experiência com crianças pequenas',
    'Horas',
    'Lagos',
    'Ajuda com jardinagem',
    'Somente tardes'
);


-- =========================================================
-- ❤️ СПИСОК БАЖАНЬ
-- =========================================================

INSERT INTO public.wishes
    (owner_id, title, description, example_urls, notes)
VALUES

(
    '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a',
    'Livro de culinária',
    'Procuro receitas mediterrânicas',
    ARRAY['https://example.com/livro1'],
    'Preferência por edições recentes'
),

(
    'b85df707-a7c9-4a90-9b05-d7776d6dc63c',
    'Troca de carro',
    'Procuro carro usado em bom estado',
    ARRAY['https://example.com/car1'],
    'Até 5000€'
),

(
    '5c05b746-38d2-4256-9677-1ebc95560bc3',
    'Curso online de design',
    'Qualquer plataforma reconhecida',
    ARRAY['https://example.com/design'],
    'Preciso certificado'
);


-- =========================================================
-- 🔄 ЗАПИТИ НА ОБМІН
-- =========================================================

INSERT INTO public.exchange_requests
    (offer_id, proposer_id, proposal_type, proposal_text, notes)
VALUES

(
    (
        SELECT id
        FROM public.offers
        WHERE title = 'Bicicleta usada'
          AND owner_id = '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a'
    ),
    'b85df707-a7c9-4a90-9b05-d7776d6dc63c',
    'Objeto',
    'Livro de viagens',
    'Posso entregar pessoalmente'
),

(
    (
        SELECT id
        FROM public.offers
        WHERE title = 'Aulas de guitarra'
          AND owner_id = 'b85df707-a7c9-4a90-9b05-d7776d6dc63c'
    ),
    '5c05b746-38d2-4256-9677-1ebc95560bc3',
    'Horas',
    '2 horas de babysitting',
    'Disponível esta semana'
);


-- =========================================================
-- 🚨 РЕПОРТИ
-- =========================================================

INSERT INTO public.reports
    (reporter_id, offer_id, reason, details)
VALUES

(
    '5c05b746-38d2-4256-9677-1ebc95560bc3',

    (
        SELECT id
        FROM public.offers
        WHERE title = 'Bicicleta usada'
          AND owner_id = '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a'
    ),

    'Spam',
    'Oferta duplicada'
),

(
    '69de9d32-3aef-40a4-bdd8-0bd1f4f7467a',

    (
        SELECT id
        FROM public.offers
        WHERE title = 'Aulas de guitarra'
          AND owner_id = 'b85df707-a7c9-4a90-9b05-d7776d6dc63c'
    ),

    'Inadequado',
    'Descrição ofensiva'
);


-- =========================================================
-- ✅ ПЕРЕВІРКА
-- =========================================================

SELECT
    p.display_name,
    p.area,
    COUNT(DISTINCT o.id) AS offers_count,
    COUNT(DISTINCT w.id) AS wishes_count
FROM public.profiles p
LEFT JOIN public.offers o
    ON o.owner_id = p.id
LEFT JOIN public.wishes w
    ON w.owner_id = p.id
GROUP BY
    p.id,
    p.display_name,
    p.area
ORDER BY
    p.display_name;