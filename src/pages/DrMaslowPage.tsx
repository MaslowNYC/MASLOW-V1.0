import React from 'react';
import { Helmet } from 'react-helmet';

const DrMaslowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Helmet>
        <title>Dr. Abraham Maslow | MASLOW</title>
        <meta name="description" content="The life and work of Abraham Maslow, and why Maslow NYC bears his name." />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B5998] tracking-tight mb-2">
            Dr. Abraham Maslow
          </h1>
          <p className="text-lg text-[#3B5998]/70 font-medium">
            April 1, 1908 – June 8, 1970
          </p>
        </header>

        <p className="text-xl text-[#3B5998]/90 font-light leading-relaxed mb-8">
          Abraham Maslow was an American psychologist best known for creating <strong className="text-[#3B5998]">Maslow's hierarchy of needs</strong>, a theory of human motivation that places our most basic physical and emotional needs at the foundation, and the need for meaning and fulfillment at the top.
        </p>

        <h2 className="text-2xl font-serif font-bold text-[#3B5998] mt-12 mb-4">
          The five levels of the hierarchy
        </h2>
        <p className="text-[#3B5998]/90 leading-relaxed mb-4">
          Maslow described human needs in five levels, often shown as a pyramid. Until the lower levels are reasonably met, the higher ones are harder to reach.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-[#3B5998]/90 leading-relaxed">
          <li><strong className="text-[#3B5998]">Physiological</strong> — Air, water, food, shelter, sleep, basic bodily function. Without these, little else is possible.</li>
          <li><strong className="text-[#3B5998]">Safety</strong> — Security, stability, freedom from fear and harm. We need to feel safe before we can fully engage with others or ourselves.</li>
          <li><strong className="text-[#3B5998]">Belongingness and love</strong> — Connection, family, friendship, community. We are social beings who need to belong.</li>
          <li><strong className="text-[#3B5998]">Esteem</strong> — Respect, recognition, achievement, a sense of competence. We need to feel valued by others and by ourselves.</li>
          <li><strong className="text-[#3B5998]">Self-actualization</strong> — Becoming who we are capable of being: creativity, meaning, growth, and the pursuit of our highest potential.</li>
        </ol>

        <h2 className="text-2xl font-serif font-bold text-[#3B5998] mt-12 mb-4">
          Why we bear his name
        </h2>
        <p className="text-[#3B5998]/90 leading-relaxed">
          Maslow understood that <strong className="text-[#3B5998]">dignity begins with meeting basic needs</strong>. You cannot ask someone to thrive, create, or participate fully in community if they don't have a safe place to rest, wash, or use the bathroom. Public restrooms are not a luxury; they are the base of the pyramid. Maslow NYC exists to meet that need with care—so that everyone in the city can move up the pyramid from a foundation of dignity.
        </p>

        <h2 className="text-2xl font-serif font-bold text-[#3B5998] mt-12 mb-4">
          A digital memorial
        </h2>
        <p className="text-[#3B5998]/90 leading-relaxed">
          We hope one day to acquire <strong className="text-[#3B5998]">maslow.com</strong> and turn it into a proper digital memorial to Dr. Maslow—his life, his work, and his lasting influence on psychology and on how we think about human need and dignity. Until then, we carry his name and his insight into everything we build.
        </p>
      </article>
    </div>
  );
};

export default DrMaslowPage;
