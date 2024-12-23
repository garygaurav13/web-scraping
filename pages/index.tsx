import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const scrapeWebsite = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");
    setLinks([]);
    setLoading(true);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setLinks(data.links);
      } else {
        setError(data.error || "An unexpected error occurred.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Web Scraper Tool</h1>
      <p>Enter a URL to scrape the links from the page:</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={scrapeWebsite}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Scraping..." : "Scrape"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {links.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Scraped Links</h2>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
