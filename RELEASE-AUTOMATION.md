# RELEASE-AUTOMATION.md
> Guia de instalação da automação de release do Modelo B.
> Após configurar, uma única ação no repo de docs cria tags e
> GitHub Releases sincronizadas em todos os repositórios do sistema.

---

## Como funciona

```
Você dispara manualmente:
  [docs] Actions → "Release do Sistema" → informe versão + notas

O workflow faz:
  1. Valida e resolve a versão (auto-incremento se campo vazio)
  2. Atualiza changelogs/CHANGELOG-sistema.md
  3. Cria tag vX.Y.Z + GitHub Release no repo de docs
  4. Envia repository_dispatch para cada repo de código
  5. Cada repo de código cria sua própria tag + GitHub Release
```

---

## Arquivos deste template

| Arquivo | Onde usar | Descrição |
|---------|-----------|-----------|
| `.github/workflows/release-system.yml` | Repo de docs (maestro) | Dispara a release em cascata em todos os repos |
| `.github/workflows/release-tag.yml` | Cada repo de código | Recebe o dispatch e cria tag + GitHub Release |

---

## Pré-requisito: Personal Access Token (PAT)

### Criar o PAT

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Clique **Generate new token**
3. Configure:
   - **Token name**: `RELEASE_PAT_[nome-do-sistema]`
   - **Expiration**: 1 year
   - **Repository access**: todos os repos do sistema
   - **Permissions**:
     | Permissão | Nível |
     |-----------|-------|
     | Contents  | Read and write |
     | Actions   | Read and write |
     | Metadata  | Read-only (obrigatório) |
4. Copie o token gerado

### Adicionar o PAT como secret em cada repositório

Repita para **cada repo** (docs, backend, frontend, workers):

1. Abra o repositório no GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Clique **New repository secret**
4. **Name**: `RELEASE_PAT` | **Secret**: cole o token

---

## Instalação

### No repo de docs (maestro)

```bash
mkdir -p .github/workflows
cp release-system.yml .github/workflows/
```

Edite o arquivo e atualize a lista de repositórios:

```yaml
# Em dispatch-repos > strategy > matrix > repo:
repo:
  - minha-org/meu-projeto-backend
  - minha-org/meu-projeto-frontend
```

### Em cada repo de código

```bash
mkdir -p .github/workflows
cp release-tag.yml .github/workflows/
```

Não é necessário editar — o workflow recebe tudo via payload.

---

## Como disparar uma release

1. Abra o **repo de docs** no GitHub
2. Vá em **Actions** → **Release do Sistema**
3. Clique **Run workflow**
4. Preencha:
   - **Versão**: `1.3.0` (ou deixe vazio para auto-incrementar o patch)
   - **Notas de release**: descreva as features entregues
5. Clique **Run workflow**

Ao final (~2 min), todos os repositórios terão tag `vX.Y.Z` + GitHub Release.

---

## Integração com o INDEX.md

Após cada release, atualize `modules/INDEX.md`:

```markdown
| Feature          | Domínio  | Status          | Repositórios  | Versão |
|------------------|----------|-----------------|---------------|--------|
| Cadastro Contato | Contacts | ✅ Implementado  | backend, web  | v1.3.0 |
```

E preencha `## Implementação` no N3 correspondente:

```markdown
## Implementação

| Item           | Referência      |
|----------------|-----------------|
| Versão sistema | v1.3.0          |
| Data de deploy | YYYY-MM-DD      |
| PR backend     | #xx             |
| PR frontend    | #xx             |
```

---

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Tag vX.Y.Z já existe` | Tag duplicada | Use outra versão ou delete a tag manualmente |
| `Bad credentials` | PAT inválido ou expirado | Regenere e atualize o secret em todos os repos |
| Workflow não disparado no repo de código | Actions desabilitado | Habilite Actions nas configurações do repo |
| Release sem commits | Sem commits desde a última tag | Normal — aparecerá na próxima release |
