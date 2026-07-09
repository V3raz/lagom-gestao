-- ============================================================
-- LAGOM GESTÃO — Trancar o banco (Row Level Security)
--
-- O QUE ISSO FAZ: hoje qualquer pessoa com a chave pública do
-- site (visível no navegador) consegue ler e alterar o banco
-- inteiro sem login. Este script exige login pra tudo.
--
-- ⚠️ ANTES DE RODAR (os 2 passos, na ordem):
--
--   1. Crie o usuário dela em Authentication → Users → Add user
--      (com "Auto Confirm"). Depois de rodar, o app SÓ funciona logado.
--
--   2. DESLIGUE o auto-cadastro: Authentication → Sign In / Up →
--      desmarque "Allow new users to sign up". Sem isso, qualquer
--      pessoa com a chave pública do site consegue criar uma conta
--      pela API e virar "authenticated" — anulando todo este script.
--
-- COMO RODAR: painel do Supabase → SQL Editor → cole tudo → Run.
--
-- 💡 O app detecta sozinho quando este script foi aplicado: enquanto o
--    banco estiver aberto ele roda sem login; depois de rodar o script,
--    a tela de login passa a aparecer automaticamente.
-- ============================================================

-- 1) Liga o RLS em todas as tabelas
alter table public.clientes       enable row level security;
alter table public.roupas         enable row level security;
alter table public.pedidos        enable row level security;
alter table public.itens_pedido   enable row level security;
alter table public.anotacoes      enable row level security;
alter table public.marcas         enable row level security;
alter table public.categorias     enable row level security;
alter table public.estoque_opcoes enable row level security;

-- 1b) REMOVE as policies antigas que liberavam acesso ANÔNIMO
--     (elas anulam o RLS — com elas o banco continua aberto!)
do $$
declare r record;
begin
  for r in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (roles::text like '%anon%' or roles::text like '%{public}%')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 1c) Garante acesso logado também na estoque_opcoes
drop policy if exists "acesso total para logados" on public.estoque_opcoes;
create policy "acesso total para logados" on public.estoque_opcoes
  for all to authenticated using (true) with check (true);

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
