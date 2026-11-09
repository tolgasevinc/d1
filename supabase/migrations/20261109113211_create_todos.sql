create table public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  done boolean not null default false,
  due_date date null,
  priority text not null default 'orta' check (priority in ('dusuk','orta','yuksek')),
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

alter table public.todos enable row level security;

create policy "anon select" on public.todos for select to anon using (true);
create policy "anon insert" on public.todos for insert to anon with check (true);
create policy "anon update" on public.todos for update to anon using (true) with check (true);
create policy "anon delete" on public.todos for delete to anon using (true);

grant select, insert, update, delete on public.todos to anon;
