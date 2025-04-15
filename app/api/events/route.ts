import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { location } = await request.json();

        console.log(location);

        if (!location) {
            return NextResponse.json(
                { error: 'Location is required' },
                { status: 400 }
            );
        }

        // Step 1: Get raw events data using web search
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const searchTools = [
            { googleSearch: {} },
        ];

        const searchConfig = {
            tools: searchTools,
            responseMimeType: 'text/plain',
            systemInstruction: [
                {
                    text: `My query is a location. Please surf the internet to gather information on upcoming events near or in that location. For each event you find, format the output in a structured way as follows:

Event Name: [Name of the event]

Event Details: [Date, time, venue, a brief description, and any other relevant details]

Source: [Exact Link of the source]




Ensure the output is clearly structured for each event and includes as much relevant information as possible. You can use facebook events for additional source. Be strict with the output. No need for extra intro message start directly with. 

Events for [Location]

....
`,
                }
            ],
        };

        const model = 'gemini-2.5-pro-preview-03-25';
        const searchContents = [
            {
                role: 'user',
                parts: [
                    {
                        text: location,
                    },
                ],
            },
        ];

        // Collect the raw response
        const searchResponse = await ai.models.generateContentStream({
            model,
            config: searchConfig,
            contents: searchContents,
        });

        let rawEventsData = '';
        for await (const chunk of searchResponse) {
            rawEventsData += chunk.text || '';
        }

        console.log(rawEventsData);

        // Step 2: Structure the data into proper JSON format
        const structureConfig = {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    required: ["Event Name", "Event Details", "Source"],
                    properties: {
                        "Event Name": {
                            type: Type.STRING,
                            description: "The name of the event.",
                        },
                        "Event Details": {
                            type: Type.STRING,
                            description: "A brief description or details about the event.",
                        },
                        "Source": {
                            type: Type.STRING,
                            description: "The source where the event information was found.",
                        },
                    },
                },
            },
            systemInstruction: [
                {
                    text: `I will give you content from my ground search. I just want you to structure the output properly based from my structured output format.`,
                }
            ],
        };

        const structureContents = [
            {
                role: 'user',
                parts: [
                    {
                        text: rawEventsData,
                    },
                ],
            },
        ];

        const structuredResponse = await ai.models.generateContent({
            model,
            config: structureConfig,
            contents: structureContents,
        });

        // Access the text content correctly using first candidate
        const structuredText = structuredResponse.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const structuredData = JSON.parse(structuredText);

        return NextResponse.json({
            events: structuredData,
            location: location
        });

    } catch (error) {
        console.error('Error in events API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events', details: (error as Error).message },
            { status: 500 }
        );
    }
}

