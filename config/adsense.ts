/**
 * Google AdSense 설정
 *
 * ⚠️ 중요: 실제 광고 단위 ID로 교체 필요 ⚠️
 *
 * 현재 설정된 ID는 예시용입니다.
 * Google AdSense 대시보드에서 생성한 실제 광고 단위 ID로 교체하세요.
 *
 * 교체 방법:
 * 1. https://www.google.com/adsense/ 접속
 * 2. "광고" → "광고 단위별" → "디스플레이 광고" 클릭
 * 3. 각 배치별로 광고 단위 생성:
 *    - Mobile Top (모바일 상단)
 *    - Mid Content (중간 콘텐츠)
 *    - Bottom Content (하단 콘텐츠)
 * 4. 생성된 광고 단위 ID를 아래 값으로 복사
 */

export const ADSENSE_CONFIG = {
  // AdSense Publisher ID (현재 값은 실제 ID)
  PUBLISHER_ID: 'ca-pub-2919389888186154',

  // 광고 단위 슬롯 ID (실제 ID 적용 완료)
  AD_SLOTS: {
    MOBILE_TOP: '6991508932',      // Mobile Top 광고 단위
    MID_CONTENT: '6561098243',     // Mid Content 광고 단위
    BOTTOM_CONTENT: '5314738837',  // Bottom Content 광고 단위
  }
} as const;

/**
 * 교체 완료 확인 체크리스트:
 * □ Mobile Top 광고 단위 생성 및 ID 복사
 * □ Mid Content 광고 단위 생성 및 ID 복사
 * □ Bottom Content 광고 단위 생성 및 ID 복사
 * □ 배포 후 광고 표시 테스트 완료
 */
