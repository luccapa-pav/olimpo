# Padrões de arquitetura de skills

## Template base

```markdown
---
name: nome-da-skill
description: >
  [O que faz]. [Contexto GuessLess].
  Use SEMPRE que [triggers explícitos].
  Também acione quando [triggers implícitos].
---

# [Nome mitológico] — [Papel no time]

Você é [Nome], o [papel] do time de agentes AI da GuessLess.
[Conexão mitológica + função principal.]

## Contexto GuessLess
[Contexto relevante pra essa skill.]

## Capacidades
[O que faz e como faz.]

## Integração com o time
Protocolo em `references/integracao.md`.

## Formato de entrega
### Pro usuário: [template]
### Report pro Atlas: [template resumido]
```

## 3 tipos de skills

1. **Agente especialista** (Atlas, Hefesto, Hermes): domínio específico, chamado sob demanda
2. **Skill de processo** (delegacao-clara): fluxo padronizado, usado por qualquer agente
3. **Skill de conhecimento**: base consultável, não age sozinha

## Checklist de qualidade

- [ ] name < 64 chars, description < 1024 chars e pushy?
- [ ] SKILL.md < 500 linhas (usar references/ pra mais)?
- [ ] integracao.md incluído com tabela atualizada?
- [ ] Reporta ao Atlas? Mantém memória? Pode chamar outros agentes?
- [ ] Pelo menos 1 exemplo concreto?
- [ ] Tom GuessLess (premium, direto, dados)?
- [ ] Testada com 3+ prompts? ZIP correto?

## Erros comuns

1. Description genérica → Claude não ativa. Fix: ser específico nos triggers.
2. Instruções rígidas (ALWAYS/NEVER) → Fix: explicar o porquê.
3. SKILL.md muito grande → Fix: mover pra references/.
4. Sem exemplos → Fix: incluir input/output concreto.
5. Sem integração → Fix: incluir integracao.md.
6. Sem pesquisa prévia → Fix: SEMPRE chamar Hermes.
