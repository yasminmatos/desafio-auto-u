import { Mail } from "lucide-react";

export function Header() {
  return (
    <div className="header">
      <h1>
        <Mail className="inline-icon" /> Análise de Emails com IA
      </h1>
      <p>
        Use o poder da inteligência artificial para classificar emails, gerar
        respostas e extrair insights. <br/> Utilize o Google Gemini ou nossa IA
      </p>
    </div>
  );
}
