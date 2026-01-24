
import React from 'react';
import { Helmet } from 'react-helmet';
import { Users, Wind, Hexagon } from 'lucide-react'; // Swapped Shield for Users

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
            "Dignity requires separation. Like a lotus, the sanctuary unfolds from the communal to the intimate."
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
                <Users className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Hull (The Commons)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The pressurized vessel. A shared, sub-grade sanctuary featuring a circadian skylight and restored seating. This is the "Third Place" for the public—a space to breathe, hydrate, and reset under the protection of Maslow's infrastructure.
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
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Petals (The Transition)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The decompression zone. Sound-dampened corridors separating the Hull from the private suites. Designed with "Pink Noise" and filtered air to wash off the city before you enter the core.
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
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Core (The Sanctuary Suite)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The absolute center. A fully private hygiene environment with ritual basins, touchless utilities, and full-spectrum lighting. This is the "Return to Self."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TheLotusPage;