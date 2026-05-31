# Feature Set: Gestão de Helpers
> **Nível 2** — Domínio: Equipe

## Responsabilidade
Permite à gerente cadastrar helpers — profissionais autônomas contratadas de forma avulsa para cobrir ausências de membros fixas. Helpers não têm acesso ao app e não registram disponibilidade, mas ficam disponíveis para seleção na atribuição de equipe na agenda.

**Não faz**: gerenciar membros fixas (isso está em Gestão de Membros); nem atribuir helpers diretamente (isso é do Agendamento).

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Listar Helpers | [listar-helpers.md](./listar-helpers.md) | Exibe lista de helpers com busca por nome e filtro por status |
| Cadastrar Helper | [cadastrar-helper.md](./cadastrar-helper.md) | Registra uma helper avulsa com nome e telefone de contato |

---

## Fluxo principal

```
[Gerente identifica necessidade de helper para uma semana]
          │
          └─→ [Cadastrar Helper] ── verifica se já existe → se não, cadastra → disponível para atribuição
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Helper deve estar cadastrada para ser atribuída | O sistema não permite atribuição de pessoas fora do cadastro |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Lista de Helpers | `/equipe/helpers` | Visualizar helpers cadastradas; acesso a cadastrar |
| Cadastro de Helper | `/equipe/helpers/novo` | Cadastrar Helper |

---

## Permissões por perfil

| Perfil | Cadastrar | Visualizar |
|---|---|---|
| GERENTE | ✅ | ✅ |
| MEMBRO | ❌ | ❌ |

---

*Domínio: Equipe · Última revisão: 2026-05-31*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
