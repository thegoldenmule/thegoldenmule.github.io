// ==========================================================================
// Portfolio App - Vanilla JS (Category-Based Navigation)
// ==========================================================================

// State
const state = {
  data: null,
  currentCategory: "career",
  archiveManifest: null,
  currentArticle: null,
};

// Code Explorer State
const codeExplorerState = {
  expandedFolders: new Set(),
  expandedFiles: new Set(),
  selectedTags: new Set(),
};

// Products Filter State
const productsFilterState = {
  selectedTags: new Set(),
};

// Unified Writing State (combines writing + archive)
const writingState = {
  selectedTags: new Set(),
  allItems: [],           // All items (both sources, cached)
  displayedCount: 25,     // How many to show
  PAGE_SIZE: 25
};

// Archive State
const archiveState = {
  expandedYears: new Set(),
  articlesCache: new Map(),
  selectedTags: new Set(),
};

// ==========================================================================
// Data Loading
// ==========================================================================

async function loadData() {
  try {
    const response = await fetch("timeline.json");
    state.data = await response.json();
    initializeApp();
  } catch (error) {
    console.error("Failed to load timeline data:", error);
  }
}

async function loadArchiveManifest() {
  if (state.archiveManifest) return state.archiveManifest;
  try {
    const response = await fetch("archive/manifest.json");
    state.archiveManifest = await response.json();
    return state.archiveManifest;
  } catch (error) {
    console.error("Failed to load archive manifest:", error);
    return null;
  }
}

async function loadAllWritingItems() {
  // Load archive manifest
  const manifest = await loadArchiveManifest();

  // Get writing items from timeline
  const writingItems = getItemsForCategory("writing");

  // Normalize and merge
  const allItems = [
    // Writing items (normalize to common format)
    ...writingItems.map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      date: parseDate(item.date),
      tags: item.tech || [],
      url: item.url,
      isArchive: false
    })),
    // Archive items (normalize to common format)
    ...(manifest?.posts || []).map(post => ({
      title: post.title,
      subtitle: post.subtitle,
      description: post.description,
      date: new Date(post.date).getTime(),
      tags: post.tags || [],
      filename: post.filename,
      isArchive: true
    }))
  ];

  // Sort by date descending (newest first)
  return allItems.sort((a, b) => b.date - a.date);
}

// ==========================================================================
// Initialization
// ==========================================================================

function initializeApp() {
  setupCategoryNav();
  setupHashChangeListener();

  // Check URL hash for initial routing
  handleRouteChange();
}

function setupHashChangeListener() {
  window.addEventListener("hashchange", handleRouteChange);
}

function handleRouteChange() {
  const hash = window.location.hash.slice(1);

  // Handle archive article routes: #archive/filename.md
  if (hash.startsWith("archive/")) {
    const filename = hash.slice(8); // Remove 'archive/'
    if (filename) {
      state.currentArticle = filename;
      state.currentCategory = "archive";
      // Update nav to show writing as active (archive is part of writing now)
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === "writing");
      });
      renderContent();
      return;
    }
  }

  // Redirect #archive to #writing (archive is now part of writing)
  if (hash === "archive") {
    window.history.replaceState(null, null, "#writing");
    switchCategory("writing");
    return;
  }

  // Reset article state if not viewing an article
  state.currentArticle = null;

  // Handle category routes (archive removed from valid categories)
  if (["career", "products", "code", "writing"].includes(hash)) {
    switchCategory(hash);
  } else if (!hash) {
    renderContent();
  }
}

// ==========================================================================
// Category Navigation
// ==========================================================================

function setupCategoryNav() {
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      switchCategory(category);
    });
  });
}

function switchCategory(category) {
  state.currentCategory = category;

  // Update buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  // Update URL hash
  window.history.replaceState(null, null, `#${category}`);

  // Render content
  renderContent();
}

// ==========================================================================
// Content Rendering
// ==========================================================================

function renderContent() {
  const container = document.getElementById("content-container");

  // Handle archive article routes (keep working for direct links)
  if (state.currentCategory === "archive" && state.currentArticle) {
    renderArchiveArticle(container, state.currentArticle);
    return;
  }

  // Handle unified writing view (includes archive items)
  if (state.currentCategory === "writing") {
    renderListContent(container);
    return;
  }

  const items = getItemsForCategory(state.currentCategory);

  if (items.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No items in this category.</p></div>';
    return;
  }

  // Each category uses appropriate view
  if (state.currentCategory === "career") {
    renderCareerView(container, items);
  } else if (state.currentCategory === "code") {
    renderCodeExplorer(container, items);
  } else {
    renderGridContent(container, items);
  }
}

