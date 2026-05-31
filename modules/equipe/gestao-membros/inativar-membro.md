<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Inativar Membro
> **Nível 3** — Feature Set: Gestão de Membros — Domínio: Equipe

## Descrição
Permite à gerente marcar uma membro da equipe como inativa quando ela deixa de fazer parte do time. Membro inativa não aparece para atribuição em novas agendas, mas seu histórico é preservado.

---

## Regras de negócio

1. Somente o perfil Gerente pode inativar membros.
2. Membro inativa não aparece na lista de seleção ao atribuir equipe na agenda.
3. O acesso da membro ao app é bloqueado automaticamente após a inativação.
4. Registros de disponibilidade e histórico de atribuições passadas são preservados.
5. A ação requer confirmação via modal.
6. Não é possível inativar membro já inativa.

---

## Cenários

```gherkin
Feature: Inativar membro da equipe

  Background:
    Given que a gerente está autenticada

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Inativar membro ativa
    Given que a membro "Ana Oliveira" está ativa
    When a gerente clica em "Inativar" na ficha de "Ana"
    And confirma no modal: "Sim, inativar"
    Then "Ana" é marcada como inativa
    And seu acesso ao app é bloqueado
    And exibe: "Membro inativada com sucesso."
    And "Ana" não aparece mais nas listas de atribuição de agenda

  # ── Conflitos ──────────────────────────────────────────────────

  Scenario: Tentativa de inativar membro já inativa
    Given que "Lucia" já está inativa
    When a gerente tenta inativá-la
    Then o sistema exibe: "Esta membro já está inativa."
```

---

## Campos

*Esta feature não possui formulário de entrada.*

### Campos preenchidos automaticamente

| Label PO | Valor | Quando |
|---|---|---|
| Ativo (Membro) | Falso | No momento da confirmação |
| Ativo (Usuário vinculado) | Falso | Em conjunto, bloqueando acesso ao app |

---

## Comportamento de tela

### Onde fica
Botão "Inativar" na ficha da membro. Abre modal de confirmação.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Modal | "Deseja inativar [Nome]? Ela perderá acesso ao app." — botões "Sim, inativar" e "Cancelar" |
| Loading | Botão com spinner |
| Sucesso | Toast verde: "Membro inativada com sucesso." |
| Erro | Toast vermelho: "Não foi possível inativar. Tente novamente." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Membro da Equipe

---

## API

### DELETE /api/v1/equipe/membros/:id
**Acesso**: autenticado — role `GERENTE`

**Resposta de sucesso** — HTTP 200:
```json
{ "data": { "memberId": "uuid" }, "meta": null }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `MEMBRO_NOT_FOUND` | 404 | "Membro não encontrada." |
| `MEMBRO_JA_INATIVO` | 422 | "Esta membro já está inativa." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'membro.inativada',
  targetEntity: 'MembroEquipe',
  targetId: membro.id,
  metadata: { name: membro.name }
})
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Inativar Membro | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Membros · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
