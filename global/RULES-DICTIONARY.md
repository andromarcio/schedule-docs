# RULES-DICTIONARY.md
> Dicionário de regras de negócio canônicas do sistema.
> Regras listadas aqui se repetem em múltiplas features e têm
> comportamento definido e aprovado. Referencie em vez de repetir.
>
> Notação de referência no N3:
> `→ ver RULES-DICTIONARY: [nome da regra]`
>
> Para adicionar uma nova regra: abrir PR com a seção preenchida
> e aprovação de ao menos um dev e um PO antes do merge.

---

## Quando usar este dicionário

Use RULES-DICTIONARY quando uma regra:
- Aparece em três ou mais features distintas, E
- Não é global do sistema (essas vão no MASTER.md), E
- Não é exclusiva de um domínio (essas vão no N1 como regra transversal)

Exemplos do que NÃO entra aqui:
- "Todo registro tem soft delete" → MASTER.md (global)
- "E-mail único por organização" → N1 de Contacts (domínio)
- "Formulário público não requer autenticação" → N3 de Form (específica)

---

## Índice de regras canônicas

| Regra | Categoria | Features onde aparece |
|---|---|---|
| [Maioridade](#maioridade) | Pessoa | Cadastro de cliente, dependente, contrato |
| [Responsável ativo](#responsável-ativo) | Atribuição | Create Contact, Import Contacts, Create Task |
| [Período de vigência](#período-de-vigência) | Temporal | Contratos, promoções, planos |
| [Aprovação antes de publicar](#aprovação-antes-de-publicar) | Fluxo | Formulários, templates, campanhas |
| [Limite por organização](#limite-por-organização) | Cotas | Tags, Smart Lists, formulários ativos |
| [Slug único público](#slug-único-público) | Identificador | Formulários públicos, páginas de captura |
| [Valor mínimo de desconto](#valor-mínimo-de-desconto) | Financeiro | Descontos, cupons, negociações |
| [Reenvio com cooldown](#reenvio-com-cooldown) | Comunicação | E-mail, SMS, WhatsApp |
| [Arquivo com tamanho máximo](#arquivo-com-tamanho-máximo) | Upload | Importação CSV, avatares, anexos |
| [Registro não pode ser excluído se vinculado](#registro-não-pode-ser-excluído-se-vinculado) | Integridade | Tags, usuários, templates |

---

## Regras canônicas

---

### Maioridade

**Descrição**: Valida se uma pessoa tem idade mínima exigida para
uma operação, calculada a partir da data de nascimento.

**Onde se aplica**: qualquer feature que exija idade mínima do usuário
ou de um terceiro (cliente, dependente, responsável).

#### Como referenciar no N3
```markdown
## Regras de negócio
3. O contratante deve ser maior de idade.
   → ver RULES-DICTIONARY: Maioridade (idade mínima: 18 anos)
```

#### Parâmetro obrigatório no N3
O N3 deve declarar **qual a idade mínima exigida**. O dicionário
não impõe um valor — apenas define o comportamento da validação.

Exemplos: 18 anos (maioridade civil), 16 anos (trabalho com autorização),
21 anos (restrições específicas de produto).

#### Regra de negócio
A idade é calculada na **data do evento** (salvamento do formulário,
assinatura do contrato), não na data de hoje. Se o usuário tem
17 anos e 364 dias no momento do envio, a validação falha.

#### Cenários Gherkin
```gherkin
# ── Maioridade ────────────────────────────────────────────────

Scenario: Pessoa com idade suficiente
  Given que a data de nascimento resulta em idade maior ou igual
        ao mínimo exigido pela feature
  When o usuário tenta concluir a operação
  Then a operação prossegue normalmente

Scenario: Pessoa com idade insuficiente
  Given que a data de nascimento resulta em idade menor
        que o mínimo exigido pela feature
  When o usuário tenta concluir a operação
  Then o sistema exibe:
    "É necessário ter ao menos [N] anos para [ação da feature]."
  And a operação não é concluída

Scenario: Data de nascimento no limite exato da maioridade
  Given que hoje é exatamente o aniversário que completa a idade mínima
  When o usuário tenta concluir a operação
  Then a operação prossegue normalmente
```

#### Mensagem de erro
`"É necessário ter ao menos [N] anos para [ação da feature]."`
O N3 substitui `[N]` e `[ação da feature]` pelos valores corretos.

---

### Responsável ativo

**Descrição**: Qualquer atribuição de responsável (contato, tarefa,
formulário) só pode referenciar um usuário com conta ativa na organização.
Usuários com `deletedAt` preenchido são inválidos como responsáveis.

**Onde se aplica**: Create Contact, Edit Contact, Import Contacts,
Create Task, Assign Task, Form Editor.

#### Como referenciar no N3
```markdown
## Regras de negócio
2. O responsável deve ser um usuário ativo da organização.
   → ver RULES-DICTIONARY: Responsável ativo
```

#### Regra de negócio
1. Ao exibir a lista de seleção de responsável, filtrar apenas
   usuários com `deletedAt = null` da organização.
2. Ao salvar, revalidar no backend — o usuário pode ter sido
   desativado entre a abertura do formulário e o envio.
3. Usuários desativados não aparecem na lista de seleção.
4. Se um usuário for desativado após já estar atribuído a registros,
   os registros existentes **mantêm** o vínculo. A reatribuição
   em lote é responsabilidade do domínio Identity ao receber o
   evento `user.disabled`.

#### Cenários Gherkin
```gherkin
# ── Responsável ativo ─────────────────────────────────────────

Scenario: Responsável ativo selecionado
  Given que o usuário "Maria Silva" está ativo na organização
  When o usuário seleciona "Maria Silva" como responsável
  And salva o registro
  Then o registro é salvo com "Maria Silva" como responsável

Scenario: Responsável desativado antes do salvamento
  Given que o usuário selecionou "Carlos Lima" como responsável
  And "Carlos Lima" é desativado antes do formulário ser salvo
  When o usuário clica em salvar
  Then o registro não é salvo
  And o sistema exibe:
    "O responsável selecionado não está mais ativo.
     Escolha outro responsável."

Scenario: Responsável desativado não aparece na lista
  Given que "João Souza" foi desativado na organização
  When o usuário abre a lista de seleção de responsável
  Then "João Souza" não aparece como opção disponível
```

#### Mensagem de erro
`"O responsável selecionado não está mais ativo. Escolha outro responsável."`

---

### Período de vigência

**Descrição**: Valida que um intervalo de datas (início e fim) é
coerente — a data de início não pode ser posterior à data de fim,
e o período mínimo deve ser respeitado quando definido.

**Onde se aplica**: contratos, promoções, campanhas, planos com validade.

#### Como referenciar no N3
```markdown
## Regras de negócio
4. O período de vigência deve ser válido.
   → ver RULES-DICTIONARY: Período de vigência (mínimo: 1 dia)
```

#### Parâmetros opcionais no N3
- **Duração mínima**: número mínimo de dias entre início e fim.
  Se não declarado, o mínimo é 1 dia.
- **Duração máxima**: número máximo de dias. Se não declarado,
  não há limite.
- **Início no passado**: declarar se a data de início pode ser
  no passado ou deve ser futura.

#### Cenários Gherkin
```gherkin
# ── Período de vigência ────────────────────────────────────────

Scenario: Período válido
  Given que a data de início é anterior à data de fim
  And o intervalo respeita a duração mínima exigida
  When o usuário salva o registro
  Then o registro é salvo com sucesso

Scenario: Data de fim anterior à data de início
  When o usuário define uma data de fim anterior à data de início
  Then o sistema exibe abaixo do campo "Data de fim":
    "A data de fim deve ser posterior à data de início."

Scenario: Período inferior ao mínimo exigido
  Given que a feature exige período mínimo de [N] dias
  When o usuário define um período inferior a [N] dias
  Then o sistema exibe:
    "O período mínimo é de [N] dia(s)."

Scenario: Período superior ao máximo permitido
  Given que a feature define período máximo de [N] dias
  When o usuário define um período superior a [N] dias
  Then o sistema exibe:
    "O período máximo é de [N] dia(s)."
```

#### Mensagens de erro
| Situação | Mensagem |
|---|---|
| Fim antes do início | "A data de fim deve ser posterior à data de início." |
| Período menor que o mínimo | "O período mínimo é de [N] dia(s)." |
| Período maior que o máximo | "O período máximo é de [N] dia(s)." |

---

### Aprovação antes de publicar

**Descrição**: Recursos que ficam visíveis externamente (formulários
públicos, templates, campanhas) precisam passar por um estado
intermediário de revisão antes de serem publicados.

**Estados**: `rascunho → em revisão → ativo` / `ativo → arquivado`

**Onde se aplica**: Form Editor, Email Templates, campanhas de comunicação.

#### Como referenciar no N3
```markdown
## Regras de negócio
5. O formulário precisa ser aprovado antes de ser publicado.
   → ver RULES-DICTIONARY: Aprovação antes de publicar
```

#### Parâmetro obrigatório no N3
O N3 deve declarar **quem pode aprovar** (ex: apenas admin,
qualquer usuário diferente do criador, qualquer usuário com role X).

#### Regras de negócio
1. Um recurso recém-criado inicia em estado `rascunho`.
2. O criador pode enviar para revisão — estado passa para `em revisão`.
3. Somente o aprovador definido pelo N3 pode publicar — estado `ativo`.
4. O criador não pode aprovar o próprio recurso, salvo se o N3
   declarar explicitamente que isso é permitido.
5. Recursos em estado `rascunho` ou `em revisão` não são visíveis
   externamente.
6. A publicação é registrada no AuditLog com o id do aprovador.

#### Cenários Gherkin
```gherkin
# ── Aprovação antes de publicar ───────────────────────────────

Scenario: Criador envia para revisão
  Given que o recurso está em estado "rascunho"
  When o criador clica em "Enviar para revisão"
  Then o estado muda para "em revisão"
  And o aprovador responsável é notificado

Scenario: Aprovador publica o recurso
  Given que o recurso está em estado "em revisão"
  And o usuário autenticado tem permissão de aprovação
  When o aprovador clica em "Publicar"
  Then o estado muda para "ativo"
  And o recurso passa a ser visível externamente
  And a publicação é registrada no histórico de auditoria

Scenario: Criador tenta aprovar o próprio recurso
  Given que o recurso foi criado pelo usuário autenticado
  And o N3 não permite auto-aprovação
  When o usuário tenta clicar em "Publicar"
  Then o botão "Publicar" não está disponível para este usuário
  And o sistema exibe: "Você não pode aprovar um recurso criado por você."

Scenario: Recurso em rascunho não é visível externamente
  Given que o recurso está em estado "rascunho"
  When qualquer usuário tenta acessar a URL pública do recurso
  Then o sistema retorna "não encontrado"
```

---

### Limite por organização

**Descrição**: Certas entidades têm um número máximo de registros
ativos por organização para evitar uso abusivo.

**Onde se aplica**: Tags (máx por contato), Smart Lists (máx por org),
Formulários ativos (máx por org).

#### Como referenciar no N3
```markdown
## Regras de negócio
3. Uma organização pode ter no máximo [N] [entidades] ativas.
   → ver RULES-DICTIONARY: Limite por organização (limite: [N])
```

#### Parâmetro obrigatório no N3
O N3 deve declarar **qual o limite** e **o que conta para o limite**
(ex: apenas registros ativos, ou todos incluindo arquivados).

#### Cenários Gherkin
```gherkin
# ── Limite por organização ─────────────────────────────────────

Scenario: Criação dentro do limite
  Given que a organização tem menos de [N] [entidades] ativas
  When o usuário tenta criar uma nova [entidade]
  Then a [entidade] é criada com sucesso

Scenario: Tentativa de criação acima do limite
  Given que a organização já possui [N] [entidades] ativas
  When o usuário tenta criar uma nova [entidade]
  Then o sistema bloqueia a criação
  And exibe: "Limite de [N] [entidades] atingido.
    Arquive ou exclua uma existente para criar uma nova."

Scenario: Botão de criar desabilitado ao atingir o limite
  Given que a organização já possui [N] [entidades] ativas
  When o usuário acessa a listagem de [entidades]
  Then o botão "Nova [entidade]" está desabilitado
  And exibe tooltip: "Limite de [N] [entidades] atingido."
```

---

### Slug único público

**Descrição**: Recursos acessíveis via URL pública (formulários, páginas
de captura) têm um identificador textual único (slug) que compõe a URL.

**Onde se aplica**: Form Editor, páginas públicas de captura.

#### Como referenciar no N3
```markdown
## Regras de negócio
2. O formulário deve ter um slug único na organização.
   → ver RULES-DICTIONARY: Slug único público
```

#### Regras de negócio
1. O slug é gerado automaticamente a partir do nome do recurso
   (convertido para kebab-case, sem acentos).
2. O usuário pode editar o slug manualmente.
3. O slug deve ser único dentro da organização — não globalmente.
4. Caracteres permitidos: letras minúsculas, números e hífen.
   Sem espaços, acentos ou caracteres especiais.
5. Comprimento: mínimo 3, máximo 60 caracteres.
6. O slug não pode ser alterado enquanto o recurso estiver ativo —
   apenas em estado `rascunho` ou `arquivado`.

#### Cenários Gherkin
```gherkin
# ── Slug único público ─────────────────────────────────────────

Scenario: Slug gerado automaticamente
  When o usuário preenche o nome "Formulário de Contato 2024"
  Then o slug é preenchido automaticamente como "formulario-de-contato-2024"

Scenario: Slug disponível aceito
  Given que o slug "meu-formulario" não existe na organização
  When o usuário define o slug como "meu-formulario"
  And salva o registro
  Then o registro é salvo com o slug informado

Scenario: Slug já em uso na organização
  Given que já existe um formulário com slug "meu-formulario"
  When o usuário tenta usar o mesmo slug
  Then o sistema exibe abaixo do campo:
    "Este endereço já está em uso. Escolha outro."

Scenario: Slug com caracteres inválidos
  When o usuário preenche o slug com "Meu Formulário!"
  Then o sistema exibe: "Use apenas letras minúsculas, números e hífen."

Scenario: Tentativa de editar slug de recurso ativo
  Given que o recurso está em estado "ativo"
  When o usuário tenta editar o campo slug
  Then o campo slug está bloqueado para edição
  And exibe: "O endereço não pode ser alterado enquanto o formulário estiver ativo."
```

---

### Valor mínimo de desconto

**Descrição**: Descontos (percentuais ou em valor) devem respeitar
limites mínimos e máximos definidos por política da organização
ou pela feature específica.

**Onde se aplica**: negociações, cupons, descontos em contratos.

#### Como referenciar no N3
```markdown
## Regras de negócio
4. O desconto deve estar dentro dos limites permitidos.
   → ver RULES-DICTIONARY: Valor mínimo de desconto
   (mínimo: 0%, máximo: definido pelo perfil do usuário)
```

#### Parâmetros obrigatórios no N3
- **Desconto mínimo**: valor mínimo aceitável (geralmente 0%).
- **Desconto máximo por role**: quanto cada perfil pode conceder.
  Ex: agent = 10%, admin = 50%.
- **Tipo**: percentual ou valor fixo.

#### Cenários Gherkin
```gherkin
# ── Valor mínimo de desconto ───────────────────────────────────

Scenario: Desconto dentro do limite do perfil
  Given que o usuário tem permissão para conceder até [max]% de desconto
  When o usuário informa um desconto de [valor dentro do limite]%
  Then o desconto é aceito

Scenario: Desconto acima do limite do perfil
  Given que o usuário tem permissão para conceder até [max]% de desconto
  When o usuário informa um desconto de [valor acima do limite]%
  Then o sistema exibe: "Seu perfil permite desconto de até [max]%."

Scenario: Desconto negativo
  When o usuário informa um desconto negativo
  Then o sistema exibe: "O desconto não pode ser negativo."
```

---

### Reenvio com cooldown

**Descrição**: Mensagens (e-mail, SMS, WhatsApp) não podem ser
reenviadas para o mesmo destinatário antes de um período de espera,
para evitar spam e consumo excessivo de créditos.

**Onde se aplica**: Send Email, Send SMS, Send WhatsApp Message,
reenvio de convites, recuperação de senha.

#### Como referenciar no N3
```markdown
## Regras de negócio
5. O sistema impõe um período de espera entre reenvios.
   → ver RULES-DICTIONARY: Reenvio com cooldown (cooldown: 5 minutos)
```

#### Parâmetro obrigatório no N3
O N3 deve declarar **o tempo de cooldown** em minutos.

#### Cenários Gherkin
```gherkin
# ── Reenvio com cooldown ────────────────────────────────────────

Scenario: Reenvio após o cooldown
  Given que o último envio foi há mais de [cooldown] minutos
  When o usuário solicita o reenvio
  Then a mensagem é reenviada com sucesso

Scenario: Reenvio antes do cooldown
  Given que o último envio foi há menos de [cooldown] minutos
  When o usuário tenta reenviar
  Then o sistema bloqueia o reenvio
  And exibe: "Aguarde [tempo restante] para reenviar."

Scenario: Botão de reenvio desabilitado durante cooldown
  Given que o cooldown está ativo
  When o usuário visualiza a opção de reenvio
  Then o botão de reenvio está desabilitado
  And exibe um contador regressivo com o tempo restante
```

---

### Arquivo com tamanho máximo

**Descrição**: Uploads de arquivo têm restrições de tamanho e tipo
que devem ser validadas antes do envio ao servidor.

**Onde se aplica**: Import Contacts (CSV), avatares, anexos em e-mails.

#### Como referenciar no N3
```markdown
## Regras de negócio
1. O arquivo deve respeitar os limites de tipo e tamanho.
   → ver RULES-DICTIONARY: Arquivo com tamanho máximo
   (tipos aceitos: .csv; tamanho máximo: 5 MB)
```

#### Parâmetros obrigatórios no N3
- **Tipos aceitos**: lista de extensões (ex: `.csv`, `.pdf`, `.jpg,.png`).
- **Tamanho máximo**: em MB.

#### Regras de negócio
1. Validar tipo e tamanho no cliente antes de iniciar o upload
   para evitar tráfego desnecessário.
2. Revalidar no servidor — nunca confiar apenas na validação do cliente.
3. Exibir o tamanho máximo permitido na área de upload, sem o usuário
   precisar tentar e falhar para descobrir.

#### Cenários Gherkin
```gherkin
# ── Arquivo com tamanho máximo ─────────────────────────────────

Scenario: Arquivo válido aceito
  Given que o arquivo tem extensão aceita e tamanho dentro do limite
  When o usuário faz o upload
  Then o arquivo é aceito e o processamento continua

Scenario: Extensão não aceita
  When o usuário tenta enviar um arquivo com extensão não permitida
  Then o sistema rejeita antes do upload
  And exibe: "Apenas arquivos [extensões aceitas] são aceitos."

Scenario: Arquivo acima do tamanho máximo
  When o usuário tenta enviar um arquivo maior que [N] MB
  Then o sistema rejeita antes do upload
  And exibe: "O arquivo não pode exceder [N] MB."
```

---

### Registro não pode ser excluído se vinculado

**Descrição**: Certos registros não podem ser excluídos enquanto
existirem outros registros que os referenciam ativamente.

**Onde se aplica**: exclusão de tags (enquanto aplicadas a contatos),
exclusão de usuários (enquanto responsáveis por contatos ou tarefas),
exclusão de templates (enquanto usados em campanhas ativas).

#### Como referenciar no N3
```markdown
## Regras de negócio
3. A tag não pode ser excluída se ainda estiver aplicada a contatos.
   → ver RULES-DICTIONARY: Registro não pode ser excluído se vinculado
   (entidade vinculada: Contact.tags)
```

#### Parâmetro obrigatório no N3
O N3 deve declarar **qual entidade referencia o registro**
e o **comportamento alternativo** (bloquear completamente ou
oferecer opção de desvinculação em lote antes de excluir).

#### Cenários Gherkin
```gherkin
# ── Registro com vínculos ──────────────────────────────────────

Scenario: Exclusão de registro sem vínculos
  Given que o registro não está referenciado por nenhum outro registro ativo
  When o usuário confirma a exclusão
  Then o registro é excluído com sucesso

Scenario: Tentativa de excluir registro com vínculos ativos
  Given que o registro está referenciado por [N] registro(s) ativo(s)
  When o usuário tenta excluir
  Then o sistema bloqueia a exclusão
  And exibe: "Este registro está em uso por [N] [entidade(s)] e não pode ser excluído.
    Remova os vínculos antes de excluir."

Scenario: Exclusão com opção de desvincular em lote (se o N3 permitir)
  Given que o registro tem vínculos ativos
  When o usuário tenta excluir
  Then o sistema exibe um modal de confirmação com a opção:
    "Remover de todos os [N] [entidades] e excluir"
  And aguarda confirmação antes de prosseguir
```

---

## Template para nova regra canônica

```markdown
### [Nome da regra]

**Descrição**: [o que esta regra define — uma frase]

**Onde se aplica**: [lista de features]

#### Como referenciar no N3
[trecho de exemplo de como citar no N3]

#### Parâmetros obrigatórios no N3 (se houver)
[o que o N3 deve declarar que o dicionário não impõe]

#### Regras de negócio
1. [regra]

#### Cenários Gherkin
[cenários completos com grupos]

#### Mensagens de erro
| Situação | Mensagem |
|---|---|
| [situação] | "[mensagem]" |
```

---

## Instrução para a LLM

Ao identificar uma regra de negócio em um N3 que coincide com
uma regra deste dicionário:

1. No **Modo PO**: não faça perguntas sobre o comportamento da regra —
   ele já está definido. Pergunte apenas sobre os **parâmetros**
   que o dicionário deixa em aberto para o N3 declarar.

2. No **Modo DEV** (PROMPT 3B): ao gerar endpoints e serviços,
   implemente a regra conforme definida aqui. Não reescreva
   os cenários Gherkin — use o marcador:
   `# ← RULES-DICTIONARY: [nome da regra] (importar cenários)`

3. Na **geração do SDD**: ao mapear regras de negócio para métodos
   de service, referencie o dicionário:
   `// → RULES-DICTIONARY: Responsável ativo`

4. Na **revisão de consistência**: verificar se implementações da
   mesma regra canônica em features diferentes estão alinhadas
   com este dicionário.
