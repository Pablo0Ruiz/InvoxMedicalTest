import { GetObjectCommand, PutObjectCommand, NoSuchKey, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface SaveTranscriptionParams {
    bucketName: string;
    key: string;
    content: string;
}

interface UploadUrlParams {
    bucketName: string;
    key: string;
    contentType: string;
}

interface DownloadUrlParams {
    bucketName: string;
    key: string;
}

interface GetTranscriptionsParams {
    bucketName: string;
    key: string;
}

export const getUploadUrl = async ({ bucketName, key, contentType }: UploadUrlParams) => {
    const client = new S3Client({});
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
    });

    try {
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error(`Error generating signed URL: ${error}`);
        throw error;
    }
}


export const getDownloadUrl = async ({ bucketName, key }: DownloadUrlParams) => {
    const client = new S3Client({});
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error(`Error generating signed download URL: ${error}`);
        throw error;
    }
}

export const saveTranscription = async ({ bucketName, key, content }: SaveTranscriptionParams) => {
    const client = new S3Client({});
    try {
        await client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: content,
                ContentType: "application/json",
            }),
        );
        return { success: true };
    } catch (error) {
        console.error(`Error saving transcription to S3: ${error}`);
        throw error;
    }
}


export const getTranscription = async ({ bucketName, key }: GetTranscriptionsParams) => {
    const client = new S3Client({});
    try {
        const response = await client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            }),
        );
        const body = await response.Body?.transformToString();

        if (!body) throw new Error("Body is undefined");
        return JSON.parse(body);
    } catch (error) {
        if (error instanceof NoSuchKey) {
            console.error("Transcription not found:", error);

        } else if (error instanceof S3ServiceException) {
            console.error(`Error getting transcription:${bucketName},${error.name},${error.message}`);
        } else {
            throw error;
        }
    }
}