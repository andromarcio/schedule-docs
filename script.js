// ============ CONFIG ============
const REPO_OWNER = 'andromarcio';
const REPO_NAME  = 'doc-template';
const BRANCH     = 'main';
const API_TREE   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE   = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;

// ============ DARK MODE ============
const themeToggle  = document.getElementById('themeToggle');
const hljsTheme    = document.getElementById('hljs-theme');

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
});

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    hljsTheme.href = theme === 'dark'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
}

// ============ SIDEBAR TOGGLE (mobile) ============
const menuToggle     = document.getElementById('menuToggle');
const sidebar        = document.getElementById('sidebar');
const sidebarClose   = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

menuToggle.addEventListener('click',     () => openSidebar());
sidebarClose.addEventListener('click',   () => closeSidebar());
sidebarOverlay.addEventListener('click', () => closeSidebar());

function openSidebar()  { sidebar.classList.add('open'); sidebarOverlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('active'); }

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
});

// ============ REPO TREE ============
let treeRoot = null;

async function loadTree() {
    try {
        const res = await fetch(API_TREE);
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const data = await res.json();
        treeRoot = buildTree(data.tree);
        renderTree(treeRoot, document.getElementById('treeContainer'));
    } catch (err) {
        document.getElementById('treeContainer').innerHTML =
            `<p class="tree-error"><i class="fas fa-exclamation-triangle"></i> ${err.message}</p>`;
    }
}

// Build nested object from flat API list
function buildTree(items) {
    const root = { name: REPO_NAME, path: '', type: 'tree', children: [] };
    const map  = { '': root };

    // Sort so parent dirs always come before children
    items.sort((a, b) => a.path.localeCompare(b.path));

    for (const item of items) {
        if (item.path.startsWith('.git')) continue;

        const parts      = item.path.split('/');
        const name       = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join('/');
        const parent     = map[parentPath] || root;

        const node = { name, path: item.path, type: item.type, children: [] };
        parent.children.push(node);
        if (item.type === 'tree') map[item.path] = node;
    }

    return root;
}

// Render the tree recursively into a <ul>
function renderTree(node, container) {
    container.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'tree-list';

    for (const child of sortedChildren(node)) {
        ul.appendChild(makeTreeItem(child, 0));
    }

    container.appendChild(ul);
}

function sortedChildren(node) {
    const dirs  = node.children.filter(c => c.type === 'tree').sort((a, b) => a.name.localeCompare(b.name));
    const files = node.children.filter(c => c.type !== 'tree').sort((a, b) => a.name.localeCompare(b.name));
    return [...dirs, ...files];
}

function makeTreeItem(node, depth) {
    const isDir = node.type === 'tree';
    const li    = document.createElement('li');
    li.className = 'tree-item';

    const row = document.createElement('button');
    row.className = 'tree-row' + (isDir ? ' tree-dir' : ' tree-file');
    row.style.paddingLeft = `${0.75 + depth * 1}rem`;
    row.dataset.path = node.path;

    row.innerHTML = `
        <i class="fas ${isDir ? 'fa-chevron-right tree-chevron' : fileIcon(node.name)} tree-icon"></i>
        <span class="tree-label">${node.name}</span>
    `;

    li.appendChild(row);

    if (isDir) {
        const sub = document.createElement('ul');
        sub.className = 'tree-list tree-sub collapsed';

        for (const child of sortedChildren(node)) {
            sub.appendChild(makeTreeItem(child, depth + 1));
        }

        li.appendChild(sub);

        row.addEventListener('click', () => {
            const open = sub.classList.toggle('collapsed');
            row.querySelector('.tree-chevron').classList.toggle('rotated', !open);
        });
    } else {
        row.addEventListener('click', () => loadFile(node.path, node.name));
    }

    return li;
}

