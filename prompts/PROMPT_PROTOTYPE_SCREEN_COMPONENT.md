# PROMPT_PROTOTYPE_SCREEN_COMPONENT — Protótipos de Estado (Componente)

> **Quem participa**: dev / designer / PO técnico
> **Insumo necessário**: DESIGN-SYSTEM.md + N3 da feature
> **Entrega**: um arquivo HTML por estado, mostrando **apenas a área de conteúdo**
> da tela — sem sidebar, topbar ou shell de aplicação
>
> **Quando usar este em vez do FULL**:
> - Iteração rápida com o PO — quer validar campos e mensagens sem montar o layout
> - Dev quer usar como referência de markup para um componente isolado
> - Quer comparar variações de um mesmo estado lado a lado
> - Quer embutir em Storybook, design token preview ou documentação técnica
>
> **Pré-requisito**: N3 aprovado (PROMPT_3B concluído)
> **Onde salvar**: `prototypes/[dominio]/[feature-set]/[feature]/[estado]-component.html`

---

## INSTRUÇÕES PARA O CLAUDE

Você vai gerar protótipos HTML de cada estado de tela de uma feature,
focados **exclusivamente na área de conteúdo** — sem sidebar, topbar ou
qualquer shell de aplicação.

Cada arquivo representa um estado isolado que pode ser aberto diretamente
no browser ou embutido como componente.

### Regras de geração

1. **Sem shell de aplicação**: nenhuma sidebar, topbar, breadcrumb ou footer.
   O arquivo começa diretamente com o conteúdo da área principal.

2. **Tokens do Design System aplicados**: mesmo sem layout completo, usar
   as cores, tipografia, espaçamentos e componentes do DESIGN-SYSTEM.md
   para todos os elementos internos.

3. **Largura máxima realista**: aplicar `max-width` equivalente ao que a
   área de conteúdo teria no layout completo (conforme DESIGN-SYSTEM.md),
   centralizado com `margin: 0 auto` e padding lateral.

4. **Um arquivo por estado**: `form-component.html`, `loading-component.html`,
   `empty-component.html`, `error-component.html`. Nunca misturar estados.

5. **Campos mapeados do N3**: labels = Label PO do N3. Tipos de input =
   tipo do campo. Mensagens de erro/validação = exatamente as do N3.

6. **Componente autoexplicativo**: incluir no topo do arquivo (fora do
   componente real) um cabeçalho minimalista de contexto:
   ```html
   <div class="proto-header">
     <span class="proto-badge">🔲 COMPONENTE</span>
     <span class="proto-feature">[Feature] / [Estado]</span>
     <span class="proto-spec">→ spec: [caminho do N3]</span>
   </div>
   ```

7. **Dados fictícios realistas**: mesma regra do FULL — nunca Lorem ipsum.

8. **Declarar dependências explicitamente**: o arquivo deve listar no rodapé
   o que o componente espera receber do contexto pai (props, contexto global,
   permissões). Isso é essencial para que o dev saiba como integrar.

---

## CONTEXTO DO PROJETO

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N3 DA FEATURE ===
[cole aqui o arquivo completo da feature]

---

## PASSO 1 — Mapeamento de estados

Leia o N3 e liste os estados a gerar:

| Arquivo | Estado | Baseado em |
|---|---|---|
| `form-component.html` | Formulário principal | Seção "Campos" do N3 |
| `loading-component.html` | Skeleton | "Comportamento de tela: Loading" |
| `empty-component.html` | Sem dados | "Comportamento de tela: Empty state" |
| `error-component.html` | Erro | "Comportamento de tela: Error state" |
| `modal-component.html` | Modal | "Onde fica" (se for modal) |
| `[custom]-component.html` | [estado] | [referência no N3] |

Pergunte:
> "Os estados mapeados estão corretos? Qual gerar primeiro?"

---

## PASSO 2 — Geração estado a estado

Gere um estado por vez. Aguarde aprovação antes de avançar.

