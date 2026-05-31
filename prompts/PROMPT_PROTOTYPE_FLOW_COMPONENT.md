# PROMPT_PROTOTYPE_FLOW_COMPONENT — Protótipo de Fluxo (Componente)

> **Quem participia**: dev / designer / PO técnico
> **Insumo necessário**: DESIGN-SYSTEM.md + N2 do Feature Set
> **Entrega**: arquivo `flow-component.html` mostrando o fluxo de navegação
> entre as áreas de conteúdo das telas, **sem** sidebar, topbar ou shell
> de aplicação — apenas o conteúdo principal de cada tela
>
> **Quando usar este em vez do FULL**:
> - Iteração rápida — quer validar o fluxo sem montar o layout completo
> - Componente será embutido em outro sistema (iframe, storybook, design token preview)
> - O Design System ainda não está definido completamente
> - Quer gerar múltiplas variações para comparação sem repetir o layout
>
> **Pré-requisito**: N2 aprovado (PROMPT_2B concluído)
> **Onde salvar**: `prototypes/[dominio]/[feature-set]/flow-component.html`

---

## INSTRUÇÕES PARA O CLAUDE

Você vai gerar um protótipo de fluxo HTML focado **exclusivamente no conteúdo**
de cada tela — sem sidebar, topbar, breadcrumb ou qualquer shell de aplicação.

O arquivo terá um menu de navegação próprio e minimalista no topo,
apenas para permitir alternar entre as telas durante a revisão.

### Regras de geração

1. **Sem shell de aplicação**: nenhuma sidebar, topbar, nav global ou footer.
   O foco é a área de conteúdo `<main>` de cada tela.

2. **Navegador de protótipo próprio**: incluir uma barra simples no topo
   do arquivo com os nomes das telas como abas ou botões de seleção.
   Essa barra pertence ao protótipo, não ao produto.

3. **Tokens do Design System aplicados**: mesmo sem o layout completo,
   usar as cores, tipografia, espaçamentos e componentes do Design System
   para os elementos internos (tabelas, formulários, botões, cards).

4. **Foco na informação e hierarquia**: sem o visual completo, o protótipo
   deve deixar claro o que é título de página, o que são ações primárias,
   o que é conteúdo principal e o que é secundário.

5. **Navegação funcional entre telas**: botões e links de transição devem
   funcionar — implementar como troca de `display` entre seções.

6. **Leve e rápido**: o arquivo deve ser compacto. Evitar CSS excessivo.
   Um desenvolvedor deve conseguir adaptar o componente em menos de 30 minutos.

7. **Dados fictícios realistas**: mesma regra do FULL — nunca Lorem ipsum.

8. **Anotar dependências do layout**: listar no painel de notas o que
   o componente precisa do shell para funcionar corretamente
   (ex: "Este componente assume que a sidebar passa o `organizationId` via contexto").

---

## CONTEXTO DO PROJETO

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

=== N3s DAS FEATURES (opcional) ===
[cole aqui os N3s disponíveis, se quiser mais fidelidade]

---

## PASSO 1 — Mapeamento de telas

Leia o N2 e liste as telas e o grafo de navegação entre elas.
Apresente antes de gerar:

```
[Listagem] ──"Novo"──→ [Formulário de criação]
           ──"Linha"──→ [Detalhe]
                            └──"Editar"──→ [Formulário de edição]
```

Pergunte:
> "O mapa de navegação reflete o fluxo esperado?
> Posso gerar o protótipo de componente?"

---

## PASSO 2 — Geração do HTML

