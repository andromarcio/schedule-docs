<!--
  CONVENÇÃO DE VISIBILIDADE
  ─────────────────────────────────────────────────────────────────
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
  ─────────────────────────────────────────────────────────────────
-->

# [Nome da Feature]
> **Nível 3** — Feature Set: [Nome do Feature Set] — Domínio: [Nome do Domínio]

## Descrição
[Descrição em 1-2 frases do que esta feature faz, em linguagem de negócio,
para alguém que nunca viu o sistema.]

---

## Regras de negócio

<!--
  Regras canônicas: referenciar o dicionário em vez de repetir.
  Regras de domínio: referenciar o N1 em vez de repetir.
  Regras específicas desta feature: descrever aqui.
-->

1. [Regra específica desta feature em linguagem de negócio]
   → ver RULES-DICTIONARY: [nome da regra] *(se for regra canônica)*
   → ver [N1 do domínio]: Regras transversais: [N] *(se for regra de domínio)*

2. [Regra específica]

---

## Cenários

```gherkin
Feature: [Nome da feature em linguagem natural]

  Background:
    Given que o usuário está autenticado na organização "[org]"
    And [contexto adicional comum a todos os cenários]

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: [Descrição do cenário principal]
    Given [estado inicial em linguagem de negócio]
    When [ação do usuário]
    Then [resultado esperado]
    And [efeito colateral esperado]

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: [Campo obrigatório ausente]
    When o usuário deixa o campo "[Label PO]" vazio
    And clica em "[botão de ação]"
    Then o sistema exibe abaixo do campo: "[mensagem de erro]"

  Scenario: [Formato inválido]
    When o usuário preenche "[Label PO]" com "[valor inválido]"
    Then o sistema exibe abaixo do campo: "[mensagem de erro]"
    # ← FIELD-DICTIONARY: [nome do campo] *(se for campo canônico)*

  # ── Conflitos com dados existentes ────────────────────────────

  Scenario: [Duplicata ou conflito]
    Given que já existe [registro] com [dado conflitante]
    When o usuário tenta [ação]
    Then o sistema exibe: "[mensagem de conflito]"

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: [Perfil sem permissão]
    Given que o usuário autenticado tem perfil "[perfil]"
    When o usuário tenta [ação]
    Then o sistema exibe: "[mensagem de acesso negado]"

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: [Situação especial do sistema]
    Given que [estado especial]
    When o usuário tenta [ação]
    Then [comportamento alterado]
    And o sistema exibe: "[mensagem contextual]"
```

---

## Campos

<!--
  Esta tabela usa apenas Label PO e regras em linguagem de negócio.
  A nomenclatura técnica (Label Dev e campo banco) está centralizada
  no DATA-MODEL.md — não duplicar aqui.
-->

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| [Nome do campo em português] | [texto / número / data / lista de opções / sim·não / arquivo] | sim / não / automático | [regras em linguagem natural] |

*[Notas sobre dependências entre campos, se houver.]*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| [campo] | [valor fixo ou calculado em linguagem natural] | [momento — ex: "no momento do salvamento"] |

---

## Comportamento de tela

### Onde fica
[Descrever em qual rota e componente a feature aparece:
formulário em página própria, modal, botão em listagem, etc.]

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | [o que exibir durante o processamento] |
| Erro de validação | [como exibir erros de campo] |
| Erro de servidor | [toast ou mensagem genérica] |
| Sucesso | [toast, redirecionamento ou relatório] |
| Empty state | [quando e o que exibir se não há dados] |

---

## Métricas de tamanho

<!--
  Preencher após aprovação do N3 técnico (PROMPT_3B) e antes do início do desenvolvimento.
  Responsável: Dev que especificou o N3. Revisão: Tech Lead do domínio.
  Critérios de contagem: ver global/SIZING.md

  IMPORTANTE — Arquitetura BFF (Java + Angular):
  Endpoints internos (consumidos apenas pelo frontend do próprio sistema) NÃO são EE.
  Para ser contado como EE, o endpoint deve estar exposto a sistemas além da
  fronteira lógica do sistema (ex: API pública, integração com sistema externo).
  Registrar aqui apenas Funções de Transação (EE, SE, CE).
  Funções de Dados (ALI, AIE) são contadas centralmente no DATA-MODEL.md.
-->

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| [Nome da Feature] | [EE / SE / CE] | Baixa / Média / Alta | [3/4/5/6/7] |

> Endpoints consumidos exclusivamente pelo frontend deste sistema (BFF interno) **não são contados**.
> Ver critério completo em `global/SIZING.md`.

**Total: [N] PF**

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Entidade [Nome da Entidade]

<!--
  Todos os campos desta feature — Label Dev, campo banco, tipo SQL
  e constraints — estão centralizados no DATA-MODEL.md.
  Campos novos aprovados durante a sessão devem ser adicionados
  ao DATA-MODEL.md antes de iniciar a implementação.
-->

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento técnico ──────────────────────────────────────

  Scenario: [Cenário técnico — sessão, cookies, formato de erro HTTP]
    Given [estado técnico]
    When [ação técnica]
    Then [resultado técnico com formato JSON ou HTTP status]
```

---

## Mapeamento de erros (código interno → mensagem ao usuário)

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `[ENTIDADE_ERRO]` | [código] | "[mensagem em português]" |

---

## API

### [MÉTODO] /api/v1/[rota]
**Acesso**: [público / autenticado — roles `[role1]`, `[role2]`]

**Body / Query params**:
```typescript
{
  [labelDev]: tipo        // Label PO: [Label PO] — obrigatório/opcional
  [labelDev]?: tipo       // Label PO: [Label PO] — opcional
}
// Tipos e constraints completos: ver DATA-MODEL.md: Entidade [Nome]
```

**Resposta de sucesso** — HTTP [código]:
```json
{
  "data": {
    "id": "uuid"
  },
  "meta": null
}
```

**Respostas de erro**:

| HTTP | Code | Situação |
|---|---|---|
| [código] | `[ENTIDADE_ERRO]` | [quando ocorre] |

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `[entidade.acao]` | [quando] | `{ organizationId, [id] }` | [quem consome] |

### Consumidos
| Evento | Publicado por | Reação |
|---|---|---|
| `[entidade.acao]` | [Domínio] | [o que faz ao receber] |

---

## AuditLog

```typescript
logAction({
  organizationId: context.organizationId,
  userId: context.userId,
  action: '[entidade.acao]',
  targetEntity: '[Entidade]',
  targetId: [entidade].id,
  metadata: {
    // campos relevantes usando Label Dev
    // → nomes completos em DATA-MODEL.md: Entidade [Nome]
  }
})
```

---

## Arquivos a criar ou alterar

```
[caminho/arquivo.ts]     ← [o que faz]
[caminho/arquivo.tsx]    ← [o que faz]
```

---

## Dependências

- **[Lib/Serviço]** — [para que é usado]

</div>

---

## Implementação

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| [endpoint/componente/job] | [repo] | [caminho no repo] | `main` |

**Status**: `[ ] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: [Nome] · Domínio: [Nome] · Última revisão: —*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
