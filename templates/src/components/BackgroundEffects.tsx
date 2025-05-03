
import React from 'react';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Brighter gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-purple-600 to-orange-500"></div>
      
      {/* Light glow in the center */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 opacity-50"></div>
      
      {/* Brighter animated colorful glow circles */}
      <div className="absolute top-[20%] left-[25%] w-[45rem] h-[45rem] rounded-full bg-blue-400/30 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-400/40 blur-[120px] animate-pulse-slow [animation-delay:1s]"></div>
      <div className="absolute bottom-[30%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-pink-400/30 blur-[100px] animate-pulse-slow [animation-delay:1.5s]"></div>
      <div className="absolute top-[5%] right-[20%] w-[30rem] h-[30rem] rounded-full bg-orange-300/30 blur-[100px] animate-pulse-slow [animation-delay:2s]"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[radial-gradient(white,_transparent_1px)] bg-[length:25px_25px] opacity-[0.02]"></div>
    </div>
  );
};

export default BackgroundEffects;
