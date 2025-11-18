# 🏡 Gestor de Cabañas - Sistema de Reservas

Sistema web completo para la gestión y reserva de cabañas, desarrollado con Next.js 14 y TypeScript. Permite a los usuarios consultar disponibilidad, realizar reservas y gestionar sus estadías, mientras que los administradores tienen control total sobre cabañas, reservas y usuarios.

---

## 🚀 Tecnologías Utilizadas

### **Frontend**

- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TanStack Query (React Query)](https://tanstack.com/query)** - Gestión de estado del servidor y caché
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilos
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizables
- **[Lucide React](https://lucide.dev/)** - Iconos
- **[React Calendar](https://www.npmjs.com/package/react-calendar)** - Calendario interactivo
- **[date-fns](https://date-fns.org/)** - Manipulación de fechas
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificaciones
- **[js-cookie](https://github.com/js-cookie/js-cookie)** - Gestión de cookies

### **Backend Integration**

- REST API con autenticación JWT
- Refresh token automático
- Manejo de errores centralizado

---

## ⚙️ Configuración

### **1. Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

- `NEXT_PUBLIC_API_URL`: URL base del backend API

### **2. Instalación de Dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Ejecutar en Desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### **4. Build para Producción**

```bash
npm run build
npm start
```

---

## 📋 Requisitos

- **Node.js** 18.x o superior
- **npm** / **yarn** / **pnpm**
- Backend API ejecutándose (ver configuración de API URL)

---

## ✨ Funcionalidades Implementadas

### **🔐 Autenticación y Seguridad**

- ✅ Inicio de sesión con email y contraseña/PIN
- ✅ Registro de nuevos usuarios (Profesores y Jubilados)
- ✅ Autenticación JWT con refresh token automático
- ✅ Protección de rutas según roles (Admin, Profesor, Jubilado)
- ✅ Cambio de contraseña/PIN personalizado

### **🏠 Gestión de Cabañas (Usuario)**

- ✅ Catálogo de cabañas disponibles
- ✅ Vista detallada de cada cabaña con:
  - Galería de imágenes
  - Información completa (capacidad, habitaciones, baños, amenidades)
  - Ubicación y horarios de check-in/check-out
  - Precio por noche
- ✅ Calendario interactivo de disponibilidad
- ✅ Sistema de reservas con selección de fechas
- ✅ Validación de disponibilidad en tiempo real
- ✅ Confirmación de reserva con resumen de costos

### **📅 Gestión de Reservas (Usuario)**

- ✅ Vista de todas las reservas del usuario
- ✅ Información detallada de cada reserva:
  - Nombre y ubicación de la cabaña
  - Fechas y horarios de check-in/check-out
  - Estado de la reserva (Pendiente, Confirmada, En uso, Completada, Cancelada)
  - Precio total
- ✅ Cancelación de reservas
- ✅ Ordenamiento por estado y fecha
- ✅ Actualización en tiempo real con TanStack Query

### **👨‍💼 Panel de Administración**

#### **Gestión de Cabañas**

- ✅ Lista completa de cabañas con búsqueda
- ✅ Crear nuevas cabañas con formulario completo
- ✅ Editar información de cabañas existentes
- ✅ Activar/desactivar cabañas
- ✅ Eliminar cabañas
- ✅ Gestión de amenidades y características

#### **Gestión de Reservas**

- ✅ Vista de todas las reservas del sistema
- ✅ Filtrado por estado y búsqueda
- ✅ Cambio de estado de reservas (workflow completo)
- ✅ Información detallada de usuario y cabaña por reserva
- ✅ Paginación y estadísticas

#### **Gestión de Usuarios**

- ✅ Lista de todos los usuarios registrados
- ✅ Activar/desactivar usuarios
- ✅ Cambio de roles
- ✅ Búsqueda y filtrado
- ✅ Gestión de documentos de identidad permitidos

#### **⚙️ Configuración del Sistema**

- ✅ Cantidad máxima de reservas permitidas por año por usuario
- ✅ Modo mantenimiento del sistema
- ✅ Días de penalización por cancelación
- ✅ Tiempo de expiración de reserva
- ✅ Notificación de lista de espera
- ✅ Duración token de acceso
- ✅ Duración token de refresco
- ✅ Notificación por email

**Notas**:

- Estas configuraciones únicamente se dejan registradas en el backend para futuras implementaciones. No se implementa ninguna funcionalidad para el modo mantenimiento, envío de notificaciones por email, penalizaciones por cancelación y lista de espera en el frontend.

### **🎨 Experiencia de Usuario**

- ✅ Diseño responsive
- ✅ Modo oscuro y claro
- ✅ Navegación intuitiva con navbar adaptable
- ✅ Notificaciones toast para feedback
- ✅ Animaciones y transiciones suaves
- ✅ Optimistic updates para mejor UX
- ✅ Prefetch de datos para navegación instantánea

---

## 🔮 Próximas Implementaciones

Las siguientes funcionalidades **ya están implementadas en el backend** y solo requieren integración en el frontend:

### **📋 Lista de Espera**

- Permitir a usuarios anotarse en lista de espera cuando no hay disponibilidad
- Sistema de notificaciones cuando se libere una cabaña
- Gestión de prioridades en la lista

### **🚫 Bloqueo de Fechas**

- Establecer bloqueos en fechas específicas
- Bloqueo por mantenimiento de cabañas
- Bloqueo por eventos especiales
- Gestión de períodos no disponibles

### **📊 Reportes y Estadísticas**

- Dashboard con métricas del sistema
- Reportes de ocupación
- Estadísticas de usuarios más activos
- Análisis de temporadas altas/bajas

---

## 📁 Estructura del Proyecto

```
gestor-cabana/
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── (app)/                    # Rutas protegidas
│   │   │   ├── admin/                # Paneles de administración
│   │   │   │   ├── cabins-management/
│   │   │   │   ├── documents-management/
│   │   │   │   └── reservation-management/
│   │   │   ├── cabins/               # Catálogo y detalles de cabañas
│   │   │   ├── reservations/         # Reservas del usuario
│   │   │   └── layout.tsx            # Layout con navbar
│   │   ├── (auth)/                   # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── layout.tsx                # Layout raíz
│   │
│   ├── components/                   # Componentes React
│   │   ├── features/                 # Componentes por feature
│   │   │   ├── admin/                # Componentes de admin
│   │   │   ├── cabins/               # Componentes de cabañas
│   │   │   └── reservations/         # Componentes de reservas
│   │   ├── shared/                   # Componentes compartidos
│   │   └── ui/                       # Componentes UI base (shadcn)
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useAdminCabins.ts         # Gestión admin de cabañas
│   │   ├── useCabins.ts              # Consulta de cabañas
│   │   ├── useDocuments.ts           # Gestión de documentos/usuarios
│   │   ├── useEnrichedReservations.ts # Reservas enriquecidas
│   │   ├── useReservations.ts        # Gestión de reservas
│   │   └── useUsers.ts               # Gestión de usuarios
│   │
│   ├── services/                     # Servicios API
│   │   ├── auth.ts                   # Autenticación
│   │   ├── availability.ts           # Disponibilidad de cabañas
│   │   ├── cabins.ts                 # Cabañas públicas
│   │   ├── cabins-admin.ts           # Cabañas admin
│   │   ├── documents.ts              # Documentos
│   │   ├── reservations.ts           # Reservas
│   │   ├── users.ts                  # Usuarios
│   │   └── users-admin.ts            # Usuarios admin
│   │
│   ├── types/                        # Definiciones de tipos
│   │   ├── auth.d.ts                 # Tipos de autenticación
│   │   ├── cabin.d.ts                # Tipos de cabañas
│   │   ├── document.d.ts             # Tipos de documentos
│   │   ├── reservation.d.ts          # Tipos de reservas
│   │   └── user.d.ts                 # Tipos de usuarios
│   │
│   ├── lib/                          # Utilidades
│   │   ├── apiClient.ts              # Cliente HTTP con refresh token
│   │   ├── auth.ts                   # Helpers de autenticación
│   │   ├── helpers.ts                # Funciones auxiliares
│   │   ├── queryClient.ts            # Configuración TanStack Query
│   │   └── utils.ts                  # Utilidades generales
│   │
│   └── middleware.ts                 # Middleware de autenticación
│
├── public/                           # Archivos estáticos
├── .env                              # Variables de entorno
├── tailwind.config.ts                # Configuración Tailwind
├── tsconfig.json                     # Configuración TypeScript
└── package.json                      # Dependencias del proyecto
```

---

## 🔑 Características Técnicas

### **Gestión de Estado**

- **TanStack Query** para caché y sincronización con el servidor
- Query keys jerárquicas para invalidación eficiente
- Optimistic updates para mejor UX
- Stale time configurado por tipo de dato

### **Autenticación**

- JWT almacenado en cookies HTTP-only
- Refresh token automático en `apiClient`
- Middleware de Next.js para protección de rutas
- Redirección automática según rol

### **Optimizaciones**

- Prefetch de datos en hover
- Lazy loading de componentes
- Memoización con `useMemo` y `useCallback`
- Debounce en búsquedas
- Paginación en listas grandes

### **Validaciones**

- Validación de disponibilidad antes de reservar
- Manejo de errores centralizado
- Feedback visual inmediato

---

## 👥 Equipo de Desarrollo

Desarrollado por [Daniel](https://github.com/danielcanoh22), [Alejandra](https://github.com/Alejandra-D-H) y [David](https://github.com/davidc-garciae) en el curso de Proyecto Integrador II, para la gestión de cabañas de COOPRUDEA.

---
