// ==========================================================================
// Portfolio App - Vanilla JS (Category-Based Navigation)
// ==========================================================================

// State
const state = {
  data: null,
  currentCategory: 'career',
  techFilter: 'all'
};

// Code Explorer State
const codeExplorerState = {
  expandedFolders: new Set(),
  expandedFiles: new Set(),
  selectedTags: new Set()
};

// ==========================================================================
// Data Loading
// ==========================================================================

async function loadData() {
  try {
    const response = await fetch('timeline.json');
    state.data = await response.json();
    initializeApp();
  } catch (error) {
    console.error('Failed to load timeline data:', error);
  }
}

// ==========================================================================
// Initialization
// ==========================================================================

function initializeApp() {
  setupCategoryNav();
  setupTechFilter();
  populateTechFilter();

  // Check URL hash for initial category
  const hash = window.location.hash.slice(1);
  if (['career', 'products', 'code', 'writing'].includes(hash)) {
    switchCategory(hash);
  } else {
    renderContent();
  }
}

// ==========================================================================
// Category Navigation
// ==========================================================================

function setupCategoryNav() {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      switchCategory(category);
    });
  });
}

function switchCategory(category) {
  state.currentCategory = category;

  // Update buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Update URL hash
  window.history.replaceState(null, null, `#${category}`);

  // Render content
  renderContent();
}

// ==========================================================================
// Tech Filter
// ==========================================================================

function setupTechFilter() {
  const techSelect = document.getElementById('tech-filter');
  techSelect.addEventListener('change', () => {
    state.techFilter = techSelect.value;
    renderContent();
  });
}

function populateTechFilter() {
  const techSet = new Set();

  // Collect all tech tags
  state.data.events.forEach(event => {
    if (event.tech) {
      event.tech.forEach(t => techSet.add(t));
    }
    if (event.children) {
      event.children.forEach(child => {
        if (child.tech) {
          child.tech.forEach(t => techSet.add(t));
        }
      });
    }
  });

  // Sort and populate select
  const sorted = Array.from(techSet).sort();
  const select = document.getElementById('tech-filter');
  sorted.forEach(tech => {
    const option = document.createElement('option');
    option.value = tech;
    option.textContent = tech;
    select.appendChild(option);
  });
}

// ==========================================================================
// Content Rendering
// ==========================================================================

function renderContent() {
  const container = document.getElementById('content-container');
  const items = getItemsForCategory(state.currentCategory);

  // Apply tech filter
  const filteredItems = items.filter(item => {
    if (state.techFilter === 'all') return true;
    return item.tech && item.tech.includes(state.techFilter);
  });

  if (filteredItems.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No items match the current filters.</p></div>';
    return;
  }

  // Each category uses appropriate view
  if (state.currentCategory === 'writing') {
    renderListContent(container, filteredItems);
  } else if (state.currentCategory === 'career') {
    renderCareerView(container, filteredItems);
  } else if (state.currentCategory === 'code') {
    renderCodeExplorer(container, filteredItems);
  } else {
    renderGridContent(container, filteredItems);
  }
}

function getItemsForCategory(category) {
  const items = [];

  if (category === 'career') {
    // Top-level events with category: "career"
    state.data.events.forEach(event => {
      if (event.category === 'career') {
        items.push(event);
      }
    });
  } else if (category === 'products') {
    // Children with category: "products"
    state.data.events.forEach(event => {
      if (event.children) {
        event.children.forEach(child => {
          if (child.category === 'products') {
            items.push(child);
          }
        });
      }
    });
  } else if (category === 'code') {
    // Children with category: "code"
    state.data.events.forEach(event => {
      if (event.children) {
        event.children.forEach(child => {
          if (child.category === 'code') {
            items.push(child);
          }
        });
      }
    });
  } else if (category === 'writing') {
    // Children with category: "publications" or type: "writing"
    state.data.events.forEach(event => {
      if (event.children) {
        event.children.forEach(child => {
          if (child.category === 'publications' || child.type === 'writing') {
            items.push(child);
          }
        });
      }
    });
  }

  // Sort by date (newest first)
  items.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB - dateA;
  });

  return items;
}

