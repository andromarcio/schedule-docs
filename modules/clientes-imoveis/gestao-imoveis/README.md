# Feature Set: Gestão de Imóveis
> **Nível 2** — Domínio: Clientes e Imóveis

## Responsabilidade
Permite à gerente cadastrar, atualizar e inativar os imóveis que serão atendidos pelo serviço de limpeza. Cada imóvel possui endereço, tamanho, frequência de limpeza e é sempre vinculado a um cliente responsável.

**Não faz**: agendar a limpeza dos imóveis (isso é responsabilidade do domínio Agendamento); nem gerir dados do cliente proprietário.

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Listar Imóveis | [listar-imoveis.md](./listar-imoveis.md) | Exibe lista de imóveis com filtros por cliente, frequência e status |
| Cadastrar Imóvel | [cadastrar-imovel.md](./cadastrar-imovel.md) | Registra novo imóvel vinculado a um cliente com endereço, tamanho e frequência |
| Editar Imóvel | [editar-imovel.md](./editar-imovel.md) | Atualiza dados de um imóvel existente |
| Inativar Imóvel | [inativar-imovel.md](./inativar-imovel.md) | Marca o imóvel como inativo, excluindo-o das futuras gerações de agenda |

---

## Fluxo principal

```
[Gerente acessa lista de imóveis (filtrada por cliente ou geral)]
          │
          ├─→ [Cadastrar Imóvel] ── seleciona cliente → preenche dados → salva
          │
          ├─→ [Editar Imóvel] ── seleciona imóvel → edita → salva
          │
          └─→ [Inativar Imóvel] ── seleciona imóvel → confirma → inativa
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Cadastrar Imóvel depende de Cliente ativo | Não é possível cadastrar imóvel para cliente inativo |
| Editar / Inativar dependem de Cadastrar | Só é possível editar ou inativar imóveis já cadastrados |
| Inativar bloqueia se houver agenda futura | Imóvel com limpezas futuras confirmadas não pode ser inativado diretamente |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Lista de Imóveis | `/imoveis` | ponto de entrada; filtro por cliente, tamanho, frequência |
| Cadastro / Edição de Imóvel | `/imoveis/novo` · `/imoveis/:id/editar` | Cadastrar Imóvel, Editar Imóvel |

---

## Permissões por perfil

| Perfil | Cadastrar | Editar | Inativar | Visualizar |
|---|---|---|---|---|
| GERENTE | ✅ | ✅ | ✅ | ✅ |
| MEMBRO | ❌ | ❌ | ❌ | ✅ (apenas imóveis da própria agenda) |

---

*Domínio: Clientes e Imóveis · Última revisão: 2026-05-31*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
