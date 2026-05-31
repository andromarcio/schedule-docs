# MASTER.md
> Arquivo de contexto global. Cole em toda sessão com o Claude,
> independente do módulo ou nível que está sendo trabalhado.

---

## Identificação do sistema

- **Nome**: CleanSched
- **Descrição**: Sistema de gestão operacional de agendamento de limpeza residencial
- **Versão atual**: 1.0.0
- **Repositório de docs**: cleansched-docs

---

## Stack técnica

- **Frontend**: React 18 + TypeScript + Tailwind CSS (PWA, mobile-first)
- **Backend**: Node.js + Express + TypeScript
- **Banco de dados**: PostgreSQL 15 com Prisma ORM
- **Autenticação**: JWT (access token + refresh token); sem OAuth
- **Fila / Jobs**: sem fila nesta versão — processamento síncrono
- **Storage**: sem storage de arquivos nesta versão
- **Notificações**: geração de texto formatado para cópia manual no WhatsApp
- **Deploy**: Railway (backend + banco) + Vercel (frontend)

---

## Repositórios do sistema

| Repositório | Responsabilidade |
|---|---|
| cleansched-api | API REST, regras de negócio, acesso a banco |
| cleansched-web | Interface web PWA (React) |
| cleansched-docs | Documentação e especificações (este repo) |

---

## Convenções de código

### Nomenclatura
- Componentes React: PascalCase, um arquivo por componente
- Funções e variáveis: camelCase
- Constantes e enums: UPPER_SNAKE_CASE
- Rotas de API: kebab-case (ex: `/agenda-semanal`)
- Arquivos de teste: `[nome].spec.ts`

### TypeScript
- `strict: true` em todo o projeto
- Proibido o uso de `any` — usar `unknown` com type guard quando necessário
- Tipos de entidades gerados pelo Prisma — não redefinir manualmente

### Estrutura de pastas (backend Express)
```
/src
  /routes         → definição de rotas Express por domínio
  /controllers    → tratamento de request/response
  /services       → lógica de negócio
  /repositories   → acesso a dados (Prisma)
  /middlewares    → auth, validação, erros
  /validations    → schemas Zod por domínio
  /events         → publicação/consumo de eventos internos
  /lib
    db.ts         → instância Prisma
    auth.ts       → utilitários JWT
    audit.ts      → registro de auditoria
```

### Estrutura de pastas (frontend React)
```
/src
  /pages          → telas principais (uma por rota)
  /components
    /ui           → componentes genéricos reutilizáveis
    /[modulo]     → componentes específicos de cada módulo
  /hooks          → custom hooks
  /services       → chamadas à API
  /stores         → estado global (Zustand)
  /validations    → schemas Zod compartilhados
```

---

## Nomenclatura de campos — três camadas

A nomenclatura de campos segue três camadas com responsabilidades distintas.
**A única fonte de verdade para Label Dev e campo banco é o `global/DATA-MODEL.md`.**
Os N3 usam apenas Label PO — nunca duplicam as camadas técnicas.

| Camada | Convenção | Exemplo | Onde aparece |
|---|---|---|---|
| Label PO | Português, title case, sem jargão | `Nome completo` | N3 (tabela de campos), Gherkin, telas |
| Label Dev | camelCase, inglês, autoexplicativo | `fullName` | DATA-MODEL.md, código, API |
| Campo banco | snake_case, inglês | `full_name` | DATA-MODEL.md, migrations, ORM |

---

## Campos globais obrigatórios em toda tabela

> ⚠️ Este sistema é **single-tenant** — não há campo `organization_id`.

| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| id | id | uuid | PK; gerado automaticamente |
| createdAt | created_at | timestamptz | Gerado automaticamente |
| updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| deletedAt | deleted_at | timestamptz | Soft delete; null = ativo |

---

## Perfis de acesso

| Perfil | Descrição | Permissões |
|---|---|---|
| GERENTE | Dona do negócio | Acesso total a todas as funcionalidades |
| MEMBRO | Funcionária fixa | Visualiza apenas a própria agenda; registra disponibilidade |

---

## Regras globais de negócio

1. **Soft delete universal**: registros nunca são removidos fisicamente
2. **IDs em URLs**: sempre UUID — nunca IDs sequenciais
3. **Paginação**: cursor-based; padrão 20 itens
4. **Validação**: Zod em frontend e backend; nunca confiar apenas no client
5. **Auditoria**: ações críticas registradas em `AuditLog`
6. **Semana de trabalho**: segunda a sexta-feira (Monday–Friday)
7. **Limite de casas por dia**: máximo 5 imóveis por dia na agenda

---

## Padrão de resposta de API

```typescript
// Sucesso com dado único
{ "data": { ...objeto }, "meta": null }

// Sucesso com lista
{ "data": [...], "meta": { "total": 0, "nextCursor": null, "prevCursor": null } }

// Erro
{ "data": null, "error": { "code": "ENTIDADE_ERRO", "message": "...", "details": [] } }
```

---

## O que NUNCA fazer

- Usar `any` no TypeScript
- Expor IDs sequenciais do banco em URLs ou respostas
- Remover registros fisicamente do banco
- Lançar exceções cruas — sempre retornar envelope de erro padronizado
- Duplicar Label Dev ou campo banco nos N3 — essas informações vivem apenas no DATA-MODEL.md
- Atribuir membro indisponível a agenda sem aviso explícito
- Confirmar agenda com imóvel sem nenhum membro atribuído

---

## Arquivos globais de referência

| Arquivo | Propósito |
|---|---|
| `global/MASTER.md` | Stack, convenções globais (este arquivo) |
| `global/DATA-MODEL.md` | Índice de entidades + campos globais + enums |
| `global/SIZING.md` | Convenções de contagem APF e COSMIC |
| `global/RULES-DICTIONARY.md` | Regras de negócio canônicas |
| `global/FIELD-DICTIONARY.md` | Campos canônicos (telefone, endereço…) |
| `global/ERROR-DICTIONARY.md` | Fonte única de códigos de erro |
| `global/API-PATTERNS.md` | Padrões de API |
| `global/DESIGN-SYSTEM.md` | Padrões de UI |
| `N0_PRODUCT_VISION.md` | Visão estratégica, personas e KPIs |
