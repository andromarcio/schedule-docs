/* ═══════════════════════════════════════════════════════════════
   CLEANSCHED DOCS — script.js
   Navegação de repositório via GitHub API com renderização Markdown
   ═══════════════════════════════════════════════════════════════ */

/* ── Configuração ── */
const REPO_OWNER   = 'andromarcio';
const REPO_NAME    = 'schedule-docs';
const BRANCH       = 'main';
const RAW_BASE     = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;
const API_BASE     = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const GITHUB_URL   = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

/* ── Filtros ── */
const HIDDEN_DIRS  = new Set(['prompts', '.github', '.git', '.claude', 'node_modules']);
const HIDDEN_PREFIX = '_template';

/* ── Ícones por extensão e pasta ── */
const ICONS = {
  dir:    '📁',
  md:     '📄',
  html:   '🖥️',
  json:   '📋',
  yml:    '⚙️',
  yaml:   '⚙️',
  js:     '⚡',
  ts:     '⚡',
  css:    '🎨',
  png:    '🖼️',
  jpg:    '🖼️',
  svg:    '🎨',
  pdf:    '📕',
  txt:    '📝',
  default:'📄',
};
const DIR_ICONS = {
  global:     '🌐',
  modules:    '📦',
  prototypes: '🔲',
  decisions:  '🏛️',
  changelogs: '📜',
  repos:      '💾',
  'data-models': '🗄️',
};

/* ── Estado global ── */
let state = {
  tree:       [],           // árvore plana da API
  treeMap:    {},           // path → nó
  activeFile: null,
  sidebarOpen: true,
  theme:      localStorage.getItem('theme') || 'light',
};

/* ═══════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════════════ */
async function init() {
  applyTheme(state.theme);
  document.getElementById('github-link').href = GITHUB_URL;

  // Carrega MASTER.md para obter nome do sistema
  loadSystemName();

  // Carrega a árvore
  await loadTree();

  // Navega para hash inicial
  handleHashChange();

  // Listeners
  window.addEventListener('hashchange', handleHashChange);
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebarMobile);
  document.getElementById('search-input').addEventListener('input', onSearch);
  document.getElementById('search-input').addEventListener('keydown', onSearchKey);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) closeSearch();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeProto(); }
  });
}

/* ═══════════════════════════════════════════════════════════════
   NOME DO SISTEMA
   ═══════════════════════════════════════════════════════════════ */
async function loadSystemName() {
  try {
    const res = await fetch(`${RAW_BASE}/global/MASTER.md`);
    if (!res.ok) return;
    const text = await res.text();
    // Procura linha "- **Nome**: [valor]"
    const match = text.match(/\*\*Nome\*\*:\s*(.+)/);
    if (match) {
      const name = match[1].trim();
      document.getElementById('system-name').textContent = name;
      document.getElementById('welcome-title').textContent = name;
      document.title = `${name} — Docs`;
    }
  } catch (e) { /* silencia */ }
}

/* ═══════════════════════════════════════════════════════════════
   CARREGAR ÁRVORE DO REPOSITÓRIO
   ═══════════════════════════════════════════════════════════════ */
async function loadTree() {
  try {
    const res = await fetch(`${API_BASE}/git/trees/${BRANCH}?recursive=1`);
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const data = await res.json();

    state.tree = data.tree.filter(item => !isHidden(item.path));
    state.treeMap = {};
    state.tree.forEach(n => { state.treeMap[n.path] = n; });

    renderSidebar();
    renderWelcomeStats();
  } catch (e) {
    document.getElementById('file-tree').innerHTML =
      `<div style="padding:12px 16px;font-size:12px;color:var(--danger)">⚠️ Erro ao carregar árvore.<br><small>${e.message}</small></div>`;
  }
}

