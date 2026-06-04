-- ============================================================================
-- Silmaril — Seed data (PHASE 51). schema.sql 적용 후 실행.
-- Thread(=Keyword) + ko/en 번역 + 관계 + 큐레이터 관점.
-- 원칙: 직접 영향 단정 금지 → 개념/태도 연결(shares_theme, related_to, tier 2)로 표현.
-- 멱등: slug unique 기준 on conflict do nothing.
-- ============================================================================

-- ── 1. threads (20) ─────────────────────────────────────────────
insert into public.threads (title, slug, type, status) values
  ('Mies van der Rohe', 'mies-van-der-rohe', 'person', 'community'),
  ('Tadao Ando', 'tadao-ando', 'person', 'community'),
  ('Le Corbusier', 'le-corbusier', 'person', 'community'),
  ('Bauhaus', 'bauhaus', 'movement', 'community'),
  ('Modernism', 'modernism', 'movement', 'community'),
  ('Minimalism', 'minimalism', 'movement', 'community'),
  ('Brutalism', 'brutalism', 'movement', 'community'),
  ('Concrete', 'concrete', 'material', 'community'),
  ('Glass', 'glass', 'material', 'community'),
  ('Steel', 'steel', 'material', 'community'),
  ('Light', 'light', 'concept', 'community'),
  ('Less is More', 'less-is-more', 'concept', 'community'),
  ('Void', 'void', 'concept', 'community'),
  ('Silence', 'silence', 'emotion', 'community'),
  ('Sacredness', 'sacredness', 'emotion', 'community'),
  ('Grid', 'grid', 'form', 'community'),
  ('Plane', 'plane', 'form', 'community'),
  ('Barcelona Pavilion', 'barcelona-pavilion', 'work', 'community'),
  ('Church of the Light', 'church-of-the-light', 'work', 'community'),
  ('Japan', 'japan', 'place', 'community')
on conflict (slug) do nothing;

-- ── 2. thread_translations (ko/en) ──────────────────────────────
-- helper: slug → id 는 subselect.
insert into public.thread_translations (thread_id, locale, title, summary)
select id, v.locale::locale_type, v.title, v.summary from public.threads t
join (values
  ('mies-van-der-rohe','ko','미스 반 데어 로에','구조적 명료성과 절제로 “Less is More”의 태도를 보여준 근대 건축가.'),
  ('mies-van-der-rohe','en','Mies van der Rohe','A modern architect of structural clarity and restraint — “Less is More.”'),
  ('tadao-ando','ko','안도 다다오','빛·노출 콘크리트·침묵·여백을 공간 언어로 쓰는 일본 건축가.'),
  ('tadao-ando','en','Tadao Ando','A Japanese architect of light, exposed concrete, silence, and emptiness.'),
  ('le-corbusier','ko','르 코르뷔지에','근대 건축의 원리를 정립한 인물. 콘크리트와 면의 건축.'),
  ('le-corbusier','en','Le Corbusier','A founder of modern architectural principles — concrete and the plane.'),
  ('bauhaus','ko','바우하우스','교육 혁명이자 근대 디자인의 출발점이 된 학교이자 사조.'),
  ('bauhaus','en','Bauhaus','A school and movement at the root of modern design.'),
  ('modernism','ko','모더니즘','기능과 형태의 명료함을 추구한 20세기의 큰 흐름.'),
  ('modernism','en','Modernism','A 20th-century movement pursuing clarity of function and form.'),
  ('minimalism','ko','미니멀리즘','덜어냄으로 본질에 다가가는 미감.'),
  ('minimalism','en','Minimalism','A sensibility reaching the essential by removing.'),
  ('brutalism','ko','브루탈리즘','노출 콘크리트의 거칠고 정직한 조형.'),
  ('brutalism','en','Brutalism','Raw, honest form in exposed concrete.'),
  ('concrete','ko','콘크리트','빛을 받아들이는 거칠고 정직한 물성.'),
  ('concrete','en','Concrete','A raw, honest material that receives light.'),
  ('glass','ko','유리','투명함으로 경계를 지우는 재료.'),
  ('glass','en','Glass','A material that dissolves boundaries through transparency.'),
  ('steel','ko','강철','가늘고 강한 구조의 언어.'),
  ('steel','en','Steel','The language of thin, strong structure.'),
  ('light','ko','빛','공간을 드러내고 침묵을 빚는 근본 재료.'),
  ('light','en','Light','The fundamental material that reveals space and shapes silence.'),
  ('less-is-more','ko','레스 이즈 모어','절제로 본질에 다가가는 태도.'),
  ('less-is-more','en','Less is More','Restraint as a way of reaching the essential.'),
  ('void','ko','보이드','비움이 만드는 공간적 긴장.'),
  ('void','en','Void','Spatial tension made by emptiness.'),
  ('silence','ko','침묵','비움으로 채우는 건축적 정서.'),
  ('silence','en','Silence','An atmosphere that fills by emptying.'),
  ('sacredness','ko','성스러움','빛과 침묵이 만드는 경외의 정서.'),
  ('sacredness','en','Sacredness','Awe shaped by light and silence.'),
  ('grid','ko','그리드','질서를 부여하는 형태 체계.'),
  ('grid','en','Grid','A formal system that imposes order.'),
  ('plane','ko','면','공간을 나누고 정의하는 기본 형태.'),
  ('plane','en','Plane','A basic form that divides and defines space.'),
  ('barcelona-pavilion','ko','바르셀로나 파빌리온','유리·강철·면이 흐르는 미스의 대표작.'),
  ('barcelona-pavilion','en','Barcelona Pavilion','Mies’ work where glass, steel, and planes flow.'),
  ('church-of-the-light','ko','빛의 교회','콘크리트 틈으로 빛이 들어오는 안도의 대표작.'),
  ('church-of-the-light','en','Church of the Light','Ando’s work where light enters through a concrete slit.'),
  ('japan','ko','일본','여백과 자연과의 관계를 중시하는 미감의 땅.'),
  ('japan','en','Japan','A land of emptiness and a relationship with nature.')
) as v(slug, locale, title, summary) on t.slug = v.slug
on conflict (thread_id, locale) do nothing;

