
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface PolaroidProps {
  imageData: string;
  onBack: () => void;
}

export const Polaroid = ({ imageData, onBack }: PolaroidProps) => {
  const [caption, setCaption] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.download = `vintage-photo-${Date.now()}.jpg`;
    link.href = imageData;
    link.click();
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-slide-up">
      <div className="relative bg-vintage-frame p-4 rounded-sm shadow-xl">
        <div className="relative">
          <img
            src={imageData}
            alt="Captured photo"
            className="w-full aspect-[4/3] object-cover rounded-sm animate-photo-develop"
          />
          <div className="mt-6 mb-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full text-center bg-transparent border-none font-caveat text-xl 
                       focus:outline-none focus:ring-0 placeholder:text-gray-400"
              maxLength={50}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-vintage-paper text-vintage-shadow rounded-full
                   hover:bg-vintage-cream transition-colors duration-200"
        >
          Take Another
        </button>
        <button
          onClick={downloadImage}
          disabled={isDownloading}
          className="px-6 py-2 bg-vintage-accent text-white rounded-full
                   hover:bg-opacity-90 transition-colors duration-200
                   flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Saving..." : "Save Photo"}
        </button>
      </div>
    </div>
  );
};
