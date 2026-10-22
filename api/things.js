// Serves a Things list only to visitors who send a matching password.
// Each list has its own password, kept in a Vercel environment variable,
// so no password ever appears in the page source:
//   THINGS_PASSWORD   → THINGS        (the main list)
//   THINGS_PASSWORD_2 → SECOND_LIST   (the separate list)
const crypto = require("crypto");

// ── Things — add new items at the TOP ──
const THINGS = [
  {
    note: "Mistral launches “Le Chonk” model leaning into a meme from June. (October 2026).",
    url: "https://x.com/MistralAI/status/2107457414387622310"
  },
  {
    note: "Alexandr Wang releases Meta Muse Manifesto on the declaration of “wanting”. 1000s+ of memes to follow. (September 2026).",
    url: "https://x.com/alexandr_wang/status/2103551714536439951"
  },
  {
    note: "Ramp sends a 40\" pair of red-handled scissors to customer originally incorporated as Red Scissor, Inc. (September 2026).",
    url: "https://x.com/sahirjaggi/status/2103541334841962519"
  },
  {
    note: "Dario shares a personal blog post. (September 2026).",
    url: "https://x.com/DarioAmodei/status/2098773920774074715"
  },
  {
    note: "Terrain's History Museum. How will we increasingly derive value from things with distinct physicality? (September 2026).",
    url: "https://www.terrain.com/history"
  },
  {
    note: "The Simulation Company's Series B announcement. Brand identity reveal with new logo and website ft. BTF Smallville game (July 2026).",
    url: "https://www.simile.com/"
  },
  {
    note: "$BIRD stays in the family from Allbirds to Smartbird. (June 2026).",
    url: "https://www.morningbrew.com/stories/allbirds-announces-pivot-ai-after-selling-assets"
  },
  {
    note: "Granola gifts “beautifully designed spoons”. Spoon from British industrial designer David Mellor's penultimate collection. (April 2026).",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7445767982384992257/"
  },
];

