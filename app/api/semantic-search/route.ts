import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = "Homes";
const collectionName = "properties";

// Function to generate embeddings using OpenAI
async function generateEmbedding(text: string): Promise<number[] | null> {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}

// GET handler for property search
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const minScore = parseFloat(searchParams.get('minScore') || '0.7'); // Default minimum score threshold

    if (!query) {
        return NextResponse.json(
            { error: 'Search query is required' },
            { status: 400 }
        );
    }

    if (!uri) {
        throw new Error("MongoDB connection string is not defined");
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    if (!queryEmbedding) {
        return NextResponse.json(
            { error: 'Failed to generate embedding for the query' },
            { status: 500 }
        );
    }

    // Connect to MongoDB
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB for vector search");

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Perform vector search with score filtering
        const results = await collection.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: limit * 20, // Increase candidates to ensure we have enough results after filtering
                    limit: limit * 5 // Get more results initially to filter by score
                }
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    property_name: 1,
                    property_description: 1,
                    property_price: 1,
                    property_address: 1,
                    property_bedroom: 1,
                    property_bathroom: 1,
                    property_floor: 1,
                    property_type: 1,
                    property_subtype: 1,
                    property_featured_photo: 1,
                    property_photos_url: 1,
                    category: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match: {
                    score: { $gte: minScore } // Filter results by minimum score
                }
            },
            {
                $limit: limit // Apply final limit after filtering
            }
        ]).toArray();

        // Log detailed score information
        console.log(`Found ${results.length} results with score >= ${minScore}`);
        console.log("--- Search Results Scores ---");
        results.forEach((result, index) => {
            console.log(`Result #${index + 1}: ${result.property_name} - Score: ${result.score.toFixed(4)}`);
        });
        console.log("---------------------------");

        return NextResponse.json({
            results,
            metadata: {
                query,
                minScore,
                totalResults: results.length
            }
        });

    } catch (error) {
        console.error("Error searching properties:", error);
        return NextResponse.json(
            { error: 'Error searching properties' },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}

// POST handler for property search
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { query, limit = 10, minScore = 0.5 } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            );
        }

        if (!uri) {
            throw new Error("MongoDB connection string is not defined");
        }

        // Generate embedding for the search query
        const queryEmbedding = await generateEmbedding(query);

        if (!queryEmbedding) {
            return NextResponse.json(
                { error: 'Failed to generate embedding for the query' },
                { status: 500 }
            );
        }

        // Connect to MongoDB
        const client = new MongoClient(uri);

        try {
            await client.connect();
            console.log("Connected to MongoDB for vector search (POST)");

            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            // Perform vector search with score filtering
            const results = await collection.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: limit * 20, // Increase candidates to ensure we have enough results after filtering
                        limit: limit * 5 // Get more results initially to filter by score
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        property_name: 1,
                        property_description: 1,
                        property_price: 1,
                        property_address: 1,
                        property_bedroom: 1,
                        property_bathroom: 1,
                        property_floor: 1,
                        property_type: 1,
                        property_subtype: 1,
                        property_featured_photo: 1,
                        property_photos_url: 1,
                        category: 1,
                        score: { $meta: "vectorSearchScore" }
                    }
                },
                {
                    $match: {
                        score: { $gte: minScore } // Filter results by minimum score
                    }
                },
                {
                    $limit: limit // Apply final limit after filtering
                }
            ]).toArray();

            // Log detailed score information
            console.log(`Found ${results.length} results with score >= ${minScore}`);
            console.log("--- Search Results Scores ---");
            results.forEach((result, index) => {
                console.log(`Result #${index + 1}: ${result.property_name} - Score: ${result.score.toFixed(4)}`);
            });
            console.log("---------------------------");

            return NextResponse.json({
                results,
                metadata: {
                    query,
                    minScore,
                    totalResults: results.length
                }
            });

        } catch (error) {
            console.error("Error searching properties:", error);
            return NextResponse.json(
                { error: 'Error searching properties' },
                { status: 500 }
            );
        } finally {
            await client.close();
        }
    } catch (error) {
        console.error("Error parsing request:", error);
        return NextResponse.json(
            { error: 'Error parsing request' },
            { status: 400 }
        );
    }
} 