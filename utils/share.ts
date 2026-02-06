import { Player } from '../types';
import { Language, ROLE_MISSIONS } from '../constants';
import html2canvas from 'html2canvas';

/**
 * Web Share API 지원 여부 확인
 */
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * 공유 텍스트 생성
 * @param assignedPlayers 배정된 선수 목록
 * @param language 언어 ('ko' | 'en')
 * @param format 포맷 ('full' | 'short')
 */
export const generateShareText = (
  assignedPlayers: Player[],
  language: Language,
  format: 'full' | 'short' = 'full'
): string => {
  const isKorean = language === 'ko';

  // 헤더
  const header = isKorean
    ? '⚽ SQUAD SNIPER 결과 ⚽\n\n우리 팀 드래프트 완료! 🎯\n'
    : '⚽ SQUAD SNIPER Results ⚽\n\nTeam Draft Complete! 🎯\n';

  // 주요 포지션 (ST, GK, CM, CAM, LW, RW 우선)
  const priorityRoles = ['ST', 'GK', 'CM', 'CAM', 'LW', 'RW'];
  const topPlayers = assignedPlayers
    .filter(p => priorityRoles.includes(p.shortRole || ''))
    .slice(0, 3);

  // 상위 3개 포지션이 없으면 앞에서 3개 선택
  const displayPlayers = topPlayers.length >= 3
    ? topPlayers
    : assignedPlayers.slice(0, 3);

  // 포지션 목록
  const positionsTitle = isKorean ? '\n🔥 주요 포지션\n' : '\n🔥 Key Positions\n';
  const positionsList = displayPlayers
    .map(player => {
      const role = player.shortRole || player.role;
      const mission = player.customMission || ROLE_MISSIONS[role]?.[language] || '';
      return `${role}: ${player.name} - ${mission}`;
    })
    .join('\n');

  // 총 선수 수
  const totalText = isKorean
    ? `\n\n총 ${assignedPlayers.length}명의 선수 배정됨!`
    : `\n\n${assignedPlayers.length} players assigned!`;

  // CTA
  const cta = isKorean
    ? '\n\n당신의 팀도 공정하게 포지션 배정해보세요!\n👉 https://squadsniper.win'
    : '\n\nDraft your team fairly with SQUAD SNIPER!\n👉 https://squadsniper.win';

  // 해시태그
  const hashtags = isKorean
    ? '\n\n#SQUADSNIPER #축구 #풋살 #포지션배정 #드래프트'
    : '\n\n#SQUADSNIPER #Football #Futsal #TeamDraft #Soccer';

  if (format === 'short') {
    // Short 포맷 (Instagram 스토리용)
    return `${header}${positionsList}${totalText}${cta}`;
  }

  // Full 포맷
  return `${header}${positionsTitle}${positionsList}${totalText}${cta}${hashtags}`;
};

/**
 * Web Share API로 공유
 */
export const shareViaWebAPI = async (
  assignedPlayers: Player[],
  language: Language
): Promise<boolean> => {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    const shareText = generateShareText(assignedPlayers, language, 'full');
    await navigator.share({
      title: 'SQUAD SNIPER',
      text: shareText,
      url: 'https://squadsniper.win',
    });
    return true;
  } catch (error) {
    // 사용자가 공유를 취소한 경우 (AbortError)
    if ((error as Error).name === 'AbortError') {
      return false;
    }
    console.error('Web Share API error:', error);
    return false;
  }
};

/**
 * Twitter/X 공유
 */
export const shareViaTwitter = (
  assignedPlayers: Player[],
  language: Language
): void => {
  const shareText = generateShareText(assignedPlayers, language, 'full');
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Facebook 공유
 */
export const shareViaFacebook = (): void => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://squadsniper.win')}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Instagram 공유 (텍스트 복사 + 안내)
 */
export const shareViaInstagram = async (
  assignedPlayers: Player[],
  language: Language
): Promise<{ success: boolean; message: string }> => {
  const shareText = generateShareText(assignedPlayers, language, 'short');
  const copied = await copyToClipboard(shareText);

  const message = language === 'ko'
    ? copied
      ? '텍스트가 복사되었습니다! Instagram 앱에서 스토리에 공유하거나 캡션으로 사용하세요.'
      : '복사에 실패했습니다. 다시 시도해주세요.'
    : copied
      ? 'Text copied! Share to Instagram Story or use as caption.'
      : 'Copy failed. Please try again.';

  return { success: copied, message };
};

/**
 * 클립보드에 복사 (폴백 포함)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // 모던 Clipboard API 시도
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API error:', error);
      // 폴백으로 진행
    }
  }

  // 폴백: execCommand 사용 (구형 브라우저 지원)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (error) {
    console.error('Fallback copy error:', error);
    return false;
  }
};

/**
 * 링크 복사
 */
export const copyLink = async (): Promise<boolean> => {
  return copyToClipboard('https://squadsniper.win');
};

/**
 * DOM 요소를 이미지로 캡처
 * @param element 캡처할 DOM 요소
 * @param language 언어 (워터마크용)
 */
export const captureElementAsImage = async (
  element: HTMLElement,
  language: Language
): Promise<Blob | null> => {
  try {
    // html2canvas로 DOM을 캔버스로 변환
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2, // 고해상도
      logging: false,
      useCORS: true,
    });

    // 워터마크 추가
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const watermarkText = 'squadsniper.win';
      const fontSize = Math.max(16, canvas.width / 40);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'center';
      ctx.fillText(watermarkText, canvas.width / 2, canvas.height - fontSize * 1.5);
    }

    // 캔버스를 Blob으로 변환
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Image capture error:', error);
    return null;
  }
};

/**
 * 이미지로 공유 (Web Share API)
 */
export const shareAsImage = async (
  element: HTMLElement,
  language: Language
): Promise<{ success: boolean; message: string }> => {
  const blob = await captureElementAsImage(element, language);

  if (!blob) {
    const message = language === 'ko'
      ? '이미지 생성에 실패했습니다.'
      : 'Failed to generate image.';
    return { success: false, message };
  }

  // Web Share API 지원 확인
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'squad-sniper-result.png', { type: 'image/png' });
    const shareData = {
      files: [file],
      title: 'SQUAD SNIPER',
      text: language === 'ko' ? '우리 팀 드래프트 결과!' : 'Our Team Draft Results!',
    };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return {
          success: true,
          message: language === 'ko' ? '공유됨! ✓' : 'Shared! ✓',
        };
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return {
            success: false,
            message: language === 'ko' ? '공유가 취소되었습니다.' : 'Share cancelled.',
          };
        }
        console.error('Share error:', error);
      }
    }
  }

  // 폴백: 이미지 다운로드
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'squad-sniper-result.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    message: language === 'ko' ? '이미지가 다운로드되었습니다! ✓' : 'Image downloaded! ✓',
  };
};

/**
 * 이미지 다운로드
 */
export const downloadAsImage = async (
  element: HTMLElement,
  language: Language
): Promise<{ success: boolean; message: string }> => {
  const blob = await captureElementAsImage(element, language);

  if (!blob) {
    const message = language === 'ko'
      ? '이미지 생성에 실패했습니다.'
      : 'Failed to generate image.';
    return { success: false, message };
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'squad-sniper-result.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    message: language === 'ko' ? '이미지가 다운로드되었습니다! ✓' : 'Image downloaded! ✓',
  };
};
