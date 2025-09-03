import React, { useState } from "react";

const SearchBar = ({ onSearch, loading, searchHistory = [] }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("general");

  const searchTypes = [
    {
      value: "general",
      label: "🔍 All",
      placeholder: "Search by title, author, or keyword...",
    },
    {
      value: "title",
      label: "📖 Title",
      placeholder: "Search by book title...",
    },
    {
      value: "author",
      label: "✍️ Author",
      placeholder: "Search by author name...",
    },
    {
      value: "subject",
      label: "🎓 Subject",
      placeholder: "Search by subject (programming, history, psychology)...",
    },
  ];

  const quickSearches = [
    { query: "data science", type: "subject", label: "📊 Data Science" },
    {
      query: "react programming",
      type: "title",
      label: "⚛️ React Programming",
    },
    { query: "shakespeare", type: "author", label: "🎭 Shakespeare" },
    { query: "psychology", type: "subject", label: "🧠 Psychology" },
    {
      query: "machine learning",
      type: "subject",
      label: "🤖 Machine Learning",
    },
    { query: "web development", type: "subject", label: "💻 Web Development" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  const handleQuickSearch = (searchItem) => {
    setQuery(searchItem.query);
    setSearchType(searchItem.type);
    onSearch(searchItem.query, searchItem.type);
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setSearchType(historyItem.searchType);
    onSearch(historyItem.query, historyItem.searchType);
  };

  const currentPlaceholder =
    searchTypes.find((type) => type.value === searchType)?.placeholder ||
    "Search books...";

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "32px",
        marginBottom: "32px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🔍 Search Books for Alex
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          Find academic books, research materials, and study resources
        </p>
      </div>

      {/* Search Type Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Search Method:
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "8px",
          }}
        >
          {searchTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSearchType(type.value)}
              style={{
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "8px",
                border: "2px solid",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                backgroundColor:
                  searchType === type.value ? "#3b82f6" : "#ffffff",
                borderColor: searchType === type.value ? "#3b82f6" : "#e5e7eb",
                color: searchType === type.value ? "#ffffff" : "#374151",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentPlaceholder}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: loading ? "#f9fafb" : "#ffffff",
              color: "#1f2937",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "12px",
              border: "none",
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              backgroundColor: loading || !query.trim() ? "#9ca3af" : "#3b82f6",
              color: "#ffffff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Searching Books...
              </>
            ) : (
              <>
                <span>🚀</span>
                Search Books
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Recent Searches:
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {searchHistory.slice(0, 5).map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleHistoryClick(item)}
                disabled={loading}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                🕒 {item.query} ({item.resultCount})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Search Options */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Quick Searches for Students:
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {quickSearches.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickSearch(item)}
              disabled={loading}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                color: "#374151",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.borderColor = "#d1d5db";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#e5e7eb";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#dbeafe",
          borderRadius: "12px",
          border: "1px solid #bfdbfe",
        }}
      >
        <p style={{ fontSize: "14px", color: "#1e40af", margin: 0 }}>
          <strong>💡 Tips for Alex:</strong> Use subject search to find books by
          topic for your assignments. Try searching for your course subjects or
          research areas!
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
