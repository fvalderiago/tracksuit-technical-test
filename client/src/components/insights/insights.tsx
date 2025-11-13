import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { useEffect, useState } from "react";
import { AddInsight } from "../add-insight/add-insight";

type InsightsProps = {
  className?: string;
};

export const Insights = ({ className }: InsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all insights
  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Delete with confirmation
  const deleteInsight = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this insight?",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/insights/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete insight");
      setInsights((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting insight");
    }
  };

  return (
    <div className={cx(className)}>
      <AddInsight
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchInsights}
      />

      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights.length
          ? (
            insights.map(({ id, text, date, brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>Brand #{brandId}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{new Date(date).toLocaleString()}</span>
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
