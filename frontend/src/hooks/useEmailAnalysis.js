import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function useEmailAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeText = async (text, model) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/classify`, {
        text,
        model,
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao processar o email");
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async (file, model) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);

      const response = await axios.post(
        `${API_BASE_URL}/classify-file`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao processar o arquivo");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return { loading, result, error, analyzeText, analyzeFile, clear };
}
