# 📝 InkFlow — Advanced Blog System

A full-stack blog platform demonstrating core Web Engineering principles.

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router v6, Axios, date-fns      |
| Backend    | Node.js, Express.js (MVC pattern)               |
| Database   | MongoDB + Mongoose ODM                          |
| Auth       | JWT (jsonwebtoken) + bcryptjs                   |
| Security   | Helmet, CORS, express-rate-limit, express-validator |

---

## 📁 Project Structure

```
blog-app/
├── backend/
│   ├── controllers/        ← MVC Controllers (business logic)
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── userController.js
│   │   └── categoryController.js
│   ├── middleware/
│   │   ├── auth.js         ← JWT protect / authorize / optionalAuth
│   │   └── errorHandler.js ← Global error handler
│   ├── models/             ← Mongoose schemas (MVC Models)
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Category.js
│   ├── routes/             ← Express routers
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── users.js
│   │   └── categories.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── Sidebar.js   ← Persistent sidebar navigation
        │   ├── Topbar.js    ← Top search bar + write button
        │   └── PostCard.js  ← Reusable post preview card
        ├── context/
        │   └── AuthContext.js  ← Global auth state (React Context)
        ├── pages/           ← 15 pages
        │   ├── HomePage.js        (hero + featured + recent)
        │   ├── BlogListPage.js    (search, filter, paginate)
        │   ├── BlogPostPage.js    (full post + comments)
        │   ├── CategoriesPage.js  (browse all categories)
        │   ├── CreatePostPage.js  (write new post)
        │   ├── EditPostPage.js    (edit existing post)
        │   ├── MyPostsPage.js     (author's post table)
        │   ├── ProfilePage.js     (public user profile)
        │   ├── SavedPage.js       (bookmarked posts)
        │   ├── DashboardPage.js   (admin panel)
        │   ├── SettingsPage.js    (profile + password)
        │   ├── AboutPage.js       (project info)
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   └── NotFoundPage.js
        ├── utils/api.js     ← Axios client with JWT interceptors
        ├── App.js           ← Router + layout shell
        ├── index.js
        └── index.css        ← Full light-theme CSS (no framework)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+  
- **MongoDB** — local (`mongodb://localhost:27017`) or [MongoDB Atlas](https://www.mongodb.com/atlas)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inkflow
JWT_SECRET=pick_a_long_random_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the API server:
```bash
npm run dev       # development with auto-reload
npm start         # production
```
→ API runs at **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```
→ App runs at **http://localhost:3000**  
The React proxy setting automatically forwards `/api` calls to port 5000.

---

### 3. First Steps

1. Register an account at `/register`
2. In MongoDB (or Atlas UI), find your user and change `role` to `"admin"`
3. Reload the app — you now have access to Dashboard and can promote other users
4. Create categories in the Dashboard, then write posts with `+ Write`

---

## 🔌 API Endpoints (22 total)

### Auth — `/api/auth`
| Method | Endpoint           | Auth     | Description          |
|--------|--------------------|----------|----------------------|
| POST   | `/register`        | Public   | Register user        |
| POST   | `/login`           | Public   | Login, get JWT       |
| GET    | `/me`              | 🔒 User  | Get current user     |
| PUT    | `/update-profile`  | 🔒 User  | Update profile       |
| PUT    | `/change-password` | 🔒 User  | Change password      |

### Posts — `/api/posts`
| Method | Endpoint       | Auth          | Description                   |
|--------|----------------|---------------|-------------------------------|
| GET    | `/`            | Public        | List + filter + paginate      |
| GET    | `/my-posts`    | 🔒 Author     | Author's own posts            |
| GET    | `/stats`       | 🔒 Admin      | Analytics + top posts         |
| GET    | `/id/:id`      | Public        | Get post by MongoDB ID        |
| GET    | `/:slug`       | Public        | Get post by slug              |
| POST   | `/`            | 🔒 Author     | Create post                   |
| PUT    | `/:id`         | 🔒 Owner      | Update post                   |
| DELETE | `/:id`         | 🔒 Owner      | Delete post + comments        |
| POST   | `/:id/like`    | 🔒 User       | Toggle like                   |
| POST   | `/:id/save`    | 🔒 User       | Toggle save to reading list   |

### Comments — `/api/comments`
| Method | Endpoint        | Auth     | Description           |
|--------|-----------------|----------|-----------------------|
| GET    | `/post/:postId` | Public   | Get post comments     |
| POST   | `/`             | 🔒 User  | Add comment / reply   |
| PUT    | `/:id`          | 🔒 Owner | Edit comment          |
| DELETE | `/:id`          | 🔒 Owner | Delete comment        |

### Categories — `/api/categories`
| Method | Endpoint | Auth     | Description   |
|--------|----------|----------|---------------|
| GET    | `/`      | Public   | List all      |
| POST   | `/`      | 🔒 Admin | Create        |
| PUT    | `/:id`   | 🔒 Admin | Update        |
| DELETE | `/:id`   | 🔒 Admin | Delete        |

### Users — `/api/users`
| Method | Endpoint       | Auth     | Description     |
|--------|----------------|----------|-----------------|
| GET    | `/`            | 🔒 Admin | List all users  |
| GET    | `/:username`   | Public   | User profile    |
| PUT    | `/:id/role`    | 🔒 Admin | Update role     |
| DELETE | `/:id`         | 🔒 Admin | Delete user     |

---

## 🏗 Concepts Demonstrated

| Concept                  | Implementation                                         |
|--------------------------|--------------------------------------------------------|
| **HTTP Protocol**        | GET/POST/PUT/DELETE verbs with proper status codes     |
| **RESTful API**          | Resource-based URLs, stateless, consistent JSON format |
| **Client-Server Arch**   | React SPA ↔ Express REST API over HTTP                |
| **MVC Pattern**          | Models (Mongoose), Views (React), Controllers (Express)|
| **Async Programming**    | async/await, Promise.all, non-blocking Node.js I/O    |
| **JWT Auth**             | Stateless tokens, protected routes, role-based access  |
| **Error Handling**       | Global middleware catching Mongoose, JWT, custom errors|
| **Input Validation**     | express-validator on auth routes, Mongoose schema rules|

---

## 🐛 Bugs Fixed vs Previous Version

1. **Edit page broken** — Added dedicated `GET /api/posts/id/:id` route (fetches by `_id`, not slug)
2. **Route ordering conflict** — Static routes (`/my-posts`, `/stats`) now defined before `/:slug`
3. **Tags not saved** — Tags are now split server-side from comma-separated string
4. **Save toggle broken** — Fixed ObjectId comparison using `indexOf` → `splice`
5. **likeCount missing on list** — Added `.lean({ virtuals: true })` to all list queries
6. **Navigation** — Replaced top navbar with persistent sidebar + breadcrumbs + tab bars
7. **Theme** — Full light theme, no dark mode variables, clean card-based layout

---

## ✨ Possible Improvements

1. **Rich Text Editor** — TipTap or Quill instead of raw HTML textarea
2. **Image Uploads** — Multer + Cloudinary for real cover photos
3. **Email Notifications** — Nodemailer for comment alerts and password reset
4. **Real-time Comments** — Socket.io for live updates
5. **Redis Cache** — Cache popular posts and category counts
6. **Full-text Search** — Upgrade to Algolia or Elasticsearch
7. **Infinite Scroll** — Replace pagination with intersection observer
8. **Post Scheduling** — Schedule future publish dates
9. **Social Auth** — Google / GitHub OAuth via Passport.js
10. **Docker** — docker-compose for one-command setup
11. **Tests** — Jest + Supertest (backend), React Testing Library (frontend)
12. **CI/CD** — GitHub Actions for automated lint + test + deploy
