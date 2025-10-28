// Clientify Auto Chat Opener
console.log("🚀 [AutoTag] Script cargado. Esperando comandos y observando el DOM...");

let stopProcess = false;
let scrollTimeoutId = null;
let openedChats = new Set();

/**
 * Obtiene los elementos div que representan los chats, filtrando por el emoji 🕐.
 * @returns {HTMLElement[]} Array de divs de chats
 */


// Clientify Auto Chat Opener - Comunicación y eventos
console.log("🚀 [AutoTag] Script cargado. Esperando comandos y observando el DOM...");

// Observador para detectar apertura de nuevos chats
const mensajesInfo = [];
function extraerInfoPrimerMensaje(chatContainer) {
    const linkElement = chatContainer.querySelector('.MuiBox-root.mui-1974d75 a[href]');
    const timeElement = chatContainer.querySelector('.MuiBox-root.mui-186zjq8[aria-label]');
    if (linkElement && timeElement) {
        const url = linkElement.getAttribute('href');
        const hora = timeElement.getAttribute('aria-label');
        mensajesInfo.push({ url, hora });
        console.log('Mensaje capturado:', { url, hora });
    }
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('MuiBox-root') && node.classList.contains('mui-argvpf')) {
                extraerInfoPrimerMensaje(node);
            }
        });
    });
});

const mainContent = document.querySelector('main');
if (mainContent) {
  observer.observe(mainContent, { childList: true, subtree: true });
  console.log("👀 Observador iniciado sobre el contenedor principal de los chats.");
} else {
  console.warn("⚠️ [AutoTag] No se encontró el contenedor principal 'main'. El observador no se inició.");
}



// --- Módulo para abrir chats ---
const chatOpener = {
  stopProcess: false,
  scrollTimeoutId: null,
  openedChats: new Set(),
  getChatElements() {
    return Array.from(document.querySelectorAll('p'))
      .filter(p => p.textContent.includes('🕐'))
      .map(p => p.closest('div'));
  },
  scrollChatsContainerToEnd() {
    const scrollContainer = document.querySelector('.MuiBox-root.mui-2m10ek');
    if (scrollContainer && typeof scrollContainer.scrollHeight === 'number') {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      console.log('⬇️ Buscando chats...');
    } else {
      console.warn('[AutoTag] No se encontró el contenedor de chats o scrollHeight no está disponible.');
    }
  },
  hasStopEmoji() {
    return Array.from(document.querySelectorAll('p.MuiTypography-root.MuiTypography-body1.mui-194rj03'))
      .some(p => p.textContent.includes('🤚🏻'));
  },
  scrollChatsUntilStopOrEnd(onFinish) {
    let lastScrollTop = -1;
    let reachedEnd = false;
    const self = this;
    function scrollUntilStopOrEnd() {
      if (self.stopProcess) {
        console.log("⏹️ [AutoTag] Proceso detenido durante el scroll.");
        return;
      }
      const scrollContainer = document.querySelector('.MuiBox-root.mui-2m10ek');
      if (self.hasStopEmoji()) {
        console.log("🛑 Emoji de stop encontrado, deteniendo el scroll. Abriendo todos los chats con emoji 🕐 visibles.");
        reachedEnd = true;
      } else if (scrollContainer) {
        if (scrollContainer.scrollTop === lastScrollTop && scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          console.log("🏁 Fin del scroll detectado. Abriendo todos los chats con emoji 🕐 visibles.");
          reachedEnd = true;
        } else {
          self.scrollChatsContainerToEnd();
          lastScrollTop = scrollContainer.scrollTop;
        }
      }
      if (reachedEnd) {
        const chatDivs = self.getChatElements();
        console.log(`Encontrados ${chatDivs.length} chats con emoji 🕐.`);
        if (chatDivs.length === 0) {
          console.warn("⚠️ No se encontraron chats con emoji 🕐.");
          return;
        }
        if (typeof onFinish === 'function') onFinish(chatDivs);
        return;
      }
      self.scrollTimeoutId = setTimeout(scrollUntilStopOrEnd, 3000);
    }
    scrollUntilStopOrEnd();
  },
  scrollAndOpenChats() {
    this.scrollChatsUntilStopOrEnd(this.iterateChats.bind(this));
  },
  iterateChats(chatDivs) {
    let index = 0;
    const self = this;
    function clickNextChat() {
      if (self.stopProcess) {
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
        self.openedChats.add(chat);
        setTimeout(() => {
          const chatWindow = document.querySelector('.mui-npbckn');
          if (chatWindow && typeof chatWindow.scrollTop === 'number') {
            chatWindow.scrollBy({ top: 120, behavior: 'smooth' });
          }
          index++;
          setTimeout(clickNextChat, 4000);
        }, 1200);
      } else {
        index++;
        setTimeout(clickNextChat, 4000);
      }
    }
    clickNextChat();
  },
  startChatIteration() {
    this.stopProcess = false;
    this.openedChats.clear();
    this.scrollAndOpenChats();
  },
  stopChatIteration() {
    this.stopProcess = true;
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
      console.log("⏹️ [AutoTag] Scroll automático detenido.");
    }
  }
};

