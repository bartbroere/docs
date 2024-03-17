const IS_DEV = process.env.NODE_ENV === "development";

// IMPORTANT: Keep this in sync with netlify.toml
// prettier-ignore
const CSP_HEADER = [
  "upgrade-insecure-requests;",
  "frame-ancestors",
    "'self'",
  ";",
  "frame-src",
    "https:",
  ";",
  "connect-src",
    "'self'",
    "https://*.streamlit.app/",
    "wss://*.streamlit.app/",
    "https://streamlit.ghost.io/ghost/api/", // Blog API
    "https://api.segment.io/", // Analytics
    "https://cdn.segment.com/", // Analytics
    "https://*.auryc.com/", // Analytics (Heap)
    "https://www.google-analytics.com/", // Analytics
    "https://stats.g.doubleclick.net/", // Analytics
    "https://*.algolia.net/", // Search
    "https://*.algolianet.com/", // Search
  ";",
  "default-src 'none';",
  "font-src 'self';",
  "form-action 'self';",
  "img-src",
    "'self'",
    "data:",
    "https:",
  ";",
  "media-src",
    "'self'",
    "https://s3-us-west-2.amazonaws.com/assets.streamlit.io/", // Videos
  ";",
  "script-src",
    "'self'",
    "'unsafe-inline'", // NextJS payload
    "'unsafe-eval'", // Required for MDXRemote in [...slug].js. Using App Router may fix this.
    "https://cdn.heapanalytics.com/", // Analytics
    "https://cdn.segment.com/", // Analytics
    "https://www.google-analytics.com/", // Analytics
    "https://www.googletagmanager.com/", // Analytics
    "https://identity.netlify.com/", // Netlify dev tools
    "https://netlify-cdp-loader.netlify.app/netlify.js", // Netlify dev tools
    "https://www.youtube.com/iframe_api/", // YouTube Embed
    "https://*.algolia.net/", // Search
    "https://*.algolianet.com/", // Search
  ";",
  "style-src",
    "'self'",
    "'unsafe-inline'", // Twitter CSS
  ";",
  "worker-src",
    "'self'",
    "blob:",
  ";",
];

module.exports = {
  output: "export",

  webpack: (configuration) => {
    // Don't try to polyfill the fs module.
    configuration.resolve.fallback = { fs: false };

    configuration.module.rules.push(
      {
        test: /\.md$/,
        use: "frontmatter-markdown-loader",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"],
      },
    );
    return configuration;
  },

  async exportPathMap(defaultPathMap) {
    return {
      ...defaultPathMap,
    };
  },

  // IMPORTANT: These headers are only useful in Dev,
  // and are otherwise ignored by Netlify!
  //
  // On Netlify, use netlify.toml
  //
  // Please keep the two files in sync.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: CSP_HEADER.join(" "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};
