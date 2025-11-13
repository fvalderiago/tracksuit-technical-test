import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onAdded?: () => void;
};

export const AddInsight = ({ onAdded, ...props }: AddInsightProps) => {
  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const select = form.querySelector("select") as HTMLSelectElement;
    const textarea = form.querySelector("textarea") as HTMLTextAreaElement;

    const brandId = Number(select.value);
    const text = textarea.value.trim();

    if (!brandId || !text) {
      alert("Please select a brand and enter some text.");
      return;
    }

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, text }),
      });

      if (!res.ok) throw new Error(`Failed to add insight (${res.status})`);

      window.location.reload();
    } catch (error) {
      alert("Failed to add insight");
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select className={styles["field-input"]}>
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
