import axios from 'axios';

async function makeClaudeRequest(prompt) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );
    return response.data.content[0].text;
  } catch (error) {
    console.error('Error making Claude request:', error);
    throw error;
  }
}

export async function POST(req) {
  const { distance, pace, comments, coachingStyle, expectedDuration } = await req.json();

  const textPrompt = `You are Ferdinand, a running coach. Generate a motivational text for a runner who is about to run ${distance} km at a pace of ${pace} min/km. Their expected run duration is ${expectedDuration}. Additional comments: ${comments}. Use a ${coachingStyle} coaching style. 

Create a series of motivational messages that span the entire duration of the run. Ensure the maximum time between coach interventions is 2 minutes. Format each intervention as "[MM:SS] Motivational message". 

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
    const jsonStructure = await makeClaudeRequest(jsonPrompt);

    let parsedJsonStructure;
    try {
      parsedJsonStructure = JSON.parse(jsonStructure);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      parsedJsonStructure = null;
    }

    return new Response(JSON.stringify({
      textPrompt,
      jsonPrompt,
      motivationalText,
      jsonStructure: parsedJsonStructure,
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
