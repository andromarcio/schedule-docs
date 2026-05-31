# MASTER.md
> Arquivo de contexto global. Cole em toda sessão com o Claude,
> independente do módulo ou nível que está sendo trabalhado.

---

## Identificação do sistema

- **Nome**: [Nome do sistema]
- **Descrição**: [Uma frase descrevendo o propósito do sistema]
- **Versão atual**: [ex: 1.0.0]
- **Repositório de docs**: [URL]

---

## Stack técnica

- **Frontend**: [ex: Next.js 14, TypeScript, Tailwind CSS]
- **Backend**: [ex: Node.js, Express / Next.js API Routes]
- **Banco de dados**: [ex: PostgreSQL com Prisma ORM]
- **Autenticação**: [ex: NextAuth.js com Google Provider]
- **Fila / Jobs**: [ex: BullMQ + Redis]
- **Storage**: [ex: AWS S3 / Cloudflare R2]
- **E-mail**: [ex: SendGrid]
- **SMS**: [ex: Twilio]
- **Mensageria**: [ex: Evolution API — WhatsApp]

---

## Repositórios do sistema

| Repositório | Responsabilidade |
|---|---|
| [nome-backend] | [ex: API REST, regras de negócio] |
| [nome-frontend] | [ex: Interface web] |
| [nome-workers] | [ex: Jobs assíncronos e filas] |
| [nome-docs] | Documentação e especificações (este repo) |

---

## Convenções de código

### Nomenclatura
- Componentes React: PascalCase, um arquivo por componente
- Funções e variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Rotas de API: kebab-case (ex: `/smart-lists`)
- Arquivos de teste: `[nome].spec.ts`

### TypeScript
- `strict: true` em todo o projeto
- Proibido o uso de `any` — usar `unknown` com type guard quando necessário
- Tipos de entidades gerados pelo Prisma — não redefinir manualmente

### Estrutura de pastas (exemplo Next.js)
```
/app
  /(auth)           → páginas protegidas
  /(public)         → páginas sem autenticação
  /api/v1           → rotas de API
/components
  /ui               → componentes genéricos reutilizáveis
  /[modulo]         → componentes específicos de cada módulo
/lib
  /db.ts            → instância do Prisma
  /auth.ts          → configuração de autenticação
  /events.ts        → publicação de eventos internos
  /audit.ts         → registro de auditoria
  /validations/     → schemas Zod por módulo
/services           → lógica de negócio separada dos controllers
/repositories       → acesso a dados separado dos services
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
| Campo banco | [CONVENÇÃO DA ORGANIZAÇÃO] | `full_name` | DATA-MODEL.md, migrations, ORM |

> ⚠️ Informe aqui a convenção de banco de dados da sua organização
> antes de usar este arquivo em qualquer sessão.

---

## Campos globais obrigatórios em toda tabela

| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| id | id | uuid | PK; gerado automaticamente |
| organizationId | organization_id | uuid | FK → organizations; multitenancy |
| createdAt | created_at | timestamptz | Gerado automaticamente |
| updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| deletedAt | deleted_at | timestamptz | Soft delete; null = ativo |

---

## Regras globais de negócio

1. **Multitenancy**: toda query filtra obrigatoriamente por `organization_id`
2. **Soft delete universal**: registros nunca são removidos fisicamente
3. **IDs em URLs**: sempre UUID — nunca IDs sequenciais
4. **Paginação**: sempre cursor-based; padrão 20 itens; teto 100
5. **Validação**: Zod em frontend e backend; nunca confiar apenas no client
6. **Auditoria**: ações críticas sempre registradas em `AuditLog`
7. **Eventos internos**: módulos comunicam-se via eventos, nunca chamadas diretas

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
- Retornar senhas ou tokens em respostas, mesmo hasheados
- Fazer query sem filtrar por `organization_id`
- Remover registros fisicamente do banco
- Lançar exceções cruas — sempre retornar envelope de erro padronizado
- Chamar diretamente outro módulo — usar eventos internos
- Duplicar Label Dev ou campo banco nos N3 — essas informações vivem apenas no DATA-MODEL.md
---

## Arquivos globais de referência

| Arquivo | Propósito |
|---|---|
| `global/MASTER.md` | Stack, convenções globais (este arquivo) |
| `global/DATA-MODEL.md` | Índice de entidades + campos globais + enums |
| `global/SIZING.md` | Convenções de contagem APF e COSMIC |
| `global/RULES-DICTIONARY.md` | Regras de negócio canônicas |
| `global/FIELD-DICTIONARY.md` | Campos canônicos (CPF, CEP, e-mail…) |
| `global/ERROR-DICTIONARY.md` | Fonte única de códigos de erro |
| `global/API-PATTERNS.md` | Padrões de API |
| `global/DESIGN-SYSTEM.md` | Padrões de UI |
