
import React from 'react';
import { Helmet } from 'react-helmet';
import { Users, Wind, Hexagon, Layout } from 'lucide-react';

const TheLotusPage = () => {
  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen pt-24 pb-12">
      <Helmet>
        <title>The Lotus Design | Maslow NYC</title>
        <meta name="description" content="The architecture of dignity. The Hull at the center, the Sanctuary Suites at the perimeter." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] mb-4">
            The Lotus Layout
          </h1>
          <p className="text-[#3B5998]/80 text-lg max-w-2xl mx-auto font-light italic">
            "An inverted sanctuary. We place the community in the center, and the privacy on the perimeter."
          </p>
        </div>

        {/* The 3 Layers Diagram */}
        <div className="max-w-4xl mx-auto space-y-8 relative">
          
          {/* Vertical Line Connector */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-[#C5A059]/30 hidden md:block"></div>

          {/* Layer 1: The Hull (Center) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998] text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              1
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Hull (The Center)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The open heart of the facility. This is the communal "Third Place"—a sunken plaza featuring the circadian skylight and church pews. It anchors the space, providing a shared sense of safety and breath before you disperse to the private rooms.
              </p>
            </div>
          </div>

          {/* Layer 2: The Threshold (Transition) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#3B5998]/80 text-[#F5F1E8] flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              2
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl border border-[#3B5998]/10 hover:border-[#C5A059] transition-all w-full">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Threshold (The Ring)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The circulation ring. Separating the bustling Hull from the silent suites is a sound-dampened corridor. This transition zone uses "Pink Noise" and filtered air to act as an acoustic airlock, ensuring the center's energy doesn't bleed into the private suites.
              </p>
            </div>
          </div>

          {/* Layer 3: The Sanctuary Suites (Perimeter) */}
          <div className="flex flex-col md:flex-row gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xl font-bold z-10 border-4 border-[#F5F1E8] shadow-lg">
              3
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl border border-[#C5A059] shadow-xl w-full">
              <div className="flex items-center gap-3 mb-3">
                <Layout className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-2xl font-serif font-bold text-[#3B5998]">The Petals (The Perimeter)</h3>
              </div>
              <p className="text-[#3B5998]/80 leading-relaxed">
                The private outer shell. Lining the perimeter of the facility, the Sanctuary Suites offer total isolation. By pushing the private rooms to the edge, we maximize their size and soundproofing, like the protective petals of a closed lotus.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TheLotusPage;