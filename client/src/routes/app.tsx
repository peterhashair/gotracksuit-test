import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import { Insight } from "../schemas/insight.ts";

export const App = () => {
    const [insights, setInsights] = useState<Insight[]>([]);

    const fetchInsights = () => {
        fetch(`/api/insights`)
            .then((res) => res.json())
            .then((data: unknown[]) => data.map((item) => Insight.parse(item)))
            .then(setInsights);
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    return (
        <main className={styles.main}>
            <Header onInsightAdded={fetchInsights} />
            <Insights
                className={styles.insights}
                insights={insights}
                onInsightDeleted={fetchInsights}
            />
        </main>
    );
};