import { createTranscription, getTranscriptions } from './dynamodbClient';

jest.mock("@aws-sdk/lib-dynamodb", () => {
    const mockSend = jest.fn();
    return {
        DynamoDBDocumentClient: {
            from: jest.fn(() => ({
                send: mockSend
            }))
        },
        PutCommand: jest.fn(),
        QueryCommand: jest.fn()
    };
});

jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn()
}));

jest.mock("./S3Client", () => ({
    saveTranscription: jest.fn().mockResolvedValue({ success: true })
}));

describe('dynamodbClient', () => {
    let mockSend: jest.Mock;

    beforeEach(() => {
        const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
        mockSend = DynamoDBDocumentClient.from().send;
        jest.clearAllMocks();
    });

    it('should create a transcription and save to S3/DynamoDB', async () => {
        mockSend.mockResolvedValue({});

        const event = {
            body: Buffer.from(JSON.stringify({
                userId: 'user-123',
                transcription: 'Hello world'
            })).toString('base64'),
            isBase64Encoded: true
        };

        process.env.VOZ_BUCKET_NAME = 'test-bucket';
        process.env.TRANSCRIPTIONS_TABLE_NAME = 'test-table';

        const result = await createTranscription(event);

        expect(result.statusCode).toBe(200);
        expect(mockSend).toHaveBeenCalled();
    });

    it('should retrieve transcriptions for a user', async () => {
        mockSend.mockResolvedValue({
            Items: [
                { transcriptionId: '1', userId: 'user-123', preview: 'Hello' }
            ],
            LastEvaluatedKey: undefined
        });

        const result = await getTranscriptions('user-123');

        expect(result.items).toHaveLength(1); 
        expect(result.lastKey).toBeNull();
        expect(mockSend).toHaveBeenCalled();
    });
});
