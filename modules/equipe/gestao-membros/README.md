# Feature Set: Gestão de Membros
> **Nível 2** — Domínio: Equipe

## Responsabilidade
Permite à gerente cadastrar e manter os dados das membros fixas da equipe, bem como que cada membro registre sua própria disponibilidade semanal. É com base nessas informações que a agenda semanal é corretamente atribuída.

**Não faz**: cadastrar helpers avulsas (isso está em Gestão de Helpers); nem atribuir membros a imóveis (isso é do Agendamento).

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Cadastrar Membro | [cadastrar-membro.md](./cadastrar-membro.md) | Registra nova membro fixa da equipe |
| Registrar Disponibilidade | [registrar-disponibilidade.md](./registrar-disponibilidade.md) | Informa se a membro estará disponível ou não em uma data específica |
| Inativar Membro | [inativar-membro.md](./inativar-membro.md) | Marca a membro como inativa, preservando histórico |

---

## Fluxo principal

```
[Gerente acessa lista de membros]
          │
          ├─→ [Cadastrar Membro] ── preenche nome + telefone → salva → cria usuário no app
          │
          ├─→ [Inativar Membro] ── seleciona membro → confirma → inativa
          │
[Membro acessa o app]
          │
          └─→ [Registrar Disponibilidade] ── seleciona data → marca disponível/indisponível → salva
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Registrar Disponibilidade depende de Cadastrar | Apenas membros cadastradas podem registrar disponibilidade |
| Inativar preserva histórico de disponibilidade | Ver RULES-DICTIONARY: Soft delete não remove vinculados |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Lista de Membros | `/equipe` | Ponto de entrada; acesso a cadastrar e inativar |
| Cadastro de Membro | `/equipe/novo` | Cadastrar Membro |
| Disponibilidade | `/equipe/disponibilidade` | Registrar Disponibilidade (visão de calendário semanal) |

---

## Permissões por perfil

| Perfil | Cadastrar | Registrar Disponibilidade | Inativar | Visualizar |
|---|---|---|---|---|
| GERENTE | ✅ | ✅ (qualquer membro) | ✅ | ✅ |
| MEMBRO | ❌ | ✅ (apenas a própria) | ❌ | ✅ (lista básica) |

---

*Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
