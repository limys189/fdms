import React from "react";

const Popup = ({ isOpen, onClose, children, onConfirm, isModal = true }) => {
  if (!isOpen) return null;

  const popupStyle = {
    position: isModal ? "fixed" : "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <>
      {isModal && <div style={overlayStyle} onClick={onClose} />}
      <div style={popupStyle}>
        {children}
        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose}>닫기</button>
          <button onClick={onConfirm} style={{ marginLeft: "10px" }}>
            확인
          </button>
        </div>
      </div>
    </>
  );
};

export default Popup;
