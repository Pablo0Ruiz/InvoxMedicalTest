import { getUploadUrl, saveTranscription } from './S3Client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe('S3Client', () => {
    const mockSend = jest.fn();

    beforeEach(() => {
        (S3Client as jest.Mock).mockImplementation(() => ({
            send: mockSend
        }));
        jest.clearAllMocks();
    });

    it('should generate a signed upload URL', async () => {
        (getSignedUrl as jest.Mock).mockResolvedValue('https://mock-upload-url.com');

        const url = await getUploadUrl({
            bucketName: 'test-bucket',
            key: 'test-key',
            contentType: 'audio/wav'
        });

        expect(url).toBe('https://mock-upload-url.com');
        expect(getSignedUrl).toHaveBeenCalled();
    });

    it('should save transcription to S3', async () => {
        mockSend.mockResolvedValue({});

        const result = await saveTranscription({
            bucketName: 'test-bucket',
            key: 'test-key',
            content: 'test-content'
        });

        expect(result.success).toBe(true);
        expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    });
});
