const BASE_URL = "https://openlibrary.org/search.json";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache for API responses
const cache = new Map();

const getCacheKey = (query, searchType) =>
  `${searchType}:${query.toLowerCase()}`;

const isValidCacheEntry = (entry) => {
  return entry && Date.now() - entry.timestamp < CACHE_DURATION;
};

export const searchBooks = async (query, searchType = "general") => {
  const cacheKey = getCacheKey(query, searchType);

  // Check cache first
  const cachedResult = cache.get(cacheKey);
  if (isValidCacheEntry(cachedResult)) {
    return cachedResult.data;
  }

  try {
    let searchParam = "q";

    // Handle different search types optimized for Alex's academic needs
    switch (searchType) {
      case "title":
        searchParam = "title";
        break;
      case "author":
        searchParam = "author";
        break;
      case "subject":
        searchParam = "subject";
        break;
      case "isbn":
        searchParam = "isbn";
        break;
      default:
        searchParam = "q"; // General search
    }

    const url = `${BASE_URL}?${searchParam}=${encodeURIComponent(
      query
    )}&limit=24&fields=key,title,author_name,first_publish_year,cover_i,subject,first_sentence,edition_count,ebook_access,has_fulltext,isbn,publisher`;

    console.log(`🔍 Searching: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.docs) {
      throw new Error("Invalid response format from Open Library API");
    }

    const normalizedBooks = data.docs
      .map(normalizeBookData)
      .filter((book) => book.title && book.title !== "Unknown Title")
      .slice(0, 20); // Limit to 20 high-quality results

    // Cache the results
    cache.set(cacheKey, {
      data: normalizedBooks,
      timestamp: Date.now(),
    });

    // Clean up old cache entries (simple cleanup)
    if (cache.size > 50) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return normalizedBooks;
  } catch (error) {
    console.error("Search error:", error);
    throw new Error(`Failed to search books: ${error.message}`);
  }
};

// Enhanced normalization with better data cleaning for academic use
const normalizeBookData = (doc) => {
  const book = {
    id: doc.key || `book_${Date.now()}_${Math.random()}`,
    title: cleanTitle(doc.title),
    author: getAuthor(doc.author_name),
    year: getYear(doc.first_publish_year),
    cover: getCoverUrl(doc.cover_i),
    subjects: getSubjects(doc.subject),
    description: getDescription(doc.first_sentence),
    openLibraryUrl: `https://openlibrary.org${doc.key}`,
    editionCount: doc.edition_count || 1,
    hasEbook: Boolean(doc.ebook_access === "public" || doc.has_fulltext),
    isbn: getISBN(doc.isbn),
    publisher: getPublisher(doc.publisher),
    academicRelevance: calculateAcademicRelevance(doc),
  };

  return book;
};

// Helper functions for data cleaning
const cleanTitle = (title) => {
  if (!title) return "Unknown Title";
  return title.trim().replace(/\s+/g, " ");
};

const getAuthor = (authorArray) => {
  if (!authorArray || !Array.isArray(authorArray) || authorArray.length === 0) {
    return "Unknown Author";
  }
  return authorArray[0].trim();
};

const getYear = (year) => {
  if (!year) return "N/A";
  const currentYear = new Date().getFullYear();
  if (year > currentYear) return "N/A";
  if (year < 1000) return "N/A";
  return year.toString();
};

const getCoverUrl = (coverId) => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
};

const getSubjects = (subjectArray) => {
  if (!subjectArray || !Array.isArray(subjectArray)) return [];

  const academicKeywords = [
    "science",
    "mathematics",
    "history",
    "literature",
    "psychology",
    "philosophy",
    "computer",
    "engineering",
    "business",
    "economics",
    "biology",
    "chemistry",
    "physics",
    "sociology",
    "politics",
    "education",
    "research",
    "study",
    "academic",
    "university",
  ];

  const subjects = subjectArray
    .filter((subject) => subject && subject.length > 2 && subject.length < 50)
    .map((subject) => subject.trim().toLowerCase())
    .filter((subject) => !subject.includes("accessible_book"))
    .filter((subject) => !subject.includes("lending_library"))
    .sort((a, b) => {
      const aIsAcademic = academicKeywords.some((keyword) =>
        a.includes(keyword)
      );
      const bIsAcademic = academicKeywords.some((keyword) =>
        b.includes(keyword)
      );
      if (aIsAcademic && !bIsAcademic) return -1;
      if (!aIsAcademic && bIsAcademic) return 1;
      return 0;
    });

  return subjects.slice(0, 5);
};

const getDescription = (firstSentence) => {
  if (
    !firstSentence ||
    !Array.isArray(firstSentence) ||
    firstSentence.length === 0
  ) {
    return "No description available";
  }

  const description = firstSentence[0].trim();
  if (description.length < 10) return "No description available";

  return description.charAt(0).toUpperCase() + description.slice(1);
};

const getISBN = (isbnArray) => {
  if (!isbnArray || !Array.isArray(isbnArray) || isbnArray.length === 0) {
    return null;
  }
  return isbnArray[0];
};

const getPublisher = (publisherArray) => {
  if (
    !publisherArray ||
    !Array.isArray(publisherArray) ||
    publisherArray.length === 0
  ) {
    return "Unknown Publisher";
  }
  return publisherArray[0];
};

const calculateAcademicRelevance = (doc) => {
  let score = 0;

  if (doc.subject && Array.isArray(doc.subject)) {
    const academicSubjects = doc.subject.filter(
      (subject) =>
        subject.toLowerCase().includes("science") ||
        subject.toLowerCase().includes("study") ||
        subject.toLowerCase().includes("research") ||
        subject.toLowerCase().includes("academic")
    );
    score += academicSubjects.length * 2;
  }

  if (doc.first_publish_year) {
    const age = new Date().getFullYear() - doc.first_publish_year;
    if (age < 10) score += 3;
    else if (age < 20) score += 2;
    else if (age < 50) score += 1;
  }

  if (doc.ebook_access === "public" || doc.has_fulltext) {
    score += 5;
  }

  if (doc.edition_count && doc.edition_count > 1) {
    score += Math.min(doc.edition_count, 5);
  }

  return Math.min(score, 20); // Cap score at 20
};

// Clear cache function (useful for development)
export const clearCache = () => {
  cache.clear();
  console.log("🗑️ API cache cleared");
};

// Get cache stats (useful for debugging)
export const getCacheStats = () => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
};
