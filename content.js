// Clientify Auto Chat Opener
console.log("🚀 Clientify Auto Chat Opener cargado, esperando comando...");

let stopProcess = false;
let openedChats = new Set();

/**
 * Obtiene los elementos div que representan los chats, filtrando por el emoji 🕐.
 * @returns {HTMLElement[]} Array de divs de chats
 */
function getChatElements() {
  return Array.from(document.querySelectorAll('p'))
    .filter(p => p.textContent.includes('🕐'))
    .map(p => p.closest('div'));
}

/**
 * Hace scroll en el contenedor de chats antes de abrir cada chat.
 */
function scrollChatsContainerToEnd() {
  const scrollContainer = document.querySelector('.MuiBox-root.mui-2m10ek');
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    console.log('⬇️ Buscando chats...');
  }
}

/**
 * Verifica si el emoji de detener está presente en el DOM.
 * @returns {boolean} Verdadero si se encuentra el emoji de detener, falso en caso contrario
 */
function hasStopEmoji() {
  return Array.from(document.querySelectorAll('p.MuiTypography-root.MuiTypography-body1.mui-194rj03'))
    .some(p => p.textContent.includes('🤚🏻'));
}

/**
 * Abre los chats encontrados tras hacer scroll.
 */
function scrollAndOpenChats() {
  let scrollStopped = false;
  if (hasStopEmoji()) {
    console.log("🛑 Emoji de stop encontrado, deteniendo el scroll. Abriendo solo los chats visibles sin emoji.");
    scrollStopped = true;
  } else {
    scrollChatsContainerToEnd();
  }
  setTimeout(() => {
    const chatDivs = getChatElements().filter(div => !div.textContent.includes('🤚🏻'));
    console.log(`Encontrados ${chatDivs.length} chats sin emoji de stop.`);
    if (chatDivs.length === 0) {
      console.warn("⚠️ No se encontraron chats sin emoji de stop.");
      return;
    }
    iterateChats(chatDivs);
  }, 2000); // Espera 2 segundos tras el scroll antes de abrir chats
}

/**
 * Recorre los chats uno por uno, con control de parada.
 * @param {HTMLElement[]} chatDivs - Array de chats
 */
function iterateChats(chatDivs) {
  let index = 0;
  function clickNextChat() {
    if (stopProcess) {
      console.log("⏹️ Proceso detenido por el usuario.");
      return;
    }
    if (index >= chatDivs.length) {
      console.log("✅ Terminó de abrir todos los chats.");
      return;
    }
    const chat = chatDivs[index];
    if (chat) {
      chat.scrollIntoView({ behavior: "smooth", block: "center" });
      chat.click();
      console.log(`💬 Chat ${index + 1} abierto`);
      openedChats.add(chat);
    }
    index++;
    setTimeout(clickNextChat, 3000);
  }
  clickNextChat();
}

/**
 * Inicia el proceso de apertura de chats.
 */
function startChatIteration() {
  stopProcess = false;
  openedChats.clear();
  scrollAndOpenChats();
}

/**
 * Detiene el proceso de apertura de chats.
 */
function stopChatIteration() {
  stopProcess = true;
}

// Escucha mensajes desde popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "abrirChats") {
    startChatIteration();
  }
  if (message.action === "detenerChats") {
    stopChatIteration();
  }
});
