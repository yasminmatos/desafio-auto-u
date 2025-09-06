import { FileText, Upload } from "lucide-react";

export function UploadTabs({ activeTab, onTabSwitch }) {
  return (
    <div className="upload-tabs">
      <button
        className={`tab-button ${activeTab === "text" ? "active" : ""}`}
        onClick={() => onTabSwitch("text")}
      >
        <FileText size={18} /> Texto
      </button>
      <button
        className={`tab-button ${activeTab === "file" ? "active" : ""}`}
        onClick={() => onTabSwitch("file")}
      >
        <Upload size={18} /> Upload de ficheiro
      </button>
    </div>
  );
}
