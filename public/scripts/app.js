// ==========================================================================
// Portfolio App - Vanilla JS (Category-Based Navigation)
// ==========================================================================

// State
const state = {
  data: null,
  currentCategory: 'career',
  techFilter: 'all'
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

function renderCareerView(container, items) {
  // Sort by date (newest first)
  const sorted = [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

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
  const expandHint = childCount === 1 ? '1 project' : `${childCount} projects`;

  return `
    <div class="career-entry" ${hasChildren ? 'data-expandable="true"' : ''}>
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
          <div class="career-entry-children-header">Projects & Products (${item.children.length})</div>
          ${item.children.slice(0, 5).map(c => renderCareerChild(c)).join('')}
          ${item.children.length > 5 ? `<p class="career-more">+${item.children.length - 5} more</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderCareerChild(child) {
  const techTags = child.tech?.length ? renderTechTags(child.tech.slice(0, 3)) : '';

  return `
    <div class="career-child">
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
      // Don't toggle if clicking a link
      if (e.target.tagName === 'A') return;

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
