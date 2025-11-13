document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const browseButton = document.getElementById("browseButton");
  const messagesContainer = document.getElementById("messagesContainer");
  const sessionSection = document.getElementById("sessionSection");
  const emptyState = document.getElementById("emptyState");
  const clearButton = document.getElementById("clearButton");
  const sampleButtons = document.querySelectorAll(".sample-button");

  // Initialize - show empty state
  showEmptyState();

  // File input handling
  browseButton.addEventListener("click", () => {
    fileInput.click();
  });

  uploadArea.addEventListener("click", (e) => {
    if (e.target !== browseButton) {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      loadSessionFromFile(file);
    }
  });

  // Drag and drop handling
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      loadSessionFromFile(file);
    } else {
      showError("Please drop a valid JSON file");
    }
  });

  // Sample button handling
  sampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filePath = button.dataset.file;
      loadSessionFromURL(filePath);
    });
  });

  // Clear button handling
  clearButton.addEventListener("click", () => {
    clearSession();
  });

  // Load session from file
  function loadSessionFromFile(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const sessionData = JSON.parse(e.target.result);
        renderSession(sessionData);
      } catch (error) {
        showError("Invalid JSON format: " + error.message);
      }
    };

    reader.onerror = () => {
      showError("Error reading file");
    };

    reader.readAsText(file);
  }

  // Load session from URL
  async function loadSessionFromURL(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load session file");
      }
      const sessionData = await response.json();
      renderSession(sessionData);
    } catch (error) {
      showError("Error loading session: " + error.message);
    }
  }

  // Render session
  function renderSession(sessionData) {
    // Validate session data
    if (!Array.isArray(sessionData)) {
      showError("Session data must be an array");
      return;
    }

    if (sessionData.length === 0) {
      showError("Session data is empty");
      return;
    }

    // Clear previous messages
    messagesContainer.innerHTML = "";

    // Hide empty state and show session
    emptyState.classList.remove("active");
    sessionSection.classList.add("active");

    // Render each message
    sessionData.forEach((message, index) => {
      renderMessage(message, index);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Render a single message
  function renderMessage(message, index) {
    // Validate message structure
    if (!message.role || !message.content) {
      console.warn(`Message ${index} is missing role or content`);
      return;
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${message.role}`;

    // Create avatar
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = message.role === "user" ? "U" : "AI";

    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    // Add role label
    const roleLabel = document.createElement("div");
    roleLabel.className = "message-role";
    roleLabel.textContent = message.role;
    contentDiv.appendChild(roleLabel);

    // Handle thinking content (for assistant messages)
    if (message.content.thinking !== undefined) {
      const thinkingSection = createThinkingSection(message.content.thinking);
      contentDiv.appendChild(thinkingSection);
    }

    // Handle tool former data
    if (message.content.toolFormerData) {
      const toolSection = createToolSection(message.content.toolFormerData);
      contentDiv.appendChild(toolSection);
    }

    // Handle main text content
    if (message.content.text) {
      const textDiv = document.createElement("div");
      textDiv.className = "message-text";
      textDiv.innerHTML = formatMessageText(message.content.text);
      contentDiv.appendChild(textDiv);
    }

    // Assemble message
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
  }

  // Create thinking section
  function createThinkingSection(thinkingText) {
    const section = document.createElement("div");
    section.className = "thinking-section";

    const label = document.createElement("div");
    label.className = "thinking-label";
    label.textContent = "Thinking";

    const text = document.createElement("div");
    text.className = "thinking-text";
    text.textContent = thinkingText || "(empty)";

    section.appendChild(label);
    section.appendChild(text);
    return section;
  }

  // Create tool section
  function createToolSection(toolData) {
    const section = document.createElement("div");
    section.className = "tool-section";

    const label = document.createElement("div");
    label.className = "tool-label";
    label.textContent = "Tool Used";

    const details = document.createElement("div");
    details.className = "tool-details";

    // Add tool name
    if (toolData.tool) {
      const toolItem = document.createElement("div");
      toolItem.className = "tool-item";
      toolItem.innerHTML = `
        <span class="tool-item-label">Tool:</span>
        <span class="tool-item-value">${escapeHtml(toolData.tool)}</span>
      `;
      details.appendChild(toolItem);
    }

    // Add input
    if (toolData.input) {
      const inputItem = document.createElement("div");
      inputItem.className = "tool-item";
      inputItem.innerHTML = `
        <span class="tool-item-label">Input:</span>
        <span class="tool-item-value">${escapeHtml(toolData.input)}</span>
      `;
      details.appendChild(inputItem);
    }

    // Add output
    if (toolData.output) {
      const outputItem = document.createElement("div");
      outputItem.className = "tool-item";
      outputItem.innerHTML = `
        <span class="tool-item-label">Output:</span>
        <span class="tool-item-value">${escapeHtml(toolData.output)}</span>
      `;
      details.appendChild(outputItem);
    }

    section.appendChild(label);
    section.appendChild(details);
    return section;
  }

  // Format message text with code blocks and inline code
  function formatMessageText(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);

    // Format code blocks (```language\ncode\n```)
    formatted = formatted.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language, code) => {
        const lang = language || "";
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
      }
    );

    // Format inline code (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Preserve line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Show error message
  function showError(message) {
    alert(message);
    console.error(message);
  }

  // Clear session
  function clearSession() {
    messagesContainer.innerHTML = "";
    sessionSection.classList.remove("active");
    emptyState.classList.add("active");
    fileInput.value = "";
  }

  // Show empty state
  function showEmptyState() {
    sessionSection.classList.remove("active");
    emptyState.classList.add("active");
  }
});
