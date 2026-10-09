// Serves the Things list only to visitors who send the right password.
// The password lives in a Vercel environment variable (THINGS_PASSWORD),
// so it never appears in the page source.
const crypto = require("crypto");

// ── Things — add new items at the TOP ──
const THINGS = [
  {
    note: "Terrain's History Museum. How will we increasingly derive value from things with distinct physicality? (September 2026).",
    url: "https://www.terrain.com/history"
  },
  {
    note: "The Simulation Company's Series B announcement. Brand identity reveal with new logo and website ft. BTF “Sims” game (July 2026).",
    url: "https://www.simile.com/"
  },
  {
    note: "Granola gifts “beautifully designed spoons”. Spoon from British industrial designer David Mellor's penultimate collection. (April 2026).",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7445767982384992257/"
  },
];

function matches(given, expected) {
  // Compare hashes so the check takes the same time whatever is typed.
  const a = crypto.createHash("sha256").update(String(given)).digest();
  const b = crypto.createHash("sha256").update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const expected = process.env.THINGS_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: "THINGS_PASSWORD is not set" });
  }

  const given = (req.body && req.body.password) || "";
  if (!matches(given, expected)) {
    return res.status(401).json({ error: "wrong password" });
  }

  return res.status(200).json({ things: THINGS });
};
