import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import styles from "../styles/Modal.module.css";

function Modal({
  show,
  onClose,
  text,
  showConfirm,
  isElem,
  removeHandler,
  removeCommentHandler,
}) {
  const [isBrowser, setIsBrowser] = useState(false);
  const buttonVal = showConfirm ? "Cancel" : "OK";
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const deleter = () => {
    if (isElem) {
      removeHandler(showConfirm);
    } else {
      removeCommentHandler(showConfirm);
    }
    onClose();
  };
  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>{text}</div>
        <div className={styles.modalButtonsDiv}>
          <a href="#" onClick={handleClose}>
            <button className={styles.modalButtonClose}>{buttonVal}</button>
          </a>
          {showConfirm ? (
            <a href="#" onClick={deleter}>
              <button className={styles.modalButtonConfirm}>Confirm</button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-div")
    );
  }

  return null;
}

export default Modal;
