'use client';

import { useState } from 'react';

interface Suggestion {
  text: string;
  explanation: string;
}

interface VideoData {
  title: string;
  viewCount: number;
  publishDate: string;
  categoryId: string;
  categoryName: string;
  duration: string;
  durationSeconds: number;
  durationText: string;
}

interface Results {
  titles: Suggestion[];
  thumbnails: Suggestion[];
  description: string;
  hashtags: string[];
  hook: Suggestion;
  videoData: VideoData;
  abTest: {
    plan: string;
    firstTest: string;
    bestTitle: string;
    recommendedOrder: string;
    timeline: string;
  };
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  const detectCategory = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    const categories = {
      music: ["music", "song", "album", "track", "lyrics", "official video", "remix", "cover", "live", "concert"],
      vlog: ["vlog", "day in my life", "daily", "lifestyle", "travel", "routine", "morning", "evening", "weekend", "update"],
      tutorial: ["how to", "tutorial", "guide", "step by step", "learn", "beginner", "easy", "simple", "master", "tips"],
      review: ["review", "honest", "vs", "comparison", "best", "worst", "rating", "unboxing", "first look", "impressions"],
      gaming: ["game", "gaming", "playthrough", "walkthrough", "lets play", "gameplay", "level", "boss", "achievement"],
      tech: ["tech", "gadget", "device", "software", "app", "review", "setup", "tutorial", "hack", "tip"],
      cooking: ["cook", "recipe", "kitchen", "food", "meal", "bake", "dish", "ingredient", "delicious"],
      fitness: ["workout", "exercise", "gym", "fitness", "health", "training", "diet", "muscle", "cardio"],
    };
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }
    return "general"; // default
  };

  const normalizeApiCategory = (categoryName: string): string => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('music')) return 'music';
    if (lower.includes('people') || lower.includes('blogs') || lower.includes('vlog')) return 'vlog';
    if (lower.includes('howto') || lower.includes('how to') || lower.includes('education') || lower.includes('style')) return 'tutorial';
    if (lower.includes('gaming')) return 'gaming';
    if (lower.includes('entertainment') || lower.includes('comedy') || lower.includes('film')) return 'general';
    if (lower.includes('science') || lower.includes('technology') || lower.includes('tech')) return 'tech';
    if (lower.includes('news') || lower.includes('politics')) return 'review';
    if (lower.includes('food') || lower.includes('cooking') || lower.includes('meal')) return 'cooking';
    if (lower.includes('fitness') || lower.includes('health') || lower.includes('sport') || lower.includes('workout')) return 'fitness';
    return '';
  };

  const formatRecencyTag = (publishDate: string) => {
    if (!publishDate) return '';
    const published = new Date(publishDate);
    const ageDays = Math.floor((Date.now() - published.getTime()) / 86400000);
    if (ageDays <= 7) return 'New';
    if (ageDays <= 30) return 'Recent';
    return '';
  };

  const popularityPhrase = (viewCount: number) => {
    if (viewCount > 200000) return 'Viral';
    if (viewCount > 50000) return 'Trending';
    if (viewCount > 10000) return 'Popular';
    return '';
  };

  const calculateCtrScore = (viewCount: number) => {
    if (viewCount >= 500000) return 85;
    if (viewCount >= 200000) return 75;
    if (viewCount >= 100000) return 65;
    if (viewCount >= 50000) return 55;
    if (viewCount >= 20000) return 45;
    if (viewCount >= 10000) return 35;
    return 25;
  };

  const generateCategoryBasedSuggestions = (title: string, category: string, meta: VideoData): Results => {
    let titles: Suggestion[];
    let thumbnails: Suggestion[];
    let description: string;
    let hashtags: string[];
    let hook: Suggestion;

    const popularityTag = popularityPhrase(meta.viewCount);
    const titlePrefix = popularityTag ? `${popularityTag} ` : '';

    switch (category) {
      case "music":
        titles = [
          {
            text: `${titlePrefix}Official Music Video: ${title}`,
            explanation: "Direct and professional title that establishes credibility and attracts fans looking for official releases."
          },
          {
            text: `You Won't Stop Listening to This! ${title} 🎵`,
            explanation: "Emotional hook using music energy and hype to create FOMO and increase CTR among music lovers."
          },
          {
            text: `${title} - Lyrics Video`,
            explanation: "Search-optimized title targeting users looking for lyrics, improving discoverability in music searches."
          }
        ];
        thumbnails = [
          {
            text: "Album artwork with play button overlay",
            explanation: "Familiar visual branding that immediately identifies the music content and encourages clicks."
          },
          {
            text: "Artist face with headphones and music notes",
            explanation: "Personal connection through facial expression combined with music elements to build emotional engagement."
          },
          {
            text: "Bold text: ''NEW SINGLE'' with release date",
            explanation: "Creates urgency and exclusivity, motivating immediate views from fans awaiting new releases."
          }
        ];
        description = `?? Listen to "${title}" - the latest track from our music collection! This song brings together incredible melodies and powerful lyrics that will take you on an emotional journey. If you enjoy this video, don't forget to like, subscribe for more music, and hit the bell for notifications on new releases!`;
        hashtags = ["#Music", "#NewMusic", "#OfficialVideo", "#MusicVideo", "#Song", "#Artist"];
        hook = {
          text: `Ever heard a song that instantly transports you to another world? This track "${title}" does exactly that. From the first note to the final chord, you're in for an unforgettable musical experience. Let's dive in!`,
          explanation: "Creates anticipation by promising an emotional musical experience, hooking listeners immediately with sensory language."
        };
        break;

      case "vlog":
        titles = [
          {
            text: `${titlePrefix}My Honest Thoughts on ${title}`,
            explanation: "Personal and authentic title that builds trust and attracts viewers seeking genuine opinions."
          },
          {
            text: `You Won't Believe What Happened in ${title}!`,
            explanation: "Curiosity hook using surprise to create intrigue and boost CTR in vlog-style content."
          },
          {
            text: `${title} - Real Talk`,
            explanation: "Search-friendly title targeting viewers looking for authentic, unfiltered content."
          }
        ];
        thumbnails = [
          {
            text: "Your face with surprised expression",
            explanation: "Personal branding creates immediate recognition and emotional connection with your audience."
          },
          {
            text: "Split screen: Before/After of the experience",
            explanation: "Visual storytelling shows transformation, piquing curiosity about your journey."
          },
          {
            text: "Bold text overlay: ''RAW & REAL''",
            explanation: "Promises authenticity, attracting viewers tired of polished content."
          }
        ];
        description = `Welcome back to another vlog episode! In "${title}", I share my real experiences and thoughts about this topic. From the highs to the lows, I keep it 100% authentic. If this resonates with you, like and subscribe for more honest vlogs, and let me know your thoughts in the comments!`;
        hashtags = ["#Vlog", "#Vlogger", "#DailyVlog", "#Life", "#RealTalk", "#Honest"];
        hook = {
          text: `Hey everyone! Today I'm sharing something that's been on my mind - "${title}". It's been quite the journey, and I can't wait to tell you all about it. Stick around for the full story!`,
          explanation: "Personal greeting creates intimacy, while promising a compelling story to maintain viewer interest."
        };
        break;

      case "tutorial":
        titles = [
          {
            text: `${titlePrefix}${title} - Step by Step Guide`,
            explanation: "Clear, actionable title that attracts viewers seeking practical learning content."
          },
          {
            text: `The Easiest Way to ${title}`,
            explanation: "Promises simplicity and encourages viewers looking for an easy-to-follow solution."
          },
          {
            text: `${title} Tutorial for Beginners`,
            explanation: "Search-optimized title targeting newcomers, expanding your audience reach."
          }
        ];
        thumbnails = [
          {
            text: "Before/After results with checkmarks",
            explanation: "Shows tangible outcomes, motivating viewers with proof of value."
          },
          {
            text: "Numbered steps: 1, 2, 3...",
            explanation: "Visual promise of structured learning creates confidence in the content."
          },
          {
            text: "Question mark with solution revealed",
            explanation: "Addresses pain points directly, creating immediate relevance."
          }
        ];
        description = `Learn ${title} with this comprehensive step-by-step tutorial! Whether you're a complete beginner or looking to improve your skills, this guide covers everything you need to know. Follow along, take notes, and don't forget to like and subscribe for more helpful tutorials!`;
        hashtags = ["#Tutorial", "#HowTo", "#Learn", "#Guide", "#Education", "#Skills"];
        hook = {
          text: `Struggling with ${title}? Don't worry, I've got you covered! In this tutorial, I'll walk you through every step from start to finish. By the end, you'll be able to do this like a pro. Let's get started!`,
          explanation: "Addresses common pain points, promises comprehensive guidance, and sets clear expectations for learning outcomes."
        };
        break;

      case "review":
        titles = [
          {
            text: `${titlePrefix}Honest ${title} Review - Pros & Cons`,
            explanation: "Promises balanced, trustworthy assessment that builds credibility."
          },
          {
            text: `${title} Review: Is It Worth It?`,
            explanation: "Direct question engages curiosity and addresses the viewer's main concern."
          },
          {
            text: `${title} vs Competitors - Which is Better?`,
            explanation: "Comparison format attracts viewers researching options."
          }
        ];
        thumbnails = [
          {
            text: "Product image with star rating overlay",
            explanation: "Clear visual hierarchy shows the review subject and immediate value proposition."
          },
          {
            text: "Thumbs up/down split screen",
            explanation: "Visual representation of pros/cons creates curiosity about the verdict."
          },
          {
            text: "Question mark over product",
            explanation: "Creates intrigue about the reviewer's opinion."
          }
        ];
        description = `My complete ${title} review! After testing it extensively, I'll share my honest thoughts on performance, value, and whether it's worth your money. If you're considering this product, this review will help you make an informed decision. Like and subscribe for more reviews!`;
        hashtags = ["#Review", "#HonestReview", "#ProductReview", "#Unboxing", "#Testing"];
        hook = {
          text: `Today I'm reviewing ${title} - and you might be surprised by what I found! I've tested it thoroughly, so stick around for my complete breakdown of the good, the bad, and everything in between.`,
          explanation: "Creates anticipation by hinting at surprising findings, encouraging viewers to stay for the full analysis."
        };
        break;

      default:
        // Fallback to general content creation
        titles = [
          {
            text: `${titlePrefix}You Won't Believe This ${title}! 🚀`,
            explanation: "Emotional hook using surprise to trigger curiosity and increase CTR."
          },
          {
            text: `The Truth About ${title}`,
            explanation: "Curiosity-driven title promising insights, boosting retention with valuable content."
          },
          {
            text: `${title} - Complete Guide`,
            explanation: "Search-optimized title targeting specific queries for better discoverability."
          }
        ];
        thumbnails = [
          {
            text: "Bold red text: 'SHOCKING REVEAL'",
            explanation: "High-contrast colors create visual urgency in the feed."
          },
          {
            text: "Before/After split with question mark",
            explanation: "Shows transformation to pique curiosity."
          },
          {
            text: "Face with surprised expression + key benefit",
            explanation: "Emotional cues build trust and engagement."
          }
        ];
        description = `Discover everything about ${title} in this comprehensive video! We break down the key insights, tips, and everything you need to know. Don't forget to like, subscribe, and hit the bell for more content!`;
        hashtags = ["#Content", "#Tutorial", "#Guide", "#Learn", "#Tips"];
        hook = {
          text: `Have you ever wondered about ${title}? What if I told you there's a simple way to understand it all? Stick around because what I'm about to share will change your perspective.`,
          explanation: "Opens with curiosity, promises value, and sets expectations for transformative content."
        };
    }

    const abTest = buildABTestPlan(titles);
    return { titles, thumbnails, description, hashtags, hook, abTest };
  };

  const buildABTestPlan = (titles: Suggestion[]) => {
    const ranked = titles; // No ranking, just use as is
    const bestTitle = ranked[0]?.text || 'Primary title';
    const secondTest = ranked[1]?.text || ranked[0]?.text || 'Secondary title';
    const thirdTest = ranked[2]?.text || '';

    const plan = `Start by testing the best title "${bestTitle}" against backups "${secondTest}" and "${thirdTest}". Measure CTR and retention closely.`;
    const recommendedOrder = `1) ${bestTitle}${secondTest ? `  2) ${secondTest}` : ''}${thirdTest ? `  3) ${thirdTest}` : ''}`;
    const timeline = 'Test each title for 2–3 days';

    return { plan, firstTest: bestTitle, bestTitle, recommendedOrder, timeline };
  };

  const generateSuggestions = async () => {
    if (!url) return;
    setLoading(true);
    try {
      // Extract video ID
      const videoId = extractVideoId(url);
      if (!videoId) {
        alert('Invalid YouTube URL');
        setLoading(false);
        return;
      }

      // Fetch video info
      const response = await fetch(`/api/video?videoId=${videoId}`);
      if (!response.ok) {
        alert('Failed to fetch video info');
        setLoading(false);
        return;
      }
      const data = await response.json();
      const videoData: VideoData = {
        title: String(data.title || 'Untitled Video'),
        viewCount: Number(data.viewCount || 0),
        publishDate: String(data.publishDate || ''),
        categoryId: String(data.categoryId || ''),
        categoryName: String(data.categoryName || ''),
        duration: String(data.duration || ''),
        durationSeconds: Number(data.durationSeconds || 0),
        durationText: String(data.durationText || ''),
      };
      const category = normalizeApiCategory(videoData.categoryName) || detectCategory(videoData.title);

      // Generate suggestions based on category and video metadata
      const results: Results = generateCategoryBasedSuggestions(videoData.title, category, videoData);
      setResults(results);
    } catch (error) {
      alert('Error generating suggestions');
      console.error(error);
    }
    setLoading(false);
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
              <h2 className="text-2xl font-semibold mb-4">Video Metadata</h2>
              <p className="mb-2"><strong>Title:</strong> {results.videoData.title}</p>
              <p className="mb-2"><strong>Category:</strong> {results.videoData.categoryName || 'Unknown'}</p>
              <p className="mb-2"><strong>Views:</strong> {results.videoData.viewCount.toLocaleString()}</p>
              <p className="mb-2"><strong>Published:</strong> {new Date(results.videoData.publishDate).toLocaleDateString()}</p>
              <p className="mb-2"><strong>Duration:</strong> {results.videoData.durationText}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">High-CTR Titles</h2>
              <p className="text-sm text-gray-600 mb-4">Test each title for 2–3 days</p>
              <div className="space-y-4">
                {results.titles.map((title, index) => (
                  <div key={index} className={`border border-gray-200 rounded-md p-4 ${index === 0 ? 'bg-yellow-50 border-yellow-300' : index === 1 || index === 2 ? 'bg-blue-50 border-blue-300' : ''}`}>
                    <p className="font-medium mb-2">
                      {index === 0 && <span className="text-yellow-700 font-bold">Use this first: </span>}
                      {(index === 1 || index === 2) && <span className="text-blue-700 font-bold">Test next: </span>}
                      {title.text}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{title.explanation}</p>
                    {index === 0 && (
                      <p className="text-sm text-green-600 mb-2">This title ranks highest due to its engaging keywords, optimal length, and CTR-boosting elements like questions or emotional hooks.</p>
                    )}
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
              <h2 className="text-2xl font-semibold mb-4">What to do now</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Use BEST title immediately</li>
                <li>Monitor CTR for 48 hours</li>
                <li>If CTR drops → switch to next title</li>
              </ol>
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
              <h2 className="text-2xl font-semibold mb-4">A/B Testing Plan</h2>
              <p className="font-medium mb-2">Best title to start: {results.abTest.bestTitle}</p>
              <p className="mb-2">Recommended order: {results.abTest.recommendedOrder}</p>
              <p className="mb-4">{results.abTest.plan}</p>
              <p className="text-sm text-gray-600 mb-4">{results.abTest.timeline}</p>
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
