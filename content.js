// Clientify Auto Chat Opener
console.log("🚀 Clientify Auto Chat Opener cargado, esperando comando...");

let stopProcess = false;

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
 * Hace scroll y clic en el chat, mostrando el log.
 * @param {HTMLElement} chat - Elemento div del chat
 * @param {number} index - Índice del chat
 */
function scrollAndClickChat(chat, index) {
  if (chat) {
    chat.scrollIntoView({ behavior: "smooth", block: "center" });
    chat.click();
    console.log(`💬 Chat ${index + 1} abierto`);
  }
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
    scrollAndClickChat(chatDivs[index], index);
    index++;
    setTimeout(clickNextChat, 3000);
  }
  clickNextChat();
}

/**
 * Inicia el proceso de apertura de chats.
 */
function startChatIteration() {
  console.log("▶️ Iniciando apertura automática de chats...");
  const chatDivs = getChatElements();
  console.log(`Encontrados ${chatDivs.length} chats.`);
  if (chatDivs.length === 0) {
    console.warn("⚠️ No se encontraron chats.");
    return;
  }
  iterateChats(chatDivs);
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
    stopProcess = false;
    startChatIteration();
  }
  if (message.action === "detenerChats") {
    stopChatIteration();
  }
});