function fileIcon(name) {
    if (name.endsWith('.md'))                        return 'fa-file-alt';
    if (name.match(/\.(js|ts|jsx|tsx)$/))           return 'fa-file-code';
    if (name.match(/\.(css|scss|sass)$/))           return 'fa-file-code';
    if (name.match(/\.(html|htm)$/))                return 'fa-file-code';
    if (name.match(/\.(json|yml|yaml|toml)$/))      return 'fa-file-code';
    return 'fa-file';
}

// ============ FILE VIEWER ============
const welcome      = document.getElementById('welcome');
const fileViewer   = document.getElementById('fileViewer');
const markdownBody = document.getElementById('markdownBody');
const breadcrumb   = document.getElementById('breadcrumb');

async function loadFile(path, name) {
    // Highlight active item in tree
    document.querySelectorAll('.tree-row.active').forEach(el => el.classList.remove('active'));
    const activeRow = document.querySelector(`.tree-row[data-path="${CSS.escape(path)}"]`);
    if (activeRow) activeRow.classList.add('active');

    // Show viewer, hide welcome
    welcome.style.display    = 'none';
    fileViewer.style.display = 'block';

    // Breadcrumb
    renderBreadcrumb(path);

    // Loading state
    markdownBody.innerHTML = '<p class="file-loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</p>';

    // Close sidebar on mobile
    closeSidebar();

    try {
        const res = await fetch(`${RAW_BASE}/${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        renderContent(text, name, path);
    } catch (err) {
        markdownBody.innerHTML = `<p class="file-error"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar: ${err.message}</p>`;
    }
}

function renderContent(text, name, path) {
    const ext = name.split('.').pop().toLowerCase();

    if (ext === 'md') {
        marked.setOptions({ breaks: true, gfm: true });
        markdownBody.innerHTML = marked.parse(text);

        // Syntax highlighting for code blocks
        markdownBody.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });

        // Open links that point to repo .md files internally
        markdownBody.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            // Internal relative link to a .md file — intercept it
            if (!href.startsWith('http') && !href.startsWith('#') && href.endsWith('.md')) {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    const dir      = path.includes('/') ? path.split('/').slice(0, -1).join('/') : '';
                    const resolved = dir ? `${dir}/${href}` : href;
                    const fname    = resolved.split('/').pop();
                    loadFile(resolved, fname);
                    expandTreeTo(resolved);
                });
            } else if (href.startsWith('http')) {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener');
            }
        });
    } else {
        // Plain text / code
        const pre  = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = text;
        pre.appendChild(code);
        markdownBody.innerHTML = '';
        markdownBody.appendChild(pre);
        hljs.highlightElement(code);
    }
}

function renderBreadcrumb(path) {
    breadcrumb.innerHTML = '';

    const root = document.createElement('button');
    root.className   = 'bc-item bc-root';
    root.textContent = REPO_NAME;
    root.addEventListener('click', () => {
        welcome.style.display    = 'block';
        fileViewer.style.display = 'none';
        document.querySelectorAll('.tree-row.active').forEach(el => el.classList.remove('active'));
    });
    breadcrumb.appendChild(root);

    const parts = path.split('/');
    parts.forEach((part, i) => {
        const sep = document.createElement('span');
        sep.className   = 'bc-sep';
        sep.textContent = '/';
        breadcrumb.appendChild(sep);

        const btn = document.createElement('span');
        btn.className   = 'bc-item' + (i === parts.length - 1 ? ' bc-current' : '');
        btn.textContent = part;
        breadcrumb.appendChild(btn);
    });
}

// Expand tree folders to reveal a given path
function expandTreeTo(path) {
    const parts = path.split('/');
    let currentPath = '';

    for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        const dirRow = document.querySelector(`.tree-dir[data-path="${CSS.escape(currentPath)}"]`);
        if (dirRow) {
            const sub = dirRow.closest('li')?.querySelector('.tree-sub');
            if (sub && sub.classList.contains('collapsed')) {
                sub.classList.remove('collapsed');
                dirRow.querySelector('.tree-chevron')?.classList.add('rotated');
            }
        }
    }
}

// ============ INIT ============
loadTree();
