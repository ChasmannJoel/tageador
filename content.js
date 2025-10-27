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
 * Hace scroll al final del contenedor de chats para cargar más.
 */
function scrollChatsContainerToEnd() {
  const scrollContainer = document.querySelector('.scroll-bar');
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    console.log('⬇️ Haciendo scroll para cargar más chats...');
  }
}

/**
 * Recorre los chats uno por uno, con control de parada y scroll para cargar más.
 */
function iterateChatsWithScroll() {
  let lastCount = 0;
  function processChats() {
    if (stopProcess) {
      console.log("⏹️ Proceso detenido por el usuario.");
      return;
    }
    const chatDivs = getChatElements().filter(chat => !openedChats.has(chat));
    if (chatDivs.length === 0) {
      if (lastCount === 0) {
        console.log("✅ Terminó de abrir todos los chats.");
        return;
      }
      // Hacer scroll para intentar cargar más chats
      scrollChatsContainerToEnd();
      lastCount = 0;
      setTimeout(processChats, 2000); // Espera a que carguen más chats
      return;
    }
    lastCount = chatDivs.length;
    let index = 0;
    function clickNextChat() {
      if (stopProcess) {
        console.log("⏹️ Proceso detenido por el usuario.");
        return;
      }
      if (index >= chatDivs.length) {
        // Hacer scroll para cargar más chats
        scrollChatsContainerToEnd();
        setTimeout(processChats, 2000);
        return;
      }
      const chat = chatDivs[index];
      if (chat) {
        openedChats.add(chat);
        scrollAndClickChat(chat, openedChats.size - 1);
      }
      index++;
      setTimeout(clickNextChat, 3000);
    }
    clickNextChat();
  }
  processChats();
}

/**
 * Inicia el proceso de apertura de chats.
 */
function startChatIteration() {
  stopProcess = false;
  openedChats.clear();
  console.log("▶️ Iniciando apertura automática de chats...");
  iterateChatsWithScroll();
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
