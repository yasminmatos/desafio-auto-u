import { CheckCircle, AlertCircle, ListTodo, Cpu, BrainCircuit } from "lucide-react";

export function Results({ result }) {
  return (
    <div className="results-section">
      <h2 className="section-title">Resultados da Análise</h2>
      <div className="result-card">
        <div className="classification-result">
          <span
            className={`category-badge ${result.category === "Produtivo"
              ? "category-productive"
              : result.category === "Improdutivo"
                ? "category-unproductive"
                : "category-undefined"
              }`}
          >
            {result.category === "Produtivo" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {result.category}
          </span>
          <span className="confidence-score">
            Confiança: <strong>{(result.confidence * 100).toFixed(0)}%</strong>
          </span>
        </div>

        <div className="insight-grid">
          <div className="insight-card">
            <div className="insight-header">
              <h3>Resumo</h3>
            </div>
            <p>{result.summary}</p>
          </div>
          <div className="insight-card">
            <div className="insight-header">
              <ListTodo size={18} />
              <h3>Itens de Ação</h3>
            </div>
            {result.action_items && result.action_items.length > 0 ? (
              <ul>
                {result.action_items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum item de ação claro foi identificado.</p>
            )}
          </div>
        </div>

        <div className="response-section">
          <div className="response-title">Resposta Sugerida:</div>
          <div className="suggested-response">"{result.suggested_response}"</div>
        </div>

        {result.analyzed_by && (
          <div className="analyzed-by">
            {result.analyzed_by.includes("gemini") ? (
              <BrainCircuit size={14} />
            ) : (
              <Cpu size={14} />
            )}
            Analisado por:{" "}
            {result.analyzed_by.includes("gemini")
              ? result.analyzed_by.replace("models/", "")
              : "Modelo Básico"}
          </div>
        )}
      </div>
    </div>
  );
}
