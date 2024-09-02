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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const pace = `${minutes}:${seconds}`;

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
      }),
    });

    const data = await response.json();
    setMotivationalText(data.motivationalText);
    setJsonStructure(data.jsonStructure);
    setLoading(false);
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
                Distance (kilometers)
              </label>
              <input
                id="distance"
                name="distance"
                type="number"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Distance in kilometers"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pace" className="block text-sm font-medium text-gray-700">
                Target Pace
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="minutes"
                  name="minutes"
                  type="number"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Minutes"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <span>:</span>
                <input
                  id="seconds"
                  name="seconds"
                  type="number"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Seconds"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Additional Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Additional Comments"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            >
              Get Motivated
            </button>
          </div>
        </form>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {motivationalText && (
          <div className="mt-6 p-4 bg-white rounded-md shadow-md">
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