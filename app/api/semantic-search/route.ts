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
        console.log("Connected to MongoDB for vector search");

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Store for pagination information
        let pagination;
        let searchType = "vector";

        // For vector search, we need to:
        // 1. Get all results that meet minimum score
        // 2. Calculate total for pagination
        // 3. Then apply pagination (slice) to results

        // Perform vector search with score filtering
        const allResults = await collection.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: limit * 30, // Increase candidates to ensure enough results
                    limit: limit * 10  // Get enough results for multiple pages
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
                    searchType: { $literal: "vector" } // Mark as vector search result
                }
            },
            {
                $match: {
                    score: { $gte: minScore } // Filter results by minimum score
                }
            }
        ]).toArray();

        // Calculate pagination for vector search
        let results;

        if (allResults.length > 0) {
            // Log detailed score information
            console.log(`Found ${allResults.length} vector results with score >= ${minScore}`);
            console.log("--- Search Results Scores (Top 10) ---");
            allResults.slice(0, 10).forEach((result, index) => {
                console.log(`Result #${index + 1}: ${result.property_name} - Score: ${result.score?.toFixed(4) || 'N/A'}`);
            });
            console.log("---------------------------");

            // Calculate pagination
            const total = allResults.length;
            pagination = calculatePagination(page, limit, total);

            // Apply pagination by slicing the results
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, total);
            results = allResults.slice(startIndex, endIndex);

            console.log(`Returning page ${page} (${startIndex}-${endIndex}) of ${total} vector results`);
        } else {
            // If no results from vector search, fall back to text search
            console.log("No vector search results found, falling back to text search");
            searchType = "text";

            // Text search with pagination
            const textSearchResults = await performTextSearch(collection, query, page, limit);
            results = textSearchResults.results;
            pagination = calculatePagination(page, limit, textSearchResults.total);

            console.log(`Found ${textSearchResults.total} results from text search fallback, showing page ${page}`);
        }

        return NextResponse.json({
            results,
            pagination,
            metadata: {
                query,
                minScore,
                searchType
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
