import React, { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer 
      className={`bg-gradient-to-r from-green-600 to-emerald-700 text-white p-2 mt-auto w-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <p className="text-xs font-medium tracking-wider transform transition-transform duration-300">
              &copy; {new Date().getFullYear()} Futsal Admin. All rights reserved.
            </p>
            <div className="mt-1 h-0.5 w-8 bg-white opacity-70 mx-auto transition-all duration-500 ease-out" 
                 style={{ width: isHovered ? '60%' : '20%' }}>
            </div>
          </div>
        </div>
        
        {/* Animated soccer balls */}
        <div className="flex justify-center space-x-6 mt-1">
          {[1, 2, 3].map((ball) => (
            <div 
              key={ball}
              className="w-1 h-1 bg-white rounded-full opacity-0"
              style={{
                animation: `fadeIn 0.5s ease-out ${ball * 0.2}s forwards, bounce 1.5s infinite ${ball * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 0.6; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        footer {
          box-shadow: 0 -2px 10px rgba(0, 100, 0, 0.2);
          transition: box-shadow 0.3s ease;
        }
        
        footer:hover {
          box-shadow: 0 -3px 12px rgba(0, 100, 0, 0.3);
        }
      `}</style>
    </footer>
  );
};

export default Footer;