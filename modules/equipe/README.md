<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Domínio: Equipe
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
Este domínio gerencia as pessoas que realizam os serviços de limpeza: as membros fixas da equipe e as helpers contratadas de forma avulsa. Também centraliza o registro de disponibilidade de cada membro, informação essencial para a montagem correta da agenda semanal.

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| Atribuir membros a imóveis específicos | Domínio: Agendamento |
| Definir quantas casas a equipe vai atender por dia | Domínio: Agendamento |
| Registrar o histórico de limpezas realizadas | Domínio: Agendamento |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Gestão de Membros](./gestao-membros/README.md) | `equipe/gestao-membros/` | Cadastro de membros fixas, disponibilidade e inativação | 3 |
| [Gestão de Helpers](./gestao-helpers/README.md) | `equipe/gestao-helpers/` | Cadastro de helpers avulsas para cobertura | 1 |

---

## Regras transversais do domínio

1. Membro inativo não aparece para atribuição na agenda. → ver RULES-DICTIONARY: Soft delete não remove vinculados
2. Membro marcado como indisponível em uma data não pode ser atribuído a nenhuma limpeza nessa data. → ver RULES-DICTIONARY: Membro indisponível não pode ser atribuído
3. Helpers não possuem registro sistemático de disponibilidade — são consideradas disponíveis por padrão quando cadastradas.
4. Um membro pode ter no máximo um registro de disponibilidade por dia (disponível ou indisponível).
5. Disponibilidade pode ser registrada com antecedência para dias futuros; não é possível registrar para datas passadas.

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| Agendamento | Lista de membros ativos e suas disponibilidades por data | Leitura direta (FK) |

### Escrita — domínios que criam ou alteram dados deste domínio
| Domínio | O que altera | Situação |
|---|---|---|
| — | Nenhum domínio externo altera dados de Equipe | — |

---

<div class="dev-only">

## Entidades do domínio

| Entidade | Descrição | Campos no DATA-MODEL.md |
|---|---|---|
| Membro da Equipe | Funcionária fixa ou helper cadastrada | → ver DATA-MODEL.md: Membro da Equipe |
| Disponibilidade | Registro de disponibilidade diária de um membro | → ver DATA-MODEL.md: Disponibilidade |

---

## Dependências externas

| Serviço | Uso | Lib sugerida |
|---|---|---|
| — | Sem dependências externas nesta versão | — |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| GERENTE | CRUD completo de membros e helpers; registrar disponibilidade de qualquer membro; inativar |
| MEMBRO | Registrar e editar a própria disponibilidade; visualizar lista de colegas (sem dados sensíveis) |

---

</div>

---

*Última revisão: 2026-05-31*
*Links: [Gestão de Membros](./gestao-membros/README.md) · [Gestão de Helpers](./gestao-helpers/README.md) · [INDEX geral](../INDEX.md)*
