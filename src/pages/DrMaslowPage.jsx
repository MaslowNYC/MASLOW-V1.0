
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Book, 
  Mic, 
  FileText, 
  ExternalLink, 
  Search, 
  Library, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const DrMaslowPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const publications = {
    booksByMaslow: [
      { title: "Toward a Psychology of Being", publisher: "Van Nostrand/Wiley", year: "1962/1998", type: "Core Theory" },
      { title: "Motivation and Personality", publisher: "Harper/Addison-Wesley", year: "1954/1987", type: "Core Theory" },
      { title: "Religions, Values and Peak-Experiences", publisher: "Penguin", year: "1964/1986", type: "Philosophy" },
      { title: "Maslow on Management (Eupsychian Management)", publisher: "Wiley", year: "1965/1998", type: "Business" },
      { title: "The Farther Reaches of Human Nature", publisher: "Viking/Penguin", year: "1971/1973", type: "Posthumous" },
      { title: "The Psychology of Science: A Reconnaissance", publisher: "Maurice Bassett", year: "2002", type: "Electronic" }
    ],
    audioVisual: [
      { title: "The Eupsychian Ethic", duration: "5 hrs 45 min", type: "Esalen Series", icon: <Mic className="w-4 h-4" /> },
      { title: "The Farther Reaches of Human Nature", duration: "9 hrs 45 min", type: "Audio Series", icon: <Mic className="w-4 h-4" /> },
      { title: "Self-Actualization", duration: "1 hr", type: "Talk", icon: <Mic className="w-4 h-4" /> },
      { title: "Being Abraham Maslow", duration: "29 min", type: "Film", icon: <FileText className="w-4 h-4" /> }
    ],
    researchArticles: [
      { title: "A Theory of Human Motivation", journal: "Psychological Review", year: "1943", cite: "#50, p.370-396" },
      { title: "Delayed Reaction Tests on Primates", journal: "Journal of Comparative Psychology", year: "1932", cite: "#14, p.97-101" },
      { title: "The Role of Dominance in Social Behavior", journal: "Journal of Genetic Psychology", year: "1936", cite: "#48, p.261-277" },
      { title: "Conflict, Frustration and the Theory of Threat", journal: "Journal of Abnormal Psychology", year: "1943", cite: "#38, p.81-86" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>The Registry | Maslow NYC</title>
        <meta name="description" content="Official bibliography and digital archive of Dr. Abraham Maslow." />
      </Helmet>

      {/* --- MUNICIPAL STYLE HEADER --- */}
      <header className="bg-slate-900 text-white pt-24 pb-20 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Legacy Stewardship Division</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight">The Dr. Maslow Registry.</h1>
            <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed italic">
              "What a man can be, he must be." — This registry catalogs the intellectual foundations 
              upon which Maslow NYC is built.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <Tabs defaultValue="books" className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <TabsList className="bg-slate-200/50 p-1">
              <TabsTrigger value="books">Bibliography</TabsTrigger>
              <TabsTrigger value="audio">Media & Archives</TabsTrigger>
              <TabsTrigger value="research">Primary Papers</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search the archive..." 
                className="pl-10 bg-white border-slate-200"
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          {/* --- BOOKS SECTION --- */}
          <TabsContent value="books" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.booksByMaslow.map((book, i) => (
                <Card key={i} className="hover:shadow-md transition-all border-slate-200 bg-white group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Book className="w-5 h-5 text-[#3B5998]" />
                      <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter">{book.type}</Badge>
                    </div>
                    <CardTitle className="text-xl font-serif mt-4 leading-tight group-hover:text-[#C5A059] transition-colors">{book.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    <p className="font-medium text-slate-400 text-xs mb-4">{book.publisher} // {book.year}</p>
                    <Separator className="my-4 opacity-50" />
                    <Button variant="link" className="p-0 h-auto text-[#3B5998] text-xs font-bold uppercase tracking-widest flex items-center">
                      View Contents <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* --- AUDIO SECTION --- */}
          <TabsContent value="audio" className="mt-0">
            <div className="bg-[#1E293B] rounded-xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-[#C5A059] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-serif mb-4 text-[#C5A059]">The Esalen Collection</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    A collection of workshops and talks recorded at the Esalen Institute, Big Sur, California. 
                    These sessions capture the raw evolution of Dr. Maslow's thoughts on Self-Actualization.
                  </p>
                  <div className="flex gap-4">
                    <Button className="bg-[#C5A059] text-slate-900 font-bold px-6">Access MP3 Archive</Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-6">Request Video</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {publications.audioVisual.map((media, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="p-2 bg-[#C5A059]/20 rounded text-[#C5A059]">{media.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-white">{media.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{media.duration} // {media.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- RESEARCH SECTION --- */}
          <TabsContent value="research">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Research Title</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Journal Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {publications.researchArticles.map((article, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-5 font-mono text-slate-400 text-xs">{article.year}</td>
                      <td className="px-6 py-5 font-bold text-slate-800 group-hover:text-[#3B5998]">{article.title}</td>
                      <td className="px-6 py-5 text-slate-500 italic text-xs">
                        {article.journal} — {article.cite}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* --- LEGACY FOOTER --- */}
        <section className="mt-24 py-16 px-8 border-t border-slate-200 text-center space-y-8">
          <Library className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-serif text-slate-900">Official Legacy Correspondence</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Maslow NYC serves as a physical steward for the humanistic framework developed by Dr. Maslow. 
              For information regarding personal papers, letters, or the 
              <span className="font-bold"> Archives of the History of American Psychology</span>, please contact the registry.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = 'mailto:maslow@maslow.com'}>
              Contact Estate Liaison
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-slate-600">
              Archives PDF
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DrMaslowPage;