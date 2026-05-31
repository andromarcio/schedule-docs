# Visão Estratégica de Produto
> **Objetivo**: prover contexto de negócio, perfil dos usuários e métricas de sucesso para balizar as inferências feitas pelo LLM durante as sessões de especificação de N1, N2 e N3.
---

## 1. Propósito geral do sistema

**CleanSched** é um sistema de gestão operacional para pequenos negócios de limpeza residencial. Ele permite que a gestora cadastre os imóveis dos clientes, organize sua equipe e gere a agenda semanal de limpezas de forma rápida e sem papel.

O sistema resolve dois problemas centrais: (1) saber quais imóveis precisam ser limpos em cada semana, respeitando a frequência contratada de cada cliente; e (2) definir quais membros da equipe vão a cada imóvel, considerando disponibilidade e possível necessidade de contratação de helpers avulsos.

---

## 2. Personas e usuários principais

### Gerente — a dona do negócio
- **Perfil**: Empreendedora individual; opera o negócio de limpeza; usa principalmente o celular; não tem perfil técnico.
- **Objetivos principais**: Cadastrar e manter os imóveis dos clientes; gerar a agenda toda semana; saber rapidamente quem vai a qual casa; controlar a disponibilidade da equipe.
- **Dores / Desafios**: Hoje faz tudo no WhatsApp e em anotações físicas; perde tempo confirmando disponibilidade de cada membro; esquece qual casa é mensal ou quinzenal.

### Membro da equipe
- **Perfil**: Funcionária fixa; acessa o sistema no celular; não cria nem edita agendas.
- **Objetivos principais**: Ver sua agenda da semana; informar quando não pode trabalhar em determinada data.
- **Dores / Desafios**: Recebe a agenda pelo WhatsApp em texto; não tem visão clara dos dias e casas que vai atender.

### Helper (contratada avulsa)
- **Perfil**: Profissional autônoma contratada pontualmente quando um membro fixo está indisponível.
- **Objetivos principais**: Receber as informações do trabalho do dia (endereço, horário).
- **Dores / Desafios**: Recebe orientações apenas via WhatsApp; não acessa o sistema diretamente.

---

## 3. Métricas de sucesso (KPIs)

| Métrica | Meta | Como medir |
|---|---|---|
| Tempo para gerar agenda semanal | Reduzir de ~40 min para menos de 10 min | Relato da gestora |
| Agendas com conflito de disponibilidade | Zero agendas com membro indisponível atribuído | Contagem de retrabalho semanal |
| Casas perdidas (esquecidas na agenda) | Zero imóveis ativos sem agendamento na frequência correta | Auditoria mensal |
| Adoção pela equipe | 100% dos membros fixos registrando disponibilidade no app | % de disponibilidade preenchida via sistema vs WhatsApp |

---

## 4. Tom de voz e princípios de UX

| Princípio | Descrição |
|---|---|
| Mobile-first, simples | A interface deve funcionar bem no celular com uma mão; sem menus complexos |
| Linguagem do negócio | Usar termos que a gestora já usa: "casa P", "quinzenal", "helper"; nunca jargão técnico |
| Velocidade na operação semanal | O fluxo de gerar e confirmar agenda deve ter no máximo 3 telas |
| Feedback claro | Toda ação deve ter confirmação visual imediata; erros em português claro e orientativo |
| Zero ambiguidade no agendamento | Data, membro e imóvel devem sempre aparecer juntos — nunca informação parcial |

---

## 5. Restrições e premissas globais

- O sistema é **single-tenant**: uma única empresa, sem multitenancy.
- O acesso é feito exclusivamente via **navegador mobile** (PWA instalável); não há app nativo.
- Todos os dados são do território dos **Estados Unidos** — endereços e telefones no formato americano.
- **Não há integração com sistemas de pagamento** — o faturamento é externo ao escopo.
- A agenda semanal considera **segunda a sexta** como dias úteis de trabalho.
- Um imóvel de **frequência mensal** é agendado na primeira semana de cada mês por padrão.
- Um imóvel de **frequência quinzenal** alterna entre a 1ª e 3ª semana do mês.
- O sistema deve funcionar com **conexão de internet intermitente** — ações críticas exibem erro claro quando offline.
- **Soft delete** em todos os registros — nenhum dado é removido fisicamente.
- **Notificações via WhatsApp** são geradas como texto copiável; não há integração automática com WhatsApp nesta versão.

---

*Documento raiz do sistema — referenciar no MASTER.md e incluir nas sessões de criação de N1 e N2.*
