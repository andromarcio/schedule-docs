<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Registrar Disponibilidade
> **Nível 3** — Feature Set: Gestão de Membros — Domínio: Equipe

## Descrição
Permite que a membro da equipe (ou a gerente em nome de qualquer membro) informe se estará disponível ou indisponível em uma data específica. Essa informação é usada pelo domínio de Agendamento para filtrar quem pode ser atribuído a cada limpeza.

---

## Regras de negócio

1. Cada membro pode ter no máximo **um registro por dia** (disponível ou indisponível).
2. Não é possível registrar disponibilidade para datas **passadas**.
3. Um registro pode ser editado enquanto a data ainda for futura.
4. Membros sem registro em uma data são considerados **disponíveis por padrão**.
5. Helpers não registram disponibilidade — são consideradas disponíveis enquanto cadastradas.
6. O perfil **Membro** só pode registrar a própria disponibilidade. O perfil **Gerente** pode registrar de qualquer membro.
7. Motivo da indisponibilidade é opcional.

---

## Cenários

```gherkin
Feature: Registrar disponibilidade de membro

  Background:
    Given que a membro "Ana Oliveira" está autenticada

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Membro registra indisponibilidade futura
    Given que "Ana Oliveira" acessa a tela de disponibilidade
    When seleciona a data "2026-06-10" (quarta-feira)
    And marca como "Indisponível"
    And preenche "Motivo" com "Consulta médica"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Disponibilidade registrada para 10/06/2026."
    And o dia 10/06 aparece marcado como indisponível no calendário

  Scenario: Membro registra disponibilidade (confirmar presença)
    When seleciona a data "2026-06-11" e marca como "Disponível"
    And clica em "Salvar"
    Then o sistema salva e exibe: "Disponibilidade registrada para 11/06/2026."

  Scenario: Membro edita registro existente
    Given que "Ana" registrou indisponibilidade para "2026-06-10"
    When acessa o registro e altera para "Disponível"
    And clica em "Salvar"
    Then o sistema atualiza e exibe: "Disponibilidade atualizada."

  Scenario: Gerente registra indisponibilidade em nome de membro
    Given que a gerente está autenticada
    When acessa a disponibilidade da membro "Carol Santos"
    And registra "Indisponível" para "2026-06-12" com motivo "Carro na oficina"
    Then o sistema salva para "Carol Santos" e exibe: "Disponibilidade registrada."

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de registrar para data passada
    When "Ana" tenta selecionar a data "2026-05-01" (passada)
    Then a data aparece desabilitada no calendário e não pode ser selecionada

  # ── Conflitos com dados existentes ─────────────────────────────

  Scenario: Tentativa de criar segundo registro no mesmo dia
    Given que já existe registro de disponibilidade de "Ana" para "2026-06-10"
    When o sistema tenta salvar novo registro para a mesma data via API
    Then o sistema atualiza o registro existente (upsert) em vez de criar um novo

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Membro tenta registrar disponibilidade de outra membro
    Given que "Ana" está autenticada
    When tenta registrar disponibilidade para "Carol Santos" via API
    Then o sistema retorna erro de permissão
    And exibe: "Você só pode registrar a sua própria disponibilidade."
```

---

## Campos

| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Data | data | sim | Deve ser data futura (a partir de amanhã) |
| Disponível | sim/não | sim | Disponível ou Indisponível |
| Motivo | texto | não | Máximo 500 caracteres; relevante apenas quando Indisponível |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Valor | Quando |
|---|---|---|
| Membro | Membro autenticada (ou membro selecionada pelo gerente) | Ao salvar |

---

## Comportamento de tela

### Onde fica
Tela de calendário semanal em `/equipe/disponibilidade`. Exibe os dias da semana atual e das próximas 4 semanas. Cada dia mostra o status atual (disponível por padrão, verde; indisponível, vermelho). Clicar em um dia abre mini-formulário inline.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Calendário carregando | Skeleton nas células dos dias |
| Dia sem registro | Exibido como "Disponível" (padrão) em verde claro |
| Dia com indisponibilidade | Exibido em vermelho com ícone de bloqueio |
| Dia passado | Cinza, não clicável |
| Salvando | Célula do dia com spinner |
| Erro de servidor | Toast vermelho: "Não foi possível salvar. Tente novamente." |
| Sucesso | Célula do dia atualiza cor imediatamente (feedback otimista) |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Disponibilidade

---

## Cenários técnicos adicionais

```gherkin
  Scenario: Upsert — PUT cria ou atualiza
    When PUT /api/v1/equipe/membros/:memberId/disponibilidade com { date, available }
    Then se não existir, cria; se existir, atualiza
    And resposta HTTP 200 em ambos os casos

  Scenario: Membro tentando alterar disponibilidade de outra via API
    When PUT /api/v1/equipe/membros/:outroMembroId/disponibilidade (autenticado como MEMBRO)
    And o ID na rota não corresponde ao membro logado
    Then resposta HTTP 403
    And body { "error": { "code": "AUTH_FORBIDDEN" } }
```

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Mensagens por campo |
| `MEMBRO_NOT_FOUND` | 404 | "Membro não encontrada." |
| `AUTH_FORBIDDEN` | 403 | "Você só pode registrar a sua própria disponibilidade." |
| `INTERNAL_ERROR` | 500 | "Não foi possível salvar. Tente novamente." |

---

## API

### PUT /api/v1/equipe/membros/:memberId/disponibilidade
**Acesso**: autenticado — roles `GERENTE` (qualquer membro) ou `MEMBRO` (apenas o próprio)

**Body**:
```typescript
{
  date: string        // ISO 8601: "2026-06-10" — deve ser data futura
  available: boolean
  reason?: string     // max 500 chars
}
```

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": {
    "id": "uuid",
    "memberId": "uuid",
    "date": "2026-06-10",
    "available": false,
    "reason": "Consulta médica"
  },
  "meta": null
}
```

### GET /api/v1/equipe/membros/:memberId/disponibilidade
**Acesso**: autenticado — role `GERENTE` ou o próprio MEMBRO

**Query params**:
```typescript
{ from: string, to: string }  // intervalo de datas ISO 8601
```

**Resposta**: lista de registros de disponibilidade no período

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `disponibilidade.registrada` | Ao salvar qualquer registro | `{ memberId, date, available }` | Agendamento |

---

## AuditLog

```typescript
logAction({
  userId: context.userId,
  action: 'disponibilidade.registrada',
  targetEntity: 'Disponibilidade',
  targetId: disponibilidade.id,
  metadata: { memberId, date, available, reason }
})
```

---

## Arquivos a criar ou alterar

```
src/routes/equipe.ts                      ← rotas PUT e GET de disponibilidade
src/services/disponibilidade.ts           ← lógica de upsert + validação de data futura
src/repositories/disponibilidade.ts       ← acesso Prisma (upsert por memberId + date)
src/validations/disponibilidade.ts        ← schema Zod
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Registrar Disponibilidade (escrita) | EE | Baixa | 3 |
| Consultar Disponibilidade (leitura) | SE | Baixa | 3 |

**Total: 6 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Gestão de Membros · Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
