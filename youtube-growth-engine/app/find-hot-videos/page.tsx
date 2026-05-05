"use client";

import { useState } from "react";

interface VideoItem {
  title: string;
  viewCount: number;
  publishedAt: string;
}

const formatNumber = (value: number) => {
  return value.toLocaleString();
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const buildHotVideos = (keyword: string): VideoItem[] => {
  const base = keyword.trim() || "your keyword";
  const titles = [
    `Recent ${base} breakthrough everyone is watching`,
    `Top ${base} strategies for fast growth`,
    `How ${base} creators are getting massive views`,
    `${base} trends you need to follow now`,
    `Why ${base} content is exploding this week`,
  ];

  const seed = base.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const now = new Date();

  return titles.map((title, index) => {
    const ageDays = [2, 4, 7, 10, 14][index];
    const publishedDate = new Date(now);
    publishedDate.setDate(now.getDate() - ageDays);

    const viewCount = Math.max(
      12000,
      Math.round((seed * (5 - index) * 37) / (index + 1)) * 100 + (5 - index) * 2000
    );

    return {
      title,
      publishedAt: formatDate(publishedDate),
      viewCount,
    };
  });
};

const scoreVideo = (video: VideoItem) => {
  const date = new Date(video.publishedAt);
  const ageDays = Math.max(1, Math.round((Date.now() - date.getTime()) / 86400000));
  return video.viewCount / ageDays;
};

export default function FindHotVideosPage() {
  const [keyword, setKeyword] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const handleAnalyze = () => {
    const generated = buildHotVideos(keyword);
    const sorted = [...generated].sort((a, b) => scoreVideo(b) - scoreVideo(a)).slice(0, 5);
    setVideos(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Hot Videos</h1>
        <p className="text-gray-600 mb-6">
          Enter a keyword to find the top 5 hot video ideas. Results are ordered by recentness and view momentum.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>

        {videos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top 5 Videos</h2>
            <p className="text-sm text-gray-500 mb-4">Sorted by recent + high views.</p>
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-semibold text-gray-900">{video.title}</p>
                    <div className="text-right text-sm text-gray-600">
                      <div>{formatNumber(video.viewCount)} views</div>
                      <div>{video.publishedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
