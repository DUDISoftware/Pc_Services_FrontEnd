# 💻 PC Services Frontend

Dự án **frontend cho dịch vụ PC Services**, được xây dựng với [Next.js](https://nextjs.org) và [TypeScript](https://www.typescriptlang.org/).

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14+-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT" />
</p>

---

## 🚀 Features
- ⚡ Next.js App Router với cấu trúc hiện đại  
- 🛠️ TypeScript toàn dự án  
- 🎨 Quản lý style với CSS Modules & Variables  
- 🔗 Tích hợp Services để gọi API backend  
- 🔐 Middleware hỗ trợ phân quyền User/Admin  

---

## 📂 Project Structure

```text
PC_Services_Frontend/
├── frontend/
│   ├── src/
│   │   ├── app/                 # App Router pages & layouts
│   │   │   ├── user/
│   │   │   │   └── home/
│   │   │   │       └── layout.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Root page
│   │   ├── assets/              # Static assets (images, icons...)
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # Global state (React Context)
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities & helpers
│   │   ├── services/            # API service layer
│   │   ├── styles/              # Global & variables CSS
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   └── middleware.ts        # Auth & permission middleware
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   └── tsconfig.json
└── README.md
```
🛠️ Tech Stack

Framework: Next.js 14+ (App Router)

Language: TypeScript

UI: React, CSS Modules / Styled Components

Linting: ESLint

Build tool: PostCSS

⚙️ Installation & Run

Clone repo:

git clone https://github.com/your-username/PC_Services_Frontend.git
cd PC_Services_Frontend/frontend


Cài dependencies:

npm install


Chạy development server:

npm run dev


Mở trình duyệt tại: http://localhost:3000

📦 Available Scripts

npm run dev → Chạy dev server

npm run build → Build production

npm run start → Chạy production server

npm run lint → Kiểm tra code với ESLint

📏 Code Convention

Sử dụng TypeScript cho toàn bộ dự án

Tuân thủ ESLint rules

Component: PascalCase

Utils & hooks: camelCase