import React from "react";

const GoogleLoader: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex justify-center items-center">
        <div className="w-[150px] h-[150px] flex justify-center items-center relative">
          {/* L1 - Yellow bar */}
          <div className="w-[15px] h-[65px] bg-[#f4b400] absolute animate-move-h"></div>

          {/* L2 - Red bar */}
          <div className="w-[15px] h-[60px] bg-[#db4437] absolute rotate-90 animate-move-v"></div>

          {/* E1 - Green line */}
          <div className="w-px h-[40px] bg-[#0f9d58] opacity-30 absolute top-0 left-[8%] animate-effect"></div>

          {/* E2 - Blue line */}
          <div className="w-[60px] h-px bg-[#4285f4] opacity-80 absolute top-[8%] left-0 animate-effect-delayed"></div>

          {/* E3 - X symbol */}
          <div className="absolute top-[10%] left-[12%] font-sans font-black text-[18px] text-[#4285f4] animate-rot">
            X
          </div>

          {/* E4 - Red line */}
          <div className="w-px h-[40px] bg-[#db4437] opacity-30 absolute top-[90%] right-[10%] animate-effect"></div>

          {/* E5 - Yellow line */}
          <div className="w-[40px] h-px bg-[#f4b400] opacity-30 absolute top-full right-0 animate-effect-delayed"></div>

          {/* E6 - Asterisk symbol */}
          <div className="absolute top-full right-0 font-sans text-[32px] text-[#0f9d58] animate-scale">
            *
          </div>

          {/* E7 - Yellow diagonal line */}
          <div className="w-px h-[20px] bg-[#f4b400] absolute bottom-0 left-0 rotate-45 animate-height"></div>

          {/* E8 - Green horizontal line */}
          <div className="w-[20px] h-px bg-[#0f9d58] absolute bottom-1/2 left-0 animate-width"></div>
        </div>
      </div>

      {/* Tailwind Custom Animations */}
      <style  global>{`
        @keyframes move-h {
          0% {
            top: 0;
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          50% {
            top: 30%;
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes move-v {
          0% {
            left: 0;
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          50% {
            left: 45%;
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes effect {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes rot {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes scale {
          0% {
            scale: 1;
          }
          50% {
            scale: 1.9;
          }
          100% {
            scale: 1;
          }
        }

        @keyframes height {
          0% {
            bottom: 0%;
            left: 0%;
            height: 0px;
          }
          25% {
            height: 90px;
          }
          50% {
            bottom: 100%;
            left: 100%;
            height: 90px;
          }
          75% {
            height: 0px;
          }
          100% {
            bottom: 0%;
            left: 0%;
            height: 0px;
          }
        }

        @keyframes width {
          0% {
            left: 0%;
            width: 0px;
          }
          50% {
            left: 100%;
            width: 90px;
          }
          100% {
            left: 0%;
            width: 0px;
          }
        }

        .animate-move-h {
          animation: move-h 1.2s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }

        .animate-move-v {
          animation: move-v 1.2s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }

        .animate-effect {
          animation: effect 0.2s 0.1s infinite linear;
        }

        .animate-effect-delayed {
          animation: effect 0.3s 0.2s infinite linear;
        }

        .animate-rot {
          animation: rot 0.8s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }

        .animate-scale {
          animation: scale 0.8s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }

        .animate-height {
          animation: height 1s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }

        .animate-width {
          animation: width 1.5s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
        }
      `}</style>
    </div>
  );
};

export default GoogleLoader;
