# troCASH Real Beta — Algarve

Arquitetura preparada para Vercel + Supabase.

## Para transformar isto numa Beta multiutilizador
1. Criar projeto no Supabase.
2. Executar `supabase/schema.sql` no SQL Editor.
3. Criar Storage bucket para fotos (de preferência privado com URLs assinadas).
4. Configurar Auth (email magic link ou email/password).
5. Copiar `.env.example` para `.env.local` e preencher as chaves.
6. Ligar o repositório à Vercel.
7. Configurar as mesmas variáveis na Vercel.
8. Testar com 20–50 utilizadores.

## Produção posterior
- Matching no servidor e trocas em cadeia.
- Chat e notificações.
- Moderação/admin real.
- RGPD/DSA/Termos/Cookies.
- MB WAY via SIBS Pagamentos Autorizados.
- Faturação e contabilista.

## Importante
O código incluído é uma base técnica. Ainda não está ligado às credenciais de nenhum serviço e não cobra dinheiro.
