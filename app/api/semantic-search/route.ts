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

// Function to perform regular text search
async function performTextSearch(
    collection: any,
    query: string,
    page: number,
    limit: number
): Promise<{ results: any[], total: number }> {
    try {
        // Text search query
        const searchQuery = { searchableText: { $regex: query, $options: 'i' } };

        // Count total results for pagination
        const total = await collection.countDocuments(searchQuery);

        // Skip value for pagination
        const skip = (page - 1) * limit;

        // Execute search with pagination
        const results = await collection.find(
            searchQuery,
            {
                projection: {
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
                    property_location_geo_coordinates: 1,
                    category: 1,
                    searchType: { $literal: "text" } // Mark as text search result
                }
            }
        ).skip(skip).limit(limit).toArray();

        return { results, total };
    } catch (error) {
        console.error("Error in text search:", error);
        return { results: [], total: 0 };
    }
}

// Function to calculate pagination metadata
function calculatePagination(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}

// GET handler for property search
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1', 10);
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
        console.log("Connected to MongoDB for combined search");

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // 1. Perform vector search first
        const vectorResults = await collection.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: limit * 30,
                    limit: limit * 5  // Get enough results but limit to avoid excessive results
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
                    property_location_geo_coordinates: 1,
                    category: 1,
                    score: { $meta: "vectorSearchScore" },
                    searchType: { $literal: "vector" }
                }
            },
            {
                $match: {
                    score: { $gte: minScore }
                }
            }
        ]).toArray();

        console.log(`Found ${vectorResults.length} vector results with score >= ${minScore}`);

        // 2. Perform text search
        const textSearchResults = await performTextSearch(collection, query, 1, limit * 2);
        console.log(`Found ${textSearchResults.total} results from text search`);

        // 3. Combine results and remove duplicates based on property id
        const vectorIds = new Set(vectorResults.map(item => item.id));
        const uniqueTextResults = textSearchResults.results.filter(item => !vectorIds.has(item.id));

        // Combine vector and text results, prioritizing vector results
        const combinedResults = [...vectorResults, ...uniqueTextResults];

        // Total count of all unique results
        const totalResults = combinedResults.length;
        console.log(`Combined unique results: ${totalResults}`);

        // Apply pagination to the combined results
        const pagination = calculatePagination(page, limit, totalResults);
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, totalResults);
        const paginatedResults = combinedResults.slice(startIndex, endIndex);

        // Log info about the returned results
        if (vectorResults.length > 0) {
            console.log("--- Top Vector Search Results ---");
            vectorResults.slice(0, 3).forEach((result, index) => {
                console.log(`Result #${index + 1}: ${result.property_name} - Score: ${result.score?.toFixed(4) || 'N/A'}`);
            });
        }

        return NextResponse.json({
            results: paginatedResults,
            pagination,
            metadata: {
                query,
                minScore,
                searchType: "combined",
                vectorResultsCount: vectorResults.length,
                textResultsCount: uniqueTextResults.length
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
