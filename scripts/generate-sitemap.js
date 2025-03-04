const fs = require("fs");
const path = require("path");

// Base URL of your website
const BASE_URL = "https://www.watchizereg.com";

// Define your static routes
const routes = [
    "/",
    "/products/:id",
    "/product/:name",
    "/offer/:id",
    "/cart",
    "/checkout",
    "/category/:name",
    "/login",
    "/register",
    "/brand/:name",
    "/subtypes/:name",
    "/grade/:name",
    "/offers",
    "/listingsearch",
    "/edit-profile",
    "/Search",
    "/wish-list",
    "/order-list",
    "/blogs",
    "/blog/:name",
    "/404",
];

// Convert dynamic routes to sitemap-friendly format (removing params)
const formattedRoutes = routes.map(route => route.replace(/:\w+/g, ""));

// Generate XML structure
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${formattedRoutes
        .map(route => {
            return `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>${route === "/" ? "1.0" : "0.8"}</priority>
    </url>
  `;
        })
        .join("")}
</urlset>`;

// Define the output path
const outputPath = path.join(__dirname, "public", "sitemap.xml");

// Ensure the "public" directory exists
if (!fs.existsSync(path.join(__dirname, "public"))) {
    fs.mkdirSync(path.join(__dirname, "public"));
}

// Write the sitemap to the public folder
fs.writeFileSync(outputPath, sitemapContent.trim(), "utf8");

// console.log("✅ Sitemap generated successfully!");
