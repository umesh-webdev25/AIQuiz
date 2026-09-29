import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Loader2, Code2, Terminal } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CodingPractice() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const predefinedTopics = [
    "Array",
    "String",
    "Linked List",
    "HashMap",
    "Stack",
    "Queue",
    "Binary Search",
    "Sorting",
    "Recursion",
    "Dynamic Programming",
  ];

  const handleGenerate = async () => {
    const finalTopic = topic === "custom" ? customTopic : topic;
    if (!finalTopic) {
      toast.error("Please select or enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      await api.post("/coding/problems/generate", {
        topic: finalTopic,
        difficulty,
        count: Number(count),
      });
      toast.success(`Generated ${count} problems successfully!`);
      navigate(`/coding/workspace?topic=${encodeURIComponent(finalTopic)}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate problems",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
          <Terminal className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Coding Practice
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Practice coding problems with AI assistance.
        </p>
      </div>

      {isGenerating ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Generating problems...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Generating {count} {topic === "custom" ? customTopic : topic} Problems
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-orange-600 h-2 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              What do you want to practice?
            </label>
            <div className="flex flex-wrap gap-3">
              {predefinedTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    topic === t
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-orange-300 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setTopic("custom")}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  topic === "custom"
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-900"
                }`}
              >
                Custom Topic...
              </button>
            </div>

            {topic === "custom" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your own topic (e.g. Graph Algorithms)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            )}
          </div>

          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Difficulty
            </label>
            <div className="flex gap-4">
              {["Easy", "Medium", "Hard", "Mixed"].map((diff) => (
                <label
                  key={diff}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff}
                    checked={difficulty === diff}
                    onChange={() => setDifficulty(diff)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {diff}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Number of Problems
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || (topic === "custom" && !customTopic) || count < 1 || count > 20}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Code2 className="w-6 h-6" />
            Generate {count} Problems
          </button>
        </div>
      )}
    </div>
  );
}
