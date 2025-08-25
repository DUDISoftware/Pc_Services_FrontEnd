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

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/docs/app)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/), CSS Modules / Styled Components
- **Linting:** [ESLint](https://eslint.org/)
- **Build tool:** [PostCSS](https://postcss.org/)

---

## ⚙️ Installation & Run

### 🔽 Clone repository
```bash
git clone https://github.com/your-username/PC_Services_Frontend.git
cd PC_Services_Frontend/frontend
```

### 📥 Install dependencies
```bash
npm install
```

### 🚀 Run development server
```bash
npm run dev
```

Mở trình duyệt và truy cập tại: 👉 http://localhost:3000

---

## 📦 Available Scripts

| Script          | Mục đích                                |
|-----------------|-----------------------------------------|
| `npm run dev`   | 🚀 Chạy development server               |
| `npm run build` | 🏗️ Build ứng dụng cho production         |
| `npm run start` | 🌐 Chạy server ở chế độ production       |
| `npm run lint`  | ✅ Kiểm tra code với ESLint              |

---

## 📏 Code Convention

- 📘 **Ngôn ngữ**: Toàn bộ dự án sử dụng TypeScript  
- 🧹 **Linting**: Tuân thủ ESLint rules  
- 🏗️ **Đặt tên**:  
  - Component → PascalCase  
  - Utils & Hooks → camelCase  
  - Styles → đặt cùng component hoặc trong thư mục `styles/`  
