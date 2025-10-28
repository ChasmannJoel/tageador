
document.getElementById("abrirChatsBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "abrirChats" });
});

document.getElementById("tagearChatsV2Btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "tagearChatsV2" });
});

document.getElementById("detenerChatsBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "detenerChats" });
});

// Recibe y muestra mensajesInfo en el popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "mostrarMensajesInfo") {
    const mensajesDiv = document.getElementById('mensajesInfo');
    if (mensajesDiv) {
      mensajesDiv.innerText = JSON.stringify(message.data, null, 2);
    } else {
      alert(JSON.stringify(message.data, null, 2));
    }
  }
});
