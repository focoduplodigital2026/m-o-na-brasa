-- Mão na Brasa Burger - simplificação do admin
-- Rode este arquivo no Supabase SQL Editor se você quer que qualquer usuário cadastrado/logado
-- no Supabase Auth possa editar o painel admin, sem precisar inserir UUID na tabela profiles.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null;
$$;

-- Com essa função, as políticas já criadas que usam public.is_admin()
-- passam a liberar edição para qualquer usuário autenticado.
--
-- Você não precisa mais rodar:
-- insert into public.profiles (id, role, name) values (...);

