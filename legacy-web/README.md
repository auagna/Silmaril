# legacy-web — 아카이브된 Next.js 웹 MVP

> **이 폴더는 보존용 아카이브다.** 현재 본진은 레포 루트의 **Expo React Native** 앱이다 (D-014).

## 무엇인가
Silmaril 초기 웹 MVP (Next.js App Router + Supabase). 인증 / Create Thread / 더미 UI 까지 구현됐고 빌드 정상이었다.
문서·Supabase 스키마·UX 리서치를 검증한 디딤돌이며, 인증·Create Thread 로직은 RN 포팅 시 참고용.

## 왜 남겨두나
- 작업물 보존 (git 히스토리 + 동작하던 코드).
- `authService` / `threadService` 등 Supabase 호출 패턴은 RN 서비스로 옮길 때 참고.

## 실행 (필요 시)
```bash
cd legacy-web
npm install   # (node_modules 가 함께 옮겨졌다면 생략 가능)
cp ../.env.local .env.local   # NEXT_PUBLIC_* 키 필요
npm run dev
```

## 주의
- 새 개발은 여기서 하지 않는다. 루트 Expo 앱에서 한다.
- 스택 무관 자산(docs/, supabase/, 루트 MD)은 루트에 그대로 있다.
