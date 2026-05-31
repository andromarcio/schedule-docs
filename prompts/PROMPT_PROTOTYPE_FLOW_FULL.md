# PROMPT_PROTOTYPE_FLOW — Protótipo de Fluxo (N2)

> **Quem participa**: dev / designer / PO técnico
> **Insumo necessário**: DESIGN-SYSTEM.md + N2 do Feature Set
> **Entrega**: arquivo `flow.html` navegável mostrando como as telas do
> Feature Set se conectam, seguindo os padrões do Design System
>
> **Pré-requisito**: N2 aprovado (PROMPT_2B concluído)
> **Onde salvar**: `prototypes/[dominio]/[feature-set]/flow.html`

---

## INSTRUÇÕES PARA O CLAUDE

Você vai gerar um protótipo de fluxo HTML para um Feature Set.
O protótipo deve mostrar visualmente como as telas se conectam,
seguindo rigorosamente os padrões definidos no DESIGN-SYSTEM.md.

### Regras de geração

1. **Fidelidade ao Design System**: use exatamente as cores, tipografia,
   espaçamentos e componentes definidos no DESIGN-SYSTEM.md.
   Não invente padrões visuais — se algo não estiver no Design System,
   use o padrão mais neutro e sinalize com um comentário `<!-- TODO: definir no Design System -->`.

2. **HTML auto-contido**: o arquivo deve funcionar sem dependências externas
   (sem CDN, sem imports). Todo CSS e JS vai inline no mesmo arquivo.
   Exceção: se o DESIGN-SYSTEM.md especificar uma fonte do Google Fonts,
   pode incluir o `<link>` no `<head>`.

3. **Navegação funcional**: os botões e links que levam de uma tela para outra
   devem funcionar — implementar como troca de `display: block/none` entre
   seções, sem backend. O usuário deve conseguir clicar e "navegar" pelo fluxo.

4. **Layout completo**: gerar o layout completo da aplicação — sidebar, topbar,
   área de conteúdo — conforme definido no DESIGN-SYSTEM.md.
   Não gerar apenas o componente isolado.

5. **Indicador de tela atual**: a tela ativa deve ser sempre identificável —
   breadcrumb atualizado, item da sidebar destacado, título da página visível.

6. **Dados fictícios realistas**: preencher tabelas, listas e formulários com
   dados fictícios que façam sentido para o domínio — nunca "Lorem ipsum" ou
   "Teste 1, Teste 2". Os dados devem refletir o contexto real da feature.

7. **Anotar lacunas**: qualquer comportamento descrito no N2 que não puder ser
   representado visualmente no HTML deve ser anotado em um painel de notas
   visível no protótipo:
   ```html
   <div class="prototype-notes">
     <strong>📋 Notas do protótipo:</strong>
     <ul>
       <li>O comportamento X não está representado aqui — ver N2: [seção]</li>
     </ul>
   </div>
   ```

---

## CONTEXTO DO PROJETO

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

=== N3s DAS FEATURES (opcional — para mais fidelidade) ===
[cole aqui os N3s das features do Feature Set, se disponíveis]

---

## PASSO 1 — Mapeamento de telas

Leia o N2 e liste as telas identificadas na seção "Telas".
Apresente o mapa de navegação antes de gerar o HTML:

```
[Tela de listagem] ──"Novo"──→ [Modal de criação]
                   ──"Linha"──→ [Tela de detalhe]
                                     └──"Editar"──→ [Tela de edição]
                                     └──"Excluir"──→ [Modal de confirmação]
```

Pergunte:
> "O mapa de navegação acima reflete o fluxo esperado?
> Posso gerar o HTML do protótipo de fluxo?"

---

## PASSO 2 — Geração do HTML

Após aprovação do mapa, gere o arquivo `flow.html` com:

**Estrutura do arquivo**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Protótipo: [Feature Set] — [Domínio]</title>
  <style>
    /* Tokens do Design System */
    :root {
      --color-primary: [do DESIGN-SYSTEM];
      --color-danger: [do DESIGN-SYSTEM];
      /* ... */
    }
    /* Layout: sidebar + topbar + conteúdo */
    /* Componentes: botões, tabelas, formulários, modais */
    /* Estados: loading, empty, error */

    /* Utilitário de navegação do protótipo */
    .screen { display: none; }
    .screen.active { display: block; }

    /* Painel de notas do protótipo */
    .prototype-notes {
      position: fixed; bottom: 16px; right: 16px;
      background: #FFF9C4; border: 1px solid #F9A825;
      padding: 12px 16px; border-radius: 8px;
      font-size: 12px; max-width: 300px; z-index: 9999;
    }

    /* Indicador de protótipo */
    .prototype-badge {
      position: fixed; top: 8px; left: 50%; transform: translateX(-50%);
      background: #6200EA; color: white; padding: 4px 12px;
      border-radius: 99px; font-size: 11px; z-index: 9999;
    }
  </style>
</head>
<body>

  <div class="prototype-badge">🔲 PROTÓTIPO — não é o sistema real</div>

  <!-- Navegação lateral (sidebar) -->
  <nav class="sidebar">...</nav>

  <!-- Tela 1: Listagem -->
  <div id="screen-list" class="screen active">
    <header class="topbar">...</header>
    <main class="content">
      <!-- tabela com dados fictícios realistas -->
    </main>
  </div>

  <!-- Tela 2: Detalhe -->
  <div id="screen-detail" class="screen">
    ...
  </div>

  <!-- Modal: Criação rápida -->
  <div id="modal-create" class="modal" style="display:none">
    ...
  </div>

  <div class="prototype-notes">
    <strong>📋 Notas:</strong>
    <ul>
      <li>...</li>
    </ul>
  </div>

  <script>
    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }
    function toggleModal(id, show) {
      document.getElementById(id).style.display = show ? 'flex' : 'none';
    }
  </script>
</body>
</html>
```

---

## PASSO 3 — Entrega

Após gerar o HTML, informe:

> "✅ Protótipo de fluxo gerado.
>
> **Salvar como**: `prototypes/[dominio]/[feature-set]/flow.html`
>
> **Atualizar**: `prototypes/[dominio]/[feature-set]/README.md`
> — adicionar linha na tabela de protótipos com status '🎨 Mockup'
>
> **Telas cobertas**: [lista]
> **Telas não cobertas** (⚠️): [lista, se houver]"