// ── Second list — add new items at the TOP (same format as above) ──
const SECOND_LIST = [
  {
    note: "a16z Crypto rebrands and expands to the Frontier. (October 2026).",
    url: "https://x.com/cdixon/status/2113299399254176221"
  },
  {
    note: "Stratechery is, starting from today, presented by Stripe. (October 2026).",
    url: "https://x.com/stratechery/status/2112962641643876475"
  },
  {
    note: "Cognition's team features reminded me of Natural's teammate announcements as personal narrative on motivation. (October 2026).",
    url: "https://www.natural.com/blog"
  },
  {
    note: "Cognition publishes sepia-toned Team Spotlights with insight into company culture. (October 2026).",
    url: "https://cognition.com/team-spotlights"
  },
  {
    note: "Monaco sends $100 bills to prospective clients. (October 2026).",
    url: "https://x.com/shangbingjiang/status/2112318753983574098"
  },
  {
    note: "There's a lot of commentary on Palantir's merch, and I most agree with @fudge. (October 2026).",
    url: "https://x.com/fudgeposting/status/2110391728398037261"
  },
  {
    note: "Flying-car stunt reminds us that Tesla is a frontier business. (October 2026).",
    url: "https://x.com/Tesla/status/2110913438293647789"
  },
  {
    note: "Zuck willingly drinks a Guinness. (October 2026).",
    url: "https://www.youtube.com/watch?v=XfdIhd1g6EI"
  },
  {
    note: "Mercury Books (accounting layer) releases re-designed and re-issued version of Luca Pacioli’s trans. “Particularis de Computis et Scripturis” on double-entry bookkeeping. (October 2026).",
    url: "https://x.com/mercury/status/2110092367076401165"
  },
  {
    note: "World-building with ramp-rider Tony Hawk. (October 2026).",
    url: "https://x.com/eglyman/status/2110429743195586737"
  },
  {
    note: "Baseten fed me an ad on their 8-month old 256-page paperback on inference. (October 2026).",
    url: "https://books.baseten.com/products/inference-engineering"
  },
  {
    note: "Mercury takes over GCS Gallery with collection of founder-selected books. (October 2026).",
    url: "https://x.com/mercury/status/2108230314921451832"
  },
  {
    note: "Jared Kushner responds in blog post to aggregate of fake news. (October 2026).",
    url: "https://jaredkushner.com/posts/new-yorker-response/"
  },
  {
    note: "Drinking the Nous Research kool-aid. (October 2026).",
    url: "https://x.com/NousResearch/status/2108005475895701712"
  },
  {
    note: "Mistral launches “Le Chonk” model leaning into a meme from June. (October 2026).",
    url: "https://x.com/MistralAI/status/2107457414387622310"
  },
  {
    note: "Material Album's User Experience gallery presented by Forerunner. (October 2026).",
    url: "https://userexperience.place/"
  },
  {
    note: "Ghost.ai invites people IRL into their factory and then launches and sells out of first batch in 8 hours. (October 2026).",
    url: "https://x.com/zainmfj/status/2107270812051055001"
  },
  {
    note: "OpenAI introduces another cute, furry agent face. (September 2026).",
    url: "https://openai.com/index/introducing-dots/"
  },
  {
    note: "Alexandr Wang releases Meta Muse Manifesto on the declaration of “wanting”. 1000s+ of memes to follow. (September 2026).",
    url: "https://x.com/alexandr_wang/status/2103551714536439951"
  },
  {
    note: "Ramp sends a 40\" pair of red-handled scissors to customer originally incorporated as Red Scissor, Inc. (September 2026).",
    url: "https://x.com/sahirjaggi/status/2103541334841962519"
  },
  {
    note: "Corridor paints SMB pains with American health insurance in launch video. (September 2026).",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7507831338272743424/"
  },
  {
    note: "Harvey launches first TV commercial and newspaper ad. (September 2026).",
    url: "https://www.youtube.com/watch?v=te-BV-wj6_E"
  },
  {
    note: "Ramp expands to the UK with an apology in the papers. (September 2026).",
    url: "https://x.com/tryramp/status/2099864815933997293"
  },
  {
    note: "Dario shares a personal blog post. (September 2026).",
    url: "https://x.com/DarioAmodei/status/2098773920774074715"
  },
  {
    note: "Duolingo releases NYFW collection with commonly mispronounced luxury fashion brands. (September 2026).",
    url: "https://lnkd.in/p/gW_HVfGh"
  },
  {
    note: "Terrain's History Museum. How will we increasingly derive value from things with distinct physicality? (September 2026).",
    url: "https://www.terrain.com/history"
  },
  {
    note: "Granola launches on Apple Watch with a limited-edition strap by textile artist Nowshin Prenon. (July 2026).",
    url: "https://www.granola.ai/blog/granola-for-apple-watch"
  },
  {
    note: "The Simulation Company's Series B announcement. Brand identity reveal with new logo and website ft. BTF Smallville game (July 2026).",
    url: "https://www.simile.com/"
  },
  {
    note: "Tomo anchors launch in everyday capturing founder's brother in launch video with physical branded merch and Tomosapiens digital world. (June 2026).",
    url: "https://x.com/justoutquan/status/2070175262973862077"
  },
  {
    note: "$BIRD stays in the family from Allbirds to Smartbird. (June 2026).",
    url: "https://www.morningbrew.com/stories/allbirds-announces-pivot-ai-after-selling-assets"
  },
  {
    note: "Spotify started discomorphism and Google followed. (May 2026).",
    url: "https://x.com/ssamat/status/2057831639275983293"
  },
  {
    note: "Granola gifts “beautifully designed spoons”. Spoon from British industrial designer David Mellor's penultimate collection. (April 2026).",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7445767982384992257/"
  },
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