-- ── 3. thread_connections (관계) ────────────────────────────────
-- tier 1 = 사실, tier 2 = 해석/태도. (Mies↔Ando 는 직접영향 단정 대신 개념 연결.)
insert into public.thread_connections (from_thread_id, to_thread_id, relation_type, connection_tier, status)
select f.id, tt.id, v.rel, v.tier, 'community' from (values
  ('mies-van-der-rohe','bauhaus','belongs_to',1),
  ('mies-van-der-rohe','modernism','belongs_to',1),
  ('mies-van-der-rohe','barcelona-pavilion','created',1),
  ('mies-van-der-rohe','less-is-more','shares_theme',2),
  ('le-corbusier','modernism','belongs_to',1),
  ('le-corbusier','concrete','related_to',2),
  ('tadao-ando','church-of-the-light','created',1),
  ('tadao-ando','light','related_to',2),
  ('tadao-ando','silence','related_to',2),
  ('tadao-ando','concrete','related_to',2),
  ('tadao-ando','japan','located_in',1),
  ('tadao-ando','minimalism','related_to',2),
  ('tadao-ando','less-is-more','shares_theme',2),
  ('brutalism','concrete','related_to',2),
  ('brutalism','modernism','derived_from',1),
  ('minimalism','less-is-more','shares_theme',2),
  ('modernism','bauhaus','related_to',1),
  ('barcelona-pavilion','glass','related_to',2),
  ('barcelona-pavilion','steel','related_to',2),
  ('church-of-the-light','light','related_to',2),
  ('light','sacredness','related_to',2),
  ('silence','void','related_to',2),
  ('grid','modernism','related_to',2)
) as v(from_slug, to_slug, rel, tier)
join public.threads f on f.slug = v.from_slug
join public.threads tt on tt.slug = v.to_slug
on conflict (from_thread_id, to_thread_id, relation_type) do nothing;

-- ── 4. viewpoints (큐레이터, 예시) ──────────────────────────────
insert into public.viewpoints (thread_id, locale, author_type, title, body)
select t.id, v.locale::locale_type, 'curator'::viewpoint_author, v.title, v.body from public.threads t
join (values
  ('tadao-ando','ko','빛이 먼저다','안도의 공간은 콘크리트가 아니라 빛으로 기억된다.'),
  ('light','en','Light connects','From Kahn to Ando, the shared thread is light.'),
  ('less-is-more','ko','덜어냄의 윤리','절제는 결핍이 아니라 선택이다.')
) as v(slug, locale, title, body) on t.slug = v.slug
on conflict do nothing;
