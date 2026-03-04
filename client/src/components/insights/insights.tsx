import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BRANDS } from "../../lib/consts.ts";
import { Modal } from "../modal/modal.tsx";
import { Button } from "../button/button.tsx";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onInsightDeleted?: () => void;
};

export const Insights = (
  { insights, className, onInsightDeleted }: InsightsProps,
) => {
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const deleteInsight = async () => {
    if (pendingDeleteId === null) return;
    try {
      const res = await fetch(`/api/insights/${pendingDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Failed to delete insight");
        return;
      }
      setPendingDeleteId(null);
      onInsightDeleted?.();
    } catch {
      setError("Failed to delete insight");
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>
                    {BRANDS.find((b) =>
                      b.id === brandId
                    )?.name}
                  </span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{createdAt.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => setPendingDeleteId(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
      <Modal
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
      >
        <Modal.CloseIcon />
        <Modal.Title>Delete insight?</Modal.Title>
        <Modal.Content>This action cannot be undone.</Modal.Content>
        <Modal.Footer>
          <Button label="Cancel" onClick={() => setPendingDeleteId(null)} />
          <Button label="Delete" onClick={deleteInsight} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};
