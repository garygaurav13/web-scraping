import puppeteer from "puppeteer";

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  // Validate the URL
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "A valid URL must be provided." });
  }

  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "domcontentloaded", // Wait for initial HTML to load
    });

    // Scrape the links from the page
    const links = await page.evaluate(() => {
      const anchorTags = Array.from(document.querySelectorAll("a"));
      return anchorTags.map((anchor) => anchor.href);
    });

    // Close the browser
    await browser.close();

    // Return the links
    res.status(200).json({ links });
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ error: "Failed to scrape the URL." });
  }
}
