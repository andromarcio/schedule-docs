<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Inativar Imóvel
> **Nível 3** — Feature Set: Gestão de Imóveis — Domínio: Clientes e Imóveis

## Descrição
Permite à gerente marcar um imóvel como inativo quando ele não deve mais ser atendido — seja por encerramento de contrato, mudança do cliente ou outro motivo. Imóvel inativo não entra em futuras gerações de agenda.

---

## Regras de negócio

1. Somente o perfil Gerente pode inativar imóveis.
2. Imóvel inativo não é incluído na geração automática de agenda. → ver RULES-DICTIONARY: Imóvel inativo não gera agenda
3. Se o imóvel possui itens de agenda em datas **futuras ainda não concluídos**, o sistema alerta a gerente mas **não bloqueia** — a gerente deve remover manualmente esses itens da agenda futura se desejar.
4. O histórico de limpezas passadas é preservado.
5. A ação requer confirmação via modal.
6. Não é possível inativar imóvel já inativo.

---

## Cenários

```gherkin
Feature: Inativar imóvel

  Background:
    Given que a gerente está autenticada no sistema

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Inativar imóvel sem agendamentos futuros
    Given que o imóvel "Casa da Maria — Pine Ave" está ativo e sem agenda futura
    When a gerente clica em "Inativar" na ficha do imóvel
    And confirma no modal
    Then o sistema inativa o imóvel e exibe: "Imóvel inativado com sucesso."
    And o imóvel não aparece mais nas próximas gerações de agenda

  Scenario: Inativar imóvel com agenda futura (alerta, sem bloqueio)
    Given que o imóvel "Casa da Karen" está agendado para a próxima semana
    When a gerente clica em "Inativar"
    And o modal exibe: "Este imóvel está agendado para datas futuras. Recomendamos remover esses agendamentos após a inativação."
    And a gerente confirma: "Sim, inativar"
    Then o sistema inativa o imóvel
    And os itens de agenda futura permanecem (devem ser removidos manualmente)

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Tentativa de inativar imóvel já inativo
    Given que "Casa da Karen" já está inativa
    When a gerente tenta inativá-lo
    Then o sistema exibe: "Este imóvel já está inativo."

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Membro tenta inativar imóvel
    Given que a usuária logada tem perfil "Membro"
    When tenta acessar a opção de inativar um imóvel
    Then o sistema exibe: "Você não tem permissão para esta ação."
```

---

## Campos

*Esta feature não possui formulário de entrada — é uma ação de confirmação.*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Ativo | Falso | No momento da confirmação |

---

## Comportamento de tela

### Onde fica
Botão "Inativar" na ficha do imóvel. Abre modal de confirmação com informações sobre agendamentos futuros.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Modal sem agenda futura | "Deseja inativar este imóvel?" — botões "Sim, inativar" e "Cancelar" |
| Modal com agenda futura | Alerta amarelo com aviso sobre agendamentos; mesmos botões |
| Loading | Botão com spinner durante processamento |
| Erro de servidor | Toast vermelho: "Não foi possível inativar. Tente novamente." |
| Sucesso | Toast verde: "Imóvel inativado com sucesso." |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Imóvel (campo `active`)

---

## API

### DELETE /api/v1/imoveis/:id
**Acesso**: autenticado — role `GERENTE`

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": { "propertyId": "uuid", "hasFutureSchedules": true },
  "meta": null
}
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `IMOVEL_NOT_FOUND` | 404 | "Imóvel não encontrado." |
| `IMOVEL_JA_INATIVO` | 422 | "Este imóvel já está inativo." |
| `AUTH_FORBIDDEN` | 403 | "Você não tem permissão para esta ação." |
| `INTERNAL_ERROR` | 500 | "Não foi possível inativar. Tente novamente." |

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `imovel.inativado` | Após inativação | `{ propertyId, hasFutureSchedules }` | Agendamento |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'imovel.inativado',
  targetEntity: 'Imovel',
  targetId: imovel.id,
  metadata: { hasFutureSchedules: boolean }
})
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Inativar Imóvel | EE | Baixa | 3 |

**Total: 3 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Imóveis · Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
