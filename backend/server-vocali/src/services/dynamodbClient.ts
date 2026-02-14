import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { saveTranscription } from "./S3Client";
import { randomUUID } from "node:crypto";

const clientDB = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createTranscription = async (event: any) => {
    let body;
    try {
        if (event.isBase64Encoded) {
            body = JSON.parse(Buffer.from(event.body, 'base64').toString());
        } else {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        }
    } catch (error) {
        console.error("Error parsing body:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Cuerpo de solicitud inválido" })
        };
    }
    const bucketName = process.env.VOZ_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("Nombre del bucket no configurado");
    }

    const transcriptionId = randomUUID();
    const userId = body.userId;
    const s3Key = `transcriptions/${userId}/${transcriptionId}.json`;
    const createdAt = new Date().toISOString();

    await saveTranscription({
        bucketName,
        key: s3Key,
        content: JSON.stringify({
            transcription: body.transcription,
            userId,
            createdAt,
            transcriptionId
        })
    });

    const putParams = {
        TableName: process.env.TRANSCRIPTIONS_TABLE_NAME,
        Item: {
            transcriptionId,
            userId,
            createdAt,
            s3Key,
            preview: body.transcription.substring(0, 100) + (body.transcription.length > 100 ? "..." : ""),
        },
    };

    await clientDB.send(new PutCommand(putParams));

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Transcripción creada exitosamente",
            transcriptionId
        }),
    };
};


export const getTranscriptions = async (userId: string, limit: number = 10, lastKey?: string) => {
    const params: any = {
        TableName: process.env.TRANSCRIPTIONS_TABLE_NAME,
        IndexName: "UserIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
        Limit: limit,
        ScanIndexForward: false
    };

    if (lastKey) {
        try {
            params.ExclusiveStartKey = JSON.parse(Buffer.from(lastKey, 'base64').toString('utf-8'));
        } catch (e) {
            console.error("Invalid lastKey:", e);
        }
    }

    const result = await clientDB.send(new QueryCommand(params));

    let nextKey = null;
    if (result.LastEvaluatedKey) {
        nextKey = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
    }

    return {
        items: result.Items || [],
        lastKey: nextKey
    };
};


export const createPendingTranscription = async ({ userId, s3Key, jobId, fileName }: any) => {
    const transcriptionId = randomUUID();
    const createdAt = new Date().toISOString();

    const putParams = {
        TableName: process.env.TRANSCRIPTIONS_TABLE_NAME,
        Item: {
            transcriptionId,
            userId,
            createdAt,
            s3Key,
            jobId,
            status: 'pending',
            fileName: fileName || 'audio-upload',
            preview: 'Procesando...',
        },
    };

    await clientDB.send(new PutCommand(putParams));

    return { transcriptionId };
};



export const updateTranscriptionStatus = async ({ transcriptionId, status, preview, s3Key }: any) => {
    const params = {
        TableName: process.env.TRANSCRIPTIONS_TABLE_NAME,
        Key: { transcriptionId },
        UpdateExpression: "set #status = :status, preview = :preview, s3Key = :s3Key",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": status,
            ":preview": preview,
            ":s3Key": s3Key
        },
        ReturnValues: "ALL_NEW" as const
    };

    const result = await clientDB.send(new UpdateCommand(params));
    return result.Attributes;
};