Após aprovação, gere `flow-component.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Feature Set] — Fluxo (Componente)</title>
  <style>
    /* Tokens do Design System */
    :root {
      --color-primary: [do DESIGN-SYSTEM];
      --color-danger: [do DESIGN-SYSTEM];
      --color-success: [do DESIGN-SYSTEM];
      --color-neutral: [do DESIGN-SYSTEM];
      --font-body: [do DESIGN-SYSTEM];
      --radius: [do DESIGN-SYSTEM];
      --spacing-sm: [do DESIGN-SYSTEM];
      --spacing-md: [do DESIGN-SYSTEM];
      --spacing-lg: [do DESIGN-SYSTEM];
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body); background: #F5F5F5; padding: 0; }

    /* ── Navegador do protótipo (não pertence ao produto) ── */
    .proto-nav {
      background: #1A1A2E;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .proto-nav span {
      color: #888;
      font-size: 11px;
      font-family: monospace;
      margin-right: 8px;
    }
    .proto-nav button {
      background: transparent;
      border: 1px solid #444;
      color: #CCC;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      font-family: monospace;
    }
    .proto-nav button.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    /* ── Área de conteúdo (o componente real) ── */
    .component-area {
      padding: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* ── Telas ── */
    .screen { display: none; }
    .screen.active { display: block; }

    /* ── Componentes do Design System ── */
    /* Título de página */
    .page-title {
      font-size: 22px;
      font-weight: 600;
      color: #111;
      margin-bottom: 4px;
    }
    .page-subtitle { font-size: 14px; color: #666; margin-bottom: 24px; }

    /* Barra de ações da página */
    .page-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    /* Botões */
    .btn { padding: 8px 16px; border-radius: var(--radius); font-size: 14px; cursor: pointer; border: none; }
    .btn-primary { background: var(--color-primary); color: white; }
    .btn-secondary { background: white; color: #333; border: 1px solid #DDD; }
    .btn-danger { background: var(--color-danger); color: white; }
    .btn-ghost { background: transparent; color: #555; border: 1px solid transparent; }
    .btn:disabled { opacity: .5; cursor: not-allowed; }

    /* Tabela */
    table { width: 100%; border-collapse: collapse; background: white; border-radius: var(--radius); overflow: hidden; }
    th { background: #F8F8F8; padding: 10px 14px; text-align: left; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
    td { padding: 12px 14px; border-top: 1px solid #F0F0F0; font-size: 14px; }
    tr:hover td { background: #FAFAFA; }

    /* Formulário */
    .form-group { margin-bottom: 18px; }
    .form-label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 6px; }
    .form-label .required { color: var(--color-danger); margin-left: 2px; }
    .form-control { width: 100%; padding: 9px 12px; border: 1px solid #DDD; border-radius: var(--radius); font-size: 14px; color: #111; }
    .form-control:focus { outline: none; border-color: var(--color-primary); }
    .form-control.error { border-color: var(--color-danger); }
    .form-control:disabled { background: #F5F5F5; color: #999; cursor: not-allowed; }
    .form-error { font-size: 12px; color: var(--color-danger); margin-top: 4px; }
    .form-hint { font-size: 12px; color: #888; margin-top: 4px; }
    .form-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #EEE; }

    /* Card / painel */
    .card { background: white; border-radius: var(--radius); border: 1px solid #EEE; padding: 20px; }

    /* Tags / chips */
    .tag { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 12px; background: #EEE; color: #444; margin: 2px; }

    /* Modal overlay (para uso dentro do componente) */
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 100; align-items: center; justify-content: center; }
    .modal-overlay.open { display: flex; }
    .modal-box { background: white; border-radius: var(--radius); padding: 28px; max-width: 440px; width: 90%; }
    .modal-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .modal-body { font-size: 14px; color: #555; margin-bottom: 24px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; }

    /* Toast (simulado, aparece no canto) */
    .toast { position: fixed; top: 20px; right: 20px; background: #323232; color: white; padding: 12px 20px; border-radius: var(--radius); font-size: 14px; z-index: 999; display: none; }
    .toast.show { display: block; }
    .toast.success { background: var(--color-success, #2E7D32); }
    .toast.error { background: var(--color-danger); }

    /* Painel de notas do protótipo */
    .proto-notes {
      margin-top: 32px;
      border: 1px dashed #CCC;
      border-radius: var(--radius);
      padding: 14px 18px;
      background: #FFFDE7;
      font-size: 13px;
      color: #555;
    }
    .proto-notes strong { display: block; margin-bottom: 8px; color: #333; }
    .proto-notes ul { padding-left: 18px; }
    .proto-notes li { margin-bottom: 4px; }
  </style>
</head>
<body>

  <!-- Navegador do protótipo -->
  <nav class="proto-nav">
    <span>🔲 PROTÓTIPO COMPONENTE — [Feature Set]</span>
    <button class="active" onclick="showScreen('screen-list', this)">[Tela 1]</button>
    <button onclick="showScreen('screen-detail', this)">[Tela 2]</button>
    <button onclick="showScreen('screen-form', this)">[Tela 3]</button>
  </nav>

  <!-- Toast global -->
  <div id="toast" class="toast"></div>

  <!-- Área de conteúdo -->
  <div class="component-area">

    <!-- Tela 1: Listagem -->
    <div id="screen-list" class="screen active">
      <div class="page-actions">
        <div>
          <div class="page-title">[Título da tela]</div>
          <div class="page-subtitle">[Subtítulo opcional]</div>
        </div>
        <button class="btn btn-primary" onclick="showScreen('screen-form', document.querySelector('[onclick*=screen-form]'))">[Ação primária]</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>[Coluna 1]</th>
            <th>[Coluna 2]</th>
            <th>[Coluna 3]</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr onclick="showScreen('screen-detail', document.querySelector('[onclick*=screen-detail]'))" style="cursor:pointer">
            <td>[dado fictício realista]</td>
            <td>[dado fictício realista]</td>
            <td><span class="tag">[tag]</span></td>
            <td><button class="btn btn-ghost btn-sm">✎</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tela 2: Detalhe -->
    <div id="screen-detail" class="screen">
      <!-- conteúdo do detalhe -->
    </div>

    <!-- Tela 3: Formulário -->
    <div id="screen-form" class="screen">
      <!-- campos do formulário -->
      <div class="form-footer">
        <button class="btn btn-ghost" onclick="showScreen('screen-list', document.querySelector('[onclick*=screen-list]'))">Cancelar</button>
        <button class="btn btn-primary" onclick="showToast('Registro salvo com sucesso.', 'success')">Salvar</button>
      </div>
    </div>

    <!-- Modais -->
    <div id="modal-delete" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-title">Excluir [item]?</div>
        <div class="modal-body">Esta ação não pode ser desfeita.</div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="closeModal('modal-delete')">Cancelar</button>
          <button class="btn btn-danger" onclick="closeModal('modal-delete'); showToast('Registro excluído.', 'success')">Excluir</button>
        </div>
      </div>
    </div>

    <!-- Notas do protótipo -->
    <div class="proto-notes">
      <strong>📋 Notas — Componente [Feature Set]:</strong>
      <ul>
        <li>Este componente assume que recebe <code>organizationId</code> do contexto global.</li>
        <li>[Outro comportamento não representado aqui]</li>
      </ul>
    </div>

  </div><!-- /component-area -->

  <script>
    function showScreen(id, btn) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      if (btn) {
        document.querySelectorAll('.proto-nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    }

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

---

## PASSO 3 — Entrega

> "✅ Protótipo de fluxo (componente) gerado.
>
> **Salvar como**: `prototypes/[dominio]/[feature-set]/flow-component.html`
>
> **Quando usar o FULL em vez deste**: quando precisar validar o layout
> completo com sidebar e topbar, ou para apresentações ao cliente.
>
> **Telas cobertas**: [lista]
> **Dependências declaradas nas notas**: [lista]"
