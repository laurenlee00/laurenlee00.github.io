// Serves a Things list only to visitors who send a matching password.
// Each list has its own password, kept in a Vercel environment variable,
// so no password ever appears in the page source:
//   THINGS_PASSWORD   → THINGS        (the main list)
//   THINGS_PASSWORD_2 → SECOND_LIST   (the separate list)
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

// ── Second list — add new items at the TOP (same format as above) ──
const SECOND_LIST = [
];

// Which password opens which list.
const LISTS = [
  { envVar: "THINGS_PASSWORD", items: THINGS },
  { envVar: "THINGS_PASSWORD_2", items: SECOND_LIST },
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

  const given = (req.body && req.body.password) || "";
  let found = null;
  let anyConfigured = false;
  // Check every list (no early exit) so the response time doesn't hint at which matched.
  for (const list of LISTS) {
    const expected = process.env[list.envVar];
    if (!expected) continue;
    anyConfigured = true;
    if (matches(given, expected) && !found) found = list.items;
  }

  if (!anyConfigured) {
    return res.status(500).json({ error: "no Things password is set" });
  }
  if (!found) {
    return res.status(401).json({ error: "wrong password" });
  }
  return res.status(200).json({ things: found });
};
