import React, { useState, useEffect } from "react";

function App() {
  const [selectedText, setSelectedText] = useState("");
  const [status, setStatus] = useState("Select text in PDF and click detect");
  const [isLoading, setIsLoading] = useState(false);

  // Function to directly get selected text from the PDF tab
  const getSelectedTextDirectly = async () => {
    setIsLoading(true);
    setStatus("Detecting selected text...");

    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab) {
        setStatus("Error: No active tab found");
        setIsLoading(false);
        return;
      }

      console.log("Current tab:", tab.url);

      // Inject a script to get the selected text directly
      try {
        const injectionResults = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // This function runs in the context of the PDF page
            return {
              selectedText: window.getSelection().toString().trim(),
              lingualinkText: window.lingualinkSelectedText || "",
              timestamp: window.lingualinkLastUpdate || 0,
              hasSelection: window.getSelection().toString().trim().length > 0,
            };
          },
        });

        const result = injectionResults[0]?.result;
        console.log("Injection result:", result);

        if (result) {
          // Prefer the direct selection, then our global variable
          const text = result.selectedText || result.lingualinkText;

          if (text && text.length > 1) {
            setSelectedText(text);
            setStatus("✅ Text detected successfully!");

            // Store for future use
            chrome.storage.local.set({ lastSelectedText: text });
          } else {
            setSelectedText("");
            setStatus(
              "❌ No text selected. Select some text in the PDF first."
            );
          }
        } else {
          setStatus("❌ Cannot access PDF content. Try refreshing the page.");
        }
      } catch (injectError) {
        console.error("Injection error:", injectError);
        setStatus("❌ Cannot access this page due to security restrictions.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Error detecting text selection");
    }

    setIsLoading(false);
  };

  // Alternative method using programmatic selection
  const simulateTextSelection = async () => {
    setIsLoading(true);
    setStatus("Simulating text detection...");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Try to get any selected text
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Try multiple methods to get selected text
          const selection = window.getSelection();
          const activeElement = document.activeElement;

          return {
            method1: selection.toString().trim(),
            method2:
              activeElement?.value?.substring(
                activeElement.selectionStart,
                activeElement.selectionEnd
              ) || "",
            method3: window.lingualinkSelectedText || "",
            hasSelection: !selection.isCollapsed,
          };
        },
      });

      const result = results[0]?.result;
      const text = result.method1 || result.method2 || result.method3;

      if (text) {
        setSelectedText(text);
        setStatus("✅ Text found!");
      } else {
        setStatus("💡 Tip: Select text with mouse, not keyboard");
      }
    } catch (error) {
      setStatus(
        "🔒 Security restriction. Try on web PDF instead of local file."
      );
    }

    setIsLoading(false);
  };

  // Load any previously stored text
  useEffect(() => {
    chrome.storage.local.get(["lastSelectedText"], (result) => {
      if (result.lastSelectedText) {
        setSelectedText(result.lastSelectedText);
        setStatus("Previously selected text loaded");
      }
    });
  }, []);

  const handleTranslate = () => {
    if (selectedText) {
      alert(
        `Translation coming soon!\n\nSelected text: "${selectedText}"\n\nNext: We'll add actual translation API`
      );
    } else {
      alert(
        'Please select text in the PDF first, then click "Detect Selection"'
      );
    }
  };

  return (
    <div
      style={{
        width: "400px",
        minHeight: "450px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2
          style={{
            margin: "0 0 5px 0",
            color: "#2c3e50",
            fontSize: "24px",
          }}
        >
          🈲 LinguaLink
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#7f8c8d",
            fontWeight: "bold",
          }}
        >
          PDF Text Translator
        </p>
      </div>

      {/* Status Card */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#2c3e50",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>Status:</span>
          <strong
            style={{
              color: status.includes("✅")
                ? "#27ae60"
                : status.includes("❌")
                ? "#e74c3c"
                : "#f39c12",
            }}
          >
            {status}
          </strong>
        </div>

        {/* Selected Text Display */}
        <div
          style={{
            border: "2px dashed #bdc3c7",
            padding: "15px",
            borderRadius: "8px",
            background: selectedText ? "#ecf0f1" : "#fafafa",
            minHeight: "80px",
            fontSize: "14px",
            lineHeight: "1.4",
            color: selectedText ? "#2c3e50" : "#95a5a6",
            fontStyle: selectedText ? "normal" : "italic",
          }}
        >
          {selectedText || "No text detected yet..."}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={getSelectedTextDirectly}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px",
            background: isLoading ? "#bdc3c7" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {isLoading ? "🔄 Detecting..." : "🔍 Detect Selection"}
        </button>
      </div>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={!selectedText}
        style={{
          width: "100%",
          padding: "15px",
          background: selectedText ? "#e74c3c" : "#bdc3c7",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: selectedText ? "pointer" : "not-allowed",
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "20px",
          transition: "all 0.3s",
        }}
      >
        🈳 Translate Text
      </button>

      {/* Instructions */}
      <div
        style={{
          background: "#34495e",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        <strong style={{ display: "block", marginBottom: "8px" }}>
          📖 How to use:
        </strong>
        <ol style={{ margin: "0", paddingLeft: "15px" }}>
          <li>Open your PDF file in Chrome</li>
          <li>
            <strong>Select text with your mouse</strong> (click and drag)
          </li>
          <li>
            Click the <strong>"Detect Selection"</strong> button above
          </li>
          <li>
            Click <strong>"Translate Text"</strong> when text appears
          </li>
        </ol>
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            background: "#2c3e50",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          💡 <strong>Tip:</strong> Make sure text is highlighted in blue when
          selected
        </div>
      </div>
    </div>
  );
}

export default App;
