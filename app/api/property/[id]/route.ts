import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = "Homes";
const collectionName = "properties";

// Type definition for params
interface Params {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json(
            { error: 'Invalid property ID' },
            { status: 400 }
        );
    }

    // Connect to MongoDB

    if (!uri) {
        throw new Error("MongoDB connection string is not defined");
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log(`Connected to MongoDB for property ID: ${id}`);

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Find property by ID
        const property = await collection.findOne(
            { id: id },
            {
                projection: {
                    _id: 0,
                    embedding: 0, // Exclude the embedding vector to reduce payload size
                }
            }
        );

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ property });

    } catch (error) {
        console.error(`Error fetching property ID ${id}:`, error);
        return NextResponse.json(
            { error: 'Error fetching property' },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
} 