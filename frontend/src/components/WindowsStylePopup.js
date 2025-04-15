import React from "react";
import PropTypes from "prop-types";

const WindowsStylePopup = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isModal = true,
  confirmText = "확인",
  cancelText = "취소"
}) => {
  if (!isOpen) return null;

  return (
    <>
      {isModal && (
        <div
          style={styles.overlay}
          onClick={onClose}
        />
      )}
      <div style={styles.window}>
        {/* Title Bar */}
        <div style={styles.titleBar}>
          <span style={styles.titleText}>{title}</span>
          <button
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          {children}
        </div>

        {/* Action Buttons */}
        <div style={styles.footer}>
          <button
            style={styles.confirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            style={styles.cancelButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </>
  );
};

// Windows 스타일 디자인 시스템
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)",
    zIndex: 1400,    /* MUI Modal 기본 z-index는 1300이므로 더 높은 값 지정 */
  },
  window: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    boxShadow: `
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(0, 0, 0, 0.1)
    `,
    zIndex: 1500,    /* MUI Modal 기본 z-index는 1300, overlay z-index는 1400 이므로 더 높은 값 지정 */
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    overflow: "hidden",
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#0078d7",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    userSelect: "none",
    cursor: "default",
  },
  titleText: {
    paddingLeft: "4px",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 8px",
    borderRadius: "2px",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
  content: {
    padding: "20px",
    minHeight: "80px",
    backgroundColor: "white",
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "12px",
    backgroundColor: "#f0f0f0",
    borderTop: "1px solid #ddd",
    gap: "8px",
  },
  confirmButton: {
    padding: "6px 16px",
    backgroundColor: "#0078d7",
    color: "white",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "13px",
    ":hover": {
      backgroundColor: "#106ebe",
    },
  },
  cancelButton: {
    padding: "6px 16px",
    backgroundColor: "#e5e5e5",
    color: "#333",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "13px",
    ":hover": {
      backgroundColor: "#d5d5d5",
    },
  },
};

WindowsStylePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  isModal: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default WindowsStylePopup;
