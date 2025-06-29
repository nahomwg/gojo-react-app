/**
 * OpenAI API service for natural language property search
 */

interface SearchFilters {
  type?: 'residential' | 'business';
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  squareMetersMin?: number;
  features?: string[];
}

interface AISearchResponse {
  filters: SearchFilters;
  searchQuery: string;
  confidence: number;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Check if OpenAI API is configured
 */
export const isOpenAIConfigured = (): boolean => {
  return !!(OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key');
};

/**
 * Process natural language search query using OpenAI
 */
export const processNaturalLanguageSearch = async (query: string): Promise<AISearchResponse> => {
  if (!isOpenAIConfigured()) {
    // Fallback to local processing if OpenAI is not configured
    return processSearchLocally(query);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a property search assistant for Addis Ababa, Ethiopia. Extract search filters from natural language queries and return them as JSON.

Available areas in Addis Ababa: Bole, CMC, Kazanchis, Old Airport, Meskel Square, Merkato, Piassa, Addis Ketema, Kirkos, Lideta

Property types: residential, business

Common features:
- Residential: Parking, Balcony, Garden, Security, Furnished, Pet Friendly, Internet, Air Conditioning, Heating, Gym, Swimming Pool, Elevator
- Business: Reception Area, Conference Room, Parking, Security, Internet, Air Conditioning, Elevator, Kitchen, Storage, Loading Dock

Price range: 5,000 - 200,000 ETB per month
Bedrooms: 1-10
Square meters: 20-1000

Return JSON with these fields:
{
  "filters": {
    "type": "residential|business|undefined",
    "location": "area name or undefined",
    "priceMin": number or undefined,
    "priceMax": number or undefined,
    "bedrooms": number or undefined,
    "squareMetersMin": number or undefined,
    "features": ["feature1", "feature2"] or undefined
  },
  "searchQuery": "cleaned search query",
  "confidence": 0.0-1.0
}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const aiResponse: AISearchResponse = JSON.parse(content);
    
    // Validate and sanitize the response
    return validateAIResponse(aiResponse, query);

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to local processing
    return processSearchLocally(query);
  }
};

/**
 * Local fallback processing when OpenAI is not available
 */
const processSearchLocally = (query: string): AISearchResponse => {
  const filters: SearchFilters = {};
  const lowerQuery = query.toLowerCase().trim();

  // Extract location
  const addisAreas = ['bole', 'cmc', 'kazanchis', 'old airport', 'meskel square', 'merkato', 'piassa', 'addis ketema', 'kirkos', 'lideta'];
  const foundArea = addisAreas.find(area => lowerQuery.includes(area));
  if (foundArea) {
    filters.location = foundArea.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Extract bedrooms
  const bedroomMatch = lowerQuery.match(/(\d+)\s*(bedroom|bed|br)/);
  if (bedroomMatch) {
    const bedrooms = parseInt(bedroomMatch[1]);
    if (bedrooms > 0 && bedrooms <= 10) {
      filters.bedrooms = bedrooms;
    }
  }

  // Extract price
  const priceMatch = lowerQuery.match(/under\s*(\d+)[,\s]*(\d+)?\s*(etb|birr)?/);
  if (priceMatch) {
    const price = priceMatch[2] ? 
      parseInt(priceMatch[1] + priceMatch[2]) : 
      parseInt(priceMatch[1]) * (priceMatch[1].length <= 2 ? 1000 : 1);
    
    if (price > 0 && price <= 1000000) {
      filters.priceMax = price;
    }
  }

  // Extract minimum price
  const minPriceMatch = lowerQuery.match(/above\s*(\d+)[,\s]*(\d+)?\s*(etb|birr)?|over\s*(\d+)[,\s]*(\d+)?\s*(etb|birr)?/);
  if (minPriceMatch) {
    const price = minPriceMatch[2] ? 
      parseInt(minPriceMatch[1] + minPriceMatch[2]) : 
      parseInt(minPriceMatch[1]) * (minPriceMatch[1].length <= 2 ? 1000 : 1);
    
    if (price > 0 && price <= 1000000) {
      filters.priceMin = price;
    }
  }

  // Extract property type
  if (lowerQuery.includes('office') || lowerQuery.includes('business') || lowerQuery.includes('commercial')) {
    filters.type = 'business';
  } else if (lowerQuery.includes('apartment') || lowerQuery.includes('house') || lowerQuery.includes('residential') || lowerQuery.includes('studio')) {
    filters.type = 'residential';
  }

  // Extract features
  const features: string[] = [];
  const featureMap = {
    'furnished': 'Furnished',
    'parking': 'Parking',
    'garden': 'Garden',
    'wifi': 'Internet',
    'internet': 'Internet',
    'security': 'Security',
    'gym': 'Gym',
    'pool': 'Swimming Pool',
    'swimming pool': 'Swimming Pool',
    'balcony': 'Balcony',
    'elevator': 'Elevator',
    'conference': 'Conference Room',
    'loading': 'Loading Dock',
    'reception': 'Reception Area',
    'air conditioning': 'Air Conditioning',
    'ac': 'Air Conditioning'
  };

  Object.entries(featureMap).forEach(([key, value]) => {
    if (lowerQuery.includes(key) && !features.includes(value)) {
      features.push(value);
    }
  });

  if (features.length > 0) {
    filters.features = features;
  }

  // Extract square meters
  const sqmMatch = lowerQuery.match(/(\d+)\s*(sqm|square\s*meter|m2|m²)/);
  if (sqmMatch) {
    const sqm = parseInt(sqmMatch[1]);
    if (sqm > 0 && sqm <= 2000) {
      filters.squareMetersMin = sqm;
    }
  }

  return {
    filters,
    searchQuery: query,
    confidence: 0.7 // Local processing confidence
  };
};

/**
 * Validate and sanitize AI response
 */
const validateAIResponse = (response: AISearchResponse, originalQuery: string): AISearchResponse => {
  const validatedFilters: SearchFilters = {};

  // Validate type
  if (response.filters.type === 'residential' || response.filters.type === 'business') {
    validatedFilters.type = response.filters.type;
  }

  // Validate location
  if (response.filters.location && typeof response.filters.location === 'string') {
    validatedFilters.location = response.filters.location;
  }

  // Validate price range
  if (response.filters.priceMin && response.filters.priceMin > 0 && response.filters.priceMin <= 1000000) {
    validatedFilters.priceMin = response.filters.priceMin;
  }
  if (response.filters.priceMax && response.filters.priceMax > 0 && response.filters.priceMax <= 1000000) {
    validatedFilters.priceMax = response.filters.priceMax;
  }

  // Validate bedrooms
  if (response.filters.bedrooms && response.filters.bedrooms > 0 && response.filters.bedrooms <= 10) {
    validatedFilters.bedrooms = response.filters.bedrooms;
  }

  // Validate square meters
  if (response.filters.squareMetersMin && response.filters.squareMetersMin > 0 && response.filters.squareMetersMin <= 2000) {
    validatedFilters.squareMetersMin = response.filters.squareMetersMin;
  }

  // Validate features
  if (Array.isArray(response.filters.features) && response.filters.features.length > 0) {
    validatedFilters.features = response.filters.features.filter(feature => 
      typeof feature === 'string' && feature.length > 0
    );
  }

  return {
    filters: validatedFilters,
    searchQuery: response.searchQuery || originalQuery,
    confidence: Math.min(Math.max(response.confidence || 0.5, 0), 1)
  };
};

/**
 * Generate search suggestions based on user input
 */
export const generateSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
  if (!partialQuery.trim()) {
    return [
      "2 bedroom apartment in Bole under 25,000 ETB",
      "Furnished office space near Meskel Square",
      "3 bedroom house in CMC with parking and garden",
      "Business space in Kazanchis with conference room",
      "Studio apartment in Old Airport area with WiFi",
      "Commercial property in Merkato with loading dock"
    ];
  }

  // For now, return contextual suggestions based on partial input
  const suggestions: string[] = [];
  const lower = partialQuery.toLowerCase();

  if (lower.includes('bedroom') || lower.includes('bed')) {
    suggestions.push(
      `${partialQuery} in Bole`,
      `${partialQuery} with parking`,
      `${partialQuery} furnished`
    );
  } else if (lower.includes('office') || lower.includes('business')) {
    suggestions.push(
      `${partialQuery} with conference room`,
      `${partialQuery} in CMC`,
      `${partialQuery} with parking`
    );
  } else {
    suggestions.push(
      `${partialQuery} in Bole`,
      `${partialQuery} in CMC`,
      `${partialQuery} with parking`
    );
  }

  return suggestions.slice(0, 5);
};