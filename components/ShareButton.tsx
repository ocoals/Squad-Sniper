import React, { useState, RefObject } from 'react';
import { Share2, X, Image as ImageIcon, Download } from 'lucide-react';
import { Player } from '../types';
import { Language, getTranslation } from '../constants';
import {
  isWebShareSupported,
  shareViaWebAPI,
  shareViaTwitter,
  shareViaFacebook,
  shareViaInstagram,
  copyToClipboard,
  copyLink,
  generateShareText,
  shareAsImage,
  downloadAsImage,
} from '../utils/share';

interface ShareButtonProps {
  assignedPlayers: Player[];
  language: Language;
  resultElementRef?: RefObject<HTMLElement>;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  assignedPlayers,
  language,
  resultElementRef,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const t = getTranslation(language).share;

  // 토스트 메시지 표시
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 메인 공유 버튼 핸들러
  const handleShare = async () => {
    // Web Share API 지원 브라우저: 즉시 네이티브 공유
    if (isWebShareSupported()) {
      const success = await shareViaWebAPI(assignedPlayers, language);
      if (!success) {
        // 사용자가 취소했거나 에러 발생 → 모달 표시
        setShowModal(true);
      }
    } else {
      // Web Share API 미지원 → 모달 표시
      setShowModal(true);
    }
  };

  // 텍스트 복사
  const handleCopyText = async () => {
    const shareText = generateShareText(assignedPlayers, language, 'full');
    const success = await copyToClipboard(shareText);
    showToast(success ? t.copied : t.copyFailed);
  };

  // 링크 복사
  const handleCopyLink = async () => {
    const success = await copyLink();
    showToast(success ? t.copied : t.copyFailed);
  };

  // Twitter 공유
  const handleTwitter = () => {
    shareViaTwitter(assignedPlayers, language);
    setShowModal(false);
  };

  // Facebook 공유
  const handleFacebook = () => {
    shareViaFacebook();
    setShowModal(false);
  };

  // Instagram 공유
  const handleInstagram = async () => {
    const result = await shareViaInstagram(assignedPlayers, language);
    showToast(result.message);
    setShowModal(false);
  };

  // 이미지로 공유
  const handleShareImage = async () => {
    if (!resultElementRef?.current) {
      showToast(language === 'ko' ? '공유할 수 없습니다.' : 'Cannot share.');
      return;
    }

    setIsCapturing(true);
    const result = await shareAsImage(resultElementRef.current, language);
    setIsCapturing(false);
    showToast(result.message);
    if (result.success) {
      setShowModal(false);
    }
  };

  // 이미지 다운로드
  const handleDownloadImage = async () => {
    if (!resultElementRef?.current) {
      showToast(language === 'ko' ? '다운로드할 수 없습니다.' : 'Cannot download.');
      return;
    }

    setIsCapturing(true);
    const result = await downloadAsImage(resultElementRef.current, language);
    setIsCapturing(false);
    showToast(result.message);
    if (result.success) {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* 공유 버튼 */}
      <button
        onClick={handleShare}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
      >
        <Share2 size={20} />
        {t.button}
      </button>

      {/* 공유 옵션 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* 제목 */}
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {t.title}
            </h2>

            {/* 공유 옵션 그리드 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* 카카오톡 (텍스트 복사) */}
              <button
                onClick={handleCopyText}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-2xl">💬</span>
                <span className="text-sm">{t.kakao}</span>
              </button>

              {/* Instagram */}
              <button
                onClick={handleInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-2xl">📷</span>
                <span className="text-sm">{t.instagram}</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={handleTwitter}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🐦</span>
                <span className="text-sm">{t.twitter}</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-2xl">👍</span>
                <span className="text-sm">{t.facebook}</span>
              </button>
            </div>

            {/* 이미지 공유/다운로드 */}
            {resultElementRef && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleShareImage}
                  disabled={isCapturing}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ImageIcon size={20} />
                  <span className="text-sm">{isCapturing ? (language === 'ko' ? '처리 중...' : 'Processing...') : (t.shareImage || (language === 'ko' ? '이미지 공유' : 'Share Image'))}</span>
                </button>
                <button
                  onClick={handleDownloadImage}
                  disabled={isCapturing}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span className="text-sm">{isCapturing ? (language === 'ko' ? '처리 중...' : 'Processing...') : (t.downloadImage || (language === 'ko' ? '이미지 저장' : 'Save Image'))}</span>
                </button>
              </div>
            )}

            {/* 텍스트/링크 복사 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleCopyText}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                📋 {t.copyText}
              </button>
              <button
                onClick={handleCopyLink}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                🔗 {t.copyLink}
              </button>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </>
  );
};
