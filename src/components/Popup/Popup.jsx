import React, { useState } from "react";
import "./Popup.css";

const Popup = () => {
  const [activeTab, setActiveTab] = useState("translate");

  return (
    <div className="lingua-link-popup">
      <header>
        <div className="logo">
          <svg
            className="logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M8 11H16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 15H16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 7H12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>LinguaLink</span>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <div
            className={`tab ${activeTab === "translate" ? "active" : ""}`}
            onClick={() => setActiveTab("translate")}
          >
            Translate
          </div>
          <div
            className={`tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </div>
          <div
            className={`tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </div>
        </div>

        {activeTab === "translate" && (
          <div className="tab-content active">
            <div className="translation-card">
              <div className="original-text">
                Select text in a PDF to translate
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="tab-content active">
            <div className="empty-state">
              <p>No translation history yet</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content active">
            <div className="settings-option">
              <label htmlFor="primary-language">
                Primary Translation Language
              </label>
              <select id="primary-language">
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
