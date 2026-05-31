<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Inativar Cliente
> **Nível 3** — Feature Set: Gestão de Clientes — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente marcar um cliente como inativo quando ele deixa de utilizar os serviços. A inativação é em cascata: todos os imóveis ativos desse cliente também são automaticamente inativados, e nenhum deles volta a aparecer na geração de agenda.

---

## Regras de negócio

1. Somente o perfil Gerente pode inativar clientes.
2. A inativação do cliente inativa automaticamente **todos** os imóveis vinculados a ele. → ver RULES-DICTIONARY: Soft delete não remove vinculados
3. O histórico de limpezas passadas é preservado integralmente mesmo após a inativação.
4. Não é possível inativar um cliente que já está inativo.
5. A ação requer confirmação explícita via modal antes de ser executada.
6. Após inativação, o cliente ainda aparece em buscas e histórico com identificação visual de "Inativo".

---

## Cenários

```gherkin
Feature: Inativar cliente

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Inativar cliente ativo sem imóveis
    Given que o cliente "Mark Wilson" está ativo e não possui imóveis
    When a gerente clica em "Inativar" na ficha de "Mark Wilson"
    And confirma a ação no modal: "Sim, inativar"
    Then o sistema inativa "Mark Wilson"
    And exibe: "Cliente inativado com sucesso."
    And "Mark Wilson" aparece na lista marcado como "Inativo"

  Scenario: Inativar cliente com imóveis ativos (cascata)
    Given que o cliente "Linda Brown" possui 2 imóveis ativos
    When a gerente clica em "Inativar" na ficha de "Linda Brown"
    And o modal exibe: "Este cliente possui 2 imóvel(is) ativo(s). Todos serão inativados também."
    And a gerente confirma: "Sim, inativar tudo"
    Then o sistema inativa "Linda Brown"
    And inativa automaticamente os 2 imóveis de "Linda Brown"
    And exibe: "Cliente e 2 imóvel(is) inativados com sucesso."

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Tentativa de inativar cliente já inativo
    Given que "Robert Davis" já está inativo
    When a gerente tenta inativar "Robert Davis"
    Then o sistema exibe: "Este cliente já está inativo."
    And nenhuma alteração é feita

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Membro tenta inativar cliente
    Given que a usuária logada tem perfil "Membro"
    When tenta acessar a opção de inativar um cliente
    Then o sistema exibe: "Você não tem permissão para esta ação."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Gerente cancela a inativação no modal
    Given que a gerente clica em "Inativar" na ficha de "Linda Brown"
    When o modal é exibido e a gerente clica em "Cancelar"
    Then o modal fecha sem fazer nenhuma alteração
```

---

## Campos

*Esta feature não possui formulário de entrada — é uma ação de confirmação.*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Ativo (Cliente) | Falso | No momento da confirmação |
| Ativo (Imóveis) | Falso | Em cascata, junto com o cliente |

---

## Comportamento de tela

### Onde fica
Botão "Inativar" na ficha do cliente (página de detalhes ou lista). Abre modal de confirmação antes de executar.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Modal de confirmação | Exibe contagem de imóveis que serão afetados; botões "Sim, inativar" e "Cancelar" |
| Loading | Botão "Sim, inativar" com spinner durante o processamento |
| Erro de servidor | Toast vermelho: "Não foi possível inativar. Tente novamente." |
| Sucesso | Toast verde com contagem de registros afetados; cliente marcado como inativo na tela |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Cliente · → ver DATA-MODEL.md: Imóvel (campo `active`)

---

## Cenários técnicos adicionais

```gherkin
  Scenario: DELETE lógico retorna 200 com contagem de imóveis afetados
    When DELETE /api/v1/clientes/:id
    Then resposta HTTP 200
    And body { "data": { "clientId": "uuid", "inactivatedProperties": 2 }, "meta": null }

  Scenario: DELETE em cliente já inativo retorna 422
    When DELETE /api/v1/clientes/:id (cliente inativo)
    Then resposta HTTP 422
    And body { "error": { "code": "CLIENTE_JA_INATIVO" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `CLIENTE_NOT_FOUND` | 404 | "Cliente não encontrado." |
| `CLIENTE_JA_INATIVO` | 422 | "Este cliente já está inativo." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível inativar. Tente novamente." |

---

## API

### DELETE /api/v1/clientes/:id
**Acesso**: autenticado — role `GERENTE`

**Body**: nenhum

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": { "clientId": "uuid", "inactivatedProperties": 2 },
  "meta": null
}
```

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `cliente.inativado` | Após inativação | `{ clientId, inactivatedPropertyIds[] }` | Agendamento (verificação de agenda futura) |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'cliente.inativado',
  targetEntity: 'Cliente',
  targetId: cliente.id,
  metadata: { inactivatedPropertyIds: [...ids] }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/clientes.ts           ← rota DELETE /api/v1/clientes/:id
src/services/clientes.ts         ← lógica de inativação em cascata
src/repositories/clientes.ts     ← query de inativação (transaction)
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Inativar Cliente | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Clientes · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