// ==========================================================================
// Grid View (Career, Products, Code)
// ==========================================================================

function renderGridContent(container, items) {
  container.innerHTML = `
    <div class="grid-container">
      ${items.map(item => renderGridCard(item)).join('')}
    </div>
  `;
}

function renderGridCard(item) {
  const imageUrl = getImageUrl(item);

  return `
    <div class="grid-card">
      ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(item.title)}" class="grid-card-image" />` : '<div class="grid-card-image placeholder"></div>'}
      <div class="grid-card-content">
        <h3 class="grid-card-title">
          ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}
        </h3>
        ${item.subtitle ? `<p class="grid-card-subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
        ${item.date ? `<div class="grid-card-date">${escapeHtml(item.date)}</div>` : ''}
        ${item.description ? `<p class="grid-card-description">${escapeHtml(item.description)}</p>` : ''}
        ${item.tech && item.tech.length > 0 ? `<div class="grid-card-tech">${renderTechTags(item.tech)}</div>` : ''}
      </div>
    </div>
  `;
}

// ==========================================================================
// List View (Writing)
// ==========================================================================

function renderListContent(container, items) {
  container.innerHTML = `
    <div class="list-container">
      ${items.map(item => renderListItem(item)).join('')}
    </div>
  `;
}

function renderListItem(item) {
  return `
    <div class="list-item">
      <div class="list-item-header">
        <h3 class="list-item-title">
          ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}
        </h3>
        ${item.date ? `<span class="list-item-date">${escapeHtml(item.date)}</span>` : ''}
      </div>
      ${item.subtitle ? `<p class="list-item-subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
      ${item.description ? `<p class="list-item-description">${escapeHtml(item.description)}</p>` : ''}
      ${item.tech && item.tech.length > 0 ? `<div class="list-item-tech">${renderTechTags(item.tech)}</div>` : ''}
    </div>
  `;
}

// ==========================================================================
// Career Timeline View
// ==========================================================================

// Store children data for lazy loading
const careerChildrenData = new Map();

function renderCareerView(container, items) {
  // Sort by date (newest first)
  const sorted = [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // Clear previous data
  careerChildrenData.clear();

  // Store children data for each item
  sorted.forEach(item => {
    if (item.children?.length > 0) {
      const entryId = `career-entry-${item.title.replace(/\W+/g, '-').toLowerCase()}`;
      careerChildrenData.set(entryId, item.children);
    }
  });

  container.innerHTML = `
    <div class="career-timeline">
      ${sorted.map(item => renderCareerEntry(item)).join('')}
    </div>
  `;

  // Add click/keyboard handlers for expansion
  setupCareerEntryInteractions(container);
}

function renderCareerEntry(item) {
  const imageUrl = getImageUrl(item);
  const hasChildren = item.children?.length > 0;

  // Collect all tech tags from item and its children
  const allTech = new Set(item.tech || []);
  if (item.children) {
    item.children.forEach(child => {
      if (child.tech) {
        child.tech.forEach(t => allTech.add(t));
      }
    });
  }
  const techArray = Array.from(allTech).sort();
  const techTags = techArray.length ? renderTechTags(techArray) : '';

  const childCount = item.children?.length || 0;
  const expandHint = childCount === 1 ? '1 entry' : `${childCount} entries`;
  const entryId = `career-entry-${item.title.replace(/\W+/g, '-').toLowerCase()}`;

  return `
    <div class="career-entry" id="${entryId}" ${hasChildren ? 'data-expandable="true"' : ''} ${hasChildren ? `data-children-total="${childCount}" data-children-shown="5"` : ''}>
      <div class="career-entry-header" ${hasChildren ? 'tabindex="0" role="button" aria-expanded="false"' : ''}>
        <span class="career-entry-toggle">▶</span>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(item.title)}" class="career-entry-logo" />` : ''}
        <div class="career-entry-info">
          <h3 class="career-entry-title">${escapeHtml(item.title)}</h3>
          ${item.subtitle ? `<span class="career-entry-subtitle">${escapeHtml(item.subtitle)}</span>` : ''}
        </div>
        ${item.date ? `<span class="career-entry-date">${escapeHtml(item.date)}</span>` : ''}
        ${hasChildren ? `<span class="career-entry-expand-hint">+ ${expandHint}</span>` : ''}
      </div>
      <div class="career-entry-body">
        ${item.description ? `<p class="career-entry-description">${escapeHtml(item.description)}</p>` : ''}
        ${techTags ? `<div class="career-entry-tech">${techTags}</div>` : ''}
      </div>
      ${hasChildren ? `
        <div class="career-entry-children">
          <div class="career-entry-children-header">Projects & Writing (${item.children.length})</div>
          <div class="career-children-list">
            ${item.children.slice(0, 5).map(c => renderCareerChild(c)).join('')}
          </div>
          ${item.children.length > 5 ? `<button type="button" class="career-load-more" tabindex="0">+ ${item.children.length - 5} more</button>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderCareerChild(child) {
  const techTags = child.tech?.length ? renderTechTags(child.tech.slice(0, 3)) : '';
  const isWriting = child.type === 'writing' || child.category === 'publications';
  const typeClass = isWriting ? 'career-child--writing' : 'career-child--project';
  const typeLabel = isWriting ? 'Writing' : 'Project';

  return `
    <div class="career-child ${typeClass}">
      <div class="career-child-header">
        <span class="career-child-type">${typeLabel}</span>
        ${child.date ? `<span class="career-child-date">${escapeHtml(child.date)}</span>` : ''}
      </div>
      <h5 class="career-child-title">
        ${child.url ? `<a href="${escapeHtml(child.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(child.title)}</a>` : escapeHtml(child.title)}
      </h5>
      ${child.description ? `<p class="career-child-description">${escapeHtml(child.description)}</p>` : ''}
      ${techTags ? `<div class="career-child-tech">${techTags}</div>` : ''}
    </div>
  `;
}

function setupCareerEntryInteractions(container) {
  const entries = container.querySelectorAll('.career-entry[data-expandable="true"]');

  entries.forEach(entry => {
    const header = entry.querySelector('.career-entry-header');

    // Toggle function
    const toggleEntry = (e) => {
      // Don't toggle if clicking a link or load more button
      if (e.target.tagName === 'A') return;
      if (e.target.classList.contains('career-load-more')) return;

      const isExpanded = entry.classList.contains('expanded');
      entry.classList.toggle('expanded');

      // Update ARIA state
      header.setAttribute('aria-expanded', !isExpanded);
    };

    // Click handler
    header.addEventListener('click', toggleEntry);

    // Keyboard handler (Enter/Space)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEntry(e);
      }
    });

    // Load more button handler
    const loadMoreBtn = entry.querySelector('.career-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadMoreChildren(entry);
      });

      loadMoreBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          loadMoreChildren(entry);
        }
      });
    }
  });
}

function loadMoreChildren(entry) {
  const entryId = entry.id;
  const children = careerChildrenData.get(entryId);
  if (!children) return;

  const currentShown = parseInt(entry.dataset.childrenShown, 10) || 5;
  const total = children.length;
  const newShown = Math.min(currentShown + 5, total);

  // Get the children to add
  const newChildren = children.slice(currentShown, newShown);

  // Render and append new children
  const childrenList = entry.querySelector('.career-children-list');
  if (childrenList) {
    newChildren.forEach(child => {
      childrenList.insertAdjacentHTML('beforeend', renderCareerChild(child));
    });
  }

  // Update shown count
  entry.dataset.childrenShown = newShown;

  // Update or remove the load more button
  const loadMoreBtn = entry.querySelector('.career-load-more');
  if (loadMoreBtn) {
    const remaining = total - newShown;
    if (remaining > 0) {
      loadMoreBtn.textContent = `+ ${remaining} more`;
    } else {
      loadMoreBtn.remove();
    }
  }
}

// ==========================================================================
// Code Explorer (File Tree View)
// ==========================================================================

// Folder display configuration
const folderConfig = {
  graphics: { icon: '🎨', label: 'graphics' },
  games: { icon: '🎮', label: 'games' },
  physics: { icon: '⚛️', label: 'physics' },
  software: { icon: '🔧', label: 'software' },
  exploration: { icon: '🔬', label: 'exploration' },
  iot: { icon: '📡', label: 'iot' },
  ar: { icon: '👓', label: 'ar' },
  misc: { icon: '📦', label: 'misc' }
};

// Folder sort order (most important first)
const folderOrder = ['software', 'games', 'graphics', 'physics', 'ar', 'exploration', 'iot', 'misc'];

function renderCodeExplorer(container, items) {
  // Collect all unique tech tags
  const allTags = new Set();
  items.forEach(item => {
    if (item.tech) {
      item.tech.forEach(t => allTags.add(t));
    }
  });
  const sortedTags = Array.from(allTags).sort();

  // Filter items by selected tags
  let filteredItems = items;
  if (codeExplorerState.selectedTags.size > 0) {
    filteredItems = items.filter(item => {
      if (!item.tech) return false;
      return Array.from(codeExplorerState.selectedTags).every(tag =>
        item.tech.includes(tag)
      );
    });
  }

  // Group items by type
  const grouped = {};
  filteredItems.forEach(item => {
    const type = item.type || 'misc';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(item);
  });

  // Sort items within each folder by date (newest first)
  Object.values(grouped).forEach(folderItems => {
    folderItems.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  });

  // Get sorted folder keys
  const folderKeys = Object.keys(grouped).sort((a, b) => {
    const aIndex = folderOrder.indexOf(a);
    const bIndex = folderOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const totalFolders = folderKeys.length;

  container.innerHTML = `
    <div class="code-explorer">
      <div class="code-explorer-header">~/projects</div>
      <div class="code-filter-bar">
        ${sortedTags.map(tag => `
          <button class="code-filter-tag ${codeExplorerState.selectedTags.has(tag) ? 'active' : ''}" data-tag="${escapeHtml(tag)}">
            ${escapeHtml(tag)}
          </button>
        `).join('')}
      </div>
      ${filteredItems.length === 0 ? `
        <div class="code-explorer-empty">No projects match the selected filters.</div>
      ` : `
        <div class="code-explorer-tree">
          ${folderKeys.map((type, index) =>
            renderCodeFolder(type, grouped[type], index === totalFolders - 1)
          ).join('')}
        </div>
      `}
    </div>
  `;

  setupCodeExplorerInteractions(container);
  setupCodeFilterInteractions(container, items);
}

function setupCodeFilterInteractions(container, allItems) {
  const filterTags = container.querySelectorAll('.code-filter-tag');
  filterTags.forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const tag = tagBtn.dataset.tag;
      if (codeExplorerState.selectedTags.has(tag)) {
        // Clicking active tag clears it
        codeExplorerState.selectedTags.clear();
        // Close all folders when no filter
        codeExplorerState.expandedFolders.clear();
      } else {
        // Clicking new tag clears others and selects this one
        codeExplorerState.selectedTags.clear();
        codeExplorerState.selectedTags.add(tag);
        // Expand all folders when filtering
        folderOrder.forEach(f => codeExplorerState.expandedFolders.add(f));
      }
      // Re-render the explorer
      renderCodeExplorer(container, allItems);
    });
  });
}

function renderCodeFolder(type, items, isLast) {
  const config = folderConfig[type] || { icon: '📁', label: type };
  const isExpanded = codeExplorerState.expandedFolders.has(type);
  const connector = isLast ? '└─' : '├─';
  const folderId = `code-folder-${type}`;
  const folderIcon = isExpanded ? '📂' : '📁';

  return `
    <div class="code-folder ${isExpanded ? 'expanded' : ''}" id="${folderId}" data-folder-type="${type}">
      <div class="code-folder-row" tabindex="0" role="button" aria-expanded="${isExpanded}">
        <span class="tree-connector">${connector}</span>
        <span class="code-folder-icon">${folderIcon}</span>
        <span class="code-folder-name">${config.label}/</span>
        <span class="code-folder-count">(${items.length} items)</span>
      </div>
      <div class="code-folder-children" ${isExpanded ? '' : 'style="display:none"'}>
        ${items.map((item, index) =>
          renderCodeFile(item, index === items.length - 1, isLast, type)
        ).join('')}
      </div>
    </div>
  `;
}

function renderCodeFile(item, isLastInFolder, isLastFolder, folderType) {
  const fileConnector = isLastInFolder ? '└─' : '├─';
  const parentLine = isLastFolder ? '     ' : '│    ';
  const fileId = `code-file-${(item.title || '').replace(/\W+/g, '-').toLowerCase()}`;
  const isExpanded = codeExplorerState.expandedFiles.has(fileId);

  // Get file icon based on tech
  const fileIcon = getFileIcon(item.tech);

  // Format tech tags inline
  const techStr = item.tech && item.tech.length > 0
    ? item.tech.slice(0, 3).join(', ')
    : '';

  // Format date
  const dateStr = item.date || '';

  return `
    <div class="code-file ${isExpanded ? 'expanded' : ''}" id="${fileId}" data-folder="${folderType}">
      <div class="code-file-row" tabindex="0" role="button" aria-expanded="${isExpanded}">
        <span class="tree-line">${parentLine}</span>
        <span class="tree-connector">${fileConnector}</span>
        <span class="code-file-icon">${fileIcon}</span>
        <span class="code-file-name">${escapeHtml(item.title)}</span>
        ${isExpanded ? '<span class="code-file-toggle">▼</span>' : ''}
        <span class="code-file-tech">${escapeHtml(techStr)}</span>
        <span class="code-file-date">${escapeHtml(dateStr)}</span>
      </div>
      <div class="code-file-details" ${isExpanded ? '' : 'style="display:none"'}>
        <div class="code-file-details-content">
          <span class="tree-line">${parentLine}</span>
          <span class="tree-line">${isLastInFolder ? '     ' : '│    '}</span>
          <div class="code-file-details-inner">
            ${item.description ? `<p class="code-file-description">${escapeHtml(item.description)}</p>` : ''}
            ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="code-file-link">→ View on GitHub</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getFileIcon(tech) {
  if (!tech || tech.length === 0) return '📄';

  const primary = tech[0].toLowerCase();

  // Map tech to icons
  if (primary.includes('unity') || primary.includes('c#') || primary.includes('cs')) return '🎮';
  if (primary.includes('webgl') || primary.includes('glsl') || primary.includes('shader')) return '🎨';
  if (primary.includes('typescript') || primary.includes('ts')) return '📘';
  if (primary.includes('javascript') || primary.includes('js')) return '📒';
  if (primary.includes('python')) return '🐍';
  if (primary.includes('rust')) return '🦀';
  if (primary.includes('go') || primary.includes('golang')) return '🐹';
  if (primary.includes('java')) return '☕';
  if (primary.includes('swift')) return '🍎';
  if (primary.includes('react')) return '⚛️';
  if (primary.includes('node')) return '💚';
  if (primary.includes('arduino') || primary.includes('iot')) return '📡';
  if (primary.includes('ar') || primary.includes('vr')) return '👓';

  return '📄';
}

function setupCodeExplorerInteractions(container) {
  // Folder toggle handlers
  const folders = container.querySelectorAll('.code-folder-row');
  folders.forEach(folderRow => {
    const toggleFolder = () => {
      const folder = folderRow.closest('.code-folder');
      const type = folder.dataset.folderType;
      const children = folder.querySelector('.code-folder-children');
      const icon = folder.querySelector('.code-folder-icon');
      const isExpanded = folder.classList.contains('expanded');

      if (isExpanded) {
        codeExplorerState.expandedFolders.delete(type);
        folder.classList.remove('expanded');
        children.style.display = 'none';
        folderRow.setAttribute('aria-expanded', 'false');
        icon.textContent = '📁';
      } else {
        codeExplorerState.expandedFolders.add(type);
        folder.classList.add('expanded');
        children.style.display = 'block';
        folderRow.setAttribute('aria-expanded', 'true');
        icon.textContent = '📂';
      }
    };

    folderRow.addEventListener('click', toggleFolder);
    folderRow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFolder();
      }
    });
  });

  // File toggle handlers
  const files = container.querySelectorAll('.code-file-row');
  files.forEach(fileRow => {
    const toggleFile = () => {
      const file = fileRow.closest('.code-file');
      const fileId = file.id;
      const details = file.querySelector('.code-file-details');
      const isExpanded = file.classList.contains('expanded');

      if (isExpanded) {
        codeExplorerState.expandedFiles.delete(fileId);
        file.classList.remove('expanded');
        details.style.display = 'none';
        fileRow.setAttribute('aria-expanded', 'false');
        // Remove toggle indicator
        const toggle = fileRow.querySelector('.code-file-toggle');
        if (toggle) toggle.remove();
      } else {
        codeExplorerState.expandedFiles.add(fileId);
        file.classList.add('expanded');
        details.style.display = 'block';
        fileRow.setAttribute('aria-expanded', 'true');
        // Add toggle indicator if not present
        if (!fileRow.querySelector('.code-file-toggle')) {
          const nameEl = fileRow.querySelector('.code-file-name');
          const toggle = document.createElement('span');
          toggle.className = 'code-file-toggle';
          toggle.textContent = '▼';
          nameEl.after(toggle);
        }
      }
    };

    fileRow.addEventListener('click', (e) => {
      // Don't toggle if clicking a link
      if (e.target.tagName === 'A') return;
      toggleFile();
    });
    fileRow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFile();
      }
    });
  });
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getImageUrl(item) {
  if (item.imageUrl) {
    if (item.imageUrl.startsWith('http')) {
      return item.imageUrl;
    }
    return item.imageUrl;
  }
  return null;
}

function renderTechTags(tech) {
  if (!tech || tech.length === 0) return '';
  return tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
}

function parseDate(dateStr) {
  if (!dateStr) return 0;

  const str = dateStr.toLowerCase();

  // "Present" means ongoing - sort to top
  if (str.includes('present') || str.includes('current') || str.includes('now')) {
    return Date.now();
  }

  // For date ranges, use the end date (last year found)
  const yearMatches = str.match(/\d{4}/g);
  const year = yearMatches ? parseInt(yearMatches[yearMatches.length - 1]) : 2000;

  // Extract month if present (use last month found for ranges)
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  let month = 0;
  months.forEach((m, i) => {
    const lastIndex = str.lastIndexOf(m);
    if (lastIndex !== -1) {
      // Check if this month appears after a dash (end of range)
      const dashIndex = str.lastIndexOf('-');
      if (dashIndex === -1 || lastIndex > dashIndex) {
        month = i;
      }
    }
  });

  return new Date(year, month, 1).getTime();
}

// ==========================================================================
// Initialize
// ==========================================================================

document.addEventListener('DOMContentLoaded', loadData);