// --- Módulo para tagear chats ---
const chatTagger = {
  stopProcess: false,
  scrollTimeoutId: null,
  scrollAndTagChats() {
    chatOpener.scrollChatsUntilStopOrEnd(this.iterateTagChats.bind(this));
  },
  iterateTagChats(chatDivs) {
    let index = 0;
    const self = this;
    function clickNextChat() {
      if (self.stopProcess) {
        console.log("⏹️ Proceso de tagear detenido por el usuario.");
        return;
      }
      if (index >= chatDivs.length) {
        console.log("✅ Terminó de tagear todos los chats.");
        return;
      }
      const chat = chatDivs[index];
      if (chat) {
        chat.scrollIntoView({ behavior: "smooth", block: "center" });
        chat.click();
        console.log(`[Tagear] 💬 Chat ${index + 1} tageado`);
        setTimeout(() => {
          const chatWindow = document.querySelector('.mui-npbckn');
          if (chatWindow && typeof chatWindow.scrollTop === 'number') {
            chatWindow.scrollBy({ top: 120, behavior: 'smooth' });
          }
          // Espera adicional para asegurar que el DOM esté listo
          setTimeout(() => {
            const obsP = chatWindow && Array.from(chatWindow.querySelectorAll('p')).find(
              p => /Observaci[oó]n(es)?/i.test(p.textContent)
            );
            if (obsP) {
              // Simular hover para mostrar el botón de edición
              const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
              obsP.dispatchEvent(mouseOverEvent);
              setTimeout(() => {
                const editBtn = obsP.querySelector('button.btn-edit');
                if (editBtn) {
                  editBtn.click();
                  // Intentar encontrar el textarea con reintentos y más tiempo
                  let intentos = 0;
                  const maxIntentos = 8; // hasta 8 intentos (~8 segundos)
                  function buscarTextareaYTaggear() {
                    const textarea = document.querySelector('textarea.mui-16j0ffk');
                    if (textarea) {
                      const actual = textarea.value.trim();
                      const nuevoCodigo = window._textoTag;
                      const codigos = actual.split(',').map(c => c.trim());
                      if (!codigos.includes(nuevoCodigo)) {
                        const nuevoValor = actual ? actual + ', ' + nuevoCodigo : nuevoCodigo;
                        textarea.value = nuevoValor;
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        setTimeout(() => {
                          const saveBtn = document.querySelector('button[aria-label="Guardar"]');
                          if (saveBtn) {
                            saveBtn.click();
                            console.log('Cambios guardados');
                          } else {
                            console.warn('No se encontró el botón Guardar');
                          }
                        }, 1000);
                      } else {
                        console.log('El código ya existe en el campo, no se agrega.');
                      }
                    } else if (intentos < maxIntentos) {
                      intentos++;
                      setTimeout(buscarTextareaYTaggear, 1000); // espera 1 segundo y reintenta
                    } else {
                      console.warn('No se encontró el textarea tras varios intentos');
                    }
                  }
                  setTimeout(buscarTextareaYTaggear, 4000); // primer intento tras 4 segundos
                } else {
                  console.warn('No se encontró el botón de edición');
                }
              }, 600); // Espera tras el hover para que aparezca el botón
            } else {
              console.warn('No se encontró el <p> Observaciones');
            }
            index++;
            setTimeout(clickNextChat, 4000);
          }, 4000); // Espera 4 segundos extra tras abrir el chat
        }, 1200);
      } else {
        index++;
        setTimeout(clickNextChat, 4000);
      }
    }
    clickNextChat();
  },
  startTagIteration() {
    const texto = prompt('¿Qué texto/código quieres tagear?');
    if (!texto || typeof texto !== 'string' || !texto.trim()) {
      alert('Debes ingresar un texto válido para tagear.');
      return;
    }
    window._textoTag = texto.trim();
    this.stopProcess = false;
    this.scrollAndTagChats();
  },
  stopTagIteration() {
    this.stopProcess = true;
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
      console.log("⏹️ [Tagear] Scroll automático detenido.");
    }
  }
};

// --- Handlers de mensajes ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 [AutoTag] Mensaje recibido desde popup:", message);
  if (message.action === "abrirChats") {
    console.log("▶️ [AutoTag] Iniciando apertura de chats...");
    chatOpener.startChatIteration();
  }
  if (message.action === "detenerChats") {
    console.log("⏹️ [AutoTag] Deteniendo apertura de chats...");
    chatOpener.stopChatIteration();
    chatTagger.stopTagIteration();
  }
  if (message.action === "tagearChatsV2") {
    console.log("▶️ [AutoTag] Iniciando tageo de chats V2...");
    chatTagger.startTagIteration();
  }
});
