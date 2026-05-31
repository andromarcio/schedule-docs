# Changelog — Versão Inicial: Especificação Completa do CleanSched

**Data**: 2026-05-31
**Autor**: Proposta inicial — sistema criado do zero
**Tipo**: Nova especificação (versão 1.0.0)
**Artefatos afetados**: Todos os arquivos globais, todos os módulos N1/N2/N3

---

## Motivação

Criação do sistema **CleanSched** para atender à necessidade operacional de uma microempresa de limpeza residencial. O sistema substitui o controle manual via WhatsApp e anotações físicas por uma solução digital mobile-first.

---

## O que foi criado

### Arquivos globais

| Arquivo | Descrição |
|---|---|
| `N0_PRODUCT_VISION.md` | Visão estratégica, personas (Gerente, Membro, Helper), KPIs e restrições |
| `global/MASTER.md` | Stack técnica, convenções, perfis de acesso, padrão de API |
| `global/DATA-MODEL.md` | Índice de entidades, enums e relacionamentos |
| `global/RULES-DICTIONARY.md` | 5 regras canônicas do sistema |
| `global/FIELD-DICTIONARY.md` | Campos canônicos (telefone, e-mail, endereço) |
| `global/ERROR-DICTIONARY.md` | 21 códigos de erro organizados por domínio |
| `global/data-models/clientes-imoveis.md` | Entidades Cliente e Imóvel com ALI |
| `global/data-models/equipe.md` | Entidades Membro e Disponibilidade com ALI |
| `global/data-models/agendamento.md` | Entidades Agenda, Item e AtribuiçãoMembro com ALI |

### Módulos (N1, N2, N3)

| Domínio | N1 | N2s | N3s |
|---|---|---|---|
| Clientes e Imóveis | ✅ | Gestão de Clientes, Gestão de Imóveis | Cadastrar/Editar/Inativar Cliente; Cadastrar/Editar/Inativar Imóvel |
| Equipe | ✅ | Gestão de Membros, Gestão de Helpers | Cadastrar/Inativar Membro; Registrar Disponibilidade; Cadastrar Helper |
| Agendamento | ✅ | Agenda Semanal | Gerar Agenda; Atribuir Equipe; Visualizar Agenda |

### Decisões e rastreabilidade

| Arquivo | Descrição |
|---|---|
| `decisions/ADR-001-stack-tecnologico.md` | Justificativa da escolha de React + Node + PostgreSQL + Railway |
| `modules/INDEX.md` | Índice consolidado de domínios, features, eventos e integrações |

---

## Totais de sizing

| Tipo | Quantidade | PF total |
|---|---|---|
| ALIs | 4 | 39 PF |
| Features (EE/SE) | 13 | ~49 PF (transações) |
| **Total estimado** | — | **~88 PF** |

---

## Status dos artefatos

- [x] N0 — Visão estratégica
- [x] N1 — Todos os 3 domínios especificados
- [x] N2 — Todos os 5 feature sets especificados
- [x] N3 negocial — Todas as 13 features especificadas
- [x] N3 técnico — Seções dev-only incluídas em todos os N3
- [x] DATA-MODEL — Todos os fragmentos por domínio criados
- [x] RULES-DICTIONARY — 5 regras canônicas documentadas
- [x] ERROR-DICTIONARY — 21 códigos de erro catalogados
- [x] ADR-001 — Stack tecnológica documentada
- [ ] Protótipos — Pendente (próxima fase)
- [ ] SDD — Pendente (usar PROMPT_SDD.md)
- [ ] QA Plan — Pendente (usar PROMPT_QA.md)