/* Verifica se um path deve ser ocultado */
function isHidden(path) {
  const parts = path.split('/');
  return parts.some(p =>
    HIDDEN_DIRS.has(p) || p.startsWith(HIDDEN_PREFIX) || p.startsWith('.')
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONSTRUÇÃO DA ÁRVORE DE NAVEGAÇÃO
   ═══════════════════════════════════════════════════════════════ */
function buildTreeNode(items) {
  // Agrupa por nível raiz
  const roots = {};
  items.forEach(item => {
    const parts = item.path.split('/');
    const root = parts[0];
    if (!roots[root]) roots[root] = { name: root, path: root, type: 'dir', children: {} };
    if (parts.length === 1) {
      roots[root] = { ...roots[root], type: item.type, sha: item.sha };
    } else {
      addToNode(roots[root], parts.slice(1), item);
    }
  });
  return Object.values(roots).sort(sortNodes);
}

function addToNode(node, parts, item) {
  const name = parts[0];
  if (!node.children[name]) {
    node.children[name] = { name, path: `${node.path}/${name}`, type: 'dir', children: {} };
  }
  if (parts.length === 1) {
    node.children[name] = { ...node.children[name], type: item.type, sha: item.sha };
  } else {
    addToNode(node.children[name], parts.slice(1), item);
  }
}

function sortNodes(a, b) {
  // Pastas primeiro, depois arquivos; ambos em ordem alfabética
  if (a.type === 'tree' && b.type !== 'tree') return -1;
  if (a.type !== 'tree' && b.type === 'tree') return 1;
  // README.md e INDEX.md primeiro entre arquivos
  const priority = (n) => n.name.toLowerCase().startsWith('readme') || n.name.toLowerCase().startsWith('index') ? -1 : 0;
  const pa = priority(a), pb = priority(b);
  if (pa !== pb) return pa - pb;
  return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
}

/* ═══════════════════════════════════════════════════════════════
   RENDERIZAÇÃO DO SIDEBAR
   ═══════════════════════════════════════════════════════════════ */
function renderSidebar() {
  const treeEl = document.getElementById('file-tree');
  const nodes = buildTreeNode(state.tree);
  treeEl.innerHTML = '';

  // Arquivo README.md na raiz sempre no topo
  const readme = nodes.find(n => n.name.toLowerCase() === 'readme.md');
  const n0vision = nodes.find(n => n.name === 'N0_PRODUCT_VISION.md');
  const rest = nodes.filter(n => n !== readme && n !== n0vision);

  const ordered = [readme, n0vision, ...rest].filter(Boolean);
  ordered.forEach(node => {
    treeEl.appendChild(renderNode(node, 0));
  });
}

function getIcon(node) {
  if (node.type === 'tree') return DIR_ICONS[node.name] || ICONS.dir;
  const ext = node.name.split('.').pop().toLowerCase();
  return ICONS[ext] || ICONS.default;
}

function renderNode(node, depth) {
  const isDir = node.type === 'tree';
  const children = isDir ? Object.values(node.children || {}).sort(sortNodes) : [];
  const hasChildren = children.length > 0;

  const item = document.createElement('div');
  item.className = 'tree-item';
  item.dataset.path = node.path;

  const row = document.createElement('div');
  row.className = 'tree-row';
  row.dataset.path = node.path;
  row.dataset.type = isDir ? 'dir' : 'file';
  if (node.path === state.activeFile) row.classList.add('active');

  // Indentação
  if (depth > 0) {
    const indent = document.createElement('span');
    indent.className = 'tree-indent';
    indent.style.width = `${depth * 14}px`;
    row.appendChild(indent);
  }

  // Chevron
  const chev = document.createElement('span');
  chev.className = `tree-chevron ${!isDir ? 'leaf' : hasChildren ? '' : 'leaf'}`;
  chev.innerHTML = '▶';
  row.appendChild(chev);

  // Ícone
  const icon = document.createElement('span');
  icon.className = 'tree-icon';
  icon.textContent = getIcon(node);
  row.appendChild(icon);

  // Nome
  const label = document.createElement('span');
  label.className = `tree-name${isDir ? ' tree-name-dir' : ''}`;
  label.textContent = node.name;
  row.appendChild(label);

  item.appendChild(row);

  // Filhos
  let childrenEl = null;
  if (isDir && hasChildren) {
    childrenEl = document.createElement('div');
    childrenEl.className = 'tree-children';
    childrenEl.dataset.parentPath = node.path;
    children.forEach(child => {
      childrenEl.appendChild(renderNode(child, depth + 1));
    });
    item.appendChild(childrenEl);
  }

  // Clique
  row.addEventListener('click', () => {
    if (isDir && hasChildren && childrenEl) {
      const open = childrenEl.classList.toggle('open');
      chev.classList.toggle('open', open);
    }
    if (!isDir) {
      navigateTo(node.path);
    } else {
      navigateTo(node.path, true);
    }
  });

  return item;
}

/* Abrir caminho pai no sidebar */
function expandPathInSidebar(filePath) {
  const parts = filePath.split('/');
  let cumPath = '';
  parts.slice(0, -1).forEach(part => {
    cumPath = cumPath ? `${cumPath}/${part}` : part;
    const row = document.querySelector(`.tree-row[data-path="${cumPath}"]`);
    if (row) {
      const parent = row.closest('.tree-item');
      if (parent) {
        const childrenEl = parent.querySelector('.tree-children');
        const chev = row.querySelector('.tree-chevron');
        if (childrenEl) { childrenEl.classList.add('open'); }
        if (chev) { chev.classList.add('open'); }
      }
    }
  });
}

/* Marcar ativo */
function setActive(path) {
  document.querySelectorAll('.tree-row.active').forEach(r => r.classList.remove('active'));
  const row = document.querySelector(`.tree-row[data-path="${path}"]`);
  if (row) {
    row.classList.add('active');
    row.scrollIntoView({ block: 'nearest' });
  }
}

/* ═══════════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ═══════════════════════════════════════════════════════════════ */
function navigateTo(path, isDir = false) {
  window.location.hash = encodeURIComponent(path);
}

function handleHashChange() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) {
    showWelcome();
    return;
  }
  const node = state.treeMap[hash];
  if (!node) { showWelcome(); return; }

  if (node.type === 'tree') {
    showDirectory(hash);
  } else {
    showFile(hash);
  }
}

