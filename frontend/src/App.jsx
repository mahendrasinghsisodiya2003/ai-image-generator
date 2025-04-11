import React, { useState } from "react";
import axios from "axios";

// API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || "https://ai-image-generator-com.onrender.com";

function App() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("none");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError({
        title: "Missing Input",
        message: "Please describe what you want to generate"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Sending request to:", `${API_URL}/generate`);
      console.log("Request payload:", { prompt, style });

      const response = await axios.post(`${API_URL}/generate`, 
        { prompt, style },
        {
          timeout: 90000, // 90 seconds timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Received response:", response.data);

      if (!response.data?.imageUrl) {
        throw new Error("Server returned no image");
      }

      setGeneratedImage(response.data.imageUrl);
      
    } catch (error) {
      console.error("Generation error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: API_URL
      });

      setError({
        title: "Generation Failed",
        message: error.response?.data?.details || 
                 error.response?.data?.error || 
                 error.message || 
                 "Failed to connect to the server",
        suggestion: error.response?.data?.suggestion || 
                   (error.message?.includes("Network Error") ? 
                     "Please check your internet connection and try again" : 
                     "Please try a different description")
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <h1 className="text-6xl font-bold text-center mb-6 text-gray-800">
        AI Image Generator
      </h1>
      <p className="text-center text-xl mb-12 text-gray-600">
        Create custom images from your text descriptions
      </p>

      <div className="max-w-2xl mx-auto">
        {/* Prompt Input */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <label htmlFor="prompt" className="block text-gray-700 mb-2 font-medium">
            Describe your image:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate (e.g. 'A sunset over mountains with a lake reflection')"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Style Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <label htmlFor="style" className="block text-gray-700 mb-2 font-medium">
            Choose a style:
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">No specific style</option>
            <option value="photographic">Photographic</option>
            <option value="digital-art">Digital Art</option>
            <option value="anime">Anime</option>
            <option value="cinematic">Cinematic Animation</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 text-xl rounded-xl font-semibold mb-8 ${
            isGenerating
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isGenerating ? "Creating Your Image..." : "Generate Image"}
        </button>

        {/* Result Display */}
        {generatedImage && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <img
              src={generatedImage}
              alt="Generated image"
              className="w-full rounded-lg"
            />
            <a
              href={generatedImage}
              download="generated-image.png"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Download Image
            </a>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-bold text-red-800">{error.title}</h3>
            <p className="text-red-600">{error.message}</p>
            {error.suggestion && (
              <p className="text-red-500 text-sm mt-1">{error.suggestion}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
