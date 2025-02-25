import React, { useState, useRef } from "react";
import { Loader, UploadCloud } from "lucide-react";
import axios from "axios";

const AudioExtractor = () => {
  const [file, setFile] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messageEndRef = useRef(null);

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setResponseText("");

    try {
      // Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // Replace with your actual preset name
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dno2u9uqa/video/upload", // Replace with your Cloudinary cloud name
        formData
      );
      const videoUrl = cloudinaryResponse.data.secure_url;
      const audioUrl = videoUrl.replace(/\.mp4$/, ".mp3");

      // Pass Cloudinary URL to backend
      const backendResponse = await axios.post("/convert-audio-to-text", {
        audioUrl,
      });
      setResponseText(backendResponse.data.transcription || "No text extracted.");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-2 bg-cover bg-center">
      {/* Output Section */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto w-full sm:w-[80%] md:w-[65%] bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 leading-relaxed mt-4 sm:mt-8">
        <h2 className="text-white text-xl font-bold border-b-2 border-white/50 pb-2 mb-4">
          Audio Processing History
        </h2>
        {responseText && (
          <div className="bg-gray-900/40 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-500">
            <div className="bg-teal-600/30 text-white rounded-md w-full sm:w-[90%] p-3 mb-2">
              <p className="font-semibold">Extracted Text:</p>
              <p className="whitespace-pre-wrap">{responseText}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 font-medium text-center">{error}</div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 space-y-6 w-full sm:w-[80%] md:w-[65%] mt-6">
        <h1 className="text-2xl font-bold text-center text-white uppercase">
          Audio Extractor
        </h1>
        <div className="flex items-center justify-center">
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-[90%] transition-shadow duration-200 shadow-md"
          />
          <button
            onClick={handleFileUpload}
            disabled={loading}
            className={`p-4 ml-3 rounded-lg font-semibold text-white flex justify-center items-center transition-all duration-200 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            }`}
          >
            {loading ? (
              <Loader className="animate-spin text-xl" />
            ) : (
              <UploadCloud className="text-xl" />
            )}
          </button>
        </div>
        {error && <p className="text-red-500 font-medium text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AudioExtractor;
