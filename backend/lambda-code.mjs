import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

export const handler = async (event) => {

    try {

        
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 200,
                headers: corsHeaders
            };
        }

        
        if (event.httpMethod === "POST") {

            const body = JSON.parse(event.body);
            const originalUrl = body.url;

            const shortId = Math.random().toString(36).substring(2, 8);

            const putCommand = new PutItemCommand({
                TableName: "url-shortener",
                Item: {
                    shortId: { S: shortId },
                    originalUrl: { S: originalUrl }
                }
            });

            await client.send(putCommand);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ shortId })
            };
        }

        
        if (event.httpMethod === "GET") {

            const shortId = event.pathParameters.shortId;

            const getCommand = new GetItemCommand({
                TableName: "url-shortener",
                Key: {
                    shortId: { S: shortId }
                }
            });

            const result = await client.send(getCommand);

            if (!result.Item) {
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: "URL not found" })
                };
            }

            const originalUrl = result.Item.originalUrl.S;

            return {
                statusCode: 302,
                headers: {
                    ...corsHeaders,
                    Location: originalUrl
                }
            };
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Bad request" })
        };

    } catch (error) {
        console.error("ERROR:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message })
        };
    }
};