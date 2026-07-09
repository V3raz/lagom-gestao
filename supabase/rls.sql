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
--      Providers → Email → desmarque "Allow new users to sign up".
--      Sem isso, qualquer pessoa com a chave pública do site consegue
--      criar uma conta pela API e virar "authenticated" — anulando
--      todo este script.
--
-- COMO RODAR: painel do Supabase → SQL Editor → cole tudo → Run.
-- É seguro rodar mais de uma vez (idempotente) e só mexe nas tabelas
-- que existem — se faltar alguma, ela é ignorada em vez de dar erro.
--
-- 💡 O app detecta sozinho quando este script foi aplicado: enquanto o
--    banco estiver aberto ele roda sem login; depois de rodar o script,
--    a tela de login passa a aparecer automaticamente.
-- ============================================================

-- 1) Para CADA tabela que existir: liga o RLS, remove a policy antiga
--    (se houver) e cria a regra "só quem está logado acessa".
do $$
declare
  t text;
  tabelas text[] := array[
    'clientes', 'roupas', 'pedidos', 'itens_pedido',
    'anotacoes', 'marcas', 'categorias', 'estoque_opcoes'
  ];
begin
  foreach t in array tabelas loop
    -- to_regclass devolve null se a tabela não existe → pula sem erro
    if to_regclass(format('public.%I', t)) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists "acesso_logado" on public.%I', t);
      execute format(
        'create policy "acesso_logado" on public.%I '
        'for all to authenticated using (true) with check (true)', t);
    end if;
  end loop;
end $$;

-- 2) Remove QUALQUER policy que ainda libere acesso anônimo/público —
--    são elas que anulam o RLS (com elas, o banco continua aberto).
--    A policy "acesso_logado" acima é para o papel "authenticated",
--    então não é afetada por esta limpeza.
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

-- 3) Confere o resultado: lista as policies que sobraram por tabela.
--    O esperado é UMA policy "acesso_logado" (papel {authenticated})
--    em cada tabela, e NENHUMA com {public} ou anon.
select tablename, policyname, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
