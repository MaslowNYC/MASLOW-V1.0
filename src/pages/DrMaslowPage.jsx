
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Book, 
  Mic, 
  FileText, 
  Library, 
  ShieldCheck,
  ChevronRight,
  Lock,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const DrMaslowPage = () => {
  const publications = {
    booksByMaslow: [
      { title: "Toward a Psychology of Being", publisher: "Van Nostrand/Wiley", year: "1962/1998", type: "Core Theory" },
      { title: "Motivation and Personality", publisher: "Harper/Addison-Wesley", year: "1954/1987", type: "Core Theory" },
      { title: "Religions, Values and Peak-Experiences", publisher: "Penguin", year: "1964/1986", type: "Philosophy" },
      { title: "Maslow on Management", publisher: "Wiley", year: "1998", type: "Business" },
      { title: "The Farther Reaches of Human Nature", publisher: "Viking/Penguin", year: "1971/1973", type: "Posthumous" }
    ],
    familyArchives: [
      { title: "Unpublished Letters to Bertha (1930-1945)", status: "Digitization Pending", access: "Estate Only" },
      { title: "Personal Journals: The Brooklyn Years", status: "Restoration", access: "Restricted" },
      { title: "Correspondence with Carl Rogers", status: "Archive Planned", access: "Scholarly Request" }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Helmet><title>The Dr. Maslow Registry | Maslow NYC</title></Helmet>

      <header className="bg-slate-900 text-white pt-24 pb-20 px-6 border-b-4 border-[#C5A059]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Official Legacy Stewardship</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight text-white">The Dr. Maslow Registry.</h1>
            <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed italic">
              "What a man can be, he must be." — Catalouging the intellectual blueprints for the future of urban dignity.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <Tabs defaultValue="books" className="space-y-12">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="books">Bibliography</TabsTrigger>
            <TabsTrigger value="archives">Family Archives</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.booksByMaslow.map((book, i) => (
              <Card key={i} className="border-slate-100 hover:shadow-lg transition-all group">
                <CardHeader className="pb-3">
                  <Book className="w-5 h-5 text-[#C5A059] mb-4" />
                  <CardTitle className="text-xl font-serif group-hover:text-[#3B5998] transition-colors">{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-500 font-mono uppercase tracking-widest">
                  {book.publisher} // {book.year}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="archives">
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center">
              <Lock className="w-8 h-8 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif mb-2">Restricted Family Papers</h3>
              <p className="text-slate-500 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
                This section is reserved for the Maslow family’s private collection. We aim to provide a secure, high-fidelity environment for the preservation of Dr. Maslow's personal correspondence.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {publications.familyArchives.map((archive, i) => (
                  <Card key={i} className="bg-white border-slate-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{archive.access}</div>
                      <div className="text-sm font-bold">{archive.title}</div>
                      <Badge variant="secondary" className="text-[9px]">{archive.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DrMaslowPage;