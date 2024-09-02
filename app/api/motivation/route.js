import axios from 'axios';

export async function POST(req) {
  const { distance, pace, comments, coachingStyle } = await req.json();

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `I have a running session with the following details:
                    Distance: ${distance} km
                    Pace: ${pace} per km
                    Comments: ${comments}
                    Coaching Style: ${coachingStyle}
                    Please generate a motivational text for this run.`,
        },
      ],
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
    });

    const motivationalText = response.data.content[0].text;
    return new Response(JSON.stringify({ motivationalText }), { status: 200 });
  } catch (error) {
    console.error('Error generating motivational text:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate motivational text' }), { status: 500 });
  }
}
