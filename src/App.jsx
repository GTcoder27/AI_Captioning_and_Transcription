import React, { useState } from "react";
import Chatbot from "./pages/Chatbot"; // Assume Chatbot component
import AudioExtractor from "./pages/AudioExtractor"; // Assume AudioExtractor component
import FileExtractor from "./pages/FileExtractor"; // Assume FileExtractor component

const App = () => {
  const [activeComponent, setActiveComponent] = useState("Chatbot");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Chatbot":
        return <Chatbot />;
      case "AudioExtractor":
        return <AudioExtractor />;
      case "FileExtractor":
        return <FileExtractor />;
      default:
        return <Chatbot />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col  bg-cover bg-center items-center bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6"
      style={{ backgroundImage: "url('/wallpaper/wall.jpg')" }}
    >
      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveComponent("Chatbot")}
          className={`px-6 py-3 rounded-lg text-lg font-bold shadow-md transition-transform transform w-full sm:w-auto ${activeComponent === "Chatbot"
              ? "bg-purple-700 text-white scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
        >
          💬 Text Translator
        </button>
        <button
          onClick={() => setActiveComponent("AudioExtractor")}
          className={`px-6 py-3 rounded-lg text-lg font-bold shadow-md transition-transform transform w-full sm:w-auto ${activeComponent === "AudioExtractor"
              ? "bg-purple-700 text-white scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
        >
          🎵 Audio Extractor
        </button>
        <button
          onClick={() => setActiveComponent("FileExtractor")}
          className={`px-6 py-3 rounded-lg text-lg font-bold shadow-md transition-transform transform w-full sm:w-auto ${activeComponent === "FileExtractor"
              ? "bg-purple-700 text-white scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
        >
          📂 File Extractor
        </button>
      </div>


      {/* Header Section */}
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Multi-Utility Tool
      </h1>
      <p className="text-lg text-gray-400 text-center max-w-2xl">
        Switch between different tools effortlessly. Choose a tool from the
        navigation buttons above to get started.
      </p>

      {/* Active Component */}
      <div className="w-full max-w-4xl rounded-lg shadow-lg">
        {renderComponent()}
      </div>
    </div>

  );
};

export default App;
