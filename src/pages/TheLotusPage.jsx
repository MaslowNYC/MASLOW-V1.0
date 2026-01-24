
import React from 'react';
import { Helmet } from 'react-helmet';
import { Hexagon, Wind, Users } from 'lucide-react';

const TheLotusPage = () => {
  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen pt-24 pb-12">
      <Helmet>
        <title>The Lotus Design | Maslow NYC</title>
        <meta name="description" content="The architecture of dignity. Layers of privacy protecting a communal core." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-4">
            The Lotus Layout
          </h1>
          <p className="text-[#3B5998]/80 text-lg max-w-2xl mx-auto font-light italic">
            "A protective arc. The private suites form the outer shell, sheltering the communal sanctuary within."
          </p>
        </div>

        {/* The 3 Layers Diagram - Rainbow/Geode Order */}
        <div className="max-w-4xl mx-auto space-y-8 relative">
          
          {/* Vertical Line Connector */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-[#C5A059]/30 hidden md:block"></div>

          {/* Layer 1: The Sanctuary Suites (Outer Ring) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998] text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              1
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Hexagon className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Perimeter (The Suites)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The protective outer shell. The Sanctuary Suites line the perimeter of the facility, acting as a physical barrier against the city's noise. By pushing the private rooms to the edge, we create a fortified ring of silence that insulates the rest of the space.
              </p>
            </div>
          </div>

          {/* Layer 2: The Transition (Middle) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998]/80 text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              2
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Threshold (The Hall)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The acoustic airlock. A "Pink Noise" corridor that separates the private suites from the communal center. This buffer zone ensures that the solitude of the suites and the social energy of the Hull never bleed into one another.
              </p>
            </div>
          </div>

          {/* Layer 3: The Hull (Inner Core) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              3
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl border border-[#C5A059] shadow-xl w-full">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Core (The Hull)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The protected heart. Sheltered inside the ring of suites is the communal "Third Place"—an open sanctuary with church pews and the circadian skylight. Safe, central, and completely insulated from the world above.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TheLotusPage;