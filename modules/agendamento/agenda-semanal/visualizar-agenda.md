<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Visualizar Agenda
> **Nível 3** — Feature Set: Agenda Semanal — Domínio: Agendamento

## Descrição
Exibe a agenda semanal de limpezas de forma organizada por dia, mostrando os imóveis a serem limpos e a equipe atribuída a cada um. A gerente vê a visão completa; cada membro vê apenas os imóveis em que está atribuída naquela semana.

---

## Regras de negócio

1. A gerente visualiza todos os imóveis e toda a equipe da semana.
2. A membro logada visualiza apenas os imóveis onde foi atribuída (líder ou auxiliar).
3. A visão padrão é a semana atual; é possível navegar para semanas anteriores e futuras.
4. Agendas em Rascunho exibem banner de aviso para o Gerente.
5. Agendas confirmadas exibem badge de confirmação e opção de reabrir (apenas Gerente).
6. A membro visualiza, para cada imóvel: apelido, endereço completo, tamanho e as observações do imóvel.
7. O texto de agenda formatado para WhatsApp pode ser gerado e copiado a partir desta tela.

---

## Cenários

```gherkin
Feature: Visualizar agenda semanal

  Background:
    Given que existe a agenda da semana de 08/06/2026 com status "Confirmada"

  # ── Gerente ─────────────────────────────────────────────────────

  Scenario: Gerente visualiza agenda completa
    Given que a gerente está autenticada
    When acessa "/agenda" com a semana de 08/06/2026 selecionada
    Then visualiza 5 colunas (seg–sex) com os imóveis de cada dia
    And cada card de imóvel exibe: apelido, cliente, tamanho, endereço e equipe atribuída
    And imóveis sem equipe atribuída são destacados em laranja

  Scenario: Gerente navega para semana anterior
    When clica em "< Semana anterior"
    Then a tela exibe a agenda da semana de 01/06/2026

  Scenario: Gerente copia agenda para WhatsApp
    When clica em "Copiar para WhatsApp"
    Then o texto formatado é copiado para a área de transferência
    And o formato é: "📅 Semana 08–12/06\n\n🗓 Segunda:\n• Casa da Maria — Oak St (M) — Ana (Líder)\n..."

  Scenario: Gerente reabre agenda confirmada
    When clica em "Reabrir Agenda"
    And confirma no modal
    Then o status volta para "Rascunho"
    And o banner de rascunho é exibido

  # ── Membro ──────────────────────────────────────────────────────

  Scenario: Membro visualiza apenas sua agenda
    Given que "Ana Oliveira" está autenticada e atribuída em 3 imóveis na semana
    When acessa "/minha-agenda"
    Then visualiza apenas os 3 imóveis onde está atribuída
    And cada card exibe: apelido, endereço completo, tamanho, observações do imóvel e função (Líder/Auxiliar)
    And os demais imóveis da semana não aparecem

  Scenario: Membro sem atribuições na semana
    Given que "Carol Santos" não está atribuída em nenhum imóvel na semana de 08/06
    When acessa "/minha-agenda"
    Then vê mensagem: "Você não tem agendamentos nesta semana."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Semana sem agenda gerada
    Given que não existe agenda para a semana de 15/06/2026
    When a gerente acessa a semana de 15/06
    Then o sistema exibe botão "Gerar Agenda" em destaque
    And mensagem: "A agenda desta semana ainda não foi gerada."
```

---

## Campos

*Esta feature é somente leitura — não possui formulário de entrada.*

---

## Comportamento de tela

### Onde fica
- Gerente: `/agenda` — visão completa em colunas por dia
- Membro: `/minha-agenda` — visão filtrada em lista

### Layout (Gerente)
Cabeçalho com seletor de semana (← semana atual →). Status badge (Rascunho/Confirmada). Grid de 5 colunas para dias úteis. Cada coluna mostra o nome do dia e a data. Cards de imóveis empilhados verticalmente. Footer com botão "Copiar para WhatsApp" e, se confirmada, "Reabrir Agenda".

### Layout (Membro)
Lista vertical, agrupada por dia. Para cada dia: data em destaque. Para cada imóvel: card com todas as informações relevantes para execução.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | Skeleton das colunas/cards |
| Sem agenda para a semana (Gerente) | Botão "Gerar Agenda" centralizado na tela |
| Sem agendamentos (Membro) | Mensagem vazia com ícone de calendário |
| Agenda em Rascunho (Gerente) | Banner amarelo no topo: "Rascunho — atribuição pendente" |
| Agenda Confirmada (Gerente) | Badge verde no topo; botão "Reabrir" |
| Item sem equipe (Gerente) | Card com borda laranja e badge "Sem equipe" |
| Erro de carregamento | Mensagem de erro com botão "Tentar novamente" |

---

<div class="dev-only">

## Mapeamento de campos
→ ver DATA-MODEL.md: Agenda Semanal · Item de Agenda · Membro do Item de Agenda

---

## API

### GET /api/v1/agendamento/agenda
**Acesso**: autenticado — role `GERENTE`

**Query params**:
```typescript
{ weekStart: string }  // ISO 8601 — segunda-feira da semana desejada
```

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": {
    "id": "uuid",
    "weekStart": "2026-06-08",
    "weekEnd": "2026-06-12",
    "status": "CONFIRMADA",
    "items": [
      {
        "id": "uuid",
        "cleaningDate": "2026-06-08",
        "dayOrder": 1,
        "property": { "id": "uuid", "nickname": "Casa da Maria — Oak St", "size": "M", "address": "...", "notes": "..." },
        "client": { "name": "Maria Johnson", "phone": "..." },
        "team": [
          { "memberId": "uuid", "name": "Ana Oliveira", "role": "LIDER" }
        ]
      }
    ]
  },
  "meta": null
}
```

---

### GET /api/v1/agendamento/minha-agenda
**Acesso**: autenticado — role `MEMBRO`

**Query params**:
```typescript
{ weekStart?: string }  // default: semana atual
```

**Resposta**: apenas itens onde o membro autenticado está atribuído

---

## Mapeamento de erros

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `AGENDA_NOT_FOUND` | 404 | Tela de "agenda não gerada" com botão de geração |
| `AUTH_FORBIDDEN` | 403 | Redirecionamento para `/minha-agenda` |
| `INTERNAL_ERROR` | 500 | "Não foi possível carregar a agenda. Tente novamente." |

---

## Arquivos a criar ou alterar

```
src/routes/agendamento.ts            ← GET /agenda e GET /minha-agenda
src/services/visualizacao.ts         ← montagem da resposta completa com joins
src/repositories/agendamento.ts      ← queries com Prisma include
```

</div>

---

## Métricas de tamanho

| Função de Transação | Tipo | Complexidade | PF |
|---|---|---|---|
| Visualizar Agenda (Gerente) | SE | Média | 5 |
| Visualizar Minha Agenda (Membro) | SE | Baixa | 4 |
| Gerar texto WhatsApp | SE | Baixa | 3 |

**Total: 12 PF**

---

## Implementação

**Status**: `[x] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: Agenda Semanal · Domínio: Agendamento · Última revisão: 2026-05-31*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
