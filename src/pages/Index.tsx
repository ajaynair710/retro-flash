
import { useState } from "react";
import { Camera } from "../components/Camera";
import { Polaroid } from "../components/Polaroid";

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const maxPhotos = 3;

  const handleCapture = (imageData: string) => {
    setImages(prev => [...prev, imageData]);
  };

  return (
    <div className="min-h-screen bg-vintage-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl text-vintage-shadow mb-8 font-caveat">
          Retro Flash ✨
        </h1>
        
        <div className="relative">
          {images.length === maxPhotos ? (
            <Polaroid
              imageData={images}
              onBack={() => setImages([])}
            />
          ) : (
            <Camera 
              onCapture={handleCapture} 
              photosLeft={maxPhotos - images.length}
              currentPhoto={images.length + 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
