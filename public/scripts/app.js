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

  // Writing uses list view, others use grid
  if (state.currentCategory === 'writing') {
    renderListContent(container, filteredItems);
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

  // Extract year
  const yearMatch = str.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : 2000;

  // Extract month if present
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  let month = 0;
  months.forEach((m, i) => {
    if (str.includes(m)) month = i;
  });

  return new Date(year, month, 1).getTime();
}

// ==========================================================================
// Initialize
// ==========================================================================

document.addEventListener('DOMContentLoaded', loadData);
