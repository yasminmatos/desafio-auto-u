# Sistema de Classificação Automática de Emails

Uma solução completa para **classificação inteligente de emails** e **geração automática de respostas**, desenvolvida para empresas que lidam com grande volume de emails diários.

---

## 📝 Descrição do Projeto

O sistema permite:

- Classificar emails como **Produtivo** ou **Improdutivo**.
- Gerar respostas automáticas apropriadas.
- Processar entradas via texto direto ou arquivos (`.txt` / `.pdf`).
- Integrar com frontend moderno em React.
- Utilizar modelos de IA para análise avançada (Google Gemini) ou fallback baseado em palavras-chave.

A arquitetura foi pensada para ser modular, escalável e de fácil manutenção.

---

## 🏗 Arquitetura e Decisões Técnicas

### Backend (Python + Flask)

- **Flask**: Criação de API RESTful.
- **Google Gemini API**: Modelo avançado de NLP para análise semântica.
- **Fallback Legacy Model**: Classificação rápida via palavras-chave, sem dependências externas.
- **PyPDF2**: Extração de texto de arquivos PDF.
- **dotenv**: Gerenciamento de variáveis de ambiente (como API Keys).
- **Flask-CORS**: Permite requisições do frontend hospedado em outra porta.

**Decisão técnica:**
Mantemos dois modelos de análise (Gemini e Legacy) para garantir robustez: caso a IA não responda ou haja limite de uso, a análise baseada em palavras-chave garante funcionalidade mínima.

### Frontend (React 18)

- **React**: Estrutura de componentes reutilizáveis.
- **Axios**: Comunicação HTTP com a API.
- **React Dropzone**: Upload de arquivos intuitivo.
- **React Hot Toast**: Feedback visual para ações do usuário.
- **Lucide React**: Ícones modernos e leves.

**Decisão técnica:**
Separação clara entre backend e frontend permite desenvolvimento paralelo e escalabilidade futura.

---

## ⚙️ Setup do Projeto

### Pré-requisitos

- Python 3.8+
- Node.js 18+
- npm ou yarn
- Chave da API Gemini (`GOOGLE_API_KEY`)

### Backend

1. Acesse a pasta `backend`:

```bash
cd backend
```

2. Crie e ative o ambiente virtual:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Configure a variável de ambiente:

```bash
# Windows
set GOOGLE_API_KEY=sua_chave_aqui

# macOS / Linux
export GOOGLE_API_KEY=sua_chave_aqui
```

5. Rode o backend:

```bash
python app.py
```

O backend estará disponível em `http://localhost:5000`.

### Frontend

1. Acesse a pasta `frontend`:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`.

---

## 📂 Estrutura de Pastas

```
Desafio Auto U/
├── backend/
│   ├── app.py              # API Flask principal
│   ├── requirements.txt    # Dependências Python
│   └── .env                # Variáveis de ambiente
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Componente principal
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Hooks personalizados
│   │   └── index.js        # Ponto de entrada React
│   └── package.json
└── README.md
```

---

## 🔗 Endpoints da API

### POST `/classify`

Classifica o email enviado como texto.

**Body JSON:**

```json
{
  "text": "Conteúdo do email"
}
```

**Resposta:**

```json
{
  "category": "Produtivo",
  "confidence": 0.85,
  "suggested_response": "Resposta automática sugerida...",
  "email_preview": "Prévia do conteúdo...",
  "analyzed_by": "gemini-1.5-flash"
}
```

### POST `/classify-file`

Classifica email a partir de arquivo `.txt` ou `.pdf`.

**Form Data:**

- `file`: Arquivo para análise
- `model`: (opcional) `"gemini"` ou `"legacy"`

**Resposta igual ao endpoint `/classify`.**

---

## 🎯 Categorias de Classificação

| Categoria     | Descrição                                                       |
|--------------|-----------------------------------------------------------------|
| Produtivo    | Emails que requerem ação ou resposta específica.                |
| Improdutivo  | Emails que não necessitam ação imediata (cumprimentos, feriados). |

---

## 💡 Próximos Passos / Melhorias Futuras

- Dashboard de analytics para visualizar tendências de emails.
- Suporte a mais formatos de arquivo.
- Integração direta com sistemas de email corporativo.
- Treinamento personalizado de modelos de IA.
- Sistema de caching para reduzir chamadas repetidas à API Gemini.

---

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

