import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import { searchBooks } from "./services/api";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [totalSearches, setTotalSearches] = useState(0);

  // Load search history from localStorage on app start
  useEffect(() => {
    const savedHistory = localStorage.getItem("bookfinder-search-history");
    const savedSearchCount = localStorage.getItem("bookfinder-search-count");

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    if (savedSearchCount) {
      setTotalSearches(parseInt(savedSearchCount));
    }

    // Add welcome message
    console.log("📚 BookFinder for Alex - Ready to find your next great read!");
  }, []);

  const handleSearch = async (query, searchType = "general") => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Searching for: "${query}" (${searchType})`);
      const results = await searchBooks(query, searchType);
      setBooks(results);

      // Update search history
      const newHistoryItem = {
        query,
        searchType,
        timestamp: Date.now(),
        resultCount: results.length,
      };

      const updatedHistory = [
        newHistoryItem,
        ...searchHistory.filter(
          (item) =>
            !(
              item.query.toLowerCase() === query.toLowerCase() &&
              item.searchType === searchType
            )
        ),
      ].slice(0, 10); // Keep last 10 searches

      setSearchHistory(updatedHistory);
      setTotalSearches((prev) => prev + 1);

      // Persist to localStorage
      localStorage.setItem(
        "bookfinder-search-history",
        JSON.stringify(updatedHistory)
      );
      localStorage.setItem(
        "bookfinder-search-count",
        (totalSearches + 1).toString()
      );

      // Analytics logging
      console.log(`✅ Search completed: ${results.length} books found`);
    } catch (error) {
      setBooks([]);
      setError(`Failed to search books: ${error.message}`);
      console.error("❌ Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    console.log(`📖 Selected book: ${book.title}`);
  };

  const handleModalClose = () => {
    setSelectedBook(null);
  };

  const handleClearError = () => {
    setError(null);
  };

  const stats = {
    totalBooks: books.length,
    ebooksCount: books.filter((book) => book.hasEbook).length,
    recentBooks: books.filter((book) => {
      const year = parseInt(book.year);
      return !isNaN(year) && year >= 2015;
    }).length,
  };

  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          padding: "40px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.3"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              marginBottom: "12px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            📚 BookFinder for Alex
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "300",
              opacity: 0.95,
              marginBottom: "16px",
            }}
          >
            Your Academic Research Companion
          </p>
          <div
            style={{
              fontSize: "14px",
              opacity: 0.8,
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <span>🎓 Perfect for Students</span>
            <span>📖 20+ Million Books</span>
            <span>💻 Free eBooks Available</span>
            <span>🔍 {totalSearches} Searches Made</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}
      >
        {/* Search Section */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          searchHistory={searchHistory}
        />

        {/* Error Display */}
        {error && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px 20px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              color: "#dc2626",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <p style={{ margin: 0, fontWeight: "500" }}>{error}</p>
              </div>
              <button
                onClick={handleClearError}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search Results Stats */}
        {books.length > 0 && !loading && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px 20px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Search Results for Alex
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                Academic books and research materials ready for your studies
              </p>
            </div>
            <div style={{ display: "flex", gap: "24px", fontSize: "14px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#3b82f6",
                  }}
                >
                  {stats.totalBooks}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>
                  Total Books
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  {stats.ebooksCount}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>eBooks</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#f59e0b",
                  }}
                >
                  {stats.recentBooks}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>
                  Recent (2015+)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="results-section">
          <BookList
            books={books}
            loading={loading}
            onBookSelect={handleBookSelect}
          />
        </div>

        {/* Welcome Message (when no search performed) */}
        {books.length === 0 && !loading && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎓</div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Welcome to Your Academic Journey, Alex!
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                marginBottom: "32px",
                maxWidth: "600px",
                margin: "0 auto 32px",
                lineHeight: "1.6",
              }}
            >
              Start exploring millions of books, research papers, and academic
              resources. Use the search bar above to find exactly what you need
              for your studies and assignments.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {[
                {
                  icon: "🔍",
                  title: "Smart Search",
                  desc: "Find books by title, author, subject, or ISBN",
                },
                {
                  icon: "📚",
                  title: "Academic Focus",
                  desc: "Curated results perfect for student research",
                },
                {
                  icon: "💻",
                  title: "Free eBooks",
                  desc: "Access thousands of free digital books",
                },
                {
                  icon: "🎯",
                  title: "Relevant Results",
                  desc: "AI-powered relevance scoring for better matches",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: "24px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "4px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={handleModalClose} />
      )}

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#1f2937",
          color: "#ffffff",
          padding: "40px 20px",
          marginTop: "60px",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              📚 BookFinder for Alex
            </h3>
            <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
              Empowering students with access to knowledge
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "32px",
              flexWrap: "wrap",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#d1d5db",
            }}
          >
            <span>Powered by Open Library API</span>
            <span>•</span>
            <span>Built for Academic Excellence</span>
            <span>•</span>
            <span>Free & Open Source</span>
          </div>

          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            © 2025 BookFinder. Made with ❤️ for students everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
