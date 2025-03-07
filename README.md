# Luxury Blog Application (Vue 3 + Vuetify 3 + Pinia + Supabase)

## Overview
Luxury Blog is a **modern, elegant blogging platform** built with:
- **Vue 3 + Composition API**
- **Vuetify 3** (Material Design 3 UI Framework)
- **Pinia** (State Management)
- **Supabase** (Backend Database & Authentication)

This app allows users to:
**Create, Read, Update, and Delete (CRUD) blog posts**  
**Authenticate with Supabase (Login, Signup, Logout)**  
**Switch between List and Card view for posts**  
**Paginate through blog posts for better performance**  
**Persist user authentication state and UI preferences**  

---

## Installation

### Clone the Repository
```sh
git clone https://github.com/your-repo/luxury-blog.git
cd luxury-blog
```

### Install Dependencies
```sh
npm install
```

**Table Name:** `blogs`  
| Column  | Type          | Default |
|---------|--------------|---------|
| `id`    | `uuid`       | `gen_random_uuid()` (Primary Key) |
| `title` | `text`       |         |
| `text`  | `text`       |         |
| `author` | `text`      |         |
| `date`  | `timestamptz` | `now()` |

### Configure Environment Variables
Create a `.env` file and add:
```sh
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the Development Server
```sh
npm run dev
```

---

## Features & UI

### **Authentication**
- User Signup & Login via Supabase
- Auto-login after signup (no email confirmation required)
- Logout functionality

### **Blog Management (CRUD)**
- **Create new blog posts** with title, content, and author
- **Read all blog posts** dynamically from Supabase
- **Edit existing posts**
- **Delete posts** with confirmation

### **UI Enhancements**
- **Switchable List & Card View**
- **Pagination for better performance**
- **Elegant, luxury-themed design (Dark Mode)**
- **Persistent user session & preferences**

---

## Project Structure

```sh
src/
 ├── layouts/           # Main layout (default.vue)
 ├── pages/             # Page components
 │    ├── index.vue       # Home (Blog List)
 │    ├── auth.vue        # Authentication (Login/Signup)
 │    ├── create.vue      # Create New Post
 │    ├── edit/[id].vue   # Edit Post Page
 ├── stores/           # Pinia Stores
 │    ├── authStore.ts    # User authentication store
 │    ├── blogStore.ts    # Blog management store
 ├── plugins/          # Plugins (Supabase, Vuetify)
 │    ├── supabase.ts     # Supabase Client
 │    ├── vuetify.ts      # Vuetify Config
 ├── components/       # Reusable Components
 ├── App.vue              # Root Vue Component
 ├── main.ts              # App Entry Point
 ├── vite.config.ts       # Vite Configuration
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3**  | Frontend Framework |
| **Vuetify 3** | UI Components & Styling |
| **Pinia** | State Management |
| **Supabase** | Backend Database & Authentication |
| **Vite** | Build Tool |

---
