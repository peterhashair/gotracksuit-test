import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
    insights: Insight[];
    className?: string;
    onInsightDeleted?: () => void;
};

export const Insights = (
    { insights, className, onInsightDeleted }: InsightsProps,
) => {
    const deleteInsight = (id: number) => {
        fetch(`/api/insights/${id}`, { method: "DELETE" }).then(() => {
            onInsightDeleted?.();
        });
    };

    return (
        <div className={cx(className)}>
            <h1 className={styles.heading}>Insights</h1>
            <div className={styles.list}>
                {insights?.length
                    ? (
                        insights.map(({ id, text, createdAt, brandId }) => (
                            <div className={styles.insight} key={id}>
                                <div className={styles["insight-meta"]}>
                                    <span>{brandId}</span>
                                    <div className={styles["insight-meta-details"]}>
                                        <span>{createdAt.toString()}</span>
                                        <Trash2Icon
                                            className={styles["insight-delete"]}
                                            onClick={() =>
                                                deleteInsight(id)}
                                        />
                                    </div>
                                </div>
                                <p className={styles["insight-content"]}>{text}</p>
                            </div>
                        ))
                    )
                    : <p>We have no insight!</p>}
            </div>
        </div>
    );
};