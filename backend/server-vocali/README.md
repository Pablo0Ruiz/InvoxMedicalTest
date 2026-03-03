# Backend: API de Transcripción Médica (Server-Vocali)

Este proyecto backend forma parte de la solución para **disminuir la carga administrativa de los doctores mediante la transcripción de voz**, permitiendo la generación eficiente de recetas e informes clínicos.

## Arquitectura

El backend está construido bajo una **arquitectura Serverless** utilizando **Serverless Framework** sobre **AWS** y programado en **Node.js con TypeScript**.

Se ha implementado una rigurosa arquitectura por capas (Layered Architecture):
- **Infraestructura como Código (IaC):** `serverless.yml` define integralmente la infraestructura: Cognito para autenticación, DynamoDB (almacenamiento de metadatos), S3 (almacenamiento de audios) y API Gateway + Lambdas.
- **Capa de Controladores (`src/lambda/`):** Puntos de entrada organizados por dominio (`auth/`, `cors/`, `transcription/`). Estos actúan como adaptadores para procesar el evento HTTP y delegar la operación en los servicios, manteniendo la responsabilidad única.
- **Capa de Servicios (`src/services/`):** Concentra la lógica de negocio sólida y testeable, aislada de los detalles HTTP:
  - `dynamodbClient.ts`: Persistencia de las transcripciones y consultas ligadas a los usuarios.
  - `S3Client.ts`: Gestión de la carga y descarga de archivos de audio en Amazon S3.
  - `speech.ts`: Integración especializada con la API externa de transcripción de Speechmatics.

## Ejecución y Despliegue

### Requisitos
- Node.js versión 20.x
- Cuenta configurada en AWS
- Serverless Framework instalado globalmente (`npm install -g serverless`)

### Instalación

```bash
npm install
# o con pnpm
pnpm install
```

### Desarrollo Local

Para ejecutar el emulador de AWS Lambda localmente:

```bash
serverless dev
# o usando serverless-offline, según scripts configurados
```

### Despliegue en AWS

Asegúrate de tener tus credenciales de AWS configuradas correctamente (AWS CLI o variables de entorno):

```bash
serverless deploy
```
