import axios from 'axios';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // This replaces `export const config = { runtime: 'edge' };`

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const axiosInstance = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
});

async function makeClaudeRequest(prompt, prefillResponse = null, retries = 0) {
  try {
    const messages = [{ role: 'user', content: prompt }];
    if (prefillResponse) {
      messages.push({ role: 'assistant', content: prefillResponse });
      messages.push({ role: 'user', content: 'Please complete the response above.' });
    }

    const response = await axiosInstance.post('/messages', {
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1500,
      messages: messages,
    }, {
      timeout: 60000, // 60 seconds timeout
    });
    return response.data.content[0].text;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`Retrying request (${retries + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return makeClaudeRequest(prompt, prefillResponse, retries + 1);
    }
    throw error;
  }
}

export async function POST(req) {
  const { distance, pace, comments, coachingStyle, expectedDuration } = await req.json();

  const textPrompt = `You are Ferdinand, a running coach. Generate a motivational text for a runner who is about to run ${distance} km at a pace of ${pace} min/km. Their expected run duration is ${expectedDuration}. Additional comments: ${comments}. Use a ${coachingStyle} coaching style. 

Create a series of motivational messages that span the entire duration of the run. Ensuring the maximum time between coach interventions is 3 minutes. Each intervention should last a minimum of 30s. Format each intervention as "[MM:SS] Motivational message". 

Your first message should be encouraging and set the tone for the run. Subsequent messages should provide motivation, technique reminders, and encouragement based on the expected progress of the run. Your final message should be celebratory as the runner finishes their run.`;

  const jsonPrompt = `Based on the following motivational text, create a JSON structure that includes the full text and an array of interventions with their timestamps and messages:

${textPrompt}

The JSON structure should have the following format:
{
  "motivationalText": "The full text of your motivational message, including timestamps",
  "interventions": [
    {
      "timestamp": "MM:SS",
      "message": "The motivational message for this timestamp"
    },
    // ... more interventions
  ]
}

Ensure that the JSON structure accurately reflects the content of the motivational message.`;

  try {
    const motivationalText = await makeClaudeRequest(textPrompt);
    
    const jsonPrefill = `{
  "motivationalText": "${motivationalText.replace(/"/g, '\\"')}",
  "interventions": [
    {
      "timestamp": "`;

    const jsonResponse = await makeClaudeRequest(jsonPrompt, jsonPrefill);

    let parsedJsonStructure;
    try {
      // Extract the JSON part from the response
      const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJsonStructure = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in the response');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      parsedJsonStructure = null;
    }

    return new Response(JSON.stringify({
      textPrompt,
      jsonPrompt,
      motivationalText,
      jsonStructure: parsedJsonStructure,
      rawJsonResponse: jsonResponse, // Include this for debugging
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate motivational text' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
