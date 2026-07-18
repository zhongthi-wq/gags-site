# gags.gg — profile site (Grow a Garden 2 style)

Trang hồ sơ kiểu gag.gg. URL dạng `/u/<robloxUsername>` tự tra tên + avatar thật từ Roblox.

## Cấu trúc
```
gags-site/
├── index.html        # trang (UI + day/night + đọc /u/<username>)
├── api/u.js          # serverless: username Roblox -> id, displayName, avatar
└── vercel.json       # rewrite /u/:username -> /index.html
```

## Chạy thử ở máy
```bash
npm i -g vercel
cd gags-site
vercel dev           # mở http://localhost:3000/u/ItsLossi
```

## Deploy lên Vercel

**Cách A — CLI (nhanh nhất):**
```bash
npm i -g vercel
cd gags-site
vercel          # đăng nhập, tạo project (chọn mặc định hết)
vercel --prod   # lên production, in ra link <project>.vercel.app
```

**Cách B — GitHub:**
1. Đẩy thư mục `gags-site` lên 1 repo GitHub.
2. Vào https://vercel.com → **Add New → Project** → import repo đó.
3. Framework Preset: **Other**. Nếu repo có nhiều thư mục, đặt **Root Directory = gags-site**. Deploy.

→ Sau khi xong: `https://<project>.vercel.app/u/ItsLossi`

## Gắn domain gags.gg
1. Vercel → Project → **Settings → Domains → Add** → nhập `gags.gg` (và `www.gags.gg` nếu muốn).
2. Vercel hiện bản ghi DNS cần thêm. Vào nơi mua domain, set theo đúng đó:
   - Domain gốc: **A record** `@ → 76.76.21.21`
   - hoặc đổi **Nameservers** sang của Vercel (cách này Vercel tự lo hết).
3. Chờ vài phút (có khi tới 24–48h) cho DNS lan. Xong: `https://gags.gg/u/ItsLossi`.

## Tùy chỉnh
- Sửa dữ liệu mặc định: mở `index.html`, khối `window.PROFILE`.
- Khác data theo từng user: thêm vào `window.PROFILE_OVERRIDES`, ví dụ:
  ```js
  window.PROFILE_OVERRIDES = {
    "itslossi": { tiktok: "https://www.tiktok.com/@itslossi", carrots: 20, title: "Expert Gardener" }
  };
  ```
- Huy hiệu & huy chương riêng theo user: thêm `badges` / `medals` vào override.
  - `badges: [{ rarity, icon, label, title }]` — rarity: `legendary | epic | rare | common | tiktok`.
  - `medals: ["gold","opal","emerald","bronze"]` — chọn/sắp xếp tuỳ ý.
- URL đẹp: thêm alias vào `window.PROFILE_ALIASES`, ví dụ `"gobi": "nhyva6"` → mở tại `/u/gobi`.
- `tên + avatar` của mỗi `/u/<username>` được `/api/u` tra tự động từ Roblox (không cần khai báo).

## Ghi chú
- Day/night đồng bộ qua `https://gag.gg/api/time` (API này bật CORS nên chạy được trên mọi domain). Nếu muốn tự chủ, đổi sang API time của bạn.
- `/api/u` chạy server-side nên không dính CORS và không phụ thuộc proxy. Nếu deploy kiểu static thuần (không có serverless), trang vẫn fallback sang `roproxy.com` ở client.
