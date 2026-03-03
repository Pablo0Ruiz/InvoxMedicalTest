# InvoxMedical: Asistente de Transcripción Médica

Este proyecto ha sido desarrollado como respuesta a un **desafío técnico** con el objetivo de **disminuir la carga administrativa de los doctores por medio de la transcripción de voz** para la redacción ágil de recetas, informes médicos y notas clínicas.

El repositorio está estructurado como un monorepositorio que divide el sistema en dos partes principales, siguiendo las mejores prácticas de arquitectura de software:

- [**Backend (server-vocali):**](./backend/server-vocali/README.md) API Serverless construida sobre AWS (Lambda, DynamoDB, S3, Cognito) para manejar de forma escalable la autenticación, el almacenamiento y el procesamiento de transcripciones de voz usando Node.js y TypeScript.
- [**Frontend:**](./frontend/README.md) Single Page Application (SPA) en React con TypeScript y Vite. Sigue una arquitectura Feature-Sliced Design combinada con Atomic Design, asegurando una clara separación entre la lógica de interfaz de usuario, los estados globales y las integraciones de red.

## Arquitectura

El sistema se basa en un diseño modular y altamente escalable:
- **Cloud-Native Backend**: Desplegado mediante Serverless Framework, garantizando alta disponibilidad y pago por uso sin necesidad de provisionar servidores.
- **Modular UI**: Componentes atómicos puramente presentacionales y lógica compleja encapsulada en Custom Hooks aislados del DOM.

Para más detalles sobre la ejecución y configuración de los componentes, consulta la documentación específica en los directorios respectivos.
