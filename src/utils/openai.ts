import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateAIInsights(analyticsData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness and health analytics AI assistant. Analyze the provided data and generate concise, actionable insights focused on patterns, trends, and recommendations."
        },
        {
          role: "user",
          content: JSON.stringify(analyticsData)
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error;
  }
}

export async function getPersonalizedAdvice(analyticsData: any, specificArea?: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable fitness coach and nutritionist. Provide personalized advice based on the user's data and trends. Focus on actionable, specific recommendations."
        },
        {
          role: "user",
          content: `Please provide advice ${specificArea ? `about ${specificArea}` : ''} based on this data: ${JSON.stringify(analyticsData)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting personalized advice:', error);
    throw error;
  }
}