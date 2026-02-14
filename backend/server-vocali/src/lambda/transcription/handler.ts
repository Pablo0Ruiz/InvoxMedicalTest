import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createTranscription, getTranscriptions, createPendingTranscription } from "../../services/dynamodbClient";
import { generateToken, transcribeAudioFile } from "../../services/speech";
import { getUploadUrl, getDownloadUrl } from "../../services/S3Client";

const s3Client = new S3Client();

const createResponse = (statusCode: number, body: any) => ({
    statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
});


export const getFile = async (event: any) => {
    const bucket = process.env.VOZ_BUCKET_NAME;
    if (!bucket) return createResponse(500, { error: "Nombre del bucket no encontrado" });

    const { key } = event.queryStringParameters || {};
    if (!key) return createResponse(400, { error: "Clave (key) no encontrada" });

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await s3Client.send(command);
        const str = await response.Body?.transformToString();

        return createResponse(200, str);
    } catch (error) {
        console.error(error);
        return createResponse(500, { error: "Error al obtener el archivo" });
    }
};

export const create = async (event: any) => {
    const result = await createTranscription(event);
    return createResponse(result.statusCode || 200, result.body || result);
};

export const getAll = async (event: any) => {
    try {
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub || event.queryStringParameters?.userId;

        if (!userId) {
            return createResponse(400, { error: "ID de usuario no encontrado" });
        }

        const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : 10;
        const lastKey = event.queryStringParameters?.lastKey;

        const { items, lastKey: nextKey } = await getTranscriptions(userId, limit, lastKey);

        const updatedItems = await syncPendingTranscriptions(items, userId);

        return createResponse(200, {
            items: updatedItems,
            lastKey: nextKey
        });
    } catch (error) {
        console.error("Error getting transcriptions:", error);
        return createResponse(500, { error: "Error al recuperar las transcripciones" });
    }
};

const syncPendingTranscriptions = async (items: any[], userId: string) => {
    return await Promise.all(items.map(async (item: any) => {
        if (item.status === 'pending' && item.jobId) {
            try {
                const jobStatus = await getJobStatus(item.jobId) as any;

                if (jobStatus && jobStatus.job && jobStatus.job.status === 'done') {
                    console.log(`Job ${item.jobId} is done, fetching transcript...`);
                    const transcriptData = await getJobTranscript(item.jobId) as any;

                    const results = transcriptData.results || [];
                    const fullText = results.map((r: any) => r.alternatives?.[0]?.content).join(' ');
                    const preview = fullText.substring(0, 100) + (fullText.length > 100 ? "..." : "");

                    const transcriptId = item.transcriptionId;
                    const transcriptS3Key = `transcriptions/${userId}/${transcriptId}.json`;

                    const { saveTranscription } = require("../../services/S3Client");
                    await saveTranscription({
                        bucketName: process.env.VOZ_BUCKET_NAME!,
                        key: transcriptS3Key,
                        content: JSON.stringify({
                            transcription: fullText,
                            userId,
                            createdAt: new Date().toISOString(),
                            transcriptionId: transcriptId,
                            jobId: item.jobId,
                            originalAudioKey: item.s3Key
                        })
                    });

                    const { updateTranscriptionStatus } = require("../../services/dynamodbClient");
                    await updateTranscriptionStatus({
                        transcriptionId: item.transcriptionId,
                        status: 'completed',
                        preview: preview || '(No se detectó voz)',
                        s3Key: transcriptS3Key
                    });

                    return {
                        ...item,
                        status: 'completed',
                        preview: preview || '(No se detectó voz)',
                        s3Key: transcriptS3Key
                    };
                } else if (jobStatus && jobStatus.job && (jobStatus.job.status === 'rejected' || jobStatus.job.status === 'expired')) {
                    const { updateTranscriptionStatus } = require("../../services/dynamodbClient");
                    await updateTranscriptionStatus({
                        transcriptionId: item.transcriptionId,
                        status: 'failed',
                        preview: 'Error en transcripción',
                        s3Key: item.s3Key
                    });
                    return { ...item, status: 'failed', preview: 'Error en transcripción' };
                }
            } catch (err) {
                console.error(`Error updating job ${item.jobId}:`, err);
            }
        }
        return item;
    }));
};


import { getJobStatus, getJobTranscript } from "../../services/speech";

export const generateUploadUrl = async (event: any) => {
    try {
        const { contentType, fileName } = JSON.parse(event.body || '{}');
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

        if (!userId) {
            return createResponse(401, { error: "No autorizado" });
        }

        if (!contentType) {
            return createResponse(400, { error: "Tipo de contenido requerido" });
        }

        const bucket = process.env.VOZ_BUCKET_NAME;
        if (!bucket) return createResponse(500, { error: "Bucket no configurado" });

        const key = `uploads/${userId}/${Date.now()}-${fileName || 'audio'}`;
        const uploadUrl = await getUploadUrl({ bucketName: bucket, key, contentType });

        return createResponse(200, { uploadUrl, key });
    } catch (error) {
        console.error(error);
        return createResponse(500, { error: "Error al generar URL de subida" });
    }
};

export const transcribeFile = async (event: any) => {
    try {
        const { s3Key, fileName } = JSON.parse(event.body || '{}');
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

        if (!userId) return createResponse(401, { error: "No autorizado" });
        if (!s3Key) return createResponse(400, { error: "s3Key requerido" });

        const bucket = process.env.VOZ_BUCKET_NAME;
        if (!bucket) return createResponse(500, { error: "Bucket no configurado" });

        const downloadUrl = await getDownloadUrl({ bucketName: bucket, key: s3Key });
        const job: any = await transcribeAudioFile(downloadUrl);

        const result = await createPendingTranscription({
            userId,
            s3Key,
            jobId: job.id,
            fileName
        });

        return createResponse(200, {
            message: "Trabajo de transcripción enviado",
            jobId: job.id,
            transcriptionId: result.transcriptionId
        });
    } catch (error) {
        console.error("Transcribe File Error:", error);
        return createResponse(500, { error: "Error al procesar la solicitud de transcripción" });
    }
};

export const getToken = async (event: any) => {
    try {
        const token = await generateToken();
        console.log("Token generated successfully");
        return createResponse(200, { token });
    } catch (error) {
        console.error("Token generation error:", error);
        return createResponse(500, { error: "Error al generar token" });
    }
};
