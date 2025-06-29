chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    const source = request.source || "selection";

    // ✅ Extract highlighted text (user selection)
    if (source === "selection") {
      try {
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString().trim() : "";

        if (selectedText && selectedText.length > 0) {
          sendResponse({ text: selectedText });
        } else {
          sendResponse({ text: "No text selected. Please highlight something and retry." });
        }
      } catch (e) {
        console.error("Selection read error:", e);
        sendResponse({ text: "Error reading selection." });
      }
    }

    // ✅ Extract full visible page text
    else if (source === "fullpage") {
      const isVisible = (element) => {
        const style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "visible" &&
          style.opacity !== "0" &&
          element.offsetParent !== null
        );
      };

      const textElements = document.querySelectorAll(
        "p, div, span, h1, h2, h3, h4, h5, h6, li, article, section, main, blockquote"
      );

      let visibleText = "";
      textElements.forEach((element) => {
        if (isVisible(element) && element.textContent.trim()) {
          visibleText += element.textContent.trim() + "\n";
        }
      });

      // ✅ Limit total text size to avoid overloading API
      const MAX_LENGTH = 2000;
      if (visibleText.length > MAX_LENGTH) {
        visibleText = visibleText.substring(0, MAX_LENGTH) + "\n\n[Content Truncated]";
      }

      visibleText = visibleText.replace(/\n+/g, "\n").trim();

      sendResponse({ text: visibleText || "No visible text found." });
    }

    return true; // Keeps message channel open for async response
  }
});