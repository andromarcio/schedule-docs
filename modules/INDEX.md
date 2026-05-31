# Índice geral de módulos — CleanSched
> Visão consolidada de todos os domínios do sistema.

---

## Domínios

| Domínio | Pasta | Responsabilidade | Feature Sets |
|---|---|---|---|
| [Clientes e Imóveis](./clientes-imoveis/README.md) | `modules/clientes-imoveis/` | Cadastro e gestão de clientes e seus imóveis para limpeza | 2 |
| [Equipe](./equipe/README.md) | `modules/equipe/` | Gestão de membros fixos, helpers e disponibilidade | 2 |
| [Agendamento](./agendamento/README.md) | `modules/agendamento/` | Geração e gestão da agenda semanal de limpezas | 1 |

---

## Rastreabilidade: spec → código

| Feature | Domínio | Status | PF | Repositórios |
|---|---|---|---|---|
| Cadastrar Cliente | Clientes e Imóveis | 📋 Especificado | 4 | — |
| Editar Cliente | Clientes e Imóveis | 📋 Especificado | 3 | — |
| Inativar Cliente | Clientes e Imóveis | 📋 Especificado | 3 | — |
| Cadastrar Imóvel | Clientes e Imóveis | 📋 Especificado | 4 | — |
| Editar Imóvel | Clientes e Imóveis | 📋 Especificado | 3 | — |
| Inativar Imóvel | Clientes e Imóveis | 📋 Especificado | 3 | — |
| Cadastrar Membro | Equipe | 📋 Especificado | 4 | — |
| Registrar Disponibilidade | Equipe | 📋 Especificado | 4 | — |
| Inativar Membro | Equipe | 📋 Especificado | 3 | — |
| Cadastrar Helper | Equipe | 📋 Especificado | 3 | — |
| Gerar Agenda | Agendamento | 📋 Especificado | 6 | — |
| Atribuir Equipe | Agendamento | 📋 Especificado | 5 | — |
| Visualizar Agenda | Agendamento | 📋 Especificado | 4 | — |

**Total vigente: 49 PF**

---

## Entidades consolidadas

| Entidade | Domínio | N1 de origem |
|---|---|---|
| Cliente | Clientes e Imóveis | [clientes-imoveis/README.md](./clientes-imoveis/README.md) |
| Imóvel | Clientes e Imóveis | [clientes-imoveis/README.md](./clientes-imoveis/README.md) |
| Membro da Equipe | Equipe | [equipe/README.md](./equipe/README.md) |
| Disponibilidade | Equipe | [equipe/README.md](./equipe/README.md) |
| Agenda Semanal | Agendamento | [agendamento/README.md](./agendamento/README.md) |
| Item de Agenda | Agendamento | [agendamento/README.md](./agendamento/README.md) |
| Membro do Item de Agenda | Agendamento | [agendamento/README.md](./agendamento/README.md) |

---

## Eventos do sistema

| Evento | Publicado por | Consumido por | Payload principal |
|---|---|---|---|
| `imovel.inativado` | Clientes e Imóveis | Agendamento | `{ propertyId }` |
| `cliente.inativado` | Clientes e Imóveis | Clientes e Imóveis (cascata de imóveis) | `{ clientId }` |
| `agenda.confirmada` | Agendamento | Clientes e Imóveis (atualiza lastCleanedAt) | `{ scheduleId, items[] }` |
| `disponibilidade.registrada` | Equipe | Agendamento | `{ memberId, date, available }` |

---

## Mapa de integrações entre domínios

| Domínio origem | Depende de | Tipo | Descrição |
|---|---|---|---|
| Agendamento | Clientes e Imóveis | Leitura | Lê imóveis ativos e frequências para gerar agenda |
| Agendamento | Equipe | Leitura | Lê membros ativos e disponibilidades para sugerir atribuição |
| Agendamento | Clientes e Imóveis | Escrita (via evento) | Atualiza `lastCleanedAt` ao confirmar agenda |
| Clientes e Imóveis | — | — | Domínio sem dependências externas |
| Equipe | — | — | Domínio sem dependências externas |

---

## Legenda de status

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |
