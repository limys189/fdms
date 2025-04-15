import React, { useState } from "react";
//import ReactDOM from "react-dom"; // ReactDOM 명시적 import 추가
import { createRoot } from 'react-dom/client';
import WindowsStylePopup from "./WindowsStylePopup";

/**
 * Windows 스타일 Confirm 팝업 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 표시할 메시지
 * @param {function} props.onConfirm - 확인 시 실행할 함수
 * @param {function} props.onCancel - 취소 시 실행할 함수
 * @param {string} props.confirmText - 확인 버튼 텍스트 (기본값: "확인")
 * @param {string} props.cancelText - 취소 버튼 텍스트 (기본값: "취소")
 * @param {string} props.title - 팝업 제목 (기본값: "확인")
 */
const WindowsConfirm = ({
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  title = "확인",
  type = "info" // 'info', 'warning', 'error', 'success'
}) => {
  // 타입별 아이콘 및 색상 설정
  const iconConfig = {
    info: { icon: "ℹ", color: "#0078d7" },
    warning: { icon: "⚠", color: "#ffb900" },
    error: { icon: "⛔", color: "#d83b01" },
    success: { icon: "✓", color: "#107c10" }
  };

  const { icon, color } = iconConfig[type];
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <WindowsStylePopup
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: '1400' }}>
        <div style={{ fontSize: "24px", color }}>{icon}</div>
        <div style={{ fontSize: "14px" }}>{message}</div>
      </div>
    </WindowsStylePopup>
  );
};

// confirm 함수로 쉽게 사용할 수 있도록 래핑
export const confirmX = (options) => {
  return new Promise((resolve) => {
    const {
      message,
      title = "확인",
      confirmText = "확인",
      cancelText = "취소"
    } = options;

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleConfirm = () => {
      resolve(true);
      destroy();
    };

    const handleCancel = () => {
      resolve(false);
      destroy();
    };

    const destroy = () => {
      if (container) {
//        ReactDOM.unmountComponentAtNode(container);
        root.unmount();
        container.remove();
      }
    };

//    ReactDOM.render(
    root.render(
      <WindowsConfirm
        message={message}
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />,
      container
    );
  });
};

export default WindowsConfirm;