function getItemsForCategory(category) {
  const items = [];

  if (category === "career") {
    // Top-level events with category: "career"
    state.data.events.forEach((event) => {
      if (event.category === "career") {
        items.push(event);
      }
    });
  } else if (category === "products") {
    // Children with category: "products"
    state.data.events.forEach((event) => {
      if (event.children) {
        event.children.forEach((child) => {
          if (child.category === "products") {
            items.push(child);
          }
        });
      }
    });
  } else if (category === "code") {
    // Children with category: "code"
    state.data.events.forEach((event) => {
      if (event.children) {
        event.children.forEach((child) => {
          if (child.category === "code") {
            items.push(child);
          }
        });
      }
    });
  } else if (category === "writing") {
    // Children with category: "publications" or type: "writing"
    state.data.events.forEach((event) => {
      if (event.children) {
        event.children.forEach((child) => {
          if (child.category === "publications" || child.type === "writing") {
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
// Section Filter Helpers
// ==========================================================================

function renderFilterBar(items, selectedTags) {
  const allTags = new Set();
  items.forEach((item) => {
    if (item.tech) item.tech.forEach((t) => allTags.add(t));
  });
  const sortedTags = Array.from(allTags).sort();

  if (sortedTags.length === 0) return "";

  return `<div class="code-filter-bar">
    ${sortedTags
      .map(
        (tag) => `
      <button class="code-filter-tag ${selectedTags.has(tag) ? "active" : ""}"
              data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)}
      </button>
    `
      )
      .join("")}
  </div>`;
}

function setupSectionFilterInteractions(container, filterState, allItems, renderFn) {
  const filterTags = container.querySelectorAll(".code-filter-tag");
  filterTags.forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
      const tag = tagBtn.dataset.tag;
      if (filterState.selectedTags.has(tag)) {
        filterState.selectedTags.clear();
      } else {
        filterState.selectedTags.clear();
        filterState.selectedTags.add(tag);
      }
      renderFn(container, allItems);
    });
  });
}

function filterItemsByTags(items, selectedTags) {
  if (selectedTags.size === 0) return items;
  return items.filter((item) => {
    if (!item.tech) return false;
    return Array.from(selectedTags).every((tag) => item.tech.includes(tag));
  });
}

// ==========================================================================
// Grid View (Career, Products, Code)
// ==========================================================================

function renderGridContent(container, items) {
  // Filter items based on selected tags
  const filteredItems = filterItemsByTags(items, productsFilterState.selectedTags);

  const filterBarHtml = renderFilterBar(items, productsFilterState.selectedTags);

  container.innerHTML = `
    <div class="products-container">
      ${filterBarHtml}
      ${
        filteredItems.length === 0
          ? '<div class="empty-state"><p>No products match the selected filter.</p></div>'
          : `<div class="grid-container">
              ${filteredItems.map((item) => renderGridCard(item)).join("")}
            </div>`
      }
    </div>
  `;

  // Setup filter interactions
  setupSectionFilterInteractions(container, productsFilterState, items, renderGridContent);
}

function renderGridCard(item) {
  const imageUrl = getImageUrl(item);

  return `
    <div class="grid-card">
      ${
        imageUrl
          ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(
              item.title
            )}" class="grid-card-image" />`
          : '<div class="grid-card-image placeholder"></div>'
      }
      <div class="grid-card-content">
        <h3 class="grid-card-title">
          ${
            item.url
              ? `<a href="${escapeHtml(
                  item.url
                )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                  item.title
                )}</a>`
              : escapeHtml(item.title)
          }
        </h3>
        ${
          item.subtitle
            ? `<p class="grid-card-subtitle">${escapeHtml(item.subtitle)}</p>`
            : ""
        }
        ${
          item.date
            ? `<div class="grid-card-date">${escapeHtml(item.date)}</div>`
            : ""
        }
        ${
          item.description
            ? `<p class="grid-card-description">${escapeHtml(
                item.description
              )}</p>`
            : ""
        }
        ${
          item.tech && item.tech.length > 0
            ? `<div class="grid-card-tech">${renderTechTags(item.tech)}</div>`
            : ""
        }
      </div>
    </div>
  `;
}

// ==========================================================================
// List View (Writing) - Unified with Archive
// ==========================================================================

async function renderListContent(container) {
  // Show loading state
  container.innerHTML = '<div class="archive-loading">Loading writing...</div>';

  // Load all items (if not cached)
  if (writingState.allItems.length === 0) {
    writingState.allItems = await loadAllWritingItems();
  }

  // Filter by selected tags (across ALL items)
  const filteredItems = filterUnifiedItemsByTags(writingState.allItems, writingState.selectedTags);

  // Get items to display (paginated)
  const itemsToShow = filteredItems.slice(0, writingState.displayedCount);
  const hasMore = filteredItems.length > writingState.displayedCount;

  // Collect all unique tags from ALL items (not just visible)
  const allTags = new Set();
  writingState.allItems.forEach(item => {
    (item.tags || []).forEach(tag => allTags.add(tag));
  });

  // Render filter bar
  const filterBarHtml = renderUnifiedFilterBar(
    Array.from(allTags).sort(),
    writingState.selectedTags
  );

  // Render items
  const itemsHtml = itemsToShow.map(item => renderUnifiedItem(item)).join('');

  // Render load more button
  const loadMoreHtml = hasMore ? `
    <button class="load-more-btn">
      Load More (${filteredItems.length - writingState.displayedCount} remaining)
    </button>
  ` : '';

  container.innerHTML = `
    <div class="writing-container">
      <div class="writing-header">
        <p class="writing-subtitle">${filteredItems.length} posts since 2011</p>
        ${filterBarHtml}
      </div>
      ${
        filteredItems.length === 0
          ? '<div class="empty-state"><p>No writing matches the selected filter.</p></div>'
          : `<div class="list-container">
              ${itemsHtml}
            </div>
            ${loadMoreHtml}`
      }
    </div>
  `;

  setupUnifiedFilterInteractions(container);
  setupLoadMoreButton(container);
}

function filterUnifiedItemsByTags(items, selectedTags) {
  if (selectedTags.size === 0) return items;
  return items.filter(item => {
    if (!item.tags || item.tags.length === 0) return false;
    return Array.from(selectedTags).every(tag => item.tags.includes(tag));
  });
}

function renderUnifiedFilterBar(tags, selectedTags) {
  if (tags.length === 0) return "";

  return `<div class="code-filter-bar">
    ${tags
      .map(
        tag => `
      <button class="code-filter-tag ${selectedTags.has(tag) ? "active" : ""}"
              data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)}
      </button>
    `
      )
      .join("")}
  </div>`;
}

function renderUnifiedItem(item) {
  const dateStr = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  // Archive badge
  const archiveBadge = item.isArchive
    ? '<span class="archive-badge">archive</span>'
    : '';

  // Link handling - archive goes to internal route, writing goes external
  const linkHref = item.isArchive
    ? `#archive/${item.filename}`
    : item.url;
  const linkTarget = item.isArchive ? '' : 'target="_blank" rel="noopener"';

  const tagsHtml = (item.tags || [])
    .map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`)
    .join('');

  return `
    <article class="list-item">
      <div class="list-item-header">
        <h3 class="list-item-title">
          ${linkHref
            ? `<a href="${escapeHtml(linkHref)}" ${linkTarget}>${escapeHtml(item.title)}</a>`
            : escapeHtml(item.title)
          }
          ${archiveBadge}
        </h3>
        <span class="list-item-date">${dateStr}</span>
      </div>
      ${item.subtitle ? `<p class="list-item-subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
      ${item.description ? `<p class="list-item-description">${escapeHtml(item.description)}</p>` : ''}
      ${tagsHtml ? `<div class="list-item-tech">${tagsHtml}</div>` : ''}
    </article>
  `;
}

function setupUnifiedFilterInteractions(container) {
  const filterTags = container.querySelectorAll('.code-filter-tag');
  filterTags.forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const tag = tagBtn.dataset.tag;
      if (writingState.selectedTags.has(tag)) {
        // Clicking active tag clears it
        writingState.selectedTags.clear();
      } else {
        // Clicking new tag clears others and selects this one
        writingState.selectedTags.clear();
        writingState.selectedTags.add(tag);
      }
      // Reset to first page when filter changes
      writingState.displayedCount = writingState.PAGE_SIZE;
      renderListContent(container);
    });
  });
}

