
import { useState } from "react";
import { Camera } from "../components/Camera";
import { Polaroid } from "../components/Polaroid";

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-vintage-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl text-vintage-shadow mb-8 font-caveat">
          Vintage Photobooth
        </h1>
        
        <div className="relative">
          {capturedImage ? (
            <Polaroid
              imageData={capturedImage}
              onBack={() => setCapturedImage(null)}
            />
          ) : (
            <Camera onCapture={(imageData) => setCapturedImage(imageData)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
