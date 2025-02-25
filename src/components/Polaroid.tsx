
import { useState } from "react";
import { Download } from "lucide-react";

interface PolaroidProps {
  imageData: string[];
  onBack: () => void;
}

export const Polaroid = ({ imageData, onBack }: PolaroidProps) => {
  const [caption, setCaption] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = () => {
    setIsDownloading(true);
    // Create a canvas to combine the images into a strip
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height * imageData.length + 60; // Extra space for caption
        
        // Fill background
        ctx.fillStyle = "#FCFBF8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw each image
        imageData.forEach((src, index) => {
          const image = new Image();
          image.onload = () => {
            ctx.drawImage(image, 0, index * height);
            
            // If this is the last image, add caption and download
            if (index === imageData.length - 1) {
              // Add caption
              if (caption) {
                ctx.font = "30px Caveat";
                ctx.fillStyle = "#2A2826";
                ctx.textAlign = "center";
                ctx.fillText(caption, canvas.width / 2, canvas.height - 20);
              }
              
              // Download the combined image
              const link = document.createElement("a");
              link.download = `vintage-photostrip-${Date.now()}.jpg`;
              link.href = canvas.toDataURL("image/jpeg");
              link.click();
              setTimeout(() => setIsDownloading(false), 1000);
            }
          };
          image.src = src;
        });
      };
      img.src = imageData[0];
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-slide-up">
      <div className="relative bg-vintage-frame p-4 rounded-sm shadow-xl">
        <div className="relative space-y-4">
          {imageData.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Photo ${index + 1}`}
              className="w-full aspect-[4/3] object-cover rounded-sm animate-photo-develop"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
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
          Take Another Strip
        </button>
        <button
          onClick={downloadImage}
          disabled={isDownloading}
          className="px-6 py-2 bg-vintage-accent text-white rounded-full
                   hover:bg-opacity-90 transition-colors duration-200
                   flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Saving..." : "Save Strip"}
        </button>
      </div>
    </div>
  );
};
