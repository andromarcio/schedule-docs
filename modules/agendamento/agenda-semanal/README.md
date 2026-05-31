# Feature Set: Agenda Semanal
> **Nível 2** — Domínio: Agendamento

## Responsabilidade
Centraliza toda a operação semanal: geração automática da lista de imóveis a limpar na semana, atribuição de membros da equipe a cada imóvel em cada dia, e visualização consolidada da agenda para a gerente e para cada membro.

**Não faz**: manter cadastros de imóveis ou membros; faturar clientes; integrar com calendários externos.

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Gerar Agenda | [gerar-agenda.md](./gerar-agenda.md) | Cria automaticamente a agenda da semana com os imóveis a limpar, baseado em frequências e última limpeza |
| Atribuir Equipe | [atribuir-equipe.md](./atribuir-equipe.md) | Define quais membros ou helpers irão a cada imóvel em cada dia |
| Visualizar Agenda | [visualizar-agenda.md](./visualizar-agenda.md) | Exibe a agenda da semana por dia, com imóveis e equipe atribuída |

---

## Fluxo principal

```
[Segunda-feira de manhã — Gerente abre o app]
          │
          ├─→ [Gerar Agenda] ── sistema sugere imóveis por frequência → gerente ajusta → salva como Rascunho
          │         │
          │         ▼
          ├─→ [Atribuir Equipe] ── para cada imóvel, seleciona membros disponíveis → salva
          │         │
          │         ▼
          └─→ [Visualizar Agenda] ── gerente revisa → confirma agenda → equipe visualiza a própria semana

[Durante a semana]
          └─→ [Visualizar Agenda] ── membro abre app → vê sua agenda do dia → endereços e colegas
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Atribuir Equipe depende de Gerar Agenda | Só é possível atribuir equipe a uma agenda já gerada |
| Visualizar Agenda sempre disponível | A visualização não depende de confirmação — Rascunho também é visível para a Gerente |
| Confirmar Agenda está em Visualizar Agenda | O botão de confirmação fica na tela de visualização, após revisão |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Agenda da Semana | `/agenda` | Gerar Agenda (botão), Visualizar Agenda |
| Atribuição de Equipe | `/agenda/:semana/atribuir` | Atribuir Equipe |
| Agenda do Membro | `/minha-agenda` | Visualizar Agenda (visão filtrada pelo membro logado) |

---

## Permissões por perfil

| Perfil | Gerar Agenda | Atribuir Equipe | Confirmar Agenda | Visualizar (geral) | Visualizar (própria) |
|---|---|---|---|---|---|
| GERENTE | ✅ | ✅ | ✅ | ✅ | ✅ |
| MEMBRO | ❌ | ❌ | ❌ | ❌ | ✅ |

---

*Domínio: Agendamento · Última revisão: 2026-05-31*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
