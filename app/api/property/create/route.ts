import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = "Homes";
const collectionName = "properties";

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!uri) {
        return NextResponse.json(
            { error: 'MongoDB connection string is not defined' },
            { status: 500 }
        );
    }

    try {
        const requestData = await request.json();

        // Create a new property object
        const newProperty = {
            id: Date.now(), // Use timestamp as temporary ID
            created_at: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            property_name: requestData.title,
            property_description: requestData.description,
            property_type: requestData.propertyType,
            property_subtype: requestData.propertySubtype,
            property_price: requestData.price,
            property_size: requestData.landSize || 0,
            property_floor: requestData.floorArea || 0,
            property_bedroom: requestData.bedrooms || 0,
            property_bathroom: requestData.bathrooms || 0,
            property_garage: requestData.garageSpaces || 0,
            property_address: requestData.address,
            property_location_address: `${requestData.address}, ${requestData.city}, ${requestData.province}, Philippines`,
            property_amenities: JSON.stringify(requestData.amenities || []),
            property_featured_photo: requestData.mainImage,
            property_photos_url: JSON.stringify(requestData.additionalImages || []),
            property_status: "Active",
            property_date_listed: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            property_public: 1,
            property_sold_out: 0,
            is_featured: "No",
            currency: {
                id: 1,
                name: "PHP",
                symbol: "₱",
                value: "1",
                is_default: "Yes"
            },
            // Add a placeholder user ID - in a real app this would come from authentication
            user: {
                id: 9,
                name: "Maria Santos",
                email: "maria.santos@example.com",
                photo: "https://example.com/photo.jpg"
            },
            searchableText: `${requestData.title} ${requestData.propertyType} ${requestData.address} ${requestData.description} ${requestData.price} ${requestData.bedrooms} bedrooms ${requestData.bathrooms} bathrooms ${requestData.landSize} square meters`,
            category: {
                id: getPropertyCategoryId(requestData.propertyType),
                property_category_name: requestData.propertyType,
                property_category_slug: requestData.propertyType.toLowerCase().replace(/\s+/g, '-')
            }
        };

        // Connect to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        console.log(`Connected to MongoDB for creating a property`);

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert the new property
        const result = await collection.insertOne(newProperty);
        await client.close();

        return NextResponse.json({
            success: true,
            message: 'Property created successfully',
            propertyId: newProperty.id
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        );
    }
}

// Helper function to determine property category ID
function getPropertyCategoryId(propertyType: string): number {
    switch (propertyType.toLowerCase()) {
        case 'house and lot':
            return 1;
        case 'condominium':
            return 2;
        case 'land':
            return 3;
        case 'commercial property':
            return 4;
        case 'apartment':
            return 5;
        default:
            return 1; // Default to house and lot
    }
} 