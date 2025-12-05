import axios from 'axios';
import { OPENAI_API_KEY } from '../config/config';

/**
 * Process user query with context about what the camera sees
 * Supports Hindi-English mix (Hinglish)
 */
export const processQuery = async (userQuery, sceneDescription) => {
  try {
    const systemPrompt = `You are a helpful visual guide assistant for a visually impaired person.
The user is wearing a phone on their shoulder with camera facing forward.

Current scene: ${sceneDescription || 'No objects detected yet'}

Respond to the user's question about what they can see. Be concise, specific, and helpful.
Use directional language like "on your left", "on your right", "in front of you", "about 2 meters ahead".
The user may speak in Hindi, English, or a mix (Hinglish). Respond in the same language they use.

If asked about location of an object, describe its position clearly.
If the object is not visible, say so politely and suggest looking around.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);

    // Fallback response if API fails
    if (sceneDescription) {
      return `I can see: ${sceneDescription}`;
    }
    return 'Sorry, I am having trouble processing that right now';
  }
};

/**
 * Get scene description from OpenAI Vision API (alternative for complex scenes)
 */
export const analyzeSceneWithVision = async (imageBase64) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this scene briefly. List any objects, hazards, or obstacles. Mention their approximate positions (left, right, center, near, far).'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'low' // Fast processing
                }
              }
            ]
          }
        ],
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Vision API error:', error.response?.data || error.message);
    return null;
  }
};
