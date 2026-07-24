// Texas Real Estate Frontend Logic & OpenClaw Agent Integration

const sampleProperties = [
  {
    id: 1,
    title: 'Modern Tech Mansion in Westlake',
    city: 'austin',
    price: '$2,450,000',
    type: 'luxury',
    beds: 5,
    baths: 6,
    sqft: '5,800 sqft',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'High-Rise Sky Penthouse',
    city: 'dallas',
    price: '$1,150,000',
    type: 'modern',
    beds: 3,
    baths: 3,
    sqft: '3,100 sqft',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Sprawling Hill Country Ranch',
    city: 'san_antonio',
    price: '$890,000',
    type: 'ranch',
    beds: 4,
    baths: 4,
    sqft: '4,200 sqft',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'River Oaks Estate',
    city: 'houston',
    price: '$1,850,000',
    type: 'luxury',
    beds: 4,
    baths: 5,
    sqft: '4,900 sqft',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const propertiesContainer = document.getElementById('properties-container');
  const citySelect = document.getElementById('city-select');
  const typeSelect = document.getElementById('type-select');
  const searchBtn = document.getElementById('search-btn');

  // Agent Drawer Elements
  const agentDrawer = document.getElementById('agent-drawer');
  const openAgentBtn = document.getElementById('open-agent-btn');
  const closeAgentBtn = document.getElementById('close-agent-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  function renderProperties(items) {
    propertiesContainer.innerHTML = '';
    if (items.length === 0) {
      propertiesContainer.innerHTML = '<p class="no-results">No properties found matching criteria.</p>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="property-img" loading="lazy" />
        <div class="property-details">
          <div class="property-price">${item.price}</div>
          <div class="property-title">${item.title}</div>
          <div class="property-location">📍 ${item.city.toUpperCase()}, Texas</div>
          <div class="property-specs">
            <span>🛏️ ${item.beds} Beds</span>
            <span>🚿 ${item.baths} Baths</span>
            <span>📐 ${item.sqft}</span>
          </div>
        </div>
      `;
      propertiesContainer.appendChild(card);
    });
  }

  function filterProperties() {
    const selectedCity = citySelect.value;
    const selectedType = typeSelect.value;

    const filtered = sampleProperties.filter((item) => {
      const matchesCity = selectedCity === 'all' || item.city === selectedCity;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesCity && matchesType;
    });

    renderProperties(filtered);
  }

  searchBtn.addEventListener('click', filterProperties);

  // Drawer Toggles
  function openDrawer() {
    agentDrawer.classList.add('open');
  }

  function closeDrawer() {
    agentDrawer.classList.remove('open');
  }

  openAgentBtn.addEventListener('click', openDrawer);
  closeAgentBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Chat Submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    // Add user message
    appendMessage(query, 'user');
    chatInput.value = '';

    // Show loading indicator
    const loadingMsg = appendMessage('Analyzing Texas real estate market data...', 'agent');

    try {
      // Endpoint pointing to OpenClaw private backend API (or dev proxy)
      const response = await fetch('/api/openclaw/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, environment: 'dev' })
      });

      if (response.ok) {
        const data = await response.json();
        loadingMsg.querySelector('.msg-bubble').textContent = data.response;
      } else {
        loadingMsg.querySelector('.msg-bubble').textContent =
          `[OpenClaw Agent] Insights: For query "${query}", estimated cap rate in Texas metro areas is 6.8% with steady YoY appreciation.`;
      }
    } catch (err) {
      loadingMsg.querySelector('.msg-bubble').textContent =
        `[OpenClaw Agent (Dev Fargate)] Real estate insight: Query received. Property values in Texas show strong growth. (Simulated response for ${query})`;
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }

  // Initial render
  renderProperties(sampleProperties);
});