/* ═══════════════════════════════════════════════════════════════
   TELA DE BOAS-VINDAS
   ═══════════════════════════════════════════════════════════════ */
function showWelcome() {
  state.activeFile = null;
  setActive('');
  document.getElementById('content-inner').innerHTML = document.getElementById('welcome-screen')?.outerHTML || '<div class="welcome"><div class="welcome-icon">📚</div></div>';
  renderWelcomeStats();
}

function renderWelcomeStats() {
  const statsEl = document.getElementById('welcome-stats');
  if (!statsEl) return;
  const dirs   = state.tree.filter(n => n.type === 'tree').length;
  const files  = state.tree.filter(n => n.type === 'blob').length;
  const mds    = state.tree.filter(n => n.path.endsWith('.md')).length;
  const htmls  = state.tree.filter(n => n.path.endsWith('.html')).length;
  statsEl.innerHTML = [
    dirs  ? `<span class="stat-chip">📁 ${dirs} diretórios</span>` : '',
    mds   ? `<span class="stat-chip">📄 ${mds} documentos</span>` : '',
    htmls ? `<span class="stat-chip">🔲 ${htmls} protótipos</span>` : '',
  ].join('');
}

/* ═══════════════════════════════════════════════════════════════
   EXIBIR DIRETÓRIO
   ═══════════════════════════════════════════════════════════════ */