### Estrutura base de cada arquivo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Feature] — [Estado] (Componente)</title>
  <style>
    /* Tokens */
    :root {
      --color-primary: [do DESIGN-SYSTEM];
      --color-danger: [do DESIGN-SYSTEM];
      --color-success: [do DESIGN-SYSTEM];
      --color-neutral: [do DESIGN-SYSTEM];
      --font-body: [do DESIGN-SYSTEM];
      --radius: [do DESIGN-SYSTEM];
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body); background: #F5F5F5; padding: 16px; }

    /* Cabeçalho do protótipo (não pertence ao produto) */
    .proto-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #CCC;
      font-size: 12px;
      color: #888;
      font-family: monospace;
    }
    .proto-badge {
      background: #6200EA;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
    }
    .proto-feature { font-weight: 600; color: #333; }
    .proto-spec { color: #AAA; }

    /* Componente real — área de conteúdo */
    .component {
      max-width: [do DESIGN-SYSTEM — max-width da área de conteúdo];
      margin: 0 auto;
      background: white;
      border-radius: var(--radius);
      border: 1px solid #EEE;
      padding: var(--spacing-lg);
    }

    /* Tipografia da área de conteúdo */
    .page-title { font-size: 20px; font-weight: 600; color: #111; margin-bottom: 4px; }
    .page-subtitle { font-size: 14px; color: #666; margin-bottom: var(--spacing-lg); }

    /* Ações da área */
    .area-actions {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    /* Botões */
    .btn { padding: 8px 16px; border-radius: var(--radius); font-size: 14px; cursor: pointer; border: none; font-family: inherit; }
    .btn-primary { background: var(--color-primary); color: white; }
    .btn-secondary { background: white; color: #333; border: 1px solid #DDD; }
    .btn-danger { background: var(--color-danger); color: white; }
    .btn-ghost { background: transparent; color: #555; }
    .btn:disabled { opacity: .45; cursor: not-allowed; }

    /* Formulário */
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 18px; }
    .form-label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 6px; }
    .required { color: var(--color-danger); }
    .form-control { width: 100%; padding: 9px 12px; border: 1px solid #DDD; border-radius: var(--radius); font-size: 14px; color: #111; font-family: inherit; }
    .form-control:focus { outline: 2px solid var(--color-primary); outline-offset: -1px; border-color: var(--color-primary); }
    .form-control.has-error { border-color: var(--color-danger); }
    .form-control:disabled { background: #F5F5F5; color: #999; cursor: not-allowed; }
    .form-error { font-size: 12px; color: var(--color-danger); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
    .form-hint { font-size: 12px; color: #888; margin-top: 4px; }
    .form-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; margin-top: 8px; border-top: 1px solid #EEE; }

    /* Tabela */
    .table-wrap { border-radius: var(--radius); border: 1px solid #EEE; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #F8F8F8; padding: 10px 14px; text-align: left; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
    tbody td { padding: 12px 14px; border-top: 1px solid #F0F0F0; font-size: 14px; color: #333; }
    tbody tr:hover td { background: #FAFAFA; }

    /* Tag / chip */
    .tag { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 99px; font-size: 12px; background: #EEE; color: #444; margin: 2px; }

    /* Skeleton (loading) */
    @keyframes shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #EEE 25%, #F5F5F5 50%, #EEE 75%);
      background-size: 800px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: var(--radius);
    }
    .skeleton-text { height: 14px; margin-bottom: 8px; }
    .skeleton-title { height: 22px; width: 40%; margin-bottom: 16px; }
    .skeleton-row { height: 48px; margin-bottom: 1px; }
    .skeleton-input { height: 40px; margin-bottom: 18px; border-radius: var(--radius); }
    .skeleton-btn { height: 38px; width: 120px; border-radius: var(--radius); }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
      text-align: center;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; color: #CCC; }
    .empty-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .empty-desc { font-size: 14px; color: #666; margin-bottom: 24px; max-width: 320px; }

    /* Error state */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 32px;
      text-align: center;
    }
    .error-icon { font-size: 40px; margin-bottom: 16px; color: var(--color-danger); }
    .error-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .error-desc { font-size: 14px; color: #666; margin-bottom: 24px; }

    /* Modal dentro do componente */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.4);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal-overlay.open { display: flex; }
    .modal-box { background: white; border-radius: var(--radius); padding: 28px; max-width: 440px; width: 90%; }
    .modal-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111; }
    .modal-body { font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 24px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; }

    /* Toast */
    .toast {
      position: fixed; bottom: 24px; right: 24px;
      background: #323232; color: white;
      padding: 12px 20px; border-radius: var(--radius);
      font-size: 14px; z-index: 999;
      opacity: 0; transition: opacity .2s;
      pointer-events: none;
    }
    .toast.show { opacity: 1; }
    .toast.success { background: #2E7D32; }
    .toast.error { background: var(--color-danger); }

    /* Notas do protótipo */
    .proto-notes {
      margin-top: 32px;
      border: 1px dashed #CCC;
      border-radius: var(--radius);
      padding: 14px 18px;
      background: #FFFDE7;
      font-size: 12px;
      color: #555;
    }
    .proto-notes strong { display: block; margin-bottom: 8px; font-size: 13px; color: #333; }
    .proto-notes ul { padding-left: 16px; }
    .proto-notes li { margin-bottom: 4px; line-height: 1.5; }
    .proto-notes code { background: #FFF9C4; padding: 1px 5px; border-radius: 3px; font-size: 11px; }

    /* Seção de dependências do componente */
    .proto-deps {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #CCC;
    }
    .proto-deps strong { color: #555; }
  </style>
</head>
<body>

  <!-- Cabeçalho do protótipo -->
  <div class="proto-header">
    <span class="proto-badge">🔲 COMPONENTE</span>
    <span class="proto-feature">[Feature] / [Estado]</span>
    <span class="proto-spec">spec → modules/[dom]/[fs]/[feature].md</span>
  </div>

  <!-- Componente real -->
  <div class="component">

    <!-- CONTEÚDO DO ESTADO -->
    <!-- Substituir pelo estado correspondente: form / loading / empty / error / modal -->

  </div>

  <!-- Toast -->
  <div id="toast" class="toast"></div>

  <!-- Notas do protótipo -->
  <div class="proto-notes">
    <strong>📋 Notas — [Feature] / [Estado]:</strong>
    <ul>
      <li>[comportamento não representado neste arquivo]</li>
    </ul>
    <div class="proto-deps">
      <strong>Dependências esperadas do componente pai:</strong>
      <ul>
        <li><code>organizationId</code> — via contexto global de autenticação</li>
        <li><code>userRole</code> — para exibir/ocultar campos por permissão</li>
        <li>[outras dependências identificadas no N3]</li>
      </ul>
    </div>
  </div>

  <!-- Modais (se necessário para este estado) -->

  <script>
    function openModal(id) { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }
    function showToast(msg, type = '') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast show ' + type;
      setTimeout(() => t.classList.remove('show'), 3000);
    }
  </script>

</body>
</html>
```

### Conteúdo de cada estado

**`form-component.html`**
- Título da página + subtítulo (se houver)
- Todos os campos do N3 com Label PO, tipo correto, obrigatoriedade e dica de formato
- Ao menos um campo com erro de validação pré-preenchido (para referência visual)
- Campos desabilitados para roles sem permissão (conforme N3)
- `form-footer` com cancelar (ghost) + ação principal (primary)

**`loading-component.html`**
- Skeleton no lugar de títulos, campos e tabelas
- Sem dados — apenas blocos cinza animados com proporções equivalentes ao conteúdo real
- Botões de ação desabilitados

**`empty-component.html`**
- `empty-state` com ícone SVG simples, título e descrição exatos do N3
- Botão de ação primária (conforme N3 — pode não existir)

**`error-component.html`**
- `error-state` com ícone, título e mensagem descritiva (conforme N3 — não genérica)
- Botão "Tentar novamente"

**`modal-component.html`**
- Componente já com o modal aberto (overlay + caixa) para visualização direta
- Estrutura: título + corpo + footer com ações
- Para modal de exclusão: botão danger + cancelar

---

## PASSO 3 — Geração do README do nível

Após gerar todos os estados aprovados, gere ou atualize o
`prototypes/[dominio]/[feature-set]/[feature]/README.md`
adicionando os arquivos `*-component.html` na tabela de estados
com status `🎨 Mockup`.

---

## PASSO 4 — Entrega

> "✅ Protótipos de componente de [feature] gerados.
>
> **Salvar em**: `prototypes/[dominio]/[feature-set]/[feature]/`
>
> **Arquivos gerados** (sufixo `-component`):
> - `form-component.html`
> - `loading-component.html`
> - `empty-component.html`
> - `error-component.html`
>
> **Dependências declaradas**: [lista das props/contexto esperados]
>
> **Quando usar o FULL em vez deste**: quando precisar apresentar ao
> cliente ou validar o layout completo com sidebar e topbar."
