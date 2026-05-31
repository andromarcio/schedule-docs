# Data Model: Agendamento
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Agendamento.
>
> **ALIs deste domínio**: ALI Agendamento
> Detalhes de contagem: seção `## Arquivos Lógicos` no rodapé deste arquivo.

---

## Agenda Semanal
> **ALI: ALI Agendamento** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Início da semana | weekStart | week_start | date | sim | Sempre uma segunda-feira |
| Fim da semana | weekEnd | week_end | date | sim | Sempre uma sexta-feira |
| Status | status | status | enum(RASCUNHO,CONFIRMADA) | automático | Default RASCUNHO |
| Observações | notes | notes | text | não | Anotações gerais da semana |

---

## Item de Agenda
> **ALI: ALI Agendamento** · entidade de suporte (imóvel agendado para um dia)

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Agenda | scheduleId | schedule_id | uuid | sim | FK → agenda_semanal.id |
| Imóvel | propertyId | property_id | uuid | sim | FK → imoveis.id |
| Data de limpeza | cleaningDate | cleaning_date | date | sim | Dia específico dentro da semana |
| Ordem no dia | dayOrder | day_order | smallint | automático | 1 a 5; ordem de atendimento no dia |
| Concluído | completed | completed | boolean | automático | Default false; true ao confirmar execução |
| Observações | notes | notes | text | não | Observações específicas desta limpeza |

---

## Membro do Item de Agenda
> **ALI: ALI Agendamento** · entidade de suporte (atribuição de membro a um item)
> Tabela de junção com campo de negócio (role), portanto pertence ao ALI principal.

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Item de Agenda | scheduleItemId | schedule_item_id | uuid | sim | FK → agenda_items.id |
| Membro | memberId | member_id | uuid | sim | FK → membro_equipe.id |
| Função | role | role | enum(LIDER,AUXILIAR) | sim | LIDER=responsável; AUXILIAR=apoio |

---

## Arquivos Lógicos deste domínio

> DET calculado excluindo os 4 campos globais (id, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

| ALI / AIE | Tipo | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| ALI Agendamento | ALI | Agenda Semanal (principal) · Item de Agenda · Membro do Item | 3 | 14 | Alta | 15 |

**Total deste domínio: 15 PF**

<details>
<summary>Memória de cálculo</summary>

**ALI: Agendamento**
- RET: 3 (três subgrupos distintos: Agenda, Item, Membro do Item)
- DET Agenda Semanal: weekStart, weekEnd, status, notes = 4
- DET Item de Agenda: scheduleId, propertyId, cleaningDate, dayOrder, completed, notes = 6
- DET Membro do Item: scheduleItemId, memberId, role = 3 (FKs contam como DETs de negócio + campo role)
- DET total: **13** (excluindo campos globais; scheduleId e propertyId contam pois referenciam negócio)
- Complexidade: RET 3 × DET 13 → tabela SIZING.md → **Alta → 15 PF**

</details>
