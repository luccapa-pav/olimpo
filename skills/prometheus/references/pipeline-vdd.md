# Referência de arquitetura: Pipeline paralelo (VDD)

Baseado no "AI Vendor Due Diligence System" — exemplo de pipeline de nível
enterprise que pode ser adaptado pra qualquer pesquisa profunda multi-domínio.

## Quando usar essa arquitetura

Quando uma tarefa precisa de:
- Pesquisa em 5+ domínios diferentes simultaneamente
- Síntese de múltiplas fontes num veredicto scored
- Output estruturado com scores, flags, e recomendação
- Entrega em formato de apresentação (Gamma) ou relatório

## Arquitetura de 5 camadas

```
INPUT → Layer 0 (coleta de dados) → Layer 1 (checks rápidos)
     → Layer 2 (pesquisa paralela, N queries simultâneas)
     → Layer 3 (síntese Claude com veredicto scored)
     → Layer 4 (geração de deliverable: deck, PDF, report)
```

## Princípios aplicáveis ao time Olimpo

1. Paralelismo: múltiplas queries ao mesmo tempo (ThreadPoolExecutor)
2. Output determinístico: schema rígido com scores numéricos
3. Multi-API: combinar Firecrawl + Perplexity + Claude + Gamma
4. Cost tracking: logar custo de cada API call
5. Source citation: cada afirmação com fonte verificável

## APIs úteis pra referência

- Firecrawl: scraping de sites ($0.002/página)
- Perplexity sonar/sonar-pro: pesquisa com citações ($0.001-0.015/query)
- HIBP: verificar breaches de domínio (grátis)
- Wayback CDX: histórico de páginas (grátis)
- Gamma: geração de decks (~$0.05/deck)
- Logo.dev: logos de empresas
- Apify: scraping G2/Glassdoor reviews

## Custo típico de um pipeline completo

~$0.05-0.70 por execução (vs $25,000-52,000 tradicional)

## Adaptação pra GuessLess

Possível uso futuro: "Avaliação de Ferramentas" — quando precisar recomendar
plataforma pro cliente premium, rodar pipeline adaptado que avalia:
- Pricing e custo total
- Segurança e compliance
- Reviews de clientes
- Concorrentes
- Score final com recomendação

Isso poderia ser um "modo avançado" do Hermes ou um agente novo quando a demanda
justificar (regra de contratação: custo de NÃO ter > custo de criar).

---

# Referência: Avatares fotorrealísticos com vídeo (Tavus)

Plataforma que cria avatares com rosto humano, lip sync, expressões faciais e voz
em tempo real, alimentados por LLM (Claude/GPT).

## Pipeline: Firecrawl → RAG → Tavus
1. Firecrawl crawla o site da empresa (500 créditos grátis)
2. LLM processa e estrutura o conteúdo em knowledge base (PDF)
3. Tavus recebe o PDF + system prompt → avatar pronto

## Conceitos úteis pro Olimpo (futuro)
- Welcome greeting padronizado por agente
- Engagement checks ("isso ajudou?") após 2-3 trocas
- Guardrails explícitos (não fabricar, não coletar dados, escalar gracefully)
- Avatar fotorrealístico como upgrade dos chibi 3D

## Quando considerar
Quando o Olimpo HQ evoluir pra ter chat com vídeo — clicar no Atlas e ele
aparecer como rosto humano falando. Plataforma: tavus.io
