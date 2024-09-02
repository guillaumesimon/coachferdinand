"use client";

import { useState, FormEvent } from 'react';

export default function Home() {
  const [distance, setDistance] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [comments, setComments] = useState('');
  const [coachingStyle, setCoachingStyle] = useState('Encouraging');
  const [loading, setLoading] = useState(false);
  const [motivationalText, setMotivationalText] = useState('');
  const [jsonStructure, setJsonStructure] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [jsonPrompt, setJsonPrompt] = useState('');
  const [textPromptCollapsed, setTextPromptCollapsed] = useState(true);
  const [jsonPromptCollapsed, setJsonPromptCollapsed] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validate pace
    const validatedPaceInSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    if (validatedPaceInSeconds < 180 || validatedPaceInSeconds > 539) {
      alert("Please enter a pace between 3:00 and 8:59 min/km");
      return;
    }

    setLoading(true);

    const pace = `${minutes}:${seconds}`;
    
    // Calculate expected duration
    const paceInSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    const distanceInKm = parseFloat(distance);
    const durationInSeconds = paceInSeconds * distanceInKm;
    const durationHours = Math.floor(durationInSeconds / 3600);
    const durationMinutes = Math.floor((durationInSeconds % 3600) / 60);
    const durationSeconds = durationInSeconds % 60;
    const expectedDuration = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;

    try {
      const response = await fetch('/api/motivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distance,
          pace,
          comments,
          coachingStyle,
          expectedDuration,
        }),
      });

      const data = await response.json();
      setMotivationalText(data.motivationalText);
      setJsonStructure(data.jsonStructure);
      setTextPrompt(data.textPrompt);
      setJsonPrompt(data.jsonPrompt);
    } catch (error) {
      console.error('Error generating motivational text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <img
            className="mx-auto h-32 w-auto"
            src="/header.png"
            alt="Header Image"
          />
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            Ferdinand - Your Running Coach
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get personalized motivational texts for your runs
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
              Distance (km)
            </label>
            <input
              id="distance"
              name="distance"
              type="number"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="pace" className="block text-sm font-medium text-gray-700">
              Target Pace (min/km)
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                id="minutes"
                name="minutes"
                type="number"
                required
                min="3"
                max="8"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="MM"
                value={minutes}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 3 && value <= 8) {
                    setMinutes(e.target.value);
                  }
                }}
              />
              <input
                id="seconds"
                name="seconds"
                type="number"
                required
                min="0"
                max="59"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="SS"
                value={seconds}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 59) {
                    setSeconds(e.target.value);
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Any additional information about your run"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="coachingStyle" className="block text-sm font-medium text-gray-700">
              Coaching Style
            </label>
            <select
              id="coachingStyle"
              name="coachingStyle"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={coachingStyle}
              onChange={(e) => setCoachingStyle(e.target.value)}
            >
              <option value="Encouraging">Encouraging</option>
              <option value="Tough Love">Tough Love</option>
              <option value="Analytical">Analytical</option>
              <option value="Friendly">Friendly</option>
              <option value="Inspirational">Inspirational</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Motivated'}
            </button>
          </div>
        </form>
        {/* Collapsible sections */}
        {textPrompt && (
          <div className="mt-6 bg-white rounded-md shadow-sm">
            <button
              onClick={() => setTextPromptCollapsed(!textPromptCollapsed)}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {textPromptCollapsed ? '▶ Text Prompt' : '▼ Text Prompt'}
            </button>
            {!textPromptCollapsed && (
              <div className="px-4 py-2">
                <pre className="whitespace-pre-wrap text-xs">{textPrompt}</pre>
              </div>
            )}
          </div>
        )}
        {jsonPrompt && (
          <div className="mt-4 bg-white rounded-md shadow-sm">
            <button
              onClick={() => setJsonPromptCollapsed(!jsonPromptCollapsed)}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {jsonPromptCollapsed ? '▶ JSON Prompt' : '▼ JSON Prompt'}
            </button>
            {!jsonPromptCollapsed && (
              <div className="px-4 py-2">
                <pre className="whitespace-pre-wrap text-xs">{jsonPrompt}</pre>
              </div>
            )}
          </div>
        )}
        {motivationalText && (
          <div className="mt-6 bg-white rounded-md shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900">Motivational Text</h3>
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{motivationalText}</p>
          </div>
        )}
        {jsonStructure && (
          <div className="mt-6 bg-white rounded-md shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900">JSON Structure</h3>
            <pre className="mt-2 text-xs overflow-x-auto">
              {JSON.stringify(jsonStructure, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}