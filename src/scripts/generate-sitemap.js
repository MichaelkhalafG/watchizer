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

const formattedRoutes = routes.map(route => route.replace(/:\w+/g, ""));

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

const outputPath = path.join(__dirname, "public", "sitemap.xml");

if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"));
}

fs.writeFileSync(outputPath, sitemapContent.trim(), "utf8");
