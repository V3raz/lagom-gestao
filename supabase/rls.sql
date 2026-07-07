-- ============================================================
-- LAGOM GESTÃO — Trancar o banco (Row Level Security)
--
-- O QUE ISSO FAZ: hoje qualquer pessoa com a chave pública do
-- site (visível no navegador) consegue ler e alterar o banco
-- inteiro sem login. Este script exige login pra tudo.
--
-- ⚠️ ANTES DE RODAR: crie o usuário dela em
--    Authentication → Users → Add user (com "Auto Confirm").
--    Depois de rodar, o app SÓ funciona logado.
--
-- COMO RODAR: painel do Supabase → SQL Editor → cole tudo → Run.
-- ============================================================

-- 1) Liga o RLS em todas as tabelas
alter table public.clientes      enable row level security;
alter table public.roupas        enable row level security;
alter table public.pedidos       enable row level security;
alter table public.itens_pedido  enable row level security;
alter table public.anotacoes     enable row level security;
alter table public.marcas        enable row level security;
alter table public.categorias    enable row level security;

-- 2) Remove policies antigas (se existirem) pra não conflitar
drop policy if exists "acesso_logado" on public.clientes;
drop policy if exists "acesso_logado" on public.roupas;
drop policy if exists "acesso_logado" on public.pedidos;
drop policy if exists "acesso_logado" on public.itens_pedido;
drop policy if exists "acesso_logado" on public.anotacoes;
drop policy if exists "acesso_logado" on public.marcas;
drop policy if exists "acesso_logado" on public.categorias;

-- 3) Libera tudo APENAS para quem está logado (authenticated)
create policy "acesso_logado" on public.clientes
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.roupas
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.pedidos
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.itens_pedido
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.anotacoes
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.marcas
  for all to authenticated using (true) with check (true);
create policy "acesso_logado" on public.categorias
  for all to authenticated using (true) with check (true);
