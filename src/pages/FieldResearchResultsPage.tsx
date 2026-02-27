import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Download,
  ArrowLeft,
  Users,
  DollarSign,
  ThumbsUp,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  MapPin,
  Clock,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FieldResearchResponse {
  id: string;
  created_at: string;
  location: string;
  age_range: string;
  gender: string;
  occupation: string;
  neighborhood: string;
  frequency_need_restroom: string;
  difficulty_finding_restroom: number;
  current_solutions: string[];
  biggest_pain_point: string;
  interest_level: number;
  would_pay: boolean;
  price_willing_to_pay: string;
  preferred_features: string[];
  use_case_scenario: string;
  concerns: string;
  additional_feedback: string;
  interview_quality: string;
  notes: string;
  is_complete: boolean;
}

interface Stats {
  totalResponses: number;
  avgInterest: number;
  avgDifficulty: number;
  wouldPayPercent: number;
  topFeatures: { feature: string; count: number }[];
  topSolutions: { solution: string; count: number }[];
  ageBreakdown: Record<string, number>;
  priceBreakdown: Record<string, number>;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: 'blue' | 'gold' | 'green' | 'red';
}) => {
  const colors = {
    blue: 'bg-[#3B5998]/10 text-[#3B5998]',
    gold: 'bg-[#C5A059]/10 text-[#C5A059]',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#3B5998]">{value}</p>
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProgressBar = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-[#3B5998]">{label}</span>
      <span className="text-gray-500">{value}</span>
    </div>
    <div className="h-3 bg-[#3B5998]/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#3B5998] rounded-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

const FieldResearchResultsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [responses, setResponses] = useState<FieldResearchResponse[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_research_responses')
        .select('*')
        .eq('is_complete', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fetchedResponses = (data || []) as FieldResearchResponse[];
      setResponses(fetchedResponses);

      // Calculate stats
      if (fetchedResponses.length > 0) {
        const totalResponses = fetchedResponses.length;

        // Average interest level
        const avgInterest =
          fetchedResponses.reduce((sum, r) => sum + (r.interest_level || 0), 0) / totalResponses;

        // Average difficulty
        const avgDifficulty =
          fetchedResponses.reduce((sum, r) => sum + (r.difficulty_finding_restroom || 0), 0) /
          totalResponses;

        // Would pay percentage
        const wouldPayCount = fetchedResponses.filter((r) => r.would_pay === true).length;
        const wouldPayPercent = (wouldPayCount / totalResponses) * 100;

        // Top features
        const featureCounts: Record<string, number> = {};
        fetchedResponses.forEach((r) => {
          (r.preferred_features || []).forEach((f) => {
            featureCounts[f] = (featureCounts[f] || 0) + 1;
          });
        });
        const topFeatures = Object.entries(featureCounts)
          .map(([feature, count]) => ({ feature, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Top current solutions
        const solutionCounts: Record<string, number> = {};
        fetchedResponses.forEach((r) => {
          (r.current_solutions || []).forEach((s) => {
            solutionCounts[s] = (solutionCounts[s] || 0) + 1;
          });
        });
        const topSolutions = Object.entries(solutionCounts)
          .map(([solution, count]) => ({ solution, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Age breakdown
        const ageBreakdown: Record<string, number> = {};
        fetchedResponses.forEach((r) => {
          if (r.age_range) {
            ageBreakdown[r.age_range] = (ageBreakdown[r.age_range] || 0) + 1;
          }
        });

        // Price breakdown
        const priceBreakdown: Record<string, number> = {};
        fetchedResponses
          .filter((r) => r.would_pay && r.price_willing_to_pay)
          .forEach((r) => {
            priceBreakdown[r.price_willing_to_pay] =
              (priceBreakdown[r.price_willing_to_pay] || 0) + 1;
          });

        setStats({
          totalResponses,
          avgInterest: Math.round(avgInterest * 10) / 10,
          avgDifficulty: Math.round(avgDifficulty * 10) / 10,
          wouldPayPercent: Math.round(wouldPayPercent),
          topFeatures,
          topSolutions,
          ageBreakdown,
          priceBreakdown,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    if (responses.length === 0) return;

    const headers = [
      'Date',
      'Location',
      'Age Range',
      'Gender',
      'Occupation',
      'Neighborhood',
      'Frequency Need',
      'Difficulty (1-5)',
      'Current Solutions',
      'Biggest Pain Point',
      'Interest Level (1-5)',
      'Would Pay',
      'Price Willing to Pay',
      'Preferred Features',
      'Use Case',
      'Concerns',
      'Additional Feedback',
      'Interview Quality',
      'Notes',
    ];

    const rows = responses.map((r) => [
      new Date(r.created_at).toLocaleDateString(),
      r.location || '',
      r.age_range || '',
      r.gender || '',
      r.occupation || '',
      r.neighborhood || '',
      r.frequency_need_restroom || '',
      r.difficulty_finding_restroom || '',
      (r.current_solutions || []).join('; '),
      r.biggest_pain_point || '',
      r.interest_level || '',
      r.would_pay ? 'Yes' : 'No',
      r.price_willing_to_pay || '',
      (r.preferred_features || []).join('; '),
      r.use_case_scenario || '',
      r.concerns || '',
      r.additional_feedback || '',
      r.interview_quality || '',
      r.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `maslow-field-research-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const featureLabels: Record<string, string> = {
    clean: 'Cleanliness',
    private: 'Privacy',
    quick: 'Quick Access',
    premium_amenities: 'Premium Amenities',
    climate_control: 'Climate Control',
    safe: 'Safety',
  };

  const solutionLabels: Record<string, string> = {
    coffee_shops: 'Coffee Shops',
    hotels: 'Hotel Lobbies',
    public_restrooms: 'Public Restrooms',
    restaurants: 'Restaurants',
    stores: 'Retail Stores',
    hold_it: 'Hold It / Wait',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-[#3B5998] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/field-research')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Form
            </Button>
            <h1 className="text-2xl font-bold text-white">Research Results</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchData}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              className="bg-[#C5A059] hover:bg-[#b08d4b] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              title="Total Interviews"
              value={stats.totalResponses}
              subtitle={`${100 - stats.totalResponses} remaining`}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Avg Interest"
              value={`${stats.avgInterest}/5`}
              subtitle="Interest level"
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="Avg Difficulty"
              value={`${stats.avgDifficulty}/5`}
              subtitle="Finding restrooms"
              icon={AlertTriangle}
              color="red"
            />
            <StatCard
              title="Would Pay"
              value={`${stats.wouldPayPercent}%`}
              subtitle="Payment intent"
              icon={DollarSign}
              color="gold"
            />
          </motion.div>
        )}

        {/* Charts Section */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                  <ThumbsUp className="w-5 h-5" />
                  Most Important Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.topFeatures.map((item) => (
                  <ProgressBar
                    key={item.feature}
                    label={featureLabels[item.feature] || item.feature}
                    value={item.count}
                    max={stats.totalResponses}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Current Solutions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                  <MapPin className="w-5 h-5" />
                  Current Solutions Used
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.topSolutions.map((item) => (
                  <ProgressBar
                    key={item.solution}
                    label={solutionLabels[item.solution] || item.solution}
                    value={item.count}
                    max={stats.totalResponses}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                  <Users className="w-5 h-5" />
                  Age Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.ageBreakdown)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([age, count]) => (
                    <ProgressBar
                      key={age}
                      label={age}
                      value={count}
                      max={stats.totalResponses}
                    />
                  ))}
              </CardContent>
            </Card>

            {/* Price Willingness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                  <DollarSign className="w-5 h-5" />
                  Price Willing to Pay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.priceBreakdown)
                  .sort(([a], [b]) => {
                    const order = ['$3', '$5', '$7', '$10+'];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map(([price, count]) => (
                    <ProgressBar
                      key={price}
                      label={price}
                      value={count}
                      max={Object.values(stats.priceBreakdown).reduce((a, b) => a + b, 0)}
                    />
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#3B5998]">
              <BarChart3 className="w-5 h-5" />
              All Responses ({responses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No completed interviews yet.</p>
                <Button
                  onClick={() => navigate('/admin/field-research')}
                  className="mt-4 bg-[#3B5998]"
                >
                  Start Interviewing
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 text-sm text-gray-500">Date</th>
                      <th className="pb-3 text-sm text-gray-500">Location</th>
                      <th className="pb-3 text-sm text-gray-500">Age</th>
                      <th className="pb-3 text-sm text-gray-500">Interest</th>
                      <th className="pb-3 text-sm text-gray-500">Would Pay</th>
                      <th className="pb-3 text-sm text-gray-500">Price</th>
                      <th className="pb-3 text-sm text-gray-500">Quality</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r) => (
                      <>
                        <tr
                          key={r.id}
                          className="border-b hover:bg-[#3B5998]/5 cursor-pointer"
                          onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}
                        >
                          <td className="py-3 text-sm">
                            {new Date(r.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm">{r.location || '-'}</td>
                          <td className="py-3 text-sm">{r.age_range || '-'}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                r.interest_level >= 4
                                  ? 'bg-green-100 text-green-700'
                                  : r.interest_level >= 3
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {r.interest_level}/5
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                r.would_pay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {r.would_pay ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="py-3 text-sm font-medium">
                            {r.price_willing_to_pay || '-'}
                          </td>
                          <td className="py-3 text-sm capitalize">{r.interview_quality || '-'}</td>
                          <td className="py-3">
                            {expandedRow === r.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </td>
                        </tr>
                        {expandedRow === r.id && (
                          <tr key={`${r.id}-expanded`}>
                            <td colSpan={8} className="bg-[#3B5998]/5 p-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500 mb-1">Biggest Pain Point</p>
                                  <p className="text-[#3B5998]">{r.biggest_pain_point || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Use Case</p>
                                  <p className="text-[#3B5998]">{r.use_case_scenario || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Concerns</p>
                                  <p className="text-[#3B5998]">{r.concerns || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Additional Feedback</p>
                                  <p className="text-[#3B5998]">{r.additional_feedback || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Preferred Features</p>
                                  <p className="text-[#3B5998]">
                                    {(r.preferred_features || [])
                                      .map((f) => featureLabels[f] || f)
                                      .join(', ') || '-'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Interviewer Notes</p>
                                  <p className="text-[#3B5998]">{r.notes || '-'}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldResearchResultsPage;
