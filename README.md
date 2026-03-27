# Blog.

Blog personal construido con **Next.js 14**, **Tailwind CSS** y **MongoDB**.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS + @tailwindcss/typography
- **Base de datos**: MongoDB + Mongoose
- **Autenticación**: NextAuth.js (credenciales)
- **Despliegue**: Docker (compatible con Coolify)

---

## Estructura del proyecto

```
├── app/
│   ├── (public)/           # Rutas públicas del blog
│   │   ├── page.tsx        # Home — lista de posts
│   │   ├── post/[slug]/    # Detalle de post + comentarios
│   │   ├── category/[slug]/# Posts por categoría
│   │   └── categories/     # Listado de categorías
│   ├── dashboard/          # Panel de administración (protegido)
│   │   ├── page.tsx        # Lista de posts
│   │   ├── new/            # Crear post
│   │   ├── edit/[id]/      # Editar post
│   │   ├── comments/       # Moderar comentarios
│   │   └── categories/     # Gestionar categorías
│   ├── api/                # API Routes
│   │   ├── auth/           # NextAuth
│   │   ├── posts/          # CRUD posts
│   │   ├── comments/       # CRUD + moderación
│   │   └── categories/     # CRUD categorías
│   └── login/              # Página de login
├── components/
│   ├── blog/               # Header, Footer, PostCard, CommentForm
│   └── admin/              # PostEditor
├── lib/
│   ├── mongodb.ts          # Conexión a MongoDB
│   └── models/             # Modelos Mongoose (User, Post, Comment, Category)
├── scripts/
│   └── seed.ts             # Crear primer usuario admin
└── middleware.ts            # Protección de rutas /dashboard
```

---

## Instalación local

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/mi-blog.git
cd mi-blog
npm install
```

### 2. Variables de entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=mongodb://localhost:27017/blog
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<genera con: openssl rand -base64 32>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=contraseña-segura
```

### 3. Crear el primer usuario administrador

```bash
npx tsx scripts/seed.ts
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el blog.  
El panel de administración está en [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

---

## Despliegue en Coolify

### Paso 1 — MongoDB

En Coolify, ve a **Resources → New Resource → Database → MongoDB**.  
Copia la URI de conexión que te genera (formato: `mongodb://user:pass@host:port/blog`).

### Paso 2 — Aplicación Next.js

1. Ve a **Resources → New Resource → Application → GitHub**
2. Selecciona este repositorio
3. Coolify detectará el `Dockerfile` automáticamente
4. En **Environment Variables** añade:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | URI de tu MongoDB en Coolify |
| `NEXTAUTH_URL` | `https://tu-dominio.com` |
| `NEXTAUTH_SECRET` | Secreto generado con `openssl rand -base64 32` |

5. Haz clic en **Deploy**

### Paso 3 — Crear admin en producción

Desde tu VPS (o con las variables de entorno de producción):

```bash
MONGODB_URI=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed.ts
```

### Paso 4 — Dominio y SSL

En Coolify, en la configuración de la aplicación, añade tu dominio.  
Coolify gestiona el certificado SSL automáticamente con Let's Encrypt.

---

## Funcionalidades

- ✅ Listado de posts con paginación
- ✅ Detalle de post con tiempo de lectura
- ✅ Sistema de categorías con filtrado
- ✅ Comentarios con moderación
- ✅ Panel de administración protegido
- ✅ Crear / editar / borrar posts (con HTML)
- ✅ Autenticación con email y contraseña
- ✅ SEO con metadatos dinámicos
- ✅ Diseño responsivo

---

## Generación de NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```
