# 🏛️ Olimpo HQ — Escritório Virtual do Time AI

O QG oficial do time de agentes AI da GuessLess. 

Um escritório virtual 3D isométrico onde os 5 agentes AI (Atlas, Hefesto, Hermes, Prometheus e Astraea) trabalham visualmente em tempo real. O usuário observa de cima, vê o status de cada um e pode interagir via chat.

## 🚀 Visão do Produto
**Não é um dashboard. É um lugar.** Os agentes têm presença, movimento e personalidade. O escritório escala automaticamente: quando novos agentes são adicionados ao time, novas mesas aparecem e a sala de reunião cresce.

## 🛠️ Stack Tecnológica
* **Frontend:** React 18 + TypeScript
* **3D Engine:** Three.js (via React Three Fiber)
* **State Management:** Zustand
* **Estilização:** Tailwind CSS + Framer Motion
* **IA / Backend:** Anthropic API (Claude) + Vercel Serverless Functions

## 📁 Estrutura do Repositório
* `.aios-core/`: Core de integração com o sistema AIOS.
* `olimpo-skill/`: Diretório contendo as skills do agente e a documentação base do ambiente.
  * `SKILL.md`: Guia de manutenção e construção do Olimpo HQ.
  * `references/design-doc.md`: Documento de design completo (regras de negócio, layout, paleta de cores).
  * `references/setup.md`: Instruções detalhadas de inicialização do frontend.

## 🤖 Agentes Integrados
* **Atlas:** CEO + PM (Diretoria)
* **Hefesto:** Ferreiro — Automação (Operacional)
* **Hermes:** Mensageiro — Pesquisa (Operacional)
* **Prometheus:** Criador + RH (Diretoria)
* **Astraea:** Guardiã — Qualidade (Diretoria)

## ⚙️ Como executar localmente
Consulte o arquivo `olimpo-skill/references/setup.md` para o passo a passo de instalação via Vite e configuração da Vercel.