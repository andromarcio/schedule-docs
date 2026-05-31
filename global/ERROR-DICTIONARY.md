# ERROR-DICTIONARY.md
> Dicionário centralizado de códigos de erro de API.
> Todo novo código de erro criado durante a especificação técnica (N3)
> deve ser registrado aqui para evitar duplicidade de chaves e garantir
> consistência no frontend (internacionalização / i18n).
>
> Padrão: `[DOMINIO]_[DESCRICAO]` em SCREAMING_SNAKE_CASE
>
> **Como referenciar nos N3**:
> No Mapeamento de erros (seção dev-only), cite a chave:
> `→ ver ERROR-DICTIONARY: AUTH_UNAUTHENTICATED`

---

## 1. Erros globais (qualquer rota)

Estes erros podem ocorrer em qualquer endpoint do sistema
e não são específicos de um domínio.

| Código de erro | HTTP | Situação |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | Token ausente ou assinatura inválida |
| `AUTH_TOKEN_EXPIRED` | 401 | Token válido, mas expirado — renovar via refresh |
| `AUTH_FORBIDDEN` | 403 | Usuário autenticado, mas sem permissão para a ação |
| `VALIDATION_ERROR` | 422 | Um ou mais campos no body/query são inválidos (ver `details`) |
| `FIELD_IMMUTABLE` | 422 | Tentativa de alterar um campo protegido via PATCH |
| `RESOURCE_NOT_FOUND` | 404 | Registro não existe ou pertence a outra organização |
| `RATE_LIMIT_EXCEEDED` | 429 | Excedeu limite de requisições por IP ou token |
| `INTERNAL_ERROR` | 500 | Falha genérica de servidor — nunca expor stack trace |

---

## 2. Erros de Identity

| Código de erro | HTTP | Situação |
|---|---|---|
| `AUTH_EMAIL_CONFLICT` | 409 | E-mail fornecido já existe no banco |
| `AUTH_USER_DISABLED` | 403 | Tentativa de login com conta inativa (`deletedAt` preenchido) |
| `AUTH_INVALID_CREDENTIALS` | 401 | Senha e/ou e-mail incorretos no login local |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | E-mail do Google não verificado |
| `AUTH_ORG_NOT_FOUND` | 404 | Organização não encontrada pelo contexto da URL |
| `AUTH_EMAIL_CONFLICT_PROVIDER` | 409 | E-mail já cadastrado com outro provedor de autenticação |

---

## 3. Erros de Contacts

| Código de erro | HTTP | Situação |
|---|---|---|
| `CONTACT_NOT_FOUND` | 404 | Contato não existe ou foi excluído |
| `CONTACT_DUPLICATE_EMAIL` | 409 | E-mail já cadastrado na organização |
| `CONTACT_MISSING_CONTACT_INFO` | 422 | E-mail e telefone ambos ausentes |
| `CONTACT_OWNER_INACTIVE` | 422 | Responsável selecionado está desativado |
| `CONTACT_AGENT_OWNER_MISMATCH` | 422 | Agent tentou atribuir contato a outro usuário |
| `CONTACT_FIELD_IMMUTABLE` | 422 | Tentativa de alterar campo imutável (`source`) |
| `TAG_LIMIT_REACHED` | 422 | Máximo de tags vinculadas ao contato atingido |
| `TAG_NOT_FOUND` | 404 | Tag não existe no contato ou na organização |
| `SMART_LIST_NOT_FOUND` | 404 | Smart List não encontrada |
| `SMART_LIST_INVALID_FILTER` | 422 | Critério com campo ou operador não suportado |
| `SMART_LIST_NAME_DUPLICATE` | 409 | Já existe uma Smart List com esse nome na organização |
| `IMPORT_INVALID_FILE` | 422 | Arquivo não é um CSV válido ou extensão não aceita |
| `IMPORT_FILE_TOO_LARGE` | 422 | Arquivo excede o tamanho máximo permitido |
| `IMPORT_MISSING_NAME_MAPPING` | 422 | Coluna de nome não mapeada |
| `IMPORT_DUPLICATE_MAPPING` | 422 | Mesma coluna CSV mapeada para dois campos |
| `IMPORT_JOB_NOT_FOUND` | 404 | Job de importação não encontrado |

---

## 4. Erros de Communication

| Código de erro | HTTP | Situação |
|---|---|---|
| `MESSAGE_SEND_FAILED` | 502 | Gateway externo (SendGrid, Twilio, Evolution) recusou a requisição |
| `TEMPLATE_NOT_FOUND` | 404 | Template de e-mail utilizado não existe |
| `COOLDOWN_ACTIVE` | 429 | Tentativa de reenvio antes do fim do período de carência |

---

## 5. Erros de Work

| Código de erro | HTTP | Situação |
|---|---|---|
| `TASK_NOT_FOUND` | 404 | Tarefa não encontrada |
| `TASK_ALREADY_COMPLETED` | 409 | Tentativa de finalizar tarefa já em status `done` |

---

## 6. Erros de Capture

| Código de erro | HTTP | Situação |
|---|---|---|
| `FORM_NOT_FOUND` | 404 | Formulário não encontrado |
| `FORM_SLUG_TAKEN` | 409 | Slug de formulário já em uso na organização |
| `FORM_NOT_ACTIVE` | 403 | Tentativa de submissão a formulário inativo ou arquivado |

---

## Como adicionar novos erros

Ao criar ou atualizar um N3 e identificar a necessidade de um código
não listado acima, adicione-o à tabela do domínio correspondente:

```markdown
| `[DOMINIO]_[NOME]` | [HTTP] | [Situação que dispara o erro] |
```

**Regras**:
- Prefixo = nome do domínio em maiúsculas (`CONTACT_`, `AUTH_`, `TASK_`, etc.)
- Descrição em inglês, substantivo ou verbo no passado (`NOT_FOUND`, `DUPLICATE`, `FAILED`)
- Nunca criar dois códigos com o mesmo significado em domínios diferentes
- Registrar aqui **antes** de usar no N3

---

## Instrução para a LLM

Ao gerar a seção `Mapeamento de erros` de um N3 técnico (PROMPT_3B):
1. Verificar se o erro já existe neste dicionário — usar a chave existente
2. Se for novo: propor com ⚠️, aguardar aprovação e adicionar ao dicionário
3. Nunca criar chaves ad-hoc sem registrar aqui
4. Referenciar no N3: `→ ver ERROR-DICTIONARY: [CODIGO]`
