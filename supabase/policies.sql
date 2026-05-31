-- ============================================================================
-- Silmaril — Row Level Security policies
-- ----------------------------------------------------------------------------
-- Run AFTER schema.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- helper: is_admin()
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable RLS on every table
-- ----------------------------------------------------------------------------
alter table public.users                 enable row level security;
alter table public.threads               enable row level security;
alter table public.connections           enable row level security;
alter table public.perspectives          enable row level security;
alter table public.records               enable row level security;
alter table public.collections           enable row level security;
alter table public.collection_items      enable row level security;
alter table public.bookmarks             enable row level security;
alter table public.reactions             enable row level security;
alter table public.sources               enable row level security;
alter table public.user_thread_activity  enable row level security;

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
drop policy if exists users_select_all on public.users;
create policy users_select_all on public.users
  for select using (true);  -- public profiles are visible

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists users_admin_all on public.users;
create policy users_admin_all on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- threads
--   * local      → only author
--   * community/verified/official → anyone
--   * merged/archived → only author (others get redirected via UI)
-- ----------------------------------------------------------------------------
drop policy if exists threads_select on public.threads;
create policy threads_select on public.threads
  for select using (
    status in ('community','verified','official')
    or created_by = auth.uid()
    or public.is_admin()
  );

drop policy if exists threads_insert_authed on public.threads;
create policy threads_insert_authed on public.threads
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists threads_update_author on public.threads;
create policy threads_update_author on public.threads
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists threads_delete_author on public.threads;
create policy threads_delete_author on public.threads
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- connections
--   * SELECT: visible if both endpoints are visible to the requester
--             (delegated to threads RLS via EXISTS).
--   * INSERT: any authed user (curation is a community action).
--   * UPDATE/DELETE: creator or admin.
-- ----------------------------------------------------------------------------
drop policy if exists connections_select on public.connections;
create policy connections_select on public.connections
  for select using (
    exists (select 1 from public.threads t where t.id = from_thread) -- RLS-cascade
    and exists (select 1 from public.threads t where t.id = to_thread)
  );

drop policy if exists connections_insert on public.connections;
create policy connections_insert on public.connections
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists connections_modify on public.connections;
create policy connections_modify on public.connections
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists connections_delete on public.connections;
create policy connections_delete on public.connections
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- perspectives
-- ----------------------------------------------------------------------------
drop policy if exists perspectives_select on public.perspectives;
create policy perspectives_select on public.perspectives
  for select using (
    visibility = 'public'
    or created_by = auth.uid()
    or public.is_admin()
  );

drop policy if exists perspectives_insert on public.perspectives;
create policy perspectives_insert on public.perspectives
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists perspectives_modify on public.perspectives;
create policy perspectives_modify on public.perspectives
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists perspectives_delete on public.perspectives;
create policy perspectives_delete on public.perspectives
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- records
-- ----------------------------------------------------------------------------
drop policy if exists records_select on public.records;
create policy records_select on public.records
  for select using (
    visibility = 'public'
    or created_by = auth.uid()
    or public.is_admin()
    -- 'followers' visibility will be checked once we have follows table; for now treat as private.
  );

drop policy if exists records_insert on public.records;
create policy records_insert on public.records
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists records_modify on public.records;
create policy records_modify on public.records
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists records_delete on public.records;
create policy records_delete on public.records
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- collections
-- ----------------------------------------------------------------------------
drop policy if exists collections_select on public.collections;
create policy collections_select on public.collections
  for select using (
    visibility = 'public'
    or created_by = auth.uid()
    or public.is_admin()
  );

drop policy if exists collections_insert on public.collections;
create policy collections_insert on public.collections
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists collections_modify on public.collections;
create policy collections_modify on public.collections
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists collections_delete on public.collections;
create policy collections_delete on public.collections
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- collection_items
--   parent collection's RLS governs read; write must be by owner of collection.
-- ----------------------------------------------------------------------------
drop policy if exists collection_items_select on public.collection_items;
create policy collection_items_select on public.collection_items
  for select using (
    exists (select 1 from public.collections c where c.id = collection_id)
  );

drop policy if exists collection_items_write on public.collection_items;
create policy collection_items_write on public.collection_items
  for all using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id
        and (c.created_by = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id
        and (c.created_by = auth.uid() or public.is_admin())
    )
  );

-- ----------------------------------------------------------------------------
-- bookmarks  — private to the user
-- ----------------------------------------------------------------------------
drop policy if exists bookmarks_select on public.bookmarks;
create policy bookmarks_select on public.bookmarks
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists bookmarks_write on public.bookmarks;
create policy bookmarks_write on public.bookmarks
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- reactions
-- ----------------------------------------------------------------------------
drop policy if exists reactions_select on public.reactions;
create policy reactions_select on public.reactions
  for select using (true);  -- counts are public

drop policy if exists reactions_write on public.reactions;
create policy reactions_write on public.reactions
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- sources  — visible if the attached target is visible.
-- ----------------------------------------------------------------------------
drop policy if exists sources_select on public.sources;
create policy sources_select on public.sources
  for select using (
    case attached_to_kind
      when 'thread'      then exists (select 1 from public.threads      t where t.id = attached_to_id)
      when 'perspective' then exists (select 1 from public.perspectives p where p.id = attached_to_id)
      when 'record'      then exists (select 1 from public.records      r where r.id = attached_to_id)
    end
  );

drop policy if exists sources_insert on public.sources;
create policy sources_insert on public.sources
  for insert with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists sources_modify on public.sources;
create policy sources_modify on public.sources
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists sources_delete on public.sources;
create policy sources_delete on public.sources
  for delete using (created_by = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- user_thread_activity  — private log
-- ----------------------------------------------------------------------------
drop policy if exists uta_select on public.user_thread_activity;
create policy uta_select on public.user_thread_activity
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists uta_write on public.user_thread_activity;
create policy uta_write on public.user_thread_activity
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
