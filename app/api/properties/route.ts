import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = "Homes";
const collectionName = "properties";

// GET handler for paginated property listings
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    if (!uri) {
        throw new Error("MongoDB connection string is not defined");
    }

    // Connect to MongoDB
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB for property listing");

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Get total count for pagination
        const total = await collection.countDocuments();
        const totalPages = Math.ceil(total / limit);

        // Fetch properties with pagination
        const properties = await collection.find()
            .sort({ created_at: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit)
            .project({
                _id: 0,
                id: 1,
                property_name: 1,
                property_price: 1,
                property_address: 1,
                property_bedroom: 1,
                property_bathroom: 1,
                property_floor: 1, // square meters
                property_type: 1,
                property_subtype: 1,
                property_featured_photo: 1,
                property_location_geo_coordinates: 1,
                category: {
                    property_category_name: 1
                },
                created_at: 1
            })
            .toArray();

        return NextResponse.json({
            properties,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json(
            { error: 'Error fetching properties' },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
} 