import React, { useState } from "react";

const BookItem = ({ book, onClick, viewMode = "grid" }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatSubjects = (subjects) => {
    return subjects.map(
      (subject) =>
        subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase()
    );
  };

  const getYearDisplay = (year) => {
    if (year === "N/A") return "Year Unknown";
    const currentYear = new Date().getFullYear();
    const bookYear = parseInt(year);
    if (currentYear - bookYear < 5) return `${year} 🆕`;
    if (bookYear < 1950) return `${year} 📚`;
    return year;
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: viewMode === "grid" ? "20px" : "16px",
    cursor: "pointer",
    boxShadow: isHovered
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.3s ease",
    height: viewMode === "grid" ? "auto" : "auto",
    display: "flex",
    flexDirection: viewMode === "grid" ? "column" : "row",
    gap: viewMode === "grid" ? "16px" : "20px",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      className="book-item"
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {book.hasEbook && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "#10b981",
            color: "#ffffff",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "600",
            zIndex: 10,
          }}
        >
          📱 eBook
        </div>
      )}

      {/* Book Cover Section */}
      <div
        className="book-cover-section"
        style={{
          minWidth: viewMode === "grid" ? "auto" : "120px",
          textAlign: viewMode === "grid" ? "center" : "left",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: viewMode === "grid" ? "160px" : "100px",
            height: viewMode === "grid" ? "240px" : "150px",
            margin: "0 auto",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          {book.cover && !imageError ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              onError={handleImageError}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #e2e8f0",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  fontSize: viewMode === "grid" ? "40px" : "32px",
                  marginBottom: "8px",
                }}
              >
                📚
              </div>
              <div
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  padding: "0 8px",
                }}
              >
                No Cover Available
              </div>
            </div>
          )}

          {/* Edition Count Badge */}
          {book.editionCount > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#ffffff",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "500",
              }}
            >
              {book.editionCount} editions
            </div>
          )}
        </div>
      </div>

      {/* Book Information Section */}
      <div
        className="book-info-section"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: viewMode === "grid" ? "200px" : "auto",
        }}
      >
        {/* Title and Author */}
        <div>
          <h3
            style={{
              fontSize: viewMode === "grid" ? "18px" : "16px",
              fontWeight: "700",
              color: "#1f2937",
              lineHeight: "1.4",
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: viewMode === "grid" ? 3 : 2,
              WebkitBoxOrient: "vertical",
              transition: "color 0.3s ease",
            }}
          >
            {book.title}
          </h3>

          <div style={{ marginBottom: "12px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              ✍️ {book.author}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              📅 {getYearDisplay(book.year)}
            </p>
          </div>

          {/* Description */}
          {book.description &&
            book.description !== "No description available" && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                  marginBottom: "12px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: viewMode === "grid" ? 3 : 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {book.description}
              </p>
            )}
        </div>

        {/* Subjects Tags */}
        {book.subjects.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {formatSubjects(book.subjects)
                .slice(0, viewMode === "grid" ? 3 : 2)
                .map((subject, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#eff6ff",
                      color: "#1e40af",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontWeight: "500",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    🎓 {subject}
                  </span>
                ))}
              {book.subjects.length > (viewMode === "grid" ? 3 : 2) && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    padding: "4px 8px",
                  }}
                >
                  +{book.subjects.length - (viewMode === "grid" ? 3 : 2)} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "12px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Academic Relevance Score */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Academic:
              </span>
              <div style={{ display: "flex" }}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color:
                        i <
                        (book.subjects.length > 0
                          ? Math.min(book.subjects.length, 5)
                          : 3)
                          ? "#fbbf24"
                          : "#e5e7eb",
                      fontSize: "12px",
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button
            style={{
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            📖 View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
