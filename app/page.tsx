'use client';

import { useState } from 'react';

interface Suggestion {
  text: string;
  explanation: string;
}

interface Results {
  titles: Suggestion[];
  thumbnails: Suggestion[];
  description: string;
  hashtags: string[];
  hook: Suggestion;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const generateSuggestions = async () => {
    if (!url) return;
    setLoading(true);
    // Simulate analysis and generation
    setTimeout(() => {
      const mockResults: Results = {
        titles: [
          {
            text: "You Won't Believe What Happens Next! 😱",
            explanation: "Emotional hook using surprise to trigger curiosity and increase CTR by 20-30% as viewers click to satisfy their intrigue."
          },
          {
            text: "The Secret Trick That Changed Everything",
            explanation: "Curiosity-driven title promising value, boosting retention by setting expectations for useful content that keeps viewers engaged."
          },
          {
            text: "How to Master [Topic] in 5 Minutes - Step by Step Guide",
            explanation: "Search-optimized title targeting specific queries, improving discoverability and CTR from search results."
          }
        ],
        thumbnails: [
          {
            text: "Bold red text: 'SHOCKING REVEAL'",
            explanation: "High-contrast colors and action words create visual urgency, increasing CTR by drawing attention in feed."
          },
          {
            text: "Before/After split with question mark",
            explanation: "Visual storytelling shows transformation, piquing curiosity and encouraging clicks to see the full result."
          },
          {
            text: "Face with surprised expression + key benefit",
            explanation: "Emotional facial cues combined with value proposition build trust and motivate immediate engagement."
          }
        ],
        description: "Discover the ultimate guide to [topic] that will transform your approach forever. In this video, we break down the step-by-step process, reveal insider tips, and show you exactly how to achieve [benefit]. Whether you're a beginner or expert, this comprehensive tutorial covers everything you need to know. Don't forget to like, subscribe, and hit the bell for more [topic] content!",
        hashtags: ["#Topic", "#Tutorial", "#HowTo", "#Tips", "#Guide", "#Learn"],
        hook: {
          text: "Have you ever struggled with [problem]? What if I told you there's a simple solution that takes just 5 minutes? Stick around because what I'm about to show you will change everything you thought you knew about [topic].",
          explanation: "Opens with pain point identification, creates urgency with time constraint, and promises transformation to hook viewers in the first 15 seconds for maximum retention."
        }
      };
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          YouTube Growth Engine
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateSuggestions}
              disabled={loading || !url}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">High-CTR Titles</h2>
              <div className="space-y-4">
                {results.titles.map((title, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <p className="font-medium mb-2">{title.text}</p>
                    <p className="text-sm text-gray-600 mb-2">{title.explanation}</p>
                    <button
                      onClick={() => copyToClipboard(title.text)}
                      className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Thumbnail Text Ideas</h2>
              <div className="space-y-4">
                {results.thumbnails.map((thumb, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <p className="font-medium mb-2">{thumb.text}</p>
                    <p className="text-sm text-gray-600 mb-2">{thumb.explanation}</p>
                    <button
                      onClick={() => copyToClipboard(thumb.text)}
                      className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Optimized Description</h2>
              <p className="mb-4">{results.description}</p>
              <button
                onClick={() => copyToClipboard(results.description)}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Copy
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Hashtags</h2>
              <p className="mb-4">{results.hashtags.join(' ')}</p>
              <button
                onClick={() => copyToClipboard(results.hashtags.join(' '))}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Copy
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Short Hook Script</h2>
              <p className="mb-2">{results.hook.text}</p>
              <p className="text-sm text-gray-600 mb-4">{results.hook.explanation}</p>
              <button
                onClick={() => copyToClipboard(results.hook.text)}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
