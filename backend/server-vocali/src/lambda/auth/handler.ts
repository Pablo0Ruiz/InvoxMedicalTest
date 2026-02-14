import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
const clientDB = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const postConfirmation = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
    const { sub, email, nickname } = event.request.userAttributes;
    const tableName = process.env.USER_TABLE_NAME!;

    await clientDB.send(new PutCommand({
        TableName: tableName,
        Item: {
            userId: sub, 
            email: email,
            name: nickname || '',
            createdAt: new Date().toISOString(),
        }
    }));

    return event;
};