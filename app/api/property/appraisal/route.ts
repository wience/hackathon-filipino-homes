import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { propertyData } = await req.json();

        if (!propertyData) {
            return NextResponse.json(
                { error: 'Property data is required' },
                { status: 400 }
            );
        }

        // Call OpenAI API to get the property appraisal
        const response = await openai.responses.create({
            model: "gpt-4o",
            input: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": "You are an Automated Valuation Model (AVM) specializing in real estate appraisal, particularly for properties in the Philippines. Using provided property details, return a comprehensive estimated market value of the property, clearly outlining your step-by-step valuation method.\n\nProvide detailed appraisal based on the following inputs:\n\nProperty Description:\n\nClearly outline the property's main selling points, such as special views, corner unit status, balconies, or unique layout features.\n\nLocation Details:\n\nExact Address: Specify at least city/municipality and barangay.\n\nNeighborhood Characteristics: Indicate if it is located in a premium condominium, gated subdivision, near commercial areas, residential community, or rural setting.\n\nAccessibility: Proximity to main roads, schools, hospitals, malls, public transportation.\n\nProperty Specifications:\n\nProperty Type: Clearly state if it is a condominium unit, house-and-lot, or townhouse.\n\nLot Area (sqm):\n\nFloor Area (sqm): Clearly provided, specifying total sqm.\n\nUnit Level: Clearly specify the floor level (if condominium).\n\nProperty Condition and Renovation History:\n\nYear Built or Approximate Age:\n\nRenovation History: Clearly state if recent furnishings or renovations were made and their approximate value.\n\nStructural Condition: Assess general maintenance, including foundation, roofing, electrical wiring, and plumbing.\n\nLayout and Amenities:\n\nBedrooms and Bathrooms: Clearly specify total number and their configuration.\n\nSpecial Features: Highlight key features such as balconies, panoramic views, corner unit advantages, storage rooms, maid's room.\n\nFurnishing Status: Detail whether fully furnished, partially furnished, or unfurnished and approximate value of furnishings.\n\nLegal and Documentation:\n\nTitle Status: Specify clearly whether the title is clean, lien-free, or with encumbrances.\n\nRecent Tax Declaration: Property tax classification (residential, mixed-use, commercial).\n\nCondominium Specifics: Clearly state monthly association dues, available building amenities, and special assessments.\n\nMarket Data:\n\nComparable Sales: Recent sales data of similar properties within the same condominium or locality.\n\nActive Listings: Current competing properties on the market within the same building or neighborhood.\n\nGovernment Values: BIR zonal valuation and local government assessed values.\n\nPurpose of Appraisal:\n\nClarify clearly the reason: selling, bank loan application, investment analysis, or personal estimate.\n\nRental or Income Potential (if applicable):\n\nMonthly Rental Income: Current or potential monthly rental amount.\n\nOccupancy Rates: Typical occupancy percentages in the area.\n\nValuation Process (Steps to clearly include in your response):\n\nProperty Base Valuation:\n\nUtilize local government zonal valuation or average market rate per square meter based on comparable sales data.\n\nAdjustment Factors:\n\nApply adjustments for specific advantageous features such as panoramic views, corner units, balconies, and recent high-value furnishings.\n\nMarket Comparison:\n\nCross-reference similar recent property sales and current listings to adjust final estimated value accurately.\n\nRental or Income Valuation (if applicable):\n\nEstimate potential annual rental income and apply an appropriate capitalization rate.\n\nAggregate Valuation:\n\nCombine adjusted base valuation, market comparison, and income valuation (if relevant).\n\nInclude Agent Fee:\n\nClearly adjust the final price to include an approximate 5% agent commission fee.\n\nProvide a clear, itemized breakdown of the valuation, justifying each step with logical reasoning and market data."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": propertyData
                        }
                    ]
                }
            ],
            text: {
                "format": {
                    "type": "json_schema",
                    "name": "my_schema",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "market_data": {
                                "type": "object",
                                "properties": {
                                    "comparable_sales": {
                                        "type": "string",
                                        "description": "Recent sales data of similar properties."
                                    },
                                    "active_listings": {
                                        "type": "string",
                                        "description": "Current competing properties on the market."
                                    },
                                    "government_values": {
                                        "type": "string",
                                        "description": "BIR zonal valuation and local government assessed values."
                                    }
                                },
                                "required": [
                                    "comparable_sales",
                                    "active_listings",
                                    "government_values"
                                ],
                                "additionalProperties": false
                            },
                            "purpose_of_appraisal": {
                                "type": "string",
                                "description": "Purpose for the appraisal: selling, bank loan, investment analysis, or personal estimate."
                            },
                            "rental_income_potential": {
                                "type": "object",
                                "properties": {
                                    "monthly_rental_income": {
                                        "type": "number",
                                        "description": "Current or potential monthly rental amount."
                                    },
                                    "occupancy_rates": {
                                        "type": "number",
                                        "description": "Typical occupancy percentages in the area."
                                    }
                                },
                                "required": [
                                    "monthly_rental_income",
                                    "occupancy_rates"
                                ],
                                "additionalProperties": false
                            },
                            "valuation_process": {
                                "type": "object",
                                "properties": {
                                    "base_valuation": {
                                        "type": "string",
                                        "description": "Local government zonal valuation or average market rate."
                                    },
                                    "adjustment_factors": {
                                        "type": "string",
                                        "description": "Adjustments for specific advantageous features."
                                    },
                                    "market_comparison": {
                                        "type": "string",
                                        "description": "Cross-referencing similar sales."
                                    },
                                    "rental_income_valuation": {
                                        "type": "string",
                                        "description": "Estimation of potential annual rental income."
                                    },
                                    "aggregate_valuation": {
                                        "type": "string",
                                        "description": "Combining adjusted base valuation and other factors. RETURN THE COST DIRECTLY NO NEED FOR EXPLANATION"
                                    },
                                    "agent_fee": {
                                        "type": "number",
                                        "description": "Approximate 5% agent commission fee."
                                    }
                                },
                                "required": [
                                    "base_valuation",
                                    "adjustment_factors",
                                    "market_comparison",
                                    "rental_income_valuation",
                                    "aggregate_valuation",
                                    "agent_fee"
                                ],
                                "additionalProperties": false
                            },
                            "proximity_data": {
                                "type": "object",
                                "properties": {
                                    "nearest_locations": {
                                        "type": "string",
                                        "description": "Description of nearest locations like hospitals and schools."
                                    },
                                    "festivals_events": {
                                        "type": "string",
                                        "description": "Description of festivals and events celebrated in the area."
                                    }
                                },
                                "required": [
                                    "nearest_locations",
                                    "festivals_events"
                                ],
                                "additionalProperties": false
                            }
                        },
                        "required": [
                            "market_data",
                            "purpose_of_appraisal",
                            "rental_income_potential",
                            "valuation_process",
                            "proximity_data"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            reasoning: {},
            tools: [
                {
                    "type": "web_search_preview",
                    "user_location": {
                        "type": "approximate",
                        "country": "PH"
                    },
                    "search_context_size": "high"
                }
            ],
            temperature: 0.13,
            max_output_tokens: 7993,
            top_p: 1,
            store: true
        });

        // Extract the content from the response
        let appraisalData;
        if (response.output_text) {
            console.log(response.output_text);
            try {
                appraisalData = JSON.parse(response.output_text);
            } catch (e) {
                console.error('Error parsing response:', e);
                appraisalData = {
                    error: 'Failed to parse appraisal response'
                };
            }
        } else {
            appraisalData = {
                error: 'No response received from the AI model'
            };
        }

        return NextResponse.json(appraisalData);
    } catch (error: any) {
        console.error('Error getting property appraisal:', error);

        // Return a default mock response for development/testing
        const mockResponse = {
            "market_data": {
                "comparable_sales": "Recent sales of similar properties in the area.",
                "active_listings": "Current listings of similar properties in the area.",
                "government_values": "BIR zonal valuation and local government assessed values."
            },
            "purpose_of_appraisal": "Selling",
            "rental_income_potential": {
                "monthly_rental_income": 0,
                "occupancy_rates": 0
            },
            "valuation_process": {
                "base_valuation": "Estimated value based on local market rates.",
                "adjustment_factors": "Property size, location, and amenities considerations.",
                "market_comparison": "Cross-reference with similar properties in the area.",
                "rental_income_valuation": "N/A",
                "aggregate_valuation": "Estimated valuation based on provided information.",
                "agent_fee": 25000
            },
            "proximity_data": {
                "nearest_locations": "Nearby schools, hospitals, and commercial centers.",
                "festivals_events": "Local cultural events and festivities."
            }
        };

        return NextResponse.json(mockResponse);
    }
} 