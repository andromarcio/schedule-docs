# RULES-DICTIONARY.md
> Dicionário de regras de negócio canônicas do sistema CleanSched.
> Regras listadas aqui se repetem em múltiplas features e têm
> comportamento definido e aprovado. Referencie em vez de repetir.
>
> Notação de referência no N3:
> `→ ver RULES-DICTIONARY: [nome da regra]`

---

## Quando usar este dicionário

Use RULES-DICTIONARY quando uma regra:
- Aparece em duas ou mais features distintas, E
- Não é global do sistema (essas vão no MASTER.md), E
- Não é exclusiva de um domínio (essas vão no N1 como regra transversal)

---

## Índice de regras canônicas

| Regra | Categoria | Features onde aparece |
|---|---|---|
| [Membro indisponível não pode ser atribuído](#membro-indisponível-não-pode-ser-atribuído) | Equipe / Agendamento | Atribuir Equipe, Gerar Agenda |
| [Limite de 5 imóveis por dia](#limite-de-5-imóveis-por-dia) | Agendamento | Gerar Agenda, Atribuir Equipe |
| [Agenda confirmada é imutável](#agenda-confirmada-é-imutável) | Agendamento | Atribuir Equipe, Visualizar Agenda |
| [Imóvel inativo não gera agenda](#imóvel-inativo-não-gera-agenda) | Imóveis / Agendamento | Gerar Agenda, Inativar Imóvel |
| [Soft delete não remove vinculados](#soft-delete-não-remove-vinculados) | Integridade | Inativar Cliente, Inativar Membro |

---

## Regras canônicas

---

### Membro indisponível não pode ser atribuído

**Código**: `RN-EQ-AG-001`

**Descrição**: Um membro da equipe que possui registro de `Disponibilidade` com `available = false` para uma data específica não pode ser atribuído como lider ou auxiliar em nenhum item de agenda nessa mesma data.

**Parâmetros**: data da limpeza, lista de membros com `available = false` nessa data.

**Comportamento**:
- O sistema filtra automaticamente membros indisponíveis da lista de seleção ao atribuir equipe.
- Se o usuário tentar forçar a atribuição via API, retorna erro `MEMBRO_INDISPONIVEL`.
- Helpers sem registro de disponibilidade são considerados disponíveis por padrão.

```gherkin
Rule: Membro indisponível não pode ser atribuído a uma limpeza

  Scenario: Tentativa de atribuir membro indisponível
    Given que a membro "Ana" possui disponibilidade registrada como indisponível para "2026-06-02"
    When o gerente tenta atribuir "Ana" à limpeza de "Casa da Maria" em "2026-06-02"
    Then o sistema exibe: "Ana está indisponível nesta data."
    And a atribuição não é salva

  Scenario: Membro sem registro de disponibilidade é considerado disponível
    Given que a membro "Carol" não tem registro de disponibilidade para "2026-06-02"
    When o gerente atribui "Carol" à limpeza de "Casa da Maria" em "2026-06-02"
    Then a atribuição é salva com sucesso
```

**Features onde aparece**: Atribuir Equipe, Gerar Agenda

---

### Limite de 5 imóveis por dia

**Código**: `RN-AG-001`

**Descrição**: Em qualquer dia da semana, a agenda pode conter no máximo 5 imóveis agendados. Tentativas de adicionar um sexto imóvel ao mesmo dia são bloqueadas.

**Parâmetros**: data do dia, contagem de itens já agendados para essa data.

**Comportamento**:
- Ao gerar agenda automaticamente, o sistema distribui imóveis respeitando o limite.
- Ao adicionar manualmente, o sistema bloqueia e exibe mensagem de erro.

```gherkin
Rule: Máximo de 5 imóveis por dia

  Scenario: Tentativa de adicionar 6º imóvel no mesmo dia
    Given que a agenda da semana de 02/06/2026 já tem 5 imóveis na segunda-feira
    When o gerente tenta adicionar mais um imóvel para segunda-feira
    Then o sistema exibe: "Este dia já atingiu o limite de 5 casas."
    And o imóvel não é adicionado
```

**Features onde aparece**: Gerar Agenda, Atribuir Equipe

---

### Agenda confirmada é imutável

**Código**: `RN-AG-002`

**Descrição**: Uma vez que a agenda semanal tem status `CONFIRMADA`, nenhum item pode ser adicionado, removido ou alterado, e nenhuma atribuição de equipe pode ser modificada. Apenas o perfil `GERENTE` pode reverter o status para `RASCUNHO`.

**Parâmetros**: status da agenda.

**Comportamento**:
- Botões de edição são desabilitados visualmente para agendas confirmadas.
- Tentativas via API retornam `AGENDA_JA_CONFIRMADA`.
- Reabrir uma agenda confirmada requer ação explícita do Gerente com confirmação modal.

```gherkin
Rule: Agenda confirmada bloqueia alterações

  Scenario: Tentativa de alterar agenda confirmada
    Given que a agenda da semana de 02/06/2026 está com status "Confirmada"
    When o gerente tenta alterar a atribuição de equipe de um item
    Then o sistema exibe: "A agenda desta semana já foi confirmada. Reabra-a para fazer alterações."
    And a alteração não é salva
```

**Features onde aparece**: Atribuir Equipe, Visualizar Agenda

---

### Imóvel inativo não gera agenda

**Código**: `RN-CI-001`

**Descrição**: Imóveis com `active = false` são excluídos completamente da geração automática de agenda e não aparecem na lista de imóveis disponíveis para adição manual.

**Parâmetros**: campo `active` do imóvel.

**Comportamento**:
- Inativar um imóvel não cancela agendas já geradas para semanas futuras — o gerente deve removê-las manualmente.
- Imóveis inativos aparecem apenas no histórico de limpezas já concluídas.

```gherkin
Rule: Imóvel inativo não entra na agenda

  Scenario: Geração de agenda com imóvel inativo
    Given que o imóvel "Casa da Sarah" está inativo
    When o gerente gera a agenda para a semana de 08/06/2026
    Then "Casa da Sarah" não aparece na agenda gerada
    And os demais imóveis ativos são incluídos normalmente
```

**Features onde aparece**: Gerar Agenda, Inativar Imóvel

---

### Soft delete não remove vinculados

**Código**: `RN-GLOBAL-001`

**Descrição**: Ao inativar um Cliente ou Membro da equipe, os registros vinculados (imóveis, disponibilidades, itens de agenda) são preservados integralmente. A inativação é apenas lógica.

**Parâmetros**: entidade sendo inativada (Cliente ou Membro).

**Comportamento**:
- Cliente inativado: seus imóveis permanecem no banco e no histórico, mas são automaticamente inativados junto.
- Membro inativado: seu histórico de disponibilidades e atribuições passadas é preservado.
- Registros futuros: imóveis do cliente inativado não geram agenda; membro inativo não aparece para atribuição.

```gherkin
Rule: Inativação preserva histórico

  Scenario: Inativar cliente com imóveis cadastrados
    Given que o cliente "John Smith" possui 3 imóveis ativos
    When o gerente inativa "John Smith"
    Then o cliente aparece como inativo no sistema
    And os 3 imóveis de "John Smith" são automaticamente inativados
    And o histórico de limpezas passadas permanece acessível
```

**Features onde aparece**: Inativar Cliente, Inativar Membro
