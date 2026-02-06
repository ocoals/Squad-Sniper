# Google AdSense 설정 가이드

## ⚠️ 즉시 조치 필요

현재 코드는 **예시 광고 단위 ID**를 사용하고 있습니다. Google AdSense 승인을 받으려면 실제 광고 단위를 생성하고 ID를 교체해야 합니다.

---

## 1단계: Google AdSense 광고 단위 생성

### 1.1 AdSense 대시보드 접속
1. [Google AdSense](https://www.google.com/adsense/) 로그인
2. 왼쪽 메뉴에서 **"광고"** 클릭
3. **"광고 단위별"** 탭 선택
4. **"디스플레이 광고"** 클릭

### 1.2 광고 단위 생성 (3개 필요)

각 광고 위치별로 다음 설정으로 생성하세요:

#### 📱 Mobile Top (모바일 상단)
- **이름**: `Mobile Top`
- **광고 크기**: 반응형 (Responsive)
- **광고 유형**: 디스플레이 광고

#### 📄 Mid Content (중간 콘텐츠)
- **이름**: `Mid Content`
- **광고 크기**: 반응형 (Responsive)
- **광고 유형**: 디스플레이 광고

#### 📊 Bottom Content (하단 콘텐츠)
- **이름**: `Bottom Content`
- **광고 크기**: 반응형 (Responsive)
- **광고 유형**: 디스플레이 광고

### 1.3 광고 단위 ID 복사

생성 후 각 광고 단위의 **슬롯 ID** (10자리 숫자)를 복사합니다.

예시:
```
Mobile Top     → 1234567890
Mid Content    → 9876543210
Bottom Content → 5555666677
```

---

## 2단계: 코드에 실제 ID 적용

### 파일 위치
`config/adsense.ts` 파일을 엽니다.

### 수정 전
```typescript
export const ADSENSE_CONFIG = {
  PUBLISHER_ID: 'ca-pub-2919389888186154',

  AD_SLOTS: {
    MOBILE_TOP: '1234567890',      // TODO: 실제 광고 단위 ID로 교체
    MID_CONTENT: '2345678901',     // TODO: 실제 광고 단위 ID로 교체
    BOTTOM_CONTENT: '3456789012',  // TODO: 실제 광고 단위 ID로 교체
  }
}
```

### 수정 후 (예시)
```typescript
export const ADSENSE_CONFIG = {
  PUBLISHER_ID: 'ca-pub-2919389888186154',

  AD_SLOTS: {
    MOBILE_TOP: '1234567890',      // AdSense에서 생성한 실제 ID
    MID_CONTENT: '9876543210',     // AdSense에서 생성한 실제 ID
    BOTTOM_CONTENT: '5555666677',  // AdSense에서 생성한 실제 ID
  }
}
```

---

## 3단계: 배포 및 테스트

### 3.1 빌드 및 배포
```bash
npm run build
npm run preview  # 로컬 테스트
```

### 3.2 광고 표시 확인

#### 개발 모드 (localhost)
- 노란색 테두리의 placeholder가 표시됩니다
- "Slot ID: [실제 ID]" 확인

#### 프로덕션 모드 (배포 후)
- 실제 광고 또는 빈 공간이 표시되어야 합니다
- 브라우저 콘솔에서 에러 확인:
  - ❌ `adsbygoogle.push() error` → Slot ID 오류
  - ✅ 에러 없음 → 정상 작동

### 3.3 AdSense 대시보드 확인
1. "광고" → "광고 단위별" 메뉴
2. 각 광고 단위의 노출수/수익 발생 확인
3. 보통 24시간 내에 첫 노출 데이터가 나타남

---

## 4단계: AdSense 재신청

광고가 정상적으로 표시되는 것을 확인한 후:

1. [AdSense 대시보드](https://www.google.com/adsense/) 접속
2. "사이트" → "사이트 추가" (또는 재신청)
3. 사이트 URL 입력: `https://squadsniper.com`
4. AdSense 코드가 이미 설치되어 있으므로 "확인" 클릭
5. 심사 대기 (보통 1-3일, 최대 2주)

---

## 체크리스트

배포 전에 다음 항목을 확인하세요:

### 필수 확인 사항
- [ ] Google AdSense에서 3개 광고 단위 생성 완료
- [ ] `config/adsense.ts`에 실제 Slot ID 입력 완료
- [ ] 로컬 빌드 테스트 완료 (`npm run build`)
- [ ] 브라우저 콘솔에서 AdSense 에러 없음 확인
- [ ] `public/ads.txt` 파일 존재 확인
- [ ] `index.html`에 AdSense 스크립트 로드 확인

### 권장 확인 사항
- [ ] Contact 이메일(support@squadsniper.com) 작동 확인
- [ ] Privacy/Terms 페이지 접근 가능 확인
- [ ] 모바일/데스크톱 반응형 광고 표시 테스트
- [ ] Google Search Console에 사이트맵 제출

---

## 문제 해결

### 광고가 표시되지 않을 때

1. **콘솔 에러 확인**
   ```
   "adsbygoogle.push() error: All ins elements in the DOM with class=adsbygoogle already have ads in them."
   ```
   → 중복 광고 호출. 페이지 새로고침 후 재확인

2. **빈 공간만 표시될 때**
   - 정상입니다. AdSense 승인 전에는 광고가 표시되지 않을 수 있음
   - 승인 후에도 광고 인벤토리 부족 시 빈 공간 표시 가능

3. **Slot ID 형식 오류**
   - Slot ID는 10자리 숫자여야 함
   - 앞뒤 공백 제거 확인

---

## 예상 타임라인

| 단계 | 소요 시간 |
|------|-----------|
| 광고 단위 생성 | 10분 |
| 코드 수정 및 배포 | 20분 |
| AdSense 심사 | 1-3일 (최대 2주) |
| 첫 광고 노출 | 승인 후 즉시 |
| 첫 수익 발생 | 승인 후 며칠 내 |

---

## 참고 자료

- [Google AdSense 고객센터](https://support.google.com/adsense)
- [AdSense 광고 코드 가이드](https://support.google.com/adsense/answer/9274019)
- [AdSense 정책 센터](https://support.google.com/adsense/answer/48182)

---

## 도움이 필요하신가요?

문제가 발생하면 다음으로 연락하세요:
- [Contact Form](https://squadsniper.com/contact.html)을 통해 문의
- 또는 이 저장소에 Issue 생성

---

**마지막 업데이트**: 2026-02-06
