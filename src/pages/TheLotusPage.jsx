
import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Wind, Hexagon } from 'lucide-react';

const TheLotusPage = () => {
  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen pt-24 pb-12">
      <Helmet>
        <title>The Lotus Design | Maslow NYC</title>
        <meta name="description" content="The architecture of dignity. Unfolding the layers of the Maslow Sanctuary." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-4">
            The Lotus Layout
          </h1>
          <p className="text-[#3B5998]/80 text-lg max-w-2xl mx-auto font-light italic">
            "Dignity requires separation. Like a lotus, the sanctuary unfolds in protected layers."
          </p>
        </div>

        {/* The 3 Layers Diagram */}
        <div className="max-w-4xl mx-auto space-y-8 relative">
          
          {/* Vertical Line Connector */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-[#C5A059]/30 hidden md:block"></div>

          {/* Layer 1: The Hull */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998] text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              1
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Hull (Exterior)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The protective shell. A hardened, weatherproof barrier separating the chaos of the street from the sanctuary. Armored glass, acoustic dampening, and access control.
              </p>
            </div>
          </div>

          {/* Layer 2: The Petals */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998]/80 text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              2
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Petals (Transition)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The decompression zone. A hallway designed with "Pink Noise" soundscapes and filtered air. This is where the city washes off before you enter the private suite.
              </p>
            </div>
          </div>

          {/* Layer 3: The Core */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              3
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl border border-[#C5A059] shadow-xl w-full">
              <div className="flex items-center gap-3 mb-3">
                <Hexagon className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Core (Suite)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The absolute center. A private environment with ritual ablution basins, touchless utilities, full-spectrum lighting, and the "Return to Self."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TheLotusPage;