function setupLoadMoreButton(container) {
  const btn = container.querySelector('.load-more-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      writingState.displayedCount += writingState.PAGE_SIZE;
      renderListContent(container);
    });
  }
}

// ==========================================================================
// Career Timeline View
// ==========================================================================

// Store children data for lazy loading
const careerChildrenData = new Map();

function renderCareerView(container, items) {
  // Sort by date (newest first)
  const sorted = [...items].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  // Clear previous data
  careerChildrenData.clear();

  // Store children data for each item
  sorted.forEach((item) => {
    if (item.children?.length > 0) {
      const entryId = `career-entry-${item.title
        .replace(/\W+/g, "-")
        .toLowerCase()}`;
      careerChildrenData.set(entryId, item.children);
    }
  });

  container.innerHTML = `
    <div class="career-container">
      <div class="career-header">
        <h2 class="career-title">thegoldenmule at your service</h2>
        <p class="career-subtitle">(but you can just call me <strong>Ben</strong>)</p>
        <ul class="career-intro">
          <li>I am a hands-on, full-stack technical leader with extensive experience in interactive applications and games, augmented reality, Web3, and SaaS.</li>
          <li>I have built and led many teams over the years, providing coaching and mentoring to grow aptitude, capacity, and velocity.</li>
          <li>I 💙 open source as a business strategy.</li>
        </ul>
      </div>
      <div class="career-timeline">
        ${sorted.map((item) => renderCareerEntry(item)).join("")}
      </div>
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
    item.children.forEach((child) => {
      if (child.tech) {
        child.tech.forEach((t) => allTech.add(t));
      }
    });
  }
  const techArray = Array.from(allTech).sort();
  const techTags = techArray.length ? renderTechTags(techArray) : "";

  const childCount = item.children?.length || 0;
  const expandHint = childCount === 1 ? "1 entry" : `${childCount} entries`;
  const entryId = `career-entry-${item.title
    .replace(/\W+/g, "-")
    .toLowerCase()}`;

  return `
    <div class="career-entry" id="${entryId}" ${
    hasChildren ? 'data-expandable="true"' : ""
  } ${
    hasChildren
      ? `data-children-total="${childCount}" data-children-shown="5"`
      : ""
  }>
      <div class="career-entry-header" ${
        hasChildren ? 'tabindex="0" role="button" aria-expanded="false"' : ""
      }>
        <span class="career-entry-toggle">▶</span>
        ${
          imageUrl
            ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(
                item.title
              )}" class="career-entry-logo" />`
            : ""
        }
        <div class="career-entry-info">
          <h3 class="career-entry-title">${escapeHtml(item.title)}</h3>
          ${
            item.subtitle
              ? `<span class="career-entry-subtitle">${escapeHtml(
                  item.subtitle
                )}</span>`
              : ""
          }
        </div>
        ${
          item.date
            ? `<span class="career-entry-date">${escapeHtml(item.date)}</span>`
            : ""
        }
        ${
          hasChildren
            ? `<span class="career-entry-expand-hint">+ ${expandHint}</span>`
            : ""
        }
      </div>
      <div class="career-entry-body">
        ${
          item.description
            ? `<p class="career-entry-description">${escapeHtml(
                item.description
              )}</p>`
            : ""
        }
        ${techTags ? `<div class="career-entry-tech">${techTags}</div>` : ""}
      </div>
      ${
        hasChildren
          ? `
        <div class="career-entry-children">
          <div class="career-entry-children-header">Projects & Writing (${
            item.children.length
          })</div>
          <div class="career-children-list">
            ${item.children
              .slice(0, 5)
              .map((c) => renderCareerChild(c))
              .join("")}
          </div>
          ${
            item.children.length > 5
              ? `<button type="button" class="career-load-more" tabindex="0">+ ${
                  item.children.length - 5
                } more</button>`
              : ""
          }
        </div>
      `
          : ""
      }
    </div>
  `;
}

function renderCareerChild(child) {
  const techTags = child.tech?.length
    ? renderTechTags(child.tech.slice(0, 3))
    : "";
  const isWriting =
    child.type === "writing" || child.category === "publications";
  const isMedia =
    child.type === "media" || child.category === "media";

  let typeClass, typeLabel;
  if (isWriting) {
    typeClass = "career-child--writing";
    typeLabel = "Writing";
  } else if (isMedia) {
    typeClass = "career-child--media";
    typeLabel = "Media";
  } else {
    typeClass = "career-child--project";
    typeLabel = "Project";
  }

  const imageUrl = getImageUrl(child);

  return `
    <div class="career-child ${typeClass}">
      ${imageUrl
        ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(child.title)}" class="career-child-thumbnail" loading="lazy" />`
        : ''
      }
      <div class="career-child-content">
        <div class="career-child-header">
          <span class="career-child-type">${typeLabel}</span>
          ${
            child.date
              ? `<span class="career-child-date">${escapeHtml(child.date)}</span>`
              : ""
          }
        </div>
        <h5 class="career-child-title">
          ${
            child.url
              ? `<a href="${escapeHtml(
                  child.url
                )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                  child.title
                )}</a>`
              : escapeHtml(child.title)
          }
        </h5>
        ${
          child.description
            ? `<p class="career-child-description">${escapeHtml(
                child.description
              )}</p>`
            : ""
        }
        ${techTags ? `<div class="career-child-tech">${techTags}</div>` : ""}
      </div>
    </div>
  `;
}

function setupCareerEntryInteractions(container) {
  const entries = container.querySelectorAll(
    '.career-entry[data-expandable="true"]'
  );

  entries.forEach((entry) => {
    const header = entry.querySelector(".career-entry-header");

    // Toggle function
    const toggleEntry = (e) => {
      // Don't toggle if clicking a link or load more button
      if (e.target.tagName === "A") return;
      if (e.target.classList.contains("career-load-more")) return;

      const isExpanded = entry.classList.contains("expanded");
      entry.classList.toggle("expanded");

      // Update ARIA state
      header.setAttribute("aria-expanded", !isExpanded);
    };

    // Click handler
    header.addEventListener("click", toggleEntry);

    // Keyboard handler (Enter/Space)
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleEntry(e);
      }
    });

    // Load more button handler
    const loadMoreBtn = entry.querySelector(".career-load-more");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        loadMoreChildren(entry);
      });

      loadMoreBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
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
  const childrenList = entry.querySelector(".career-children-list");
  if (childrenList) {
    newChildren.forEach((child) => {
      childrenList.insertAdjacentHTML("beforeend", renderCareerChild(child));
    });
  }

  // Update shown count
  entry.dataset.childrenShown = newShown;

  // Update or remove the load more button
  const loadMoreBtn = entry.querySelector(".career-load-more");
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
  graphics: { icon: "🎨", label: "graphics" },
  games: { icon: "🎮", label: "games" },
  physics: { icon: "⚛️", label: "physics" },
  software: { icon: "🔧", label: "software" },
  exploration: { icon: "🔬", label: "exploration" },
  iot: { icon: "📡", label: "iot" },
  ar: { icon: "👓", label: "ar" },
  misc: { icon: "📦", label: "misc" },
};

// Folder sort order (most important first)
const folderOrder = [
  "software",
  "games",
  "graphics",
  "physics",
  "ar",
  "exploration",
  "iot",
  "misc",
];

function renderCodeExplorer(container, items) {
  // Collect all unique tech tags
  const allTags = new Set();
  items.forEach((item) => {
    if (item.tech) {
      item.tech.forEach((t) => allTags.add(t));
    }
  });
  const sortedTags = Array.from(allTags).sort();

  // Filter items by selected tags
  let filteredItems = items;
  if (codeExplorerState.selectedTags.size > 0) {
    filteredItems = items.filter((item) => {
      if (!item.tech) return false;
      return Array.from(codeExplorerState.selectedTags).every((tag) =>
        item.tech.includes(tag)
      );
    });
  }

  // Group items by type
  const grouped = {};
  filteredItems.forEach((item) => {
    const type = item.type || "misc";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(item);
  });

  // Sort items within each folder by date (newest first)
  Object.values(grouped).forEach((folderItems) => {
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
      <div class="code-filter-bar">
        ${sortedTags
          .map(
            (tag) => `
          <button class="code-filter-tag ${
            codeExplorerState.selectedTags.has(tag) ? "active" : ""
          }" data-tag="${escapeHtml(tag)}">
            ${escapeHtml(tag)}
          </button>
        `
          )
          .join("")}
      </div>
      <div class="code-explorer-header">~/projects</div>
      ${
        filteredItems.length === 0
          ? `
        <div class="code-explorer-empty">No projects match the selected filters.</div>
      `
          : `
        <div class="code-explorer-tree">
          ${folderKeys
            .map((type, index) =>
              renderCodeFolder(type, grouped[type], index === totalFolders - 1)
            )
            .join("")}
        </div>
      `
      }
    </div>
  `;

  setupCodeExplorerInteractions(container);
  setupCodeFilterInteractions(container, items);
}

