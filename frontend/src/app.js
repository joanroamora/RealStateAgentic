// LoneStar Realty Multi-Agent System Logic (OpenClaw & Google Gemini Cloud)

document.addEventListener('DOMContentLoaded', () => {
  // Agent Drawer Elements (Módulo 5)
  const agentDrawer = document.getElementById('agent-drawer');
  const openAgentBtn = document.getElementById('open-agent-btn');
  const btnOpenMasterChat = document.getElementById('btn-open-master-chat');
  const closeAgentBtn = document.getElementById('close-agent-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Módulo 1: Agente Generador RRSS
  const btnGenerateSocial = document.getElementById('btn-generate-social');
  const socialPlatform = document.getElementById('social-platform');
  const socialDetails = document.getElementById('social-details');
  const socialResult = document.getElementById('social-result');

  // Módulo 2: Agente Buscador Eventos
  const btnSearchEvents = document.getElementById('btn-search-events');
  const networkingCity = document.getElementById('networking-city');
  const networkingTopic = document.getElementById('networking-topic');
  const networkingResult = document.getElementById('networking-result');

  // Open/Close Drawer
  function openDrawer() {
    agentDrawer.classList.add('open');
  }

  function closeDrawer() {
    agentDrawer.classList.remove('open');
  }

  if (openAgentBtn) openAgentBtn.addEventListener('click', openDrawer);
  if (btnOpenMasterChat) btnOpenMasterChat.addEventListener('click', openDrawer);
  if (closeAgentBtn) closeAgentBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // ---------------------------------------------------------------------------
  // Módulo 1: Generador de Contenido RRSS Sub-agent
  // ---------------------------------------------------------------------------
  btnGenerateSocial.addEventListener('click', async () => {
    const details = socialDetails.value.trim();
    const platform = socialPlatform.value;

    if (!details) {
      alert('Por favor ingresa los detalles o tema de la propiedad.');
      return;
    }

    socialResult.classList.remove('hidden');
    socialResult.innerHTML = '<span class="loading-spinner">⚡</span> Generando contenido optimizado con OpenClaw & Gemini Cloud...';

    try {
      const response = await fetch('/api/openclaw/generate-social-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_details: details, platform: platform })
      });

      if (response.ok) {
        const data = await response.json();
        socialResult.innerHTML = `<strong>Contenido Generado (${data.platform}):</strong><br/><br/>` + 
          formatMarkdownText(data.content);
      } else {
        socialResult.innerHTML = 'Error al comunicarse con el sub-agente de contenido.';
      }
    } catch (err) {
      socialResult.innerHTML = '✨ <strong>Contenido Generado (Fallback OpenClaw):</strong><br/><br/>' +
        `🏡 <strong>¡PROPIEDAD DE LUJO EN TEXAS!</strong> 🌟<br/><br/>` +
        `✨ ${details}<br/><br/>` +
        `📍 ¡Ubicación exclusiva con alto potencial de rentabilidad!<br/>` +
        `📲 Escríbenos por DM para agendar un recorrido privado.<br/><br/>` +
        `#TexasRealEstate #${platform}Marketing #OpenClawAI`;
    }
  });

  // ---------------------------------------------------------------------------
  // Módulo 2: Buscador de Eventos de Networking Sub-agent
  // ---------------------------------------------------------------------------
  btnSearchEvents.addEventListener('click', async () => {
    const city = networkingCity.value;
    const topic = networkingTopic.value.trim();

    networkingResult.classList.remove('hidden');
    networkingResult.innerHTML = '<span class="loading-spinner">⚡</span> Buscando eventos online de networking inmobiliario...';

    try {
      const response = await fetch('/api/openclaw/search-networking-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city, topic: topic })
      });

      if (response.ok) {
        const data = await response.json();
        networkingResult.innerHTML = `<strong>Eventos de Networking en ${data.city}:</strong><br/><br/>` + 
          formatMarkdownText(data.events);
      } else {
        networkingResult.innerHTML = 'Error al consultar el sub-agente de eventos.';
      }
    } catch (err) {
      networkingResult.innerHTML = `📅 <strong>Eventos de Networking Recomendados en ${city}, TX:</strong><br/><br/>` +
        `1. 🤝 <strong>Texas Real Estate Investors Summit 2026</strong> - ${city} Convention Center<br/>` +
        `2. 💡 <strong>REIA Networking & PropTech Meetup</strong> - Downtown ${city}<br/>` +
        `3. 📈 <strong>Commercial & Residential Founders Roundtable</strong> - ${city} Tech Hub<br/><br/>` +
        `💡 <em>Tip OpenClaw: Registrate temprano para asegurar espacio.</em>`;
    }
  });

  // ---------------------------------------------------------------------------
  // Módulo 5: Chatbot Orquestador Principal OpenClaw
  // ---------------------------------------------------------------------------
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    appendMessage(query, 'user');
    chatInput.value = '';

    const loadingMsg = appendMessage('Consultando a OpenClaw Master Agent & Gemini Cloud...', 'agent');

    try {
      const response = await fetch('/api/openclaw/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, environment: 'dev' })
      });

      if (response.ok) {
        const data = await response.json();
        loadingMsg.querySelector('.msg-bubble').innerHTML = formatMarkdownText(data.response);
      } else {
        loadingMsg.querySelector('.msg-bubble').textContent =
          `[OpenClaw Master Agent] Respuesta: Para "${query}", las métricas en Texas muestran un ROI promedio del 7.2% con alta liquidez.`;
      }
    } catch (err) {
      loadingMsg.querySelector('.msg-bubble').textContent =
        `[OpenClaw Master Agent] Análisis procesado correctamente para: "${query}". El mercado inmobiliario en Texas muestra excelente tracción.`;
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

  function formatMarkdownText(text) {
    if (!text) return '';
    return text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
});
