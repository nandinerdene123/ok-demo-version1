# Okay — Next.js + Tailwind CSS

3–5-р ангийн хүүхдэд зориулсан бодлого, урамшуулал болон эцэг эхийн хяналтын responsive prototype.

## Технологи

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4

## Ажиллуулах

Node.js 20.9 буюу түүнээс шинэ хувилбар суулгасан орчинд:

```bash
npm install
npm run dev
```

Дараа нь [http://localhost:3000](http://localhost:3000)-г нээнэ.

Production build шалгах:

```bash
npm run build
npm start
```

Prototype OTP код: `1234`.

## Бүтэц

- `app/` — Next.js App Router entry, metadata, Tailwind theme
- `components/OkayApp.tsx` — auth болон dashboard-ийн React UI/state
- `lib/data.ts` — багц, асуулга, бодлогын өгөгдөл

Root-д байгаа хуучин `index.html`, `app.js`, `*.css` файлууд нь эх хувилбарын reference бөгөөд шинэ Next.js апп тэдгээрийг ашиглахгүй.
