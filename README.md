# Portfolio de Andrea Larrumbide

Portfolio bilingüe de ilustración y fotografía construido con Next.js, TypeScript, MariaDB y Better Auth.

## Preparación local

1. Instala las dependencias con `npm ci`.
2. Copia `.env.example` como `.env.local` y completa los valores.
3. Ejecuta `sql/DB.sql` en MariaDB.
4. Arranca el proyecto con `npm run dev`.

## Crear la cuenta administradora

El registro público está desactivado. Para crear la primera cuenta:

1. Pon temporalmente `AUTH_ALLOW_SIGNUP=true` y arranca la aplicación.
2. Ejecuta, cambiando los datos:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H 'Content-Type: application/json' \
  -d '{"name":"Andrea","email":"correo@ejemplo.com","password":"una-contraseña-segura"}'
```

3. Vuelve a poner `AUTH_ALLOW_SIGNUP=false` y reinicia la aplicación.

El acceso al panel está en `/login`. Las páginas y operaciones del dashboard validan la sesión en el servidor.

## Privacidad del formulario de contacto

La política inicial se encuentra en `src/lib/default-privacy-policy.ts` y puede editarse posteriormente desde `/dashboard/privacy`. El formulario exige una aceptación expresa y guarda la fecha y la versión aceptadas junto al mensaje. Antes de publicar, conviene que un profesional revise el texto legal para el caso concreto.

## Imágenes

Las imágenes subidas se guardan en `uploads/`, que no se versiona. En producción hay que conservar esta carpeta entre despliegues y darle permisos de escritura al usuario que ejecuta Next.js.

## Comprobaciones

```bash
npm run lint
npm run build
```
