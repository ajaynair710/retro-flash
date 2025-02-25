
import { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon } from "lucide-react";

interface CameraProps {
  onCapture: (imageData: string) => void;
  photosLeft: number;
  currentPhoto: number;
}

export const Camera = ({ onCapture, photosLeft, currentPhoto }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 500);

      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.filter = "sepia(0.3) contrast(1.1) brightness(1.1)";
        context.drawImage(videoRef.current, 0, 0);
        
        // Add film grain effect
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 30;
          imageData.data[i] += noise;
          imageData.data[i + 1] += noise;
          imageData.data[i + 2] += noise;
        }
        context.putImageData(imageData, 0, 0);

        // Add vignette effect
        const gradient = context.createRadialGradient(
          canvasRef.current.width / 2,
          canvasRef.current.height / 2,
          canvasRef.current.height / 3,
          canvasRef.current.width / 2,
          canvasRef.current.height / 2,
          canvasRef.current.height
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.3)");
        context.fillStyle = gradient;
        context.globalCompositeOperation = "multiply";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        onCapture(canvasRef.current.toDataURL("image/jpeg"));
      }
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[4/3] rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      {isFlashing && (
        <div className="absolute inset-0 bg-white animate-photo-flash" />
      )}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white font-caveat text-xl">
        {countdown ? (
          `Photo in ${countdown}...`
        ) : (
          `Photo ${currentPhoto} of 3`
        )}
      </div>
      <button
        onClick={startCountdown}
        disabled={countdown !== null}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-vintage-accent rounded-full 
                 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CameraIcon className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
