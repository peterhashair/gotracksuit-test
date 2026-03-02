import { useEffect } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import { useInsights } from "../hooks/use-insights.ts";

export const App = () => {
  const { insights, error, fetchInsights } = useInsights();

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <main className={styles.main}>
      <Header onInsightAdded={fetchInsights} />
      {error && <p className={styles.error}>{error}</p>}
      <Insights
        className={styles.insights}
        insights={insights}
        onInsightDeleted={fetchInsights}
      />
    </main>
  );
};
