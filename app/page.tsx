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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-48 w-auto"
            src="/header.png"
            alt="Header Image"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 leading-tight">
            Ferdinand - <br /> Your Running Coach
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Meet Ferdinand, your personal running coach! Get personalized motivational texts to keep you going strong during your runs.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                Distance (km)
              </label>
              <input
                id="distance"
                name="distance"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">
                  Minutes
                </label>
                <input
                  id="minutes"
                  name="minutes"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Min"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="seconds" className="block text-sm font-medium text-gray-700">
                  Seconds
                </label>
                <input
                  id="seconds"
                  name="seconds"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Sec"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
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
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Motivated'}
            </button>
          </div>
        </form>
        {textPrompt && (
          <div className="mt-6 p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Text Prompt</h3>
              <button
                onClick={() => setTextPromptCollapsed(!textPromptCollapsed)}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {textPromptCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
            {!textPromptCollapsed && (
              <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-x-auto text-sm">
                {textPrompt}
              </pre>
            )}
          </div>
        )}
        {jsonPrompt && (
          <div className="mt-6 p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">JSON Prompt</h3>
              <button
                onClick={() => setJsonPromptCollapsed(!jsonPromptCollapsed)}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {jsonPromptCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
            {!jsonPromptCollapsed && (
              <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-x-auto text-sm">
                {jsonPrompt}
              </pre>
            )}
          </div>
        )}
        {motivationalText && (
          <div className="mt-6 p-4 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Motivational Text</h3>
            <p className="text-gray-900 whitespace-pre-line">{motivationalText}</p>
          </div>
        )}
        {jsonStructure && (
          <div className="mt-6 p-4 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-900">JSON Structure</h3>
            <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-x-auto">
              {JSON.stringify(jsonStructure, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}