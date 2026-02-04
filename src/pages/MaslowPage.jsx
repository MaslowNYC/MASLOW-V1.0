
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MaslowPage = () => {
  return (
    <>
      <Helmet>
        <title>About Abraham Maslow | Maslow NYC</title>
      </Helmet>

      <div className="min-h-screen bg-[#F5F1E8]">
        {/* Back Button */}
        <div className="container mx-auto px-6 pt-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#3B5998] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-16 max-w-4xl"
        >
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#3B5998] mb-6">
            Abraham Maslow
          </h1>
          <p className="text-2xl text-[#3B5998]/70 font-light mb-12">
            1908 – 1970
          </p>

          {/* The Story */}
          <div className="space-y-8 text-[#3B5998]/90 leading-relaxed text-lg">
            <p className="text-xl font-light">
              Abraham Maslow was an American psychologist who revolutionized our understanding 
              of human motivation and potential. Best known for his Hierarchy of Needs, Maslow 
              argued that human beings are motivated by a series of needs, starting with the most 
              basic physiological requirements.
            </p>

            <div className="bg-white/50 border-l-4 border-[#C5A059] p-8 my-12">
              <p className="text-2xl font-serif italic text-[#3B5998]">
                "What a man can be, he must be."
              </p>
              <p className="text-sm text-[#3B5998]/60 mt-2">
                — Abraham Maslow
              </p>
            </div>

            <h2 className="text-3xl font-serif font-bold text-[#3B5998] mt-12 mb-6">
              The Hierarchy of Needs
            </h2>

            <p>
              Maslow's pyramid is simple yet profound. At the base are physiological needs: 
              air, water, food, shelter, sleep—and yes, access to sanitation. Without these 
              fundamentals, nothing else matters. You cannot pursue safety, love, esteem, or 
              self-actualization if your most basic needs are unmet.
            </p>

            <p>
              In 1943, when Maslow published his groundbreaking theory, he identified these 
              physiological needs as the foundation upon which all human flourishing depends. 
              Yet here we are, 80 years later, in one of the wealthiest cities in human history, 
              and that foundation remains fractured.
            </p>

            <h2 className="text-3xl font-serif font-bold text-[#3B5998] mt-12 mb-6">
              The Missing Infrastructure
            </h2>

            <p>
              New York City has 8 million people and only 1,100 public restrooms. That's one 
              restroom for every 7,000 residents. By any measure, this is a crisis of basic 
              human dignity.
            </p>

            <p>
              When a nursing mother has nowhere to feed her child in privacy, when a person with 
              Crohn's disease must map their entire day around bathroom access, when someone in 
              a wheelchair cannot find an accessible facility—these are not minor inconveniences. 
              These are failures at the base of Maslow's pyramid.
            </p>

            <div className="bg-white/50 border-l-4 border-[#C5A059] p-8 my-12">
              <p className="text-lg font-medium text-[#3B5998]">
                If we cannot guarantee basic sanitation, we have no right to talk about building 
                a just society, a creative economy, or a compassionate city.
              </p>
            </div>

            <h2 className="text-3xl font-serif font-bold text-[#3B5998] mt-12 mb-6">
              Our Mission
            </h2>

            <p>
              Maslow NYC exists to fix this. We are building the infrastructure that should have 
              been built decades ago—not as charity, but as civic duty. Clean, safe, accessible 
              restrooms are not a luxury. They are the foundation.
            </p>

            <p>
              We named this project after Abraham Maslow not as a gimmick, but as a commitment. 
              If the first tier of human needs includes sanitation, then the first tier of urban 
              infrastructure must include restrooms. Everything else—the culture, the innovation, 
              the community—rests on that foundation.
            </p>

            <p className="text-xl font-light italic text-[#3B5998] mt-12">
              Dr. Maslow showed us the pyramid. We're building the base.
            </p>
          </div>

          {/* Visual Separator */}
          <div className="mt-16 mb-8 flex items-center justify-center">
            <div className="h-px bg-[#C5A059] w-24"></div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pb-16">
            <p className="text-sm uppercase tracking-widest text-[#3B5998]/60 mb-4">
              The Infrastructure of Dignity
            </p>
            <Link 
              to="/" 
              className="text-[#C5A059] hover:text-[#3B5998] font-medium transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MaslowPage;
