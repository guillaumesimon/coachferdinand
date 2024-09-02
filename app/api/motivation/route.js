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
                    Please generate a motivational text for this run. Include timestamps for each paragraph indicating when it should be read during the run. Ensure that the maximum time without the coach speaking is 3 minutes. Format the timestamps as [MM:SS].`,
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
    const paragraphs = motivationalText.split('\n').filter(paragraph => paragraph.trim() !== '');
    const jsonStructure = paragraphs.map((paragraph, index) => ({
      timestamp: `[${String(Math.floor(index * 3)).padStart(2, '0')}:00]`,
      text: paragraph
    }));

    return new Response(JSON.stringify({ motivationalText, jsonStructure }), { status: 200 });
  } catch (error) {
    console.error('Error generating motivational text:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate motivational text' }), { status: 500 });
  }
}
