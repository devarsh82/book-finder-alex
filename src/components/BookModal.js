import React, { useEffect, useRef } from "react";

const BookModal = ({ book, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert(`${type} copied to clipboard!`);
  };

  const generateCitation = (book) => {
    return `${book.author}. (${book.year}). *${book.title}*. Retrieved from ${book.openLibraryUrl}`;
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "8px",
                lineHeight: "1.3",
              }}
            >
              📖 {book.title}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#4b5563",
                fontWeight: "500",
              }}
            >
              by {book.author} • {book.year}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#fecaca";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fee2e2";
              e.target.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(250px, 1fr) 2fr",
              gap: "32px",
              padding: "32px",
            }}
          >
            {/* Left Column - Book Cover & Quick Actions */}
            <div>
              {/* Book Cover */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "200px",
                    height: "300px",
                    margin: "0 auto",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    position: "relative",
                  }}
                >
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                        border: "2px dashed #cbd5e1",
                      }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                        📚
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                          textAlign: "center",
                        }}
                      >
                        No Cover
                        <br />
                        Available
                      </div>
                    </div>
                  )}

                  {/* Edition Badge */}
                  {book.editionCount > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(59, 130, 246, 0.9)",
                        color: "#ffffff",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {book.editionCount} editions
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  📊 Quick Stats
                </h4>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: "1.6",
                  }}
                >
                  <div style={{ marginBottom: "6px" }}>
                    📅 <strong>Published:</strong> {book.year}
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    📚 <strong>Editions:</strong> {book.editionCount}
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    💻 <strong>eBook:</strong>{" "}
                    {book.hasEbook ? "✅ Available" : "❌ Not Available"}
                  </div>
                  {book.isbn && (
                    <div>
                      🔢 <strong>ISBN:</strong> {book.isbn}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <a
                  href={book.openLibraryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#3b82f6")
                  }
                >
                  🌐 View on Open Library
                </a>

                {book.hasEbook && (
                  <a
                    href={`${book.openLibraryUrl}#borrow`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      backgroundColor: "#10b981",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#059669")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#10b981")
                    }
                  >
                    📱 Read eBook
                  </a>
                )}

                <button
                  onClick={() =>
                    copyToClipboard(generateCitation(book), "Citation")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e5e7eb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f3f4f6")
                  }
                >
                  📋 Copy Citation
                </button>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div>
              {/* Description */}
              <div style={{ marginBottom: "32px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📝 Description
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "#4b5563",
                  }}
                >
                  {book.description ||
                    "No description available for this book. This is a great opportunity for Alex to explore the content and discover new knowledge in this subject area."}
                </p>
              </div>

              {/* Subjects */}
              {book.subjects.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    🎓 Academic Subjects
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {book.subjects.map((subject, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: "13px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontWeight: "500",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Tips for Alex */}
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#92400e",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💡 Study Tips for Alex
                </h4>
                <ul
                  style={{
                    fontSize: "14px",
                    color: "#78350f",
                    lineHeight: "1.6",
                    margin: "0",
                    paddingLeft: "16px",
                  }}
                >
                  <li>
                    Use this book for research and assignments in{" "}
                    {book.subjects[0] || "your field of study"}
                  </li>
                  <li>Take notes on key concepts and create mind maps</li>
                  <li>
                    Look for related books in the same subjects for deeper
                    understanding
                  </li>
                  {book.hasEbook && (
                    <li>
                      Download the eBook for easy access during study sessions
                    </li>
                  )}
                </ul>
              </div>

              {/* Citation Box */}
              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "8px",
                  }}
                >
                  📚 Academic Citation (APA Style)
                </h4>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#475569",
                    fontFamily: "monospace",
                    backgroundColor: "#ffffff",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {generateCitation(book)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
