# Frontend: Interfaz Clínica (InvoxMedical)

Este proyecto corresponde a la interfaz de usuario de la solución creada para **disminuir la carga administrativa de los doctores a través de la transcripción de voz**, facilitando un entorno intuitivo para la redacción de recetas, documentación de informes e historiales médicos.

## Arquitectura de UI

El frontend ha sido desarrollado como una **Single Page Application (SPA)** moderna construida con **React, TypeScript y Vite**.

Sigue directrices de nivel profesional estructuradas bajo patrones de **Feature-Sliced Design (FSD)** y **Atomic Design**:
- **Modularidad de Características (`src/modules/`):** Separación rigurosa por dominios (ej. `auth/`, `dashboard/`, `landing/`), encapsulando páginas y flujos específicos para evitar un monolito.
- **Diseño Atómico (`src/shared/ui/`):** Utilización de componentes puros o "Dumb Components" (ej. `Button.tsx` en `atoms/`) cuya lógica visual está aislada en archivos de configuración de variantes (`Button.variants.ts`). Componentes altamente testeables y reutilizables.
- **Abstracción de Lógica Compleja (`src/hooks/`):** La lógica de negocio más elaborada, como el manejo de grabaciones mediante el micrófono o la conexión con WebSockets (`useSpeechmaticsWebSocket.ts`, `useAudioRecorder.ts`), está desacoplada de los componentes visuales e inyectada a través de Custom Hooks específicos de cada dominio.
- **Capa de Red (`src/api/`):** Consultas a la API del backend totalmente centralizadas, separando la obtención y gestión de datos asíncronos de la capa visual de React.

## Ejecución

### Requisitos
- Node.js
- Gestor de paquetes (npm, yarn o pnpm)

### Instalación

Clona el repositorio, accede a este directorio e instala las dependencias:

```bash
npm install
```

### Entorno de desarrollo

Para iniciar el servidor de desarrollo local de Vite (con Fast Refresh activado por defecto):

```bash
npm run dev
```

### Construcción para producción

Para empaquetar y optimizar los archivos estáticos de la aplicación, listos para su despliegue en producción:

```bash
npm run build
```
