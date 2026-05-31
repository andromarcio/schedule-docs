# PROMPT 4A — N3 Update Negócio
## Atualização de Feature Existente · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N3 existente aprovado + descrição da mudança desejada
> **Entrega**: N3 negocial atualizado com as mudanças solicitadas e changelog
>
> **Pré-requisito**: PROMPT_3A e PROMPT_3B originais já aprovados
> **Próximo passo**: após aprovação, usar PROMPT_4B para a parte técnica
>
> ⚠️ **Use este prompt para manutenção (Brownfield).**
> Para features novas do zero, use PROMPT_3A.

---

## INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a atualizar uma especificação de feature (N3) já existente
do ponto de vista de negócio. Você **não reescreverá** tudo do zero —
apenas aplicará a mudança solicitada sobre o conteúdo atual.

Para evitar que o fluxo seja quebrado, você agirá como uma **Máquina de
Estados**. Toda resposta deve iniciar informando o estado atual:

```
[INICIALIZACAO] → [IDENTIFICACAO_MUDANCA] → [AVALIACAO_IMPACTO]
                → [ALINHAMENTO] → [GERACAO_ATUALIZACAO]
```

Regras da sessão:
- Trabalhe apenas na feature solicitada
- Verifique se a mudança afeta outras regras, fluxos ou campos — se sim, pergunte
- Mantenha linguagem de negócio — sem mencionar tabelas, endpoints ou tecnologias
- Faça uma pergunta de cada vez
- Sinalize suposições com ⚠️

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== FIELD-DICTIONARY.md ===
[cole aqui o conteúdo do FIELD-DICTIONARY.md]

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== N3 EXISTENTE DA FEATURE ===
[cole aqui o .md negocial atual da feature]

---

## PASSO 1 — Inicialização

**[Estado: INICIALIZACAO]**

Leia o N3 existente, confirme o que foi recebido e aguarde:
> "Recebi o N3 de [nome da feature]. Posso iniciar a coleta da mudança solicitada?"

---

## PASSO 2 — Identificação da mudança

**[Estado: IDENTIFICACAO_MUDANCA]**

Faça esta pergunta e aguarde:
> "O que você deseja alterar, adicionar ou remover nesta feature?
> Descreva a necessidade em linguagem de negócio."

---

## PASSO 3 — Avaliação de impacto negocial

**[Estado: AVALIACAO_IMPACTO]**

Com base na resposta, avalie no N3 existente os pontos abaixo.
Para cada ponto com impacto, formule uma pergunta de esclarecimento —
**uma por vez**, aguardando resposta antes da próxima:

- **Campos**: novos campos são necessários? Algum campo sai ou muda?
- **Regras de negócio**: a mudança altera regras atuais ou insere uma nova?
- **Cenários**: quais novos cenários surgem? Quais ficam obsoletos?
- **Comportamento de tela**: a UI precisará de mudanças?

Exemplo de pergunta:
> "Notei que você quer adicionar 'Data de validade'. Esse campo será obrigatório?"

---

## PASSO 4 — Alinhamento final

**[Estado: ALINHAMENTO]**

Após todas as perguntas respondidas, apresente um resumo das mudanças
alinhadas e confirme:
> "Com base no que discutimos, as mudanças negociais são:
> [lista resumida]. Posso gerar a versão atualizada do N3?"

---

## PASSO 5 — Geração da atualização

**[Estado: GERACAO_ATUALIZACAO]**

Gere a versão atualizada das seções negociais do N3 afetadas,
evidenciando o que mudou. Adicione ou atualize a seção de changelog:

```markdown
## Changelog

| Data | Autor | Tipo | Descrição |
|---|---|---|---|
| [data] | [nome] | Novo campo / Regra alterada / Correção | [o que mudou e por quê] |
```

Apresente apenas as seções alteradas (não repita o que não mudou).
Pergunte:
> "A atualização negocial do N3 de [feature] está correta?
> Ajusta algo ou avanço para a parte técnica via PROMPT_4B?"