function showDirectory(dirPath) {
  state.activeFile = dirPath;
  setActive(dirPath);
  expandPathInSidebar(dirPath + '/_');

  const dirName = dirPath.split('/').pop();
  const children = state.tree.filter(n => {
    const parent = n.path.substring(0, n.path.lastIndexOf('/'));
    return parent === dirPath;
  }).sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.path.localeCompare(b.path, 'pt-BR');
  });

  const breadcrumb = buildBreadcrumb(dirPath, true);
  const count = children.length;

  let cards = children.map(child => {
    const isDir = child.type === 'tree';
    const icon = getIcon(child);
    const name = child.path.split('/').pop();
    const type = isDir ? 'Diretório' : fileTypeLabel(name);
    return `<div class="dir-entry" onclick="navigateTo('${child.path}',${isDir})">
      <span class="dir-entry-icon">${icon}</span>
      <div class="dir-entry-info">
        <div class="dir-entry-name">${name}</div>
        <div class="dir-entry-type">${type}</div>
      </div>
    </div>`;
  }).join('');

  // Verifica se existe README.md ou INDEX.md nesta pasta — e se sim, carrega automaticamente
  const readmeNode = state.treeMap[`${dirPath}/README.md`] || state.treeMap[`${dirPath}/INDEX.md`];

  document.getElementById('content-inner').innerHTML = `
    ${breadcrumb}
    <div class="dir-listing">
      <div class="dir-listing-title">
        ${DIR_ICONS[dirName] || '📁'} ${dirName}
        <span class="dir-listing-count">${count} ${count === 1 ? 'item' : 'itens'}</span>
      </div>
      <div class="dir-listing-grid">${cards || '<p style="color:var(--text-3);margin-top:16px">Diretório vazio.</p>'}</div>
    </div>
    ${readmeNode ? `<div id="readme-content" style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border)"></div>` : ''}
  `;

  // Carrega README inline se existir
  if (readmeNode) {
    fetchAndRenderMd(readmeNode.path, document.getElementById('readme-content'));
  }
}

function fileTypeLabel(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = { md: 'Documento Markdown', html: 'Protótipo HTML', json: 'JSON', yml: 'YAML', yaml: 'YAML', js: 'JavaScript', ts: 'TypeScript', css: 'CSS' };
  return map[ext] || ext.toUpperCase();
}

/* ═══════════════════════════════════════════════════════════════
   EXIBIR ARQUIVO
   ═══════════════════════════════════════════════════════════════ */
async function showFile(filePath) {
  state.activeFile = filePath;
  setActive(filePath);
  expandPathInSidebar(filePath);

  const ext = filePath.split('.').pop().toLowerCase();
  const name = filePath.split('/').pop();

  // Loading
  document.getElementById('content-inner').innerHTML = `
    ${buildBreadcrumb(filePath, false)}
    <div class="content-loading"><div class="spinner"></div> Carregando ${name}…</div>
  `;

  try {
    if (ext === 'html') {
      showHtmlFile(filePath);
    } else if (ext === 'md') {
      await showMarkdownFile(filePath);
    } else {
      await showRawFile(filePath);
    }
  } catch (e) {
    document.getElementById('content-inner').innerHTML = `
      ${buildBreadcrumb(filePath, false)}
      <div class="content-error">
        <div class="error-icon">⚠️</div>
        <p>Não foi possível carregar <strong>${name}</strong>.<br><small>${e.message}</small></p>
        <button class="retry-btn" onclick="showFile('${filePath}')">Tentar novamente</button>
      </div>
    `;
  }
}

/* ── Markdown ── */
async function showMarkdownFile(filePath) {
  await fetchAndRenderMd(filePath, null);
}

async function fetchAndRenderMd(filePath, targetEl) {
  const res = await fetch(`${RAW_BASE}/${filePath}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const html = renderMarkdown(text, filePath);
  const name = filePath.split('/').pop();

  const container = `
    ${buildBreadcrumb(filePath, false)}
    <div class="md-content">${html}</div>
  `;

  if (targetEl) {
    targetEl.innerHTML = `<div class="md-content">${html}</div>`;
  } else {
    document.getElementById('content-inner').innerHTML = container;
  }

  // Syntax highlighting
  document.querySelectorAll('.md-content pre code').forEach(el => {
    addCodeLangLabel(el);
    try { hljs.highlightElement(el); } catch(e) {}
  });

  // Tornar links internos (.md) navegáveis
  document.querySelectorAll('.md-content a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const resolved = resolvePath(filePath, href.replace(/\.md$/, '.md'));
        if (state.treeMap[resolved]) navigateTo(resolved);
        else window.open(`${GITHUB_URL}/blob/${BRANCH}/${resolved}`, '_blank');
      });
    }
  });
}

