import { Cpu, BrainCircuit } from "lucide-react";

export function ModelSelector({ analysisModel, setAnalysisModel }) {
  return (
    <div className="model-selector">
      <label className="model-selector-title">Escolha o motor de análise:</label>
      <div className="model-options">
        <button
          className={`model-option ${analysisModel === "legacy" ? "active" : ""}`}
          onClick={() => setAnalysisModel("legacy")}
        >
          <Cpu size={20} />
          <span>Básico (Rápido)</span>
        </button>
        <button
          className={`model-option ${analysisModel === "gemini" ? "active" : ""}`}
          onClick={() => setAnalysisModel("gemini")}
        >
          <BrainCircuit size={20} />
          <span>Avançado (Gemini)</span>
        </button>
      </div>
    </div>
  );
}
