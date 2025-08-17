"use client";

import { useEffect, useState } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMdUp, setIsMdUp] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsMdUp(window.innerWidth >= 768); 
    };

    checkScreen(); 
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isMdUp) {
    // Show blocking screen for small devices
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100 text-center p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            📱 Not Supported on Small Screens
          </h1>
          <p className="text-gray-600">
            Please use a device with a larger screen (tablet or desktop) to access this application.
          </p>
        </div>
      </div>
    );
  }

  // Normal app content for md and up
  return <>{children}</>;
}