function renderMarkdown(text, filePath) {
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
  });
  // Renderiza HTML dentro de div.dev-only intacto
  return marked.parse(text);
}

function addCodeLangLabel(el) {
  const cls = Array.from(el.classList).find(c => c.startsWith('language-'));
  if (!cls) return;
  const lang = cls.replace('language-', '');
  const label = document.createElement('span');
  label.className = 'code-lang-label';
  label.textContent = lang;
  el.closest('pre')?.appendChild(label);
}

/* ── HTML (protótipo) ── */
function showHtmlFile(filePath) {
  const name = filePath.split('/').pop().replace('.html', '');
  const fullUrl = `${RAW_BASE}/${filePath}`;
  const ghUrl = `${GITHUB_URL}/blob/${BRANCH}/${filePath}`;

  document.getElementById('content-inner').innerHTML = `
    ${buildBreadcrumb(filePath, false)}
    <div style="margin-bottom:16px">
      <h1 style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px">🖥️ ${name}</h1>
      <div style="font-size:13px;color:var(--text-3);margin-bottom:16px">${filePath}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="proto-preview-btn" onclick="openProto('${filePath}', '${name}')">
          🔲 Abrir Protótipo
        </button>
        <a href="${ghUrl}" target="_blank" class="proto-preview-btn" style="background:var(--primary-bg);color:var(--primary);border-color:var(--primary)">
          ↗ Ver no GitHub
        </a>
      </div>
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
      <div style="background:var(--surface-2);padding:8px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">
        <span style="width:10px;height:10px;background:#FF5F57;border-radius:50%;display:inline-block"></span>
        <span style="width:10px;height:10px;background:#FEBC2E;border-radius:50%;display:inline-block"></span>
        <span style="width:10px;height:10px;background:#28C840;border-radius:50%;display:inline-block"></span>
        <span style="font-size:11px;color:var(--text-3);margin-left:8px">${filePath}</span>
      </div>
      <iframe
        src="${RAW_BASE}/${filePath}"
        style="width:100%;height:680px;border:none;display:block"
        title="${name}"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  `;
}

