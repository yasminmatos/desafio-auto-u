import { Trash2 } from "lucide-react";

export function TextInput({ emailText, setEmailText, handleClearText }) {
  return (
    <div className="text-input-container">
      <textarea
        className="text-input"
        placeholder="Cole aqui o conteúdo do email que deseja classificar..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />
      {emailText && (
        <Trash2
          size={18}
          className="clear-icon"
          title="Limpar texto"
          onClick={handleClearText}
        />
      )}
    </div>
  );
}
