-- SCHEMA PARA ORDENFI
-- Copia y pega esto en el SQL Editor de Supabase

-- 1. Tabla de Transacciones (Inversiones)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  ticker text not null,
  name text,
  qty numeric not null,
  price numeric not null,
  type text check (type in ('BUY', 'SELL')),
  currency text default 'ARS',
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 2. Tabla de Flujo de Caja (Ingresos/Egresos)
create table cashflow (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  amount numeric not null,
  currency text default 'ARS',
  exchange_rate numeric,
  type text check (type in ('INCOME', 'EXPENSE')),
  category text,
  payment_method text,
  is_installments boolean default false,
  installments integer default 1,
  target_month text, -- Formato YYYY-MM
  created_at timestamp with time zone default now()
);

-- 3. Tabla de Estrategias Personalizadas (Opcional)
create table strategies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null, -- CONSERVATIVE, MODERATE, AGGRESSIVE
  assets jsonb not null, -- Array de {ticker, percentage}
  updated_at timestamp with time zone default now()
);

-- RLS (Row Level Security) - Muy importante para seguridad
alter table transactions enable row level security;
alter table cashflow enable row level security;
alter table strategies enable row level security;

-- Políticas de lectura/escritura (Solo el dueño puede ver sus datos)
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can delete own transactions" on transactions for delete using (auth.uid() = user_id);

create policy "Users can view own cashflow" on cashflow for select using (auth.uid() = user_id);
create policy "Users can insert own cashflow" on cashflow for insert with check (auth.uid() = user_id);
create policy "Users can delete own cashflow" on cashflow for delete using (auth.uid() = user_id);

-- 4. Tabla de Cotizaciones Históricas
create table exchange_rates (
  date date primary key,
  rates jsonb not null,
  created_at timestamp with time zone default now()
);

alter table exchange_rates enable row level security;
create policy "Public read rates" on exchange_rates for select using (true);
create policy "Auth users can insert rates" on exchange_rates for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update rates" on exchange_rates for update using (auth.role() = 'authenticated');
