# Task Management Frontend

Frontend web para la gestion de proyectos, tareas, miembros y usuarios del sistema.

Este proyecto esta construido con **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**, **React Hook Form**, **Zod**, **Axios** y componentes basados en **Radix UI / shadcn style**.

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado lo siguiente:

### 1. Node.js

La version de Node.js utilizada para este proyecto es:

```bash
Node.js 24.15.0
```

Verifica tu version instalada con:

```bash
node -v
```

Debe mostrar:

```bash
v24.15.0
```

Si tienes otra version de Node, se recomienda usar un manejador de versiones como `nvm`, `fnm` o `Volta` para instalar y activar Node 24.15.0.

Ejemplo con `nvm`:

```bash
nvm install 24.15.0
nvm use 24.15.0
```

### 2. pnpm

El proyecto usa **pnpm** como gestor de paquetes, ya que incluye `pnpm-lock.yaml`.

Verifica si tienes pnpm instalado:

```bash
pnpm -v
```

Si no lo tienes, puedes habilitarlo con Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Luego valida nuevamente:

```bash
pnpm -v
```

## Backend requerido

Este frontend necesita que el backend este ejecutandose para poder iniciar sesion y consumir los modulos de proyectos, tareas y usuarios.

Backend esperado:

```text
C:\ALFREDO\WORK\Ingenius\prueba tecnica\task-magement-backend
```

URL por defecto del backend:

```text
http://localhost:3000
```

El frontend consume esa URL mediante la variable de entorno:

```env
VITE_API_URL=http://localhost:3000
```

Asegurate de levantar el backend antes de usar la aplicacion.

## Variables de entorno

El proyecto utiliza un archivo `.env` en la raiz.

Ejemplo:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=IberoMax
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
```

### Variables importantes

| Variable | Descripcion | Valor recomendado en local |
| --- | --- | --- |
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |
| `VITE_APP_NAME` | Nombre visible/configurable de la app | `IberoMax` |
| `VITE_APP_VERSION` | Version de la app | `1.0.0` |
| `VITE_ENABLE_ANALYTICS` | Activa/desactiva analytics | `false` |
| `VITE_ENABLE_NOTIFICATIONS` | Activa/desactiva notificaciones | `true` |

> Importante: en Vite, las variables que deben estar disponibles en el frontend deben iniciar con `VITE_`.

## Instalacion

Desde la raiz del proyecto frontend:

```bash
cd "C:\ALFREDO\WORK\Ingenius\prueba tecnica\task-management-frontend"
```

Instala las dependencias:

```bash
pnpm install
```

Este comando leera `package.json` y `pnpm-lock.yaml` para instalar las versiones necesarias.

## Ejecutar en modo desarrollo

Con el backend corriendo en `http://localhost:3000`, ejecuta:

```bash
pnpm run dev
```

Por configuracion de Vite, la aplicacion se inicia en:

```text
http://localhost:5173
```

El archivo `vite.config.ts` tambien tiene `open: true`, por lo que el navegador puede abrirse automaticamente.

## Credenciales y acceso

La aplicacion requiere autenticacion.

Puedes:

1. Crear una cuenta desde la pantalla de registro.
2. Iniciar sesion con un usuario existente del backend.

Una vez autenticado, tendras acceso a:

- Proyectos
- Tareas por proyecto
- Miembros de proyecto
- Usuarios del sistema

## Scripts disponibles

### Desarrollo

```bash
pnpm run dev
```

Levanta el servidor local de Vite con hot reload.

### Build de produccion

```bash
pnpm run build
```

Ejecuta:

```bash
tsc -b && vite build
```

Esto valida TypeScript y genera la version de produccion en la carpeta:

```text
dist/
```

### Lint

```bash
pnpm run lint
```

Ejecuta ESLint sobre el proyecto.

### Preview de produccion

```bash
pnpm run preview
```

Sirve localmente el build generado en `dist/`.

> Antes de usar `preview`, ejecuta primero `pnpm run build`.

## Flujo recomendado para levantar el proyecto desde cero

1. Verificar Node:

```bash
node -v
```

Debe ser:

```bash
v24.15.0
```

2. Verificar pnpm:

```bash
pnpm -v
```

3. Instalar dependencias:

```bash
pnpm install
```

4. Verificar `.env`:

```env
VITE_API_URL=http://localhost:3000
```

5. Levantar el backend en `http://localhost:3000`.

6. Levantar el frontend:

```bash
pnpm run dev
```

7. Abrir la aplicacion:

```text
http://localhost:5173
```

## Modulos principales

### Autenticacion

- Login
- Registro
- Persistencia de token en `localStorage`
- Rutas protegidas

### Proyectos

- Listado paginado
- Crear proyecto
- Editar proyecto
- Eliminar proyecto con confirmacion
- Ver tareas del proyecto
- Gestionar miembros

### Tareas

- Listado por proyecto
- Crear tarea
- Editar tarea
- Eliminar tarea con confirmacion
- Cambiar estado
- Cambiar prioridad
- Asignar usuario responsable

### Usuarios

- Listar usuarios activos del sistema
- Crear usuario
- Editar usuario
- Eliminar/desactivar usuario con confirmacion

## Estructura general del proyecto

```text
src/
  api/
    client.ts              # Configuracion de Axios e interceptores
    endpoints.ts           # Rutas de API
    services/              # Servicios HTTP por modulo
  components/
    common/                # Componentes reutilizables
    features/              # Componentes de funcionalidades principales
    forms/                 # Formularios
    layout/                # Layout principal, header y sidebar
    projects/              # Componentes del modulo proyectos
    task/                  # Componentes alternos de tareas
    users/                 # Componentes del modulo usuarios
  hooks/                   # Hooks de acceso a stores
  pages/                   # Paginas/rutas principales
  store/                   # Stores Zustand
  types/                   # Tipos TypeScript
  utils/                   # Utilidades compartidas
  validators/              # Esquemas Zod
```

## Notas importantes

### Minificacion con Terser

El proyecto usa en `vite.config.ts`:

```ts
build: {
  minify: "terser",
}
```

Por eso `terser` esta incluido como dependencia de desarrollo. No lo elimines, porque el build fallara si Vite no encuentra Terser.

### Backend y CORS

Si el frontend carga pero las peticiones fallan, revisa:

- Que el backend este corriendo en `http://localhost:3000`.
- Que `VITE_API_URL` apunte al backend correcto.
- Que el backend permita peticiones desde `http://localhost:5173` si tiene CORS restringido.

### Autenticacion

El token se guarda en `localStorage` con la clave:

```text
auth_token
```

Si tienes problemas de sesion, puedes limpiar el storage del navegador o cerrar sesion desde la aplicacion.

## Problemas comunes

### `pnpm install` falla por version o store

Si pnpm indica problemas con el store o versiones, puedes intentar:

```bash
pnpm install
```

Si persiste, revisa tu version de pnpm y que Node sea `24.15.0`.

### El frontend no conecta con el backend

Verifica el `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Y comprueba que el backend responda en:

```text
http://localhost:3000
```

### El build falla indicando que falta Terser

Instala dependencias nuevamente:

```bash
pnpm install
```

El proyecto ya incluye `terser` en `devDependencies`.

## Comandos de verificacion antes de entregar cambios

Se recomienda ejecutar:

```bash
pnpm run lint
pnpm run build
```

Opcionalmente, para validar TypeScript directamente:

```bash
pnpm exec tsc -b --pretty false
```