function setupCodeFilterInteractions(container, allItems) {
  const filterTags = container.querySelectorAll(".code-filter-tag");
  filterTags.forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
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
        folderOrder.forEach((f) => codeExplorerState.expandedFolders.add(f));
      }
      // Re-render the explorer
      renderCodeExplorer(container, allItems);
    });
  });
}

function renderCodeFolder(type, items, isLast) {
  const config = folderConfig[type] || { icon: "📁", label: type };
  const isExpanded = codeExplorerState.expandedFolders.has(type);
  const connector = isLast ? "└─" : "├─";
  const folderId = `code-folder-${type}`;
  const folderIcon = isExpanded ? "📂" : "📁";

  return `
    <div class="code-folder ${
      isExpanded ? "expanded" : ""
    }" id="${folderId}" data-folder-type="${type}">
      <div class="code-folder-row" tabindex="0" role="button" aria-expanded="${isExpanded}">
        <span class="tree-connector">${connector}</span>
        <span class="code-folder-icon">${folderIcon}</span>
        <span class="code-folder-name">${config.label}/</span>
        <span class="code-folder-count">(${items.length} items)</span>
      </div>
      <div class="code-folder-children" ${
        isExpanded ? "" : 'style="display:none"'
      }>
        ${items
          .map((item, index) =>
            renderCodeFile(item, index === items.length - 1, isLast, type)
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderCodeFile(item, isLastInFolder, isLastFolder, folderType) {
  const fileConnector = isLastInFolder ? "└─" : "├─";
  const parentLine = isLastFolder ? "     " : "│    ";
  const fileId = `code-file-${(item.title || "")
    .replace(/\W+/g, "-")
    .toLowerCase()}`;
  const isExpanded = codeExplorerState.expandedFiles.has(fileId);

  // Get file icon based on tech
  const fileIcon = getFileIcon(item.tech);

  // Format tech tags inline
  const techStr =
    item.tech && item.tech.length > 0 ? item.tech.slice(0, 3).join(", ") : "";

  // Format date
  const dateStr = item.date || "";

  return `
    <div class="code-file ${
      isExpanded ? "expanded" : ""
    }" id="${fileId}" data-folder="${folderType}">
      <div class="code-file-row" tabindex="0" role="button" aria-expanded="${isExpanded}">
        <span class="tree-line">${parentLine}</span>
        <span class="tree-connector">${fileConnector}</span>
        <span class="code-file-icon">${fileIcon}</span>
        <span class="code-file-name">${escapeHtml(item.title)}</span>
        ${isExpanded ? '<span class="code-file-toggle">▼</span>' : ""}
        <span class="code-file-tech">${escapeHtml(techStr)}</span>
        <span class="code-file-date">${escapeHtml(dateStr)}</span>
      </div>
      <div class="code-file-details" ${
        isExpanded ? "" : 'style="display:none"'
      }>
        <div class="code-file-details-content">
          <span class="tree-line">${parentLine}</span>
          <span class="tree-line">${isLastInFolder ? "     " : "│    "}</span>
          <div class="code-file-details-inner">
            ${
              getImageUrl(item)
                ? `<img src="${escapeHtml(
                    getImageUrl(item)
                  )}" alt="${escapeHtml(
                    item.title
                  )}" class="code-file-thumbnail" />`
                : ""
            }
            <div class="code-file-details-text">
              ${
                item.description
                  ? `<p class="code-file-description">${escapeHtml(
                      item.description
                    )}</p>`
                  : ""
              }
              ${
                item.url
                  ? `<a href="${escapeHtml(
                      item.url
                    )}" target="_blank" rel="noopener noreferrer" class="code-file-link">→ View on GitHub</a>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getFileIcon(tech) {
  if (!tech || tech.length === 0) return "📄";

  const primary = tech[0].toLowerCase();

  // Map tech to icons
  if (
    primary.includes("unity") ||
    primary.includes("c#") ||
    primary.includes("cs")
  )
    return "🎮";
  if (
    primary.includes("webgl") ||
    primary.includes("glsl") ||
    primary.includes("shader")
  )
    return "🎨";
  if (primary.includes("typescript") || primary.includes("ts")) return "📘";
  if (primary.includes("javascript") || primary.includes("js")) return "📒";
  if (primary.includes("python")) return "🐍";
  if (primary.includes("rust")) return "🦀";
  if (primary.includes("go") || primary.includes("golang")) return "🐹";
  if (primary.includes("java")) return "☕";
  if (primary.includes("swift")) return "🍎";
  if (primary.includes("react")) return "⚛️";
  if (primary.includes("node")) return "💚";
  if (primary.includes("arduino") || primary.includes("iot")) return "📡";
  if (primary.includes("ar") || primary.includes("vr")) return "👓";

  return "📄";
}

function setupCodeExplorerInteractions(container) {
  // Folder toggle handlers
  const folders = container.querySelectorAll(".code-folder-row");
  folders.forEach((folderRow) => {
    const toggleFolder = () => {
      const folder = folderRow.closest(".code-folder");
      const type = folder.dataset.folderType;
      const children = folder.querySelector(".code-folder-children");
      const icon = folder.querySelector(".code-folder-icon");
      const isExpanded = folder.classList.contains("expanded");

      if (isExpanded) {
        codeExplorerState.expandedFolders.delete(type);
        folder.classList.remove("expanded");
        children.style.display = "none";
        folderRow.setAttribute("aria-expanded", "false");
        icon.textContent = "📁";
      } else {
        codeExplorerState.expandedFolders.add(type);
        folder.classList.add("expanded");
        children.style.display = "block";
        folderRow.setAttribute("aria-expanded", "true");
        icon.textContent = "📂";
      }
    };

    folderRow.addEventListener("click", toggleFolder);
    folderRow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFolder();
      }
    });
  });

  // File toggle handlers
  const files = container.querySelectorAll(".code-file-row");
  files.forEach((fileRow) => {
    const toggleFile = () => {
      const file = fileRow.closest(".code-file");
      const fileId = file.id;
      const details = file.querySelector(".code-file-details");
      const isExpanded = file.classList.contains("expanded");

      if (isExpanded) {
        codeExplorerState.expandedFiles.delete(fileId);
        file.classList.remove("expanded");
        details.style.display = "none";
        fileRow.setAttribute("aria-expanded", "false");
        // Remove toggle indicator
        const toggle = fileRow.querySelector(".code-file-toggle");
        if (toggle) toggle.remove();
      } else {
        codeExplorerState.expandedFiles.add(fileId);
        file.classList.add("expanded");
        details.style.display = "block";
        fileRow.setAttribute("aria-expanded", "true");
        // Add toggle indicator if not present
        if (!fileRow.querySelector(".code-file-toggle")) {
          const nameEl = fileRow.querySelector(".code-file-name");
          const toggle = document.createElement("span");
          toggle.className = "code-file-toggle";
          toggle.textContent = "▼";
          nameEl.after(toggle);
        }
      }
    };

    fileRow.addEventListener("click", (e) => {
      // Don't toggle if clicking a link
      if (e.target.tagName === "A") return;
      toggleFile();
    });
    fileRow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFile();
      }
    });
  });
}

// ==========================================================================
// Archive View
// ==========================================================================

async function renderArchiveList(container) {
  container.innerHTML = '<div class="archive-loading">Loading archive...</div>';

  const manifest = await loadArchiveManifest();
  if (!manifest) {
    container.innerHTML =
      '<div class="empty-state"><p>Failed to load archive.</p></div>';
    return;
  }

  // Collect all unique tags from all posts
  const allTags = new Set();
  manifest.posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => allTags.add(tag));
    }
  });
  const sortedTags = Array.from(allTags).sort();

  // Filter posts by selected tags
  let filteredPosts = manifest.posts;
  if (archiveState.selectedTags.size > 0) {
    filteredPosts = manifest.posts.filter((post) => {
      if (!post.tags) return false;
      return Array.from(archiveState.selectedTags).every((tag) =>
        post.tags.includes(tag)
      );
    });
  }

  // Group filtered posts by year
  const postsByYear = {};
  filteredPosts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!postsByYear[year]) postsByYear[year] = [];
    postsByYear[year].push(post);
  });

  // Sort years descending
  const years = Object.keys(postsByYear).sort((a, b) => b - a);

  // Build filter bar HTML
  const filterBarHtml = sortedTags.length > 0 ? `
    <div class="code-filter-bar">
      ${sortedTags
        .map(
          (tag) => `
        <button class="code-filter-tag ${
          archiveState.selectedTags.has(tag) ? "active" : ""
        }" data-tag="${escapeHtml(tag)}">
          ${escapeHtml(tag)}
        </button>
      `
        )
        .join("")}
    </div>
  ` : "";

  container.innerHTML = `
    <div class="archive-container">
      <div class="archive-header">
        <p class="archive-subtitle">${
          archiveState.selectedTags.size > 0
            ? `${filteredPosts.length} of ${manifest.totalPosts} posts`
            : `${manifest.totalPosts} posts from 2011-2022`
        }</p>
        ${filterBarHtml}
      </div>
      ${
        filteredPosts.length === 0
          ? '<div class="empty-state"><p>No posts match the selected tags.</p></div>'
          : `<div class="archive-timeline">
              ${years
                .map((year) => renderArchiveYear(year, postsByYear[year]))
                .join("")}
            </div>`
      }
    </div>
  `;

  // Setup filter interactions
  setupArchiveFilterInteractions(container, manifest);
}

function setupArchiveFilterInteractions(container, manifest) {
  const filterTags = container.querySelectorAll(".code-filter-tag");
  filterTags.forEach((tagBtn) => {
    tagBtn.addEventListener("click", () => {
      const tag = tagBtn.dataset.tag;
      if (archiveState.selectedTags.has(tag)) {
        // Clicking active tag clears it
        archiveState.selectedTags.delete(tag);
      } else {
        // Add tag to selection (allows multiple)
        archiveState.selectedTags.add(tag);
      }
      // Re-render the archive list
      renderArchiveList(container);
    });
  });
}

function renderArchiveYear(year, posts) {
  return `
    <div class="archive-year" data-year="${year}">
      <div class="archive-year-header">
        <span class="archive-year-label">${year}</span>
      </div>
      <div class="archive-year-posts">
        ${posts.map((post) => renderArchivePost(post)).join("")}
      </div>
    </div>
  `;
}

function renderArchivePost(post) {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const tagsHtml = post.tags && post.tags.length > 0
    ? `<span class="archive-post-tags">${post.tags.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}</span>`
    : "";

  return `
    <div class="archive-post">
      <a href="#archive/${escapeHtml(post.filename)}" class="archive-post-link">
        <span class="archive-post-title">${escapeHtml(post.title)}</span>
        <span class="archive-post-meta">
          ${tagsHtml}
          <span class="archive-post-date">${escapeHtml(formattedDate)}</span>
        </span>
      </a>
    </div>
  `;
}

async function renderArchiveArticle(container, filename) {
  container.innerHTML = '<div class="archive-loading">Loading article...</div>';

  // Check cache first
  if (archiveState.articlesCache.has(filename)) {
    const cached = archiveState.articlesCache.get(filename);
    displayArticle(container, cached.content, cached.meta);
    return;
  }

  try {
    const response = await fetch(`archive/${filename}`);
    if (!response.ok) throw new Error("Article not found");

    const markdown = await response.text();
    const { meta, content } = parseMarkdownWithFrontmatter(markdown);

    // Cache the article
    archiveState.articlesCache.set(filename, { content, meta });

    displayArticle(container, content, meta);
  } catch (error) {
    console.error("Failed to load article:", error);
    container.innerHTML = `
      <div class="archive-article">
        <a href="#writing" class="archive-back-link">← Back to Writing</a>
        <div class="empty-state"><p>Failed to load article.</p></div>
      </div>
    `;
    // Setup back link handler for error state
    const backLink = container.querySelector(".archive-back-link");
    if (backLink) {
      backLink.addEventListener("click", (e) => {
        e.preventDefault();
        state.currentArticle = null;
        window.history.pushState(null, null, "#writing");
        switchCategory("writing");
      });
    }
  }
}

function parseMarkdownWithFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { meta: {}, content: markdown };
  }

  const frontmatter = match[1];
  const content = match[2];

  // Parse YAML frontmatter (simple key: value parsing)
  const meta = {};
  frontmatter.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  });

  return { meta, content };
}

function displayArticle(container, markdownContent, meta) {
  // Configure marked to rewrite image paths
  const renderer = new marked.Renderer();
  const originalImage = renderer.image.bind(renderer);
  renderer.image = function (href, title, text) {
    // Handle both old and new marked.js API
    const src = typeof href === "object" ? href.href : href;
    const altText = typeof href === "object" ? href.text : text;

    let finalSrc = src;
    if (src && !src.startsWith("http") && !src.startsWith("/")) {
      finalSrc = `archive/${src}`;
    }
    return `<img src="${finalSrc}" alt="${altText || ""}" loading="lazy" />`;
  };

  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
  });

  const htmlContent = marked.parse(markdownContent);

  // Format date if available
  let dateStr = "";
  if (meta.date) {
    const date = new Date(meta.date);
    dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Build original URL link if available
  let originalLink = "";
  if (meta.original_url) {
    originalLink = `<a href="${escapeHtml(
      meta.original_url
    )}" target="_blank" rel="noopener noreferrer" class="archive-original-link">Originally at thegoldenmule.com</a>`;
  }

  container.innerHTML = `
    <div class="archive-article">
      <a href="#writing" class="archive-back-link">← Back to Writing</a>
      <article class="archive-article-content">
        <header class="archive-article-header">
          <h1 class="archive-article-title">${escapeHtml(
            meta.title || "Untitled"
          )}</h1>
          <div class="archive-article-meta">
            ${
              dateStr
                ? `<span class="archive-article-date">${escapeHtml(
                    dateStr
                  )}</span>`
                : ""
            }
            ${originalLink}
          </div>
        </header>
        <div class="archive-article-body">
          ${htmlContent}
        </div>
      </article>
    </div>
  `;

  // Setup back link handler
  const backLink = container.querySelector(".archive-back-link");
  if (backLink) {
    backLink.addEventListener("click", (e) => {
      e.preventDefault();
      state.currentArticle = null;
      window.history.pushState(null, null, "#writing");
      switchCategory("writing");
    });
  }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getImageUrl(item) {
  if (item.imageUrl) {
    if (item.imageUrl.startsWith("http")) {
      return item.imageUrl;
    }
    return item.imageUrl;
  }
  return null;
}

function renderTechTags(tech) {
  if (!tech || tech.length === 0) return "";
  return tech
    .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
    .join("");
}

function parseDate(dateStr) {
  if (!dateStr) return 0;

  const str = dateStr.toLowerCase();

  // "Present" means ongoing - sort to top
  if (
    str.includes("present") ||
    str.includes("current") ||
    str.includes("now")
  ) {
    return Date.now();
  }

  // For date ranges, use the end date (last year found)
  const yearMatches = str.match(/\d{4}/g);
  const year = yearMatches
    ? parseInt(yearMatches[yearMatches.length - 1])
    : 2000;

  // Extract month if present (use last month found for ranges)
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  let month = 0;
  months.forEach((m, i) => {
    const lastIndex = str.lastIndexOf(m);
    if (lastIndex !== -1) {
      // Check if this month appears after a dash (end of range)
      const dashIndex = str.lastIndexOf("-");
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

document.addEventListener("DOMContentLoaded", loadData);
