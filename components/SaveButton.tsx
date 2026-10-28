"use client";
import { useState } from "react";

export default function SaveButton({ onSave }: { onSave: () => void | Promise<void> }) {
  const [show, setShow] = useState(false);

  const handleClick = async () => {
    await onSave();
    setShow(true);
    setTimeout(() => setShow(false), 1200);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button className="btn-tap" onClick={handleClick}>
        Salva mazzo
      </button>
      <span className={`save-counter ${show ? "is-visible" : ""}`}>+1/+1</span>
    </div>
  );
}
