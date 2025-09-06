import os
import PyPDF2
import io
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Configuração do CORS para permitir requisições de qualquer origem.
CORS(app)

# --- CONFIGURAÇÃO DA API DO GEMINI ---
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("Chave da API do Google não encontrada. Por favor, configure a variável de ambiente GOOGLE_API_KEY.")
genai.configure(api_key=api_key)


# --- MODELO BÁSICO (BASEADO EM PALAVRAS-CHAVE) ---
class LegacyEmailClassifier:
    def analyze_email(self, text: str):
        productive_keywords = [
            'status', 'atualização', 'pedido', 'suporte', 'técnico', 'problema', 
            'help', 'question', 'urgent', 'fim', 'reunião', 'documento', 
            'arquivo', 'atenção', 'revisar', 'aprovado', 'caso', 'ticket', 
            'sistema', 'erro', 'bug', 'ferramenta', 'requerimento'
        ]
        unproductive_keywords = [
            'parabéns', 'feliz', 'feliz aniversário', 'feriado', 'natal',
            'ano novo', 'férias', 'obrigado', 'agradeço', 'felicitações',
            'olá', 'oi', 'bom dia', 'boa tarde', 'celebrações',
            'festa', 'social', 'pessoal', 'fim de semana', 'ódio', 'odeio'
        ]
        
        text_lower = text.lower()
        productive_score = sum(1 for keyword in productive_keywords if keyword in text_lower)
        unproductive_score = sum(1 for keyword in unproductive_keywords if keyword in text_lower)

        if productive_score > unproductive_score:
            category = "Produtivo"
            confidence = min(0.9, 0.7 + (productive_score * 0.05))
        elif unproductive_score > productive_score:
            category = "Improdutivo"
            confidence = min(0.9, 0.7 + (unproductive_score * 0.05))
        else:
            category = "Indefinido"
            confidence = 0.5

        if category == "Produtivo":
            suggested_response = "Obrigado pelo seu email. Recebemos sua solicitação e nossa equipe irá analisá-la."
        else:
            suggested_response = "Obrigado pela sua mensagem! Desejamos a você também um excelente dia."

        # Retorna uma estrutura compatível com o frontend
        return {
            "category": category,
            "confidence": confidence,
            "summary": "Análise básica realizada por palavras-chave.",
            "suggested_response": suggested_response,
            "action_items": [],
            "analyzed_by": "legacy_keyword_model"
        }


# --- CLASSE DE ANÁLISE AVANÇADA COM GEMINI ---
class GeminiEmailAnalyzer:
    def __init__(self, model_name="gemini-1.5-flash"):
        self.model = genai.GenerativeModel(model_name)

    def analyze_email(self, email_text: str):
        prompt = f"""
            Você é um especialista em produtividade e análise de comunicação. Sua tarefa é analisar o e-mail abaixo e fornecer uma análise completa.
            O formato da sua resposta DEVE ser um objeto JSON válido, sem nenhum texto ou formatação adicional antes ou depois dele.
            O JSON deve ter as seguintes chaves:
            - "category": Classifique o e-mail como "Produtivo" ou "Improdutivo".
            - "confidence": Um número entre 0.0 e 1.0 indicando sua confiança na classificação.
            - "summary": Um resumo conciso do e-mail em uma frase.
            - "suggested_response": Sugira uma resposta curta, profissional e apropriada para o e-mail.
            - "action_items": Uma lista de strings com os itens de ação claros do e-mail. Se não houver, retorne uma lista vazia [].
            Aqui está o e-mail para análise:
            ---
            {email_text}
            ---
        """
        try:
            response = self.model.generate_content(prompt)
            cleaned_response_text = response.text.strip().replace("```json", "").replace("```", "")
            result_json = json.loads(cleaned_response_text)
            
            required_keys = ["category", "confidence", "summary", "suggested_response", "action_items"]
            for key in required_keys:
                if key not in result_json:
                    raise KeyError(f"A chave '{key}' está faltando na resposta da IA.")
            
            result_json["analyzed_by"] = self.model.model_name
            return result_json

        except Exception as e:
            print(f"Erro ao processar a resposta da IA: {e}")
            return {
                "category": "Indefinido", "confidence": 0.5,
                "summary": "Não foi possível analisar o conteúdo com o modelo avançado.",
                "suggested_response": "Não foi possível gerar uma resposta.",
                "action_items": [], "analyzed_by": "gemini_fallback"
            }

# --- INICIALIZAÇÃO E ROTAS DA API ---
legacy_analyzer = LegacyEmailClassifier()
gemini_analyzer = GeminiEmailAnalyzer()

def extract_text_from_pdf(file):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = "".join(page.extract_text() for page in pdf_reader.pages)
        return text
    except Exception as e:
        raise Exception(f"Erro ao extrair texto do PDF: {str(e)}")

def process_email_request(email_text, model='gemini', filename=None):
    if not email_text or len(email_text.strip()) < 10:
        return {"error": "Texto do email está vazio ou é muito curto"}, 400
    
    if model == 'legacy':
        analysis_result = legacy_analyzer.analyze_email(email_text)
    else:
        analysis_result = gemini_analyzer.analyze_email(email_text)

    print("\n--- RESPOSTA DO MODELO SELECIONADO ---")
    print(json.dumps(analysis_result, indent=2, ensure_ascii=False))
    print("-------------------------------------\n")
    
    analysis_result["email_preview"] = email_text[:250] + "..." if len(email_text) > 250 else email_text
    if filename:
        analysis_result["filename"] = filename
    return analysis_result, 200

@app.route('/')
def index():
    return jsonify({"message": "API de Classificação de E-mails está rodando"})

@app.route('/classify', methods=['POST'])
def classify_email_route():
    try:
        data = request.get_json()
        if 'text' not in data:
            return jsonify({"error": "Nenhum texto fornecido"}), 400
        
        email_text = data['text']
        model_choice = data.get('model', 'gemini')
        result, status_code = process_email_request(email_text, model=model_choice)
        return jsonify(result), status_code
    
    except Exception as e:
        return jsonify({"error": f"Erro no processamento: {str(e)}"}), 500

@app.route('/classify-file', methods=['POST'])
def classify_file_route():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        model_choice = request.form.get('model', 'gemini') # Pega o modelo do form-data
        
        if file.filename.endswith('.pdf'):
            email_text = extract_text_from_pdf(file)
        elif file.filename.endswith('.txt'):
            email_text = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Formato de arquivo não suportado."}), 400
            
        result, status_code = process_email_request(email_text, model=model_choice, filename=file.filename)
        return jsonify(result), status_code
    
    except Exception as e:
        return jsonify({"error": f"Erro no processamento do arquivo: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

