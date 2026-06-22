// Vercel Serverless Function: /api/u?username=<robloxUsername>
// Tra cứu username Roblox -> { found, id, name, displayName, avatar }
// Chạy server-side nên KHÔNG dính CORS và không phụ thuộc proxy bên thứ ba.
export default async function handler(req, res) {
  const username = String((req.query && req.query.username) || "").trim();
  if (!username) return res.status(400).json({ error: "username required" });

  try {
    // 1) username -> user id + display name
    const ur = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    const uj = await ur.json();
    const u = uj && uj.data && uj.data[0];
    if (!u) {
      res.setHeader("cache-control", "public, s-maxage=300");
      return res.status(200).json({ found: false });
    }

    // 2) user id -> avatar headshot
    let avatar = null;
    try {
      const tr = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${u.id}&size=420x420&format=Png&isCircular=false`
      );
      const tj = await tr.json();
      avatar = (tj && tj.data && tj.data[0] && tj.data[0].imageUrl) || null;
    } catch (_) {}

    // Cache ở edge 1h, phục vụ bản cũ trong lúc revalidate
    res.setHeader("cache-control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      found: true,
      id: u.id,
      name: u.name,
      displayName: u.displayName,
      verified: !!u.hasVerifiedBadge,
      avatar,
    });
  } catch (e) {
    return res.status(502).json({ error: "roblox lookup failed" });
  }
}
