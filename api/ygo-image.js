// Serves a Yu-Gi-Oh! card image from YGOPRODeck with CORS headers, so the
// Art swap tab can draw it on a canvas and export the result.
module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || "");
  if (!/^\d{1,10}$/.test(id)) { res.statusCode = 400; res.end("Bad card id"); return; }
  try {
    const r = await fetch("https://images.ygoprodeck.com/images/cards/" + id + ".jpg");
    if (!r.ok) { res.statusCode = r.status; res.end("Card image not found"); return; }
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(buf);
  } catch (e) {
    res.statusCode = 502; res.end("Could not reach YGOPRODeck");
  }
};
