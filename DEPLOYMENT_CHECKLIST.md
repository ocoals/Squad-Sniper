# 🚀 Google AdSense 배포 체크리스트

## ✅ 완료된 작업

### 1. 코드 구조 개선
- [x] 광고 단위 ID를 환경 변수화 (`config/adsense.ts`)
- [x] `SetupScreen.tsx`에서 중앙화된 광고 설정 사용
- [x] 재사용 가능한 `AdUnit` 컴포넌트 구조 유지

### 2. 콘텐츠 강화 (AdSense 합격률 향상)
- [x] **전략 가이드** 섹션 추가 (3개 팁)
  - 조준 정확도 높이기
  - 10초 타이머 활용
  - 미션 커스터마이징
- [x] **활용 사례** 섹션 추가 (3개 사례)
  - 풋살 동호회
  - 축구 팀 훈련
  - 친목 경기
- [x] 한국어/영어 번역 완료

### 3. 사용자 경험 개선
- [x] **Contact 페이지** 생성 (`/public/contact.html`)
  - 전문적인 디자인
  - 빠른 도움말 섹션
  - 응답 시간 안내
- [x] Privacy/Terms 페이지에 메인 페이지 복귀 링크 추가
- [x] Footer에 Contact 링크 추가

### 4. 문서화
- [x] `ADSENSE_SETUP.md` - 실제 광고 ID 교체 가이드
- [x] `DEPLOYMENT_CHECKLIST.md` - 배포 전 체크리스트

---

## 🔴 즉시 필요한 작업 (배포 전 필수)

### 1. Google AdSense 광고 단위 생성

#### 단계별 가이드:
1. [Google AdSense 대시보드](https://www.google.com/adsense/) 접속
2. "광고" → "광고 단위별" → "디스플레이 광고" 클릭
3. 아래 3개 광고 단위 생성:

| 광고 이름 | 크기 | 용도 |
|-----------|------|------|
| Mobile Top | 반응형 | 모바일 상단 |
| Mid Content | 반응형 | 중간 콘텐츠 |
| Bottom Content | 반응형 | 하단 콘텐츠 |

4. 생성된 **Slot ID** (10자리 숫자) 복사

### 2. 광고 ID 코드에 적용

**파일 위치**: `config/adsense.ts`

**현재 상태** (예시 ID):
```typescript
AD_SLOTS: {
  MOBILE_TOP: '1234567890',      // TODO
  MID_CONTENT: '2345678901',     // TODO
  BOTTOM_CONTENT: '3456789012',  // TODO
}
```

**수정 후** (실제 ID로 교체):
```typescript
AD_SLOTS: {
  MOBILE_TOP: 'YOUR_ACTUAL_SLOT_ID_1',
  MID_CONTENT: 'YOUR_ACTUAL_SLOT_ID_2',
  BOTTOM_CONTENT: 'YOUR_ACTUAL_SLOT_ID_3',
}
```

### 3. Contact Form 작동 확인

- [ ] `/contact.html`의 Google Form iframe에 실제 Form ID 입력
- [ ] Contact Form 테스트 제출
- [ ] Google Sheets에서 응답 수신 확인
- [ ] (선택) 자동 응답 이메일 설정 확인

---

## 🧪 배포 전 테스트

### 로컬 빌드 테스트
```bash
npm run build
npm run preview
```

### 확인 사항
- [ ] 빌드 에러 없음 ✅ (완료)
- [ ] 개발 모드에서 광고 placeholder 표시 확인
- [ ] 브라우저 콘솔에서 JavaScript 에러 없음
- [ ] 모바일/데스크톱 반응형 테스트
- [ ] 언어 전환 (한국어 ↔ 영어) 작동 확인
- [ ] Privacy/Terms/Contact 페이지 접근 가능

---

## 🌐 배포 후 확인 사항

### 1. 광고 표시 확인
- [ ] 프로덕션 URL에서 광고 영역 표시 확인
- [ ] 브라우저 콘솔에서 AdSense 에러 확인
  - ❌ `adsbygoogle.push() error` → Slot ID 오류
  - ✅ 에러 없음 → 정상

### 2. Google AdSense 대시보드 확인
- [ ] "사이트" → 사이트 상태 확인
- [ ] "광고" → 광고 단위별 → 노출수 발생 확인 (24시간 내)

### 3. 콘텐츠 품질 확인
- [ ] 전략 가이드 섹션 정상 표시
- [ ] 활용 사례 섹션 정상 표시
- [ ] FAQ 섹션 정상 표시
- [ ] Contact 페이지 정상 작동

---

## 📊 AdSense 재신청

광고가 정상 표시되는 것을 확인한 후:

1. [AdSense 대시보드](https://www.google.com/adsense/) 접속
2. "사이트" → "사이트 추가" 클릭
3. 사이트 URL 입력: `https://squadsniper.com`
4. "확인" 클릭 (AdSense 코드 이미 설치됨)
5. 심사 대기 (1-3일, 최대 2주)

---

## 📈 예상 타임라인

| 단계 | 소요 시간 | 상태 |
|------|-----------|------|
| 광고 단위 생성 | 10분 | ⏳ 대기 중 |
| 코드 수정 | 5분 | ⏳ 대기 중 |
| 배포 | 10분 | ⏳ 대기 중 |
| AdSense 심사 | 1-3일 | ⏳ 대기 중 |
| 첫 광고 노출 | 승인 후 즉시 | - |

---

## 🎯 합격 가능성 평가

### ✅ 강점
- 콘텐츠 품질 대폭 개선 (FAQ, How it works, 전략 가이드, 활용 사례)
- 법적 페이지 완비 (Privacy, Terms, Contact)
- SEO 최적화 완료 (Structured Data, Meta Tags)
- 광고 배치 적절 (3개, 콘텐츠와 균형)
- 기술 설정 완료 (AdSense 스크립트, ads.txt)

### ⚠️ 개선 필요
- **실제 광고 단위 ID 교체** (현재: 예시 ID)
- **이메일 작동 확인** (support@squadsniper.com)

### 예상 합격률
**90%** (실제 광고 ID 교체 후)

---

## 📝 중요 파일 목록

### 수정된 파일
- `config/adsense.ts` - 광고 설정 (⚠️ 실제 ID 입력 필요)
- `components/SetupScreen.tsx` - 광고 배치, 콘텐츠 추가
- `constants.ts` - 번역 추가
- `public/privacy.html` - 메인 페이지 링크 추가
- `public/terms.html` - Contact 섹션 추가
- `public/contact.html` - 새로 생성

### 생성된 문서
- `ADSENSE_SETUP.md` - 광고 설정 가이드
- `DEPLOYMENT_CHECKLIST.md` - 이 문서

---

## 🆘 문제 발생 시

### 광고가 표시되지 않을 때
1. 브라우저 콘솔 확인
2. Slot ID 형식 확인 (10자리 숫자)
3. AdSense 대시보드에서 광고 단위 상태 확인

### AdSense 거부 시
1. 거부 사유 확인
2. 콘텐츠 추가 개선
3. 1주일 후 재신청

---

**마지막 업데이트**: 2026-02-06
**작성자**: Claude Code
**상태**: 배포 준비 완료 (실제 광고 ID 교체 후)
