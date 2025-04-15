import React, { useState } from "react";
import WindowsStylePopup from "./WindowsStylePopup";

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isModal, setIsModal] = useState(true);
  const [params, setParams] = useState(null); // 파라미터 상태 추가
  const [onConfirmCallback, setOnConfirmCallback] = useState(null); // 콜백 함수 상태 추가

  const openPopup = (title, content, params = null, isModal = true, onConfirm = null) => {
    setTitle(title);
    setContent(content);
    setParams(params); // 파라미터 설정
    setIsModal(isModal);
    setOnConfirmCallback(() => onConfirm); // 콜백 함수 설정
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setTitle(null);
    setContent(null);
    setParams(null);
    setOnConfirmCallback(null);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback(params||{result:'Y'}); // 콜백 함수 실행
    }
    closePopup();
  };

  const PopupComponent = () => (
    <WindowsStylePopup
      isOpen={isOpen}
      onClose={closePopup}
      onConfirm={handleConfirm}
      title={title}
      isModal={isModal}
    >
      {content}
    </WindowsStylePopup>
  );

  return { openPopup, closePopup, PopupComponent };
};

export default usePopup;
