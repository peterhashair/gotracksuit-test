import { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onSuccess?: () => void;
};

export const AddInsight = ({ onSuccess, ...props }: AddInsightProps) => {
  const [brandId, setBrandId] = useState(BRANDS[0].id);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Insight text is required");
      return;
    }
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, text }),
      });
      if (!res.ok) {
        setError("Failed to add insight");
        return;
      }
      props.onClose();
      onSuccess?.();
    } catch {
      setError("Failed to add insight");
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form
        className={styles.form}
        onSubmit={addInsight}
        aria-label="Add insight"
      >
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            value={brandId}
            onChange={(e) => setBrandId(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
