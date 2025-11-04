// Copied from src/background.js so Vite will include it in the built `dist/` folder
// This file is intentionally placed in `public/` to avoid relying on a plugin
// which failed to resolve during the build.

// Log on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ retort.ai extension installed.");

  // ✅ Create Context Menu for Text Selection
  chrome.contextMenus.create({
    id: "retort-ai-selection",
    title: "Send to Retort AI",
    contexts: ["selection"]
  });
});

// ✅ Handle Context Menu Click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "retort-ai-selection" && info.selectionText) {
    console.log("✅ Text selected from context menu:", info.selectionText);

    // ✅ Save selected text temporarily in storage
    chrome.storage.local.set({ retortContext: info.selectionText }, () => {
      console.log("✅ Context saved for popup.");

      // ✅ Open the extension popup programmatically
      chrome.action.openPopup();
    });
  }
});
