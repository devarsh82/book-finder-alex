import React, { useState, useMemo } from "react";
import BookItem from "./BookItem";

const BookList = ({ books, loading, onBookSelect }) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const sortOptions = [
    { value: "relevance", label: "🎯 Most Relevant" },
    { value: "year_desc", label: "📅 Newest First" },
    { value: "year_asc", label: "📜 Oldest First" },
    { value: "title", label: "🔤 Title A-Z" },
    { value: "author", label: "✍️ Author A-Z" },
  ];

  const filterOptions = [
    { value: "all", label: "📚 All Books" },
    { value: "ebook", label: "💻 eBooks Only" },
    { value: "recent", label: "🆕 Recent (2010+)" },
    { value: "classic", label: "📖 Classics (Before 2000)" },
  ];

  const sortedAndFilteredBooks = useMemo(() => {
    let filtered = [...books];

    // Filter books based on selected filter
    switch (filterBy) {
      case "ebook":
        filtered = filtered.filter((book) => book.hasEbook);
        break;
      case "recent":
        filtered = filtered.filter(
          (book) => book.year !== "N/A" && parseInt(book.year) >= 2010
        );
        break;
      case "classic":
        filtered = filtered.filter(
          (book) => book.year !== "N/A" && parseInt(book.year) < 2000
        );
        break;
      default:
        break;
    }

    // Sort books based on selected sort option
    switch (sortBy) {
      case "year_desc":
        filtered.sort((a, b) => {
          const aYear = a.year === "N/A" ? 0 : parseInt(a.year);
          const bYear = b.year === "N/A" ? 0 : parseInt(b.year);
          return bYear - aYear;
        });
        break;
      case "year_asc":
        filtered.sort((a, b) => {
          const aYear = a.year === "N/A" ? 9999 : parseInt(a.year);
          const bYear = b.year === "N/A" ? 9999 : parseInt(b.year);
          return aYear - bYear;
        });
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      default:
        break;
    }

    return filtered;
  }, [books, sortBy, filterBy]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e5eaf3",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h3 style={{ fontSize: "20px", color: "#1f2937", marginBottom: "8px" }}>
          🔍 Searching books...
        </h3>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Finding relevant academic books for you...
        </p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "2px dashed #cbd5e1",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h3 style={{ fontSize: "24px", color: "#1e293b", marginBottom: "8px" }}>
          No books found
        </h3>
        <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "16px" }}>
          Try adjusting search terms or explore related topics.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Header Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0",
            }}
          >
            📚 Results ({sortedAndFilteredBooks.length} of {books.length})
          </p>
          <p style={{ fontSize: "14px", color: "#6b728b", margin: "4px 0 0" }}>
            Perfect picks for your academic research
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {/* Sorting */}
          <div>
            <label
              htmlFor="sort"
              style={{
                marginRight: "6px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                color: "#374151",
              }}
            >
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtering */}
          <div>
            <label
              htmlFor="filter"
              style={{
                marginRight: "6px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Filter:
            </label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                color: "#374151",
              }}
            >
              {filterOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book grid or list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {sortedAndFilteredBooks.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onClick={() => onBookSelect(book)}
          />
        ))}
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

export default BookList;
