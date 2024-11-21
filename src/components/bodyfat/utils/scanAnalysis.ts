import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ScanMetadata {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
}

interface PhotoData {
  front?: File;
  back?: File;
  leftSide?: File;
  rightSide?: File;
  angle45?: File;
  abdominal?: File;
  legs?: File;
}

interface BodyFatRange {
  min: number;
  max: number;
}

async function getImageBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export async function analyzeScan(photos: PhotoData, metadata: ScanMetadata): Promise<BodyFatRange> {
  try {
    // Convert all photos to base64
    const photoPromises = Object.entries(photos)
      .filter(([_, file]) => file)
      .map(async ([type, file]) => ({
        type,
        base64: await getImageBase64(file!)
      }));

    const photoData = await Promise.all(photoPromises);

    // Prepare the analysis prompt
    const systemPrompt = `You are an expert in body composition analysis. Your task is to estimate body fat percentage based on standardized photos and physical measurements. Follow these guidelines:

1. Analyze key visual indicators:
   - Muscle definition and vascularity
   - Fat distribution patterns
   - Visible anatomical landmarks
   - Overall body composition

2. Consider metadata impact:
   - Age affects muscle mass and fat distribution
   - Gender-specific fat patterns
   - Height-weight relationship (BMI context)
   - Typical ranges for given demographics

3. Focus on these specific areas:
   - Abdominal definition
   - Shoulder-to-waist ratio
   - Lower back fat deposits
   - Limb composition
   - Facial features

4. Output format:
   - Provide a 2% range (e.g., "13-15%")
   - Must be within biological ranges:
     * Male: 3-35%
     * Female: 8-45%
   - Consider typical healthy ranges:
     * Male: 10-20%
     * Female: 18-28%

5. Maintain consistency:
   - Use standardized assessment criteria
   - Compare against reference images
   - Account for lighting variations
   - Consider pose consistency

Important: This analysis provides an estimate with approximately 90% accuracy compared to DEXA scans. It should be used as a tracking tool and not as a replacement for medical-grade body composition analysis.`;

    const userPrompt = `Please analyze these standardized photos and provide a body fat percentage estimate as a 2% range.

Subject Metadata:
- Gender: ${metadata.gender}
- Age: ${metadata.age} years
- Height: ${metadata.height} cm
- Weight: ${metadata.weight} kg

Available Photos:
${photoData.map(p => `- ${p.type}: [Image attached]`).join('\n')}

Provide your estimate as a range (e.g., "13-15%"). Remember this is an estimate with ~90% accuracy compared to DEXA scans.`;

    // Call GPT-4 Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            ...photoData.map(photo => ({
              type: "image_url",
              image_url: {
                url: photo.base64,
                detail: "high"
              }
            }))
          ]
        }
      ],
      max_tokens: 150,
      temperature: 0.3
    });

    // Extract the body fat range from the response
    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('No response from analysis');
    }

    // Extract the range using regex
    const match = result.match(/(\d+\.?\d*)-(\d+\.?\d*)%/);
    if (!match) {
      throw new Error('Could not extract body fat range from response');
    }

    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);

    // Validate the range is within biological ranges
    const minBf = metadata.gender === 'male' ? 3 : 8;
    const maxBf = metadata.gender === 'male' ? 35 : 45;

    if (min < minBf || max > maxBf || min >= max) {
      throw new Error('Body fat estimate outside biological range');
    }

    return { min, max };
  } catch (error) {
    console.error('Scan analysis error:', error);
    throw error;
  }
}