/* ── Raw / outros ── */
async function showRawFile(filePath) {
  const res = await fetch(`${RAW_BASE}/${filePath}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const name = filePath.split('/').pop();
  const ext = name.split('.').pop();

  document.getElementById('content-inner').innerHTML = `
    ${buildBreadcrumb(filePath, false)}
    <h1 style="font-size:22px;font-weight:700;margin-bottom:16px;color:var(--text)">📄 ${name}</h1>
    <pre style="background:var(--code-bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;overflow:auto;max-height:80vh"><code class="language-${ext}">${escapeHtml(text)}</code></pre>
  `;
  document.querySelectorAll('pre code').forEach(el => {
    try { hljs.highlightElement(el); } catch(e) {}
  });
}

/* ═══════════════════════════════════════════════════════════════
   BREADCRUMB
   ═══════════════════════════════════════════════════════════════ */
function buildBreadcrumb(path, isDir) {
  const parts = path.split('/');
  let crumbs = `<a href="#" onclick="event.preventDefault();window.location.hash=''">🏠 Início</a>`;
  let cumPath = '';
  parts.forEach((part, i) => {
    cumPath = cumPath ? `${cumPath}/${part}` : part;
    const isLast = i === parts.length - 1;
    crumbs += `<span class="breadcrumb-sep">›</span>`;
    if (isLast) {
      crumbs += `<span>${part}</span>`;
    } else {
      crumbs += `<a href="#${encodeURIComponent(cumPath)}">${part}</a>`;
    }
  });
  return `<div class="breadcrumb">${crumbs}</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   PROTÓTIPO MODAL
   ═══════════════════════════════════════════════════════════════ */
function openProto(filePath, title) {
  const modal    = document.getElementById('proto-modal');
  const backdrop = document.getElementById('proto-backdrop');
  const frame    = document.getElementById('proto-frame');
  const titleEl  = document.getElementById('proto-modal-title');
  const openLink = document.getElementById('proto-open-link');

  frame.src = `${RAW_BASE}/${filePath}`;
  titleEl.textContent = `🔲 ${title}`;
  openLink.href = `${RAW_BASE}/${filePath}`;

  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProto() {
  document.getElementById('proto-modal').classList.remove('open');
  document.getElementById('proto-backdrop').classList.remove('open');
  document.getElementById('proto-frame').src = 'about:blank';
  document.body.style.overflow = '';
}
window.closeProto = closeProto;

/* ═══════════════════════════════════════════════════════════════
   TEMA
   ═══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-btn').textContent = theme === 'dark' ? '☀️' : '🌙';
  const lightSheet = document.getElementById('hljs-theme-light');
  const darkSheet  = document.getElementById('hljs-theme-dark');
  if (lightSheet) lightSheet.disabled = theme === 'dark';
  if (darkSheet)  darkSheet.disabled  = theme !== 'dark';
}
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme(state.theme);
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
   ═══════════════════════════════════════════════════════════════ */
function toggleSidebar() {
  if (window.innerWidth <= 640) {
    // Mobile: abre/fecha como overlay
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const open = sidebar.classList.toggle('open');
    overlay.classList.toggle('open', open);
    if (open) overlay.style.pointerEvents = 'all';
    else overlay.style.pointerEvents = 'none';
  } else {
    // Desktop: colapsa/expande
    document.body.classList.toggle('sidebar-collapsed');
  }
}
function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  const overlay = document.getElementById('sidebar-overlay');
  overlay.classList.remove('open');
  overlay.style.pointerEvents = 'none';
}

/* ═══════════════════════════════════════════════════════════════
   BUSCA
   ═══════════════════════════════════════════════════════════════ */
let searchDebounce;
function onSearch(e) {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => runSearch(e.target.value.trim()), 200);
}
function runSearch(q) {
  const results = document.getElementById('search-results');
  if (!q) { results.classList.remove('open'); return; }

  const matches = state.tree
    .filter(n => n.type === 'blob' && n.path.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 12);

  if (!matches.length) {
    results.innerHTML = `<div class="search-empty">Nenhum resultado para "<strong>${escapeHtml(q)}</strong>"</div>`;
    results.classList.add('open');
    return;
  }

  results.innerHTML = matches.map(n => {
    const name = n.path.split('/').pop();
    const dir  = n.path.split('/').slice(0, -1).join('/');
    const icon = getIcon(n);
    const qLow = q.toLowerCase();
    const nameLow = name.toLowerCase();
    const highlighted = nameLow.includes(qLow)
      ? name.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark style="background:var(--primary-bg);color:var(--primary);border-radius:2px">${m}</mark>`)
      : name;
    return `<div class="search-result-item" onclick="navigateTo('${n.path}');closeSearch()">
      <span class="search-result-icon">${icon}</span>
      <div>
        <div class="search-result-name">${highlighted}</div>
        ${dir ? `<div class="search-result-path">${dir}</div>` : ''}
      </div>
    </div>`;
  }).join('');
  results.classList.add('open');
}
function onSearchKey(e) {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'Enter') {
    const first = document.querySelector('.search-result-item');
    if (first) first.click();
  }
}
function closeSearch() {
  document.getElementById('search-results').classList.remove('open');
  document.getElementById('search-input').value = '';
}
window.closeSearch = closeSearch;

/* ═══════════════════════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════════════════════ */
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function resolvePath(basePath, relative) {
  const base = basePath.split('/').slice(0, -1);
  relative.split('/').forEach(p => {
    if (p === '..') base.pop();
    else if (p !== '.') base.push(p);
  });
  return base.join('/');
}

/* ═══════════════════════════════════════════════════════════════
   START
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
