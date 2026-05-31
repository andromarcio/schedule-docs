# Feature Set: Gestão de Clientes
> **Nível 2** — Domínio: Clientes e Imóveis

## Responsabilidade
Permite à gerente cadastrar, atualizar e inativar os clientes — as pessoas responsáveis pelos imóveis atendidos. Um cliente é quem paga pelo serviço e é o ponto de contato para questões sobre determinado imóvel.

**Não faz**: gerenciar os imóveis do cliente (isso está em Gestão de Imóveis); nem registrar pagamentos.

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Cadastrar Cliente | [cadastrar-cliente.md](./cadastrar-cliente.md) | Registra um novo cliente com nome e telefone |
| Editar Cliente | [editar-cliente.md](./editar-cliente.md) | Atualiza os dados de um cliente existente |
| Inativar Cliente | [inativar-cliente.md](./inativar-cliente.md) | Marca o cliente como inativo, inativando seus imóveis em cascata |

---

## Fluxo principal

```
[Gerente acessa lista de clientes]
          │
          ├─→ [Cadastrar Cliente] ── preenche nome + telefone → salva
          │
          ├─→ [Editar Cliente] ── seleciona cliente → edita campos → salva
          │
          └─→ [Inativar Cliente] ── seleciona cliente → confirma modal → inativa (cascata nos imóveis)
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Editar / Inativar dependem de Cadastrar | Só é possível editar ou inativar clientes já cadastrados |
| Inativar cascateia em Imóveis | A inativação do cliente aciona a inativação de todos os seus imóveis |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Lista de Clientes | `/clientes` | ponto de entrada; acesso a Editar e Inativar |
| Cadastro / Edição de Cliente | `/clientes/novo` · `/clientes/:id/editar` | Cadastrar Cliente, Editar Cliente |

---

## Permissões por perfil

| Perfil | Cadastrar | Editar | Inativar | Visualizar |
|---|---|---|---|---|
| GERENTE | ✅ | ✅ | ✅ | ✅ |
| MEMBRO | ❌ | ❌ | ❌ | ❌ |

---

*Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
