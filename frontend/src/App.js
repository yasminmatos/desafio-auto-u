import React from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/layouts/Header";
import { UploadTabs } from "./components/UploadTabs";
import { TextInput } from "./components/TextInput";
import { FileUpload } from "./components/FileUpload";
import { ModelSelector } from "./components/ModelSelector";
import { Results } from "./components/Results";
import { ErrorMessage } from "./components/ErrorMessage";
import useEmailAnalysis from "./hooks/useEmailAnalysis";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = React.useState("text");
  const [emailText, setEmailText] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [analysisModel, setAnalysisModel] = React.useState("gemini");

  const { loading, result, error, analyzeText, analyzeFile, clear } =
    useEmailAnalysis();

  // Limpa resultado, erro e loading do hook
  const handleClear = () => {
    clear();
  };

  const handleSubmit = () => {
    if (activeTab === "text") analyzeText(emailText, analysisModel);
    else analyzeFile(uploadedFile, analysisModel);
  };

  const handleClearText = () => {
    setEmailText("");
    handleClear();
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    handleClear();
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    handleClear();
    if (tab === "text") setUploadedFile(null);
    else setEmailText("");
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container">
        <div className="main-card">
          <div className="upload-section">
            <h2 className="section-title">Insira um e-mail para análise</h2>
            <p className="section-description">
              Pode colar um texto ou fazer o upload de um ficheiro.
            </p>

            <UploadTabs activeTab={activeTab} onTabSwitch={handleTabSwitch} />

            {activeTab === "text" ? (
              <TextInput
                emailText={emailText}
                setEmailText={setEmailText}
                handleClearText={handleClearText}
              />
            ) : (
              <FileUpload
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                handleClearFile={handleClearFile}
              />
            )}

            <ModelSelector
              analysisModel={analysisModel}
              setAnalysisModel={setAnalysisModel}
            />

            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={
                loading ||
                (activeTab === "text" && !emailText.trim()) ||
                (activeTab === "file" && !uploadedFile)
              }
            >
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>Analisando...
                </div>
              ) : (
                "Analisar e-mail"
              )}
            </button>
          </div>

          {error && <ErrorMessage error={error} />}
          {result && <Results result={result} />}
        </div>
      </div>
    </>
  );
}

export default App;
