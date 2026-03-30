import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, FileText, BarChart, Download } from 'lucide-react';
import RevenueSimulator from '@/components/RevenueSimulator';
import PricingCalculator from '@/components/PricingCalculator';

type TabType = 'simulator' | 'pricing' | 'docs';

interface DocCardProps {
  title: string;
  description: string;
  fileType: string;
  link: string;
  icon: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12 px-4">
      <Helmet>
        <title>Dashboard | Maslow</title>
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#1C2B3A] mb-2">
          Maslow Dashboard
        </h1>
        <p className="text-[#1C2B3A]/70">
          Financial modeling, pricing tools, and core documentation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-[#1C2B3A] text-white'
                : 'text-[#1C2B3A] hover:bg-[#1C2B3A]/5'
            }`}
          >
            <BarChart className="w-5 h-5" />
            Revenue Simulator
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'pricing'
                ? 'bg-[#1C2B3A] text-white'
                : 'text-[#1C2B3A] hover:bg-[#1C2B3A]/5'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Pricing Calculator
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-[#1C2B3A] text-white'
                : 'text-[#1C2B3A] hover:bg-[#1C2B3A]/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            Documentation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* REVENUE SIMULATOR TAB */}
        {activeTab === 'simulator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RevenueSimulator />
          </motion.div>
        )}

        {/* PRICING CALCULATOR TAB */}
        {activeTab === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PricingCalculator />
          </motion.div>
        )}

        {/* DOCUMENTATION TAB */}
        {activeTab === 'docs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Documentation Hub for Cat & Dayna */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#1C2B3A]/10">
              <h2 className="text-2xl font-serif font-bold text-[#1C2B3A] mb-2">
                Core Documentation
              </h2>
              <p className="text-[#1C2B3A]/70 mb-6">
                Everything you need to understand the Maslow project
              </p>

              {/* Strategic Documents */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1C2B3A] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF6A]" />
                  Strategic Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <DocCard
                    title="The Maslow Master Map"
                    description="Complete project overview - everything in one mind map"
                    fileType="MindNode"
                    link="/docs/maslow-master-map"
                    icon="🗺️"
                  />
                  <DocCard
                    title="Master Execution Plan"
                    description="90-day sprint plan with weekly milestones"
                    fileType="DOCX"
                    link="/docs/execution-plan"
                    icon="📋"
                  />
                  <DocCard
                    title="Business Snapshot"
                    description="One-page overview of the business model"
                    fileType="PDF"
                    link="/docs/business-snapshot"
                    icon="💼"
                  />
                  <DocCard
                    title="Omni-Brief"
                    description="Comprehensive brief covering all aspects"
                    fileType="DOCX"
                    link="/docs/omni-brief"
                    icon="📄"
                  />
                </div>
              </div>

              {/* Technical Documents */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1C2B3A] mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#D4AF6A]" />
                  Technical & Operational
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <DocCard
                    title="Construction & Code Compliance"
                    description="Technical specs for architects/contractors"
                    fileType="DOCX"
                    link="/docs/construction-brief"
                    icon="🏗️"
                  />
                  <DocCard
                    title="Partner Outreach Playbook"
                    description="Vendor partnership strategy with contact info"
                    fileType="DOCX"
                    link="/docs/partner-playbook"
                    icon="🤝"
                  />
                  <DocCard
                    title="Prototype Master Tracker"
                    description="All 11 prototypes with build specs"
                    fileType="MD"
                    link="/docs/prototype-tracker"
                    icon="🔧"
                  />
                  <DocCard
                    title="Social Media Strategy"
                    description="Platform bios, content calendar, launch plan"
                    fileType="TXT"
                    link="/docs/social-strategy"
                    icon="📱"
                  />
                </div>
              </div>

              {/* Legal & Financial */}
              <div>
                <h3 className="text-xl font-bold text-[#1C2B3A] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF6A]" />
                  Legal & Financial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <DocCard
                    title="LLC Formation Documents"
                    description="Articles of Organization (Sept 2025)"
                    fileType="PDF"
                    link="/docs/llc-formation"
                    icon="⚖️"
                  />
                  <DocCard
                    title="EIN Confirmation"
                    description="Tax ID from IRS"
                    fileType="PDF"
                    link="/docs/ein-confirmation"
                    icon="🔢"
                  />
                  <DocCard
                    title="DUNS Number"
                    description="144888081"
                    fileType="Info"
                    link="#"
                    icon="🏢"
                  />
                  <DocCard
                    title="Legal Scope with Lenore"
                    description="Operating Agreement, Terms, SEC compliance"
                    fileType="Info"
                    link="#"
                    icon="📜"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-[#1C2B3A] to-[#2A406E] text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Project Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-sm opacity-80 mb-1">Legal Status</div>
                  <div className="text-2xl font-bold">Active LLC</div>
                  <div className="text-xs opacity-70 mt-1">Formed Sept 2025</div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Target Location</div>
                  <div className="text-2xl font-bold">SoHo</div>
                  <div className="text-xs opacity-70 mt-1">2,500 sq ft, 10 suites</div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Target Funding</div>
                  <div className="text-2xl font-bold">$250K-$500K</div>
                  <div className="text-xs opacity-70 mt-1">Pre-sale memberships</div>
                </div>
              </div>
            </div>

            {/* MindNode Embed Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#1C2B3A]/10">
              <h3 className="text-xl font-bold text-[#1C2B3A] mb-4">
                Visual Mind Maps
              </h3>
              <p className="text-[#1C2B3A]/70 mb-6">
                Interactive mind maps showing project structure and execution plan
              </p>

              {/* Placeholder for MindNode embeds */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#1C2B3A]/20 rounded-lg p-8 text-center">
                  <p className="text-[#1C2B3A]/70 mb-4">
                    Maslow Master Map
                  </p>
                  <button className="bg-[#1C2B3A] text-white px-6 py-2 rounded-lg hover:bg-[#2A406E] transition-colors">
                    Open in MindNode
                  </button>
                  <p className="text-xs text-[#1C2B3A]/60 mt-2">
                    Full project overview with drill-down capability
                  </p>
                </div>

                <div className="border-2 border-dashed border-[#1C2B3A]/20 rounded-lg p-8 text-center">
                  <p className="text-[#1C2B3A]/70 mb-4">
                    90-Day Sprint Map
                  </p>
                  <button className="bg-[#1C2B3A] text-white px-6 py-2 rounded-lg hover:bg-[#2A406E] transition-colors">
                    Open in MindNode
                  </button>
                  <p className="text-xs text-[#1C2B3A]/60 mt-2">
                    Weekly execution plan with milestones
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#D4AF6A]/10 rounded-lg">
                <p className="text-sm text-[#1C2B3A]/80">
                  <strong>Note:</strong> MindNode files (.mindnode) can be opened in the MindNode app.
                  Download the files and open them to see the interactive mind maps.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Document Card Component
const DocCard: React.FC<DocCardProps> = ({ title, description, fileType, link, icon }) => (
  <a
    href={link}
    className="block bg-[#F8F7F4] rounded-lg p-6 border border-[#1C2B3A]/10 hover:shadow-lg hover:border-[#D4AF6A] transition-all group"
  >
    <div className="flex items-start gap-4">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-[#1C2B3A] group-hover:text-[#D4AF6A] transition-colors">
            {title}
          </h4>
          <span className="text-xs bg-[#1C2B3A] text-white px-2 py-1 rounded">
            {fileType}
          </span>
        </div>
        <p className="text-sm text-[#1C2B3A]/70">
          {description}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#D4AF6A] font-semibold group-hover:gap-3 transition-all">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </div>
      </div>
    </div>
  </a>
);

export default Dashboard;
