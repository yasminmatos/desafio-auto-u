import { AlertCircle } from "lucide-react";

export function ErrorMessage({ error }) {
  return (
    <div className="error-message">
      <AlertCircle size={20} />
      {error}
    </div>
  );
}
