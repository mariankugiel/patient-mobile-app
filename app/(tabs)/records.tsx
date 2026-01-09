import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Clock, LineChart, Heart, Scale, Dumbbell, Syringe, TrendingUp, TrendingDown, Minus, FileText, Download, Upload, Stethoscope } from 'lucide-react-native';
import Header from '@/components/Header';
import ProgressRing from '@/components/ProgressRing';
import MetricCard from '@/components/MetricCard';
import SectionHeader from '@/components/SectionHeader';
import AiInsight from '@/components/AiInsight';
import TabView from '@/components/TabView';
import HealthMetricCard from '@/components/HealthMetricCard';
import LineChartComponent from '@/components/LineChartComponent';
import Colors from '@/constants/colors';
import {
  healthMetrics,
  medicalConditions,
  vaccinations,
  medicalDocuments,
  medicalExams,
  examsAiInsight
} from '@/constants/patient';
import ExamItem from '@/components/ExamItem';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealthRecordsSummary } from '@/hooks/useHealthRecordsSummary';
import { useHealthRecordsDashboard } from '@/hooks/useHealthRecordsDashboard';
import { HealthRecordsApiService, MetricWithData } from '@/lib/api/health-records-api';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useCurrentMedicalConditions, usePastMedicalConditions, useFamilyMedicalHistory } from '@/hooks/useMedicalConditions';
import { useSurgeryHospitalization } from '@/hooks/useSurgeryHospitalization';

const screenWidth = Dimensions.get('window').width;

type TabType = 'sumario' | 'historial' | 'analises' | 'vitais' | 'corpo' | 'lifestyle' | 'vacinas' | 'exames';
type StatusType = 'normal' | 'warning' | 'danger';
type TrendType = 'up' | 'down' | 'stable';

// Helper function to determine trend
const determineTrend = (data: any[]): TrendType => {
  if (data.length < 2) return 'stable';

  const lastValues = data.slice(-2).map(item =>
    Array.isArray(item.value) ? item.value[0] : item.value
  );

  const difference = lastValues[1] - lastValues[0];

  if (Math.abs(difference) < 0.05 * lastValues[0]) return 'stable';
  return difference > 0 ? 'up' : 'down';
};

// Helper function to render trend icon
const renderTrendIcon = (trend: TrendType, metric: any) => {
  // For some metrics like blood pressure, lower is better
  // For others like activity, higher is better
  const lowerIsBetter = ['Glicose', 'Colesterol', 'Pressão Arterial'].includes(metric.name);

  let color = Colors.textLight;
  if (trend !== 'stable') {
    if (lowerIsBetter) {
      color = trend === 'down' ? Colors.success : Colors.warning;
    } else {
      color = trend === 'up' ? Colors.success : Colors.warning;
    }
  }

  switch (trend) {
    case 'up':
      return <TrendingUp size={20} color={color} />;
    case 'down':
      return <TrendingDown size={20} color={color} />;
    case 'stable':
      return <Minus size={20} color={color} />;
  }
};

// Note: AI insights are now fetched from backend, this function is kept for exames tab only
const getTabInsights = (t: any) => ({
  exames: examsAiInsight
});

export default function RecordsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('sumario');

  const tabs = [
    { key: 'sumario', title: t.summary, icon: LineChart },
    { key: 'historial', title: t.history, icon: Clock },
    { key: 'analises', title: t.analyses, icon: LineChart },
    { key: 'vitais', title: t.vitals, icon: Heart },
    { key: 'corpo', title: t.body, icon: Scale },
    { key: 'lifestyle', title: t.lifestyle, icon: Dumbbell },
    { key: 'exames', title: t.exams, icon: Stethoscope },
    { key: 'vacinas', title: t.vaccines, icon: Syringe },
  ];

  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useHealthRecordsSummary();
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Dashboard data for each tab - only fetch the active tab's data
  const { data: analysesData, isLoading: analysesLoading } = useHealthRecordsDashboard(1, activeTab === 'analises'); // Analyses
  const { data: vitalsData, isLoading: vitalsLoading } = useHealthRecordsDashboard(2, activeTab === 'vitais'); // Vitals
  const { data: bodyData, isLoading: bodyLoading } = useHealthRecordsDashboard(3, activeTab === 'corpo'); // Body
  const { data: lifestyleData, isLoading: lifestyleLoading } = useHealthRecordsDashboard(4, activeTab === 'lifestyle'); // Lifestyle
  
  // Medical conditions and history hooks
  const { 
    conditions: currentConditions, 
    loading: currentLoading, 
    error: currentError 
  } = useCurrentMedicalConditions();
  
  const { 
    conditions: pastConditions, 
    loading: pastLoading, 
    error: pastError 
  } = usePastMedicalConditions();
  
  const { 
    history: familyHistory, 
    loading: familyLoading, 
    error: familyError 
  } = useFamilyMedicalHistory();
  
  const { 
    surgeries, 
    loading: surgeriesLoading, 
    error: surgeriesError 
  } = useSurgeryHospitalization();
  
  // AI analysis for each tab
  const [analysesAiAnalysis, setAnalysesAiAnalysis] = useState<any>(null);
  const [vitalsAiAnalysis, setVitalsAiAnalysis] = useState<any>(null);
  const [bodyAiAnalysis, setBodyAiAnalysis] = useState<any>(null);
  const [lifestyleAiAnalysis, setLifestyleAiAnalysis] = useState<any>(null);

  // Fetch AI analysis for each tab
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      if (activeTab === 'sumario') {
        try {
          setAiLoading(true);
          const analysis = await HealthRecordsApiService.getAIAnalysis(6); // Summary tab uses type_id=6
          if (analysis) {
            setAiAnalysis(analysis);
          } else {
            try {
              const generated = await HealthRecordsApiService.generateAIAnalysis(6, false); // Summary tab uses type_id=6
              if (generated) {
                setAiAnalysis(generated);
              }
            } catch (genError) {
              console.error('Failed to generate AI analysis:', genError);
              setAiAnalysis(null);
            }
          }
        } catch (error) {
          console.error('Failed to fetch AI analysis:', error);
          setAiAnalysis(null);
        } finally {
          setAiLoading(false);
        }
      } else if (activeTab === 'analises') {
        setAiLoading(true);
        try {
          let analysis = await HealthRecordsApiService.getAIAnalysis(1);
          if (!analysis) {
            analysis = await HealthRecordsApiService.generateAIAnalysis(1, false);
          }
          setAnalysesAiAnalysis(analysis);
        } catch (error: any) {
          console.error('Failed to fetch Analyses AI analysis:', error);
          setAnalysesAiAnalysis(null);
        } finally {
          setAiLoading(false);
        }
      } else if (activeTab === 'vitais') {
        setAiLoading(true);
        try {
          let analysis = await HealthRecordsApiService.getAIAnalysis(2);
          if (!analysis) {
            analysis = await HealthRecordsApiService.generateAIAnalysis(2, false);
          }
          setVitalsAiAnalysis(analysis);
        } catch (error: any) {
          console.error('Failed to fetch Vitals AI analysis:', error);
          setVitalsAiAnalysis(null);
        } finally {
          setAiLoading(false);
        }
      } else if (activeTab === 'corpo') {
        setAiLoading(true);
        try {
          let analysis = await HealthRecordsApiService.getAIAnalysis(3);
          if (!analysis) {
            analysis = await HealthRecordsApiService.generateAIAnalysis(3, false);
          }
          setBodyAiAnalysis(analysis);
        } catch (error: any) {
          console.error('Failed to fetch Body AI analysis:', error);
          setBodyAiAnalysis(null);
        } finally {
          setAiLoading(false);
        }
      } else if (activeTab === 'lifestyle') {
        setAiLoading(true);
        try {
          let analysis = await HealthRecordsApiService.getAIAnalysis(4);
          if (!analysis) {
            analysis = await HealthRecordsApiService.generateAIAnalysis(4, false);
          }
          setLifestyleAiAnalysis(analysis);
        } catch (error: any) {
          console.error('Failed to fetch Lifestyle AI analysis:', error);
          setLifestyleAiAnalysis(null);
        } finally {
          setAiLoading(false);
        }
      }
    };

    fetchAIAnalysis();
  }, [activeTab]);

  // Format metric value for display (returns just the number, unit is passed separately)
  const formatMetricValue = (metric: MetricWithData): string => {
    if (metric.latest_value === null || metric.latest_value === undefined) {
      return t.notDefined;
    }
    
    // Handle object format {value: number} or primitive
    let numericValue: number;
    if (typeof metric.latest_value === 'object' && metric.latest_value !== null && 'value' in metric.latest_value) {
      numericValue = Number(metric.latest_value.value);
    } else {
      numericValue = Number(metric.latest_value);
    }
    
    if (isNaN(numericValue)) {
      return String(metric.latest_value);
    }
    
    // Format number with appropriate decimals (without unit - unit is passed separately to HealthMetricCard)
    const formattedValue = numericValue % 1 === 0 
      ? numericValue.toLocaleString() 
      : numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
    
    return formattedValue;
  };

  // Get metric unit separately
  const getMetricUnit = (metric: MetricWithData): string => {
    return metric.default_unit || metric.unit || '';
  };

  // Convert metric data points to chart format
  // LineChartComponent expects { date: string, value: number } format
  const convertMetricToChartData = (metric: MetricWithData): Array<{ date: string; value: number }> => {
    if (!metric.data_points || metric.data_points.length === 0) {
      return [];
    }
    
    const chartData = metric.data_points
      .map((point: any) => {
        // Handle different date formats from backend
        let dateValue: Date | null = null;
        const dateString = point.recorded_at || point.measure_start_time || point.created_at;
        
        if (dateString) {
          try {
            // Handle different date formats from backend
            if (typeof dateString === 'string') {
              // Try parsing as-is first (handles ISO strings with timezone)
              dateValue = new Date(dateString);
              
              // If that fails, try cleaning the string
              if (isNaN(dateValue.getTime())) {
                // Remove 'Z' and try again
                const cleanDate = dateString.replace(/Z$/, '');
                dateValue = new Date(cleanDate);
              }
              
              // If still invalid, try adding timezone offset
              if (isNaN(dateValue.getTime())) {
                // Try with explicit UTC
                dateValue = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
              }
            } else if (dateString instanceof Date) {
              dateValue = dateString;
            } else if (typeof dateString === 'number') {
              // Handle timestamp
              dateValue = new Date(dateString);
            }
            
            // Validate the date
            if (!dateValue || isNaN(dateValue.getTime())) {
              console.warn('Invalid date after parsing:', dateString);
              return null;
            }
          } catch (error) {
            console.warn('Error parsing date:', dateString, error);
            return null;
          }
        }
        
        if (!dateValue) {
          return null;
        }
        
        // Handle value - can be object {value: number} or primitive
        let numericValue: number;
        if (typeof point.value === 'object' && point.value !== null && 'value' in point.value) {
          numericValue = Number(point.value.value);
        } else {
          numericValue = Number(point.value);
        }
        
        if (isNaN(numericValue)) {
          console.warn('Invalid value:', point.value);
          return null;
        }
        
        // Return in the format expected by LineChartComponent: { date: string, value: number }
        return {
          date: dateValue.toISOString(), // Convert to ISO string for the chart component
          value: numericValue,
        };
      })
      .filter((point: any): point is { date: string; value: number } => {
        return point !== null && point.date !== undefined && point.value !== undefined && !isNaN(point.value);
      })
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
    
    // Debug logging
    if (__DEV__ && chartData.length > 0) {
      console.log(`[Chart] Converted ${metric.data_points.length} points to ${chartData.length} chart points for metric ${metric.display_name}`);
      console.log('[Chart] Sample data:', chartData.slice(0, 3));
    } else if (__DEV__ && metric.data_points && metric.data_points.length > 0) {
      console.warn(`[Chart] No valid chart data for metric ${metric.display_name}. Original points:`, metric.data_points.slice(0, 3));
    }
    
    return chartData;
  };

  // Format reference range for display based on user's profile gender
  const formatReferenceRange = (metric: MetricWithData): string => {
    if (!metric.reference_data) {
      return '';
    }
    
    // Get user's gender from profile
    const userGender = profile?.gender?.toLowerCase();
    
    // If reference_data is a string, return it
    if (typeof metric.reference_data === 'string') {
      return metric.reference_data;
    }
    
    // If reference_data is an object, format it
    if (typeof metric.reference_data === 'object') {
      // Handle gender-specific ranges
      if (metric.reference_data.male || metric.reference_data.female) {
        let selectedRange: { min?: number; max?: number } | null = null;
        
        // Select range based on user's gender
        if (userGender === 'male' || userGender === 'm' || userGender === 'masculino') {
          selectedRange = metric.reference_data.male;
        } else if (userGender === 'female' || userGender === 'f' || userGender === 'feminino') {
          selectedRange = metric.reference_data.female;
        }
        
        // If we have a gender-specific range, use it
        if (selectedRange) {
          const min = selectedRange.min ?? '';
          const max = selectedRange.max ?? '';
          if (min !== '' && max !== '') {
            return `${min}-${max}`;
          } else if (min !== '') {
            return `>${min}`;
          } else if (max !== '') {
            return `<${max}`;
          }
        }
        
        // Fallback: show both ranges if gender not specified or range not found
        const maleRange = metric.reference_data.male;
        const femaleRange = metric.reference_data.female;
        if (maleRange && femaleRange) {
          return `M: ${maleRange.min || ''}-${maleRange.max || ''}, F: ${femaleRange.min || ''}-${femaleRange.max || ''}`;
        } else if (maleRange) {
          const min = maleRange.min ?? '';
          const max = maleRange.max ?? '';
          return min !== '' && max !== '' ? `${min}-${max}` : '';
        } else if (femaleRange) {
          const min = femaleRange.min ?? '';
          const max = femaleRange.max ?? '';
          return min !== '' && max !== '' ? `${min}-${max}` : '';
        }
      }
      
      // Handle simple range
      if (metric.reference_data.min !== undefined || metric.reference_data.max !== undefined) {
        const min = metric.reference_data.min ?? '';
        const max = metric.reference_data.max ?? '';
        if (min !== '' && max !== '') {
          return `${min}-${max}`;
        } else if (min !== '') {
          return `>${min}`;
        } else if (max !== '') {
          return `<${max}`;
        }
      }
    }
    
    return '';
  };

  // Calculate health score from summary data (matching web app logic)
  const calculateHealthScore = (): number => {
    if (!summaryData) return 0;
    
    const allMetrics = [
      ...summaryData.wellness.recommended,
      ...summaryData.wellness.recent,
      ...summaryData.analysis.recommended,
      ...summaryData.analysis.recent
    ];
    
    // Remove duplicates by metric ID
    const uniqueMetrics = Array.from(
      new Map(allMetrics.map(m => [m.id, m])).values()
    );
    
    if (uniqueMetrics.length === 0) return 0;
    
    const normalCount = uniqueMetrics.filter(
      (m) => m.latest_status === "normal"
    ).length;
    
    return Math.round((normalCount / uniqueMetrics.length) * 100);
  };

  const renderSumarioTab = () => {
    // Get metrics from summary data - show recommended and recent separately
    // For wellness (types 2, 3, 4: Vitals, Body, Lifestyle)
    const wellnessRecommended = summaryData?.wellness.recommended || [];
    const wellnessRecent = summaryData?.wellness.recent || [];
    
    // For analysis (type 1)
    const analysisRecommended = summaryData?.analysis.recommended || [];
    const analysisRecent = summaryData?.analysis.recent || [];

    if (summaryLoading || aiLoading) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.textLight }}>{t.loading}</Text>
        </View>
      );
    }

    if (summaryError) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <Text style={{ color: Colors.danger, marginBottom: 8 }}>{t.error}</Text>
          <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
            {summaryError instanceof Error ? summaryError.message : String(summaryError)}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {/* AI Insight - General Assessment */}
        {aiAnalysis && (
          <AiInsight 
            insight={{
              title: aiAnalysis.title || t.assessment,
              date: aiAnalysis.generated_at || new Date().toISOString(),
              concerns: aiAnalysis.areas_of_concern || aiAnalysis.concerns || [],
              improvements: aiAnalysis.positive_trends || aiAnalysis.improvements || [],
              recommendations: aiAnalysis.recommendations || [],
            }}
            healthScore={calculateHealthScore()}
          />
        )}

        {/* Analysis Section */}
        {(analysisRecommended.length > 0 || analysisRecent.length > 0) && (
          <>
            <SectionHeader title={t.analysis || 'Analysis'} showViewAll={false} />
            
            {/* Recommended Analysis Metrics */}
            {analysisRecommended.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginBottom: 12, marginTop: 8 }]}>
                  {t.recommendedForYou || 'Recommended for You'}
                </Text>
                {/* Display all recommended metrics in rows of 3 */}
                {Array.from({ length: Math.ceil(analysisRecommended.length / 3) }).map((_, rowIndex) => (
                  <View key={`analysis-recommended-row-${rowIndex}`} style={styles.metricsRow}>
                    {analysisRecommended.slice(rowIndex * 3, (rowIndex + 1) * 3).map((metric) => (
                      <HealthMetricCard
                        key={metric.id}
                        name={metric.display_name || metric.name}
                        value={formatMetricValue(metric)}
                        unit={getMetricUnit(metric)}
                        reference={formatReferenceRange(metric)}
                        status={(() => {
                          const backendStatus = metric.latest_status?.toLowerCase();
                          if (backendStatus === 'critical') return 'danger';
                          if (backendStatus === 'abnormal' || backendStatus === 'warning') return 'warning';
                          if (backendStatus === 'normal') return 'normal';
                          return 'normal'; // Default fallback
                        })() as StatusType}
                        trend={(metric.trend === 'improving' ? 'up' : metric.trend === 'declining' ? 'down' : 'stable') as TrendType}
                        onPress={() => setActiveTab('analises')}
                      />
                    ))}
                  </View>
                ))}
              </>
            )}

            {/* Recent Analysis Metrics */}
            {analysisRecent.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginBottom: 12, marginTop: analysisRecommended.length > 0 ? 16 : 8 }]}>
                  {t.recentlyUpdated || 'Recently Updated'}
                </Text>
                {/* Display all recent metrics in rows of 3 */}
                {Array.from({ length: Math.ceil(analysisRecent.length / 3) }).map((_, rowIndex) => (
                  <View key={`analysis-recent-row-${rowIndex}`} style={styles.metricsRow}>
                    {analysisRecent.slice(rowIndex * 3, (rowIndex + 1) * 3).map((metric) => (
                      <HealthMetricCard
                        key={metric.id}
                        name={metric.display_name || metric.name}
                        value={formatMetricValue(metric)}
                        unit={getMetricUnit(metric)}
                        reference={formatReferenceRange(metric)}
                        status={(() => {
                          const backendStatus = metric.latest_status?.toLowerCase();
                          if (backendStatus === 'critical') return 'danger';
                          if (backendStatus === 'abnormal' || backendStatus === 'warning') return 'warning';
                          if (backendStatus === 'normal') return 'normal';
                          return 'normal'; // Default fallback
                        })() as StatusType}
                        trend={(metric.trend === 'improving' ? 'up' : metric.trend === 'declining' ? 'down' : 'stable') as TrendType}
                        onPress={() => setActiveTab('analises')}
                      />
                    ))}
                  </View>
                ))}
              </>
            )}
          </>
        )}

        {/* Wellness Section */}
        {(wellnessRecommended.length > 0 || wellnessRecent.length > 0) && (
          <>
            <SectionHeader title={t.wellness || 'Wellness'} showViewAll={false} />
            
            {/* Recommended Wellness Metrics */}
            {wellnessRecommended.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginBottom: 12, marginTop: 8 }]}>
                  {t.recommendedForYou || 'Recommended for You'}
                </Text>
                {/* Display all recommended metrics in rows of 3 */}
                {Array.from({ length: Math.ceil(wellnessRecommended.length / 3) }).map((_, rowIndex) => (
                  <View key={`wellness-recommended-row-${rowIndex}`} style={styles.metricsRow}>
                    {wellnessRecommended.slice(rowIndex * 3, (rowIndex + 1) * 3).map((metric) => (
                      <HealthMetricCard
                        key={metric.id}
                        name={metric.display_name || metric.name}
                        value={formatMetricValue(metric)}
                        unit={getMetricUnit(metric)}
                        reference={formatReferenceRange(metric)}
                        status={(() => {
                          const backendStatus = metric.latest_status?.toLowerCase();
                          if (backendStatus === 'critical') return 'danger';
                          if (backendStatus === 'abnormal' || backendStatus === 'warning') return 'warning';
                          if (backendStatus === 'normal') return 'normal';
                          return 'normal'; // Default fallback
                        })() as StatusType}
                        trend={(metric.trend === 'improving' ? 'up' : metric.trend === 'declining' ? 'down' : 'stable') as TrendType}
                        onPress={() => {
                          if (metric.health_record_type_id === 2) setActiveTab('vitais');
                          else if (metric.health_record_type_id === 3) setActiveTab('corpo');
                          else if (metric.health_record_type_id === 4) setActiveTab('lifestyle');
                        }}
                      />
                    ))}
                  </View>
                ))}
              </>
            )}

            {/* Recent Wellness Metrics */}
            {wellnessRecent.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginBottom: 12, marginTop: wellnessRecommended.length > 0 ? 16 : 8 }]}>
                  {t.recentlyUpdated || 'Recently Updated'}
                </Text>
                {/* Display all recent metrics in rows of 3 */}
                {Array.from({ length: Math.ceil(wellnessRecent.length / 3) }).map((_, rowIndex) => (
                  <View key={`wellness-recent-row-${rowIndex}`} style={styles.metricsRow}>
                    {wellnessRecent.slice(rowIndex * 3, (rowIndex + 1) * 3).map((metric) => (
                      <HealthMetricCard
                        key={metric.id}
                        name={metric.display_name || metric.name}
                        value={formatMetricValue(metric)}
                        unit={getMetricUnit(metric)}
                        reference={formatReferenceRange(metric)}
                        status={(() => {
                          const backendStatus = metric.latest_status?.toLowerCase();
                          if (backendStatus === 'critical') return 'danger';
                          if (backendStatus === 'abnormal' || backendStatus === 'warning') return 'warning';
                          if (backendStatus === 'normal') return 'normal';
                          return 'normal'; // Default fallback
                        })() as StatusType}
                        trend={(metric.trend === 'improving' ? 'up' : metric.trend === 'declining' ? 'down' : 'stable') as TrendType}
                        onPress={() => {
                          if (metric.health_record_type_id === 2) setActiveTab('vitais');
                          else if (metric.health_record_type_id === 3) setActiveTab('corpo');
                          else if (metric.health_record_type_id === 4) setActiveTab('lifestyle');
                        }}
                      />
                    ))}
                  </View>
                ))}
              </>
            )}
          </>
        )}

        {/* No data message */}
        {(!summaryData || (
          analysisRecommended.length === 0 && 
          analysisRecent.length === 0 && 
          wellnessRecommended.length === 0 && 
          wellnessRecent.length === 0
        )) && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
              {t.noDataAvailable || 'No data available'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Helper function to format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US');
    } catch {
      return dateString;
    }
  };

  // Helper function to format relation name
  const formatRelationName = (relation: string): string => {
    return relation
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'controlled':
        return Colors.success;
      case 'partiallyControlled':
        return Colors.warning;
      case 'uncontrolled':
        return Colors.danger;
      default:
        return Colors.textLight;
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'controlled':
        return t.statusControlled;
      case 'partiallyControlled':
        return t.statusPartiallyControlled;
      case 'uncontrolled':
        return t.statusUncontrolled;
      default:
        return status;
    }
  };

  // Helper function to get recovery status color
  const getRecoveryStatusColor = (status: string): string => {
    switch (status) {
      case 'full_recovery':
        return Colors.success;
      case 'partial_recovery':
        return Colors.warning;
      case 'no_recovery':
        return Colors.danger;
      default:
        return Colors.textLight;
    }
  };

  // Helper function to get recovery status label
  const getRecoveryStatusLabel = (status: string): string => {
    switch (status) {
      case 'full_recovery':
        return t.recoveryFull;
      case 'partial_recovery':
        return t.recoveryPartial;
      case 'no_recovery':
        return t.recoveryNone;
      default:
        return status;
    }
  };

  // Helper function to get procedure type label
  const getProcedureTypeLabel = (type: string): string => {
    return type === 'surgery' ? t.surgery : t.hospitalization;
  };

  const renderHistorialTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Current Medical Conditions */}
      <View style={styles.historyCard}>
        <View style={styles.historyCardHeader}>
          <View>
            <Text style={styles.historyCardTitle}>{t.currentMedicalConditions}</Text>
            <Text style={styles.historyCardDescription}>{t.activeConditions}</Text>
          </View>
        </View>
        <View style={styles.historyCardContent}>
          {currentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>{t.loadingCurrentConditions}</Text>
            </View>
          ) : currentError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{t.errorLoadingCurrentConditions}: {currentError}</Text>
            </View>
          ) : currentConditions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t.noCurrentConditions}</Text>
              <Text style={styles.emptyDescription}>{t.noCurrentConditionsDesc}</Text>
            </View>
          ) : (
            <View style={styles.conditionsList}>
              {currentConditions.map((condition, index) => (
                <TouchableOpacity 
                  key={condition.id || index} 
                  style={styles.conditionCard}
                  onPress={() => router.push({ pathname: '/condition-detail', params: { id: condition.id?.toString() || '', type: 'current' } })}
                >
                  <View style={styles.conditionCardHeader}>
                    <Text style={styles.conditionName}>{condition.condition}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(condition.status) }]}>
                      <Text style={styles.statusBadgeText}>
                        {getStatusLabel(condition.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.conditionDetails}>
                    {condition.diagnosedDate && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.diagnosed}:</Text> {formatDate(condition.diagnosedDate)}
                      </Text>
                    )}
                    {condition.treatedWith && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.treatment}:</Text> {condition.treatedWith}
                      </Text>
                    )}
                    {condition.notes && (
                      <Text style={styles.conditionNotes}>{condition.notes}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Past Medical Conditions */}
      <View style={styles.historyCard}>
        <View style={styles.historyCardHeader}>
          <View>
            <Text style={styles.historyCardTitle}>{t.previousMedicalConditions}</Text>
            <Text style={styles.historyCardDescription}>{t.resolvedConditions}</Text>
          </View>
        </View>
        <View style={styles.historyCardContent}>
          {pastLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>{t.loadingPastConditions}</Text>
            </View>
          ) : pastError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{t.errorLoadingPastConditions}: {pastError}</Text>
            </View>
          ) : pastConditions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t.noPastConditions}</Text>
              <Text style={styles.emptyDescription}>{t.noPastConditionsDesc}</Text>
            </View>
          ) : (
            <View style={styles.conditionsList}>
              {pastConditions.map((condition, index) => (
                <TouchableOpacity 
                  key={condition.id || index} 
                  style={styles.conditionCard}
                  onPress={() => router.push({ pathname: '/condition-detail', params: { id: condition.id?.toString() || '', type: 'past' } })}
                >
                  <View style={styles.conditionCardHeader}>
                    <Text style={styles.conditionName}>{condition.condition}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: Colors.success }]}>
                      <Text style={styles.statusBadgeText}>{t.resolved}</Text>
                    </View>
                  </View>
                  <View style={styles.conditionDetails}>
                    {condition.diagnosedDate && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.diagnosed}:</Text> {formatDate(condition.diagnosedDate)}
                      </Text>
                    )}
                    {condition.resolvedDate && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.resolved}:</Text> {formatDate(condition.resolvedDate)}
                      </Text>
                    )}
                    {condition.treatedWith && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.treatment}:</Text> {condition.treatedWith}
                      </Text>
                    )}
                    {condition.notes && (
                      <Text style={styles.conditionNotes}>{condition.notes}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Family Medical History */}
      <View style={styles.historyCard}>
        <View style={styles.historyCardHeader}>
          <View>
            <Text style={styles.historyCardTitle}>{t.familyHistory}</Text>
            <Text style={styles.historyCardDescription}>{t.familyConditions}</Text>
          </View>
        </View>
        <View style={styles.historyCardContent}>
          {familyLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>{t.loadingFamilyHistory}</Text>
            </View>
          ) : familyError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{t.errorLoadingFamilyHistory}: {familyError}</Text>
            </View>
          ) : familyHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t.noFamilyHistory}</Text>
              <Text style={styles.emptyDescription}>{t.noFamilyHistoryDesc}</Text>
            </View>
          ) : (
            <View style={styles.conditionsList}>
              {familyHistory.map((entry, index) => {
                const chronicDiseases = entry.chronic_diseases || [];
                const isDeceased = entry.is_deceased || false;
                
                return (
                  <TouchableOpacity 
                    key={entry.id || index} 
                    style={styles.conditionCard}
                    onPress={() => router.push({ pathname: '/family-history-detail', params: { id: entry.id?.toString() || '' } })}
                  >
                    <View style={styles.conditionCardHeader}>
                      <Text style={styles.conditionName}>{formatRelationName(entry.relation)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: isDeceased ? Colors.textLight : Colors.success }]}>
                        <Text style={styles.statusBadgeText}>
                          {isDeceased ? t.deceased : t.alive}
                        </Text>
                      </View>
                    </View>
                    
                    {isDeceased ? (
                      <View style={styles.conditionDetails}>
                        {entry.age_at_death && (
                          <Text style={styles.conditionDetailText}>
                            <Text style={styles.conditionDetailLabel}>{t.ageAtDeath}:</Text> {entry.age_at_death}
                          </Text>
                        )}
                        {entry.cause_of_death && (
                          <Text style={styles.conditionDetailText}>
                            <Text style={styles.conditionDetailLabel}>{t.causeOfDeath}:</Text> {entry.cause_of_death}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={styles.conditionDetails}>
                        {entry.current_age && (
                          <Text style={styles.conditionDetailText}>
                            <Text style={styles.conditionDetailLabel}>{t.currentAge}:</Text> {entry.current_age}
                          </Text>
                        )}
                        {chronicDiseases.length > 0 && (
                          <View style={styles.chronicDiseasesContainer}>
                            <Text style={styles.chronicDiseasesTitle}>{t.chronicDiseases}:</Text>
                            {chronicDiseases.map((disease: any, idx: number) => (
                              <Text key={idx} style={styles.chronicDiseaseItem}>
                                • {disease.disease} {disease.age_at_diagnosis && `(${t.diagnosedAtAge} ${disease.age_at_diagnosis})`}
                                {disease.comments && <Text style={styles.chronicDiseaseComment}> - {disease.comments}</Text>}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                    
                    {/* Legacy condition display for backward compatibility */}
                    {entry.condition && (
                      <View style={[styles.conditionDetails, styles.legacyConditionDetails]}>
                        <Text style={styles.conditionDetailText}>
                          <Text style={styles.conditionDetailLabel}>{t.condition}:</Text> {entry.condition}
                        </Text>
                        {entry.ageOfOnset && (
                          <Text style={styles.conditionDetailText}>
                            <Text style={styles.conditionDetailLabel}>{t.ageOfOnset}:</Text> {entry.ageOfOnset}
                          </Text>
                        )}
                        {entry.outcome && (
                          <Text style={styles.conditionDetailText}>
                            <Text style={styles.conditionDetailLabel}>{t.outcome}:</Text> {entry.outcome}
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Surgeries & Hospitalizations */}
      <View style={styles.historyCard}>
        <View style={styles.historyCardHeader}>
          <View>
            <Text style={styles.historyCardTitle}>{t.surgeriesHospitalizations}</Text>
            <Text style={styles.historyCardDescription}>{t.previousSurgeriesDesc}</Text>
          </View>
        </View>
        <View style={styles.historyCardContent}>
          {surgeriesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>{t.loading}</Text>
            </View>
          ) : surgeriesError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{surgeriesError}</Text>
            </View>
          ) : surgeries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t.noSurgeriesHospitalizations}</Text>
              <Text style={styles.emptyDescription}>{t.noSurgeriesHospitalizationsDesc}</Text>
            </View>
          ) : (
            <View style={styles.conditionsList}>
              {surgeries.map((surgery) => (
                <TouchableOpacity 
                  key={surgery.id} 
                  style={styles.conditionCard}
                  onPress={() => router.push({ pathname: '/surgery-detail', params: { id: surgery.id.toString() } })}
                >
                  <View style={styles.conditionCardHeader}>
                    <Text style={styles.conditionName}>
                      {getProcedureTypeLabel(surgery.procedure_type)} - {surgery.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getRecoveryStatusColor(surgery.recovery_status) }]}>
                      <Text style={styles.statusBadgeText}>
                        {getRecoveryStatusLabel(surgery.recovery_status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.conditionDetails}>
                    <Text style={styles.conditionDetailText}>
                      <Text style={styles.conditionDetailLabel}>{t.date}:</Text> {formatDate(surgery.procedure_date)}
                    </Text>
                    {surgery.reason && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.reason}:</Text> {surgery.reason}
                      </Text>
                    )}
                    {surgery.treatment && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.treatment}:</Text> {surgery.treatment}
                      </Text>
                    )}
                    {surgery.body_area && (
                      <Text style={styles.conditionDetailText}>
                        <Text style={styles.conditionDetailLabel}>{t.bodyArea}:</Text> {surgery.body_area}
                      </Text>
                    )}
                    {surgery.notes && (
                      <Text style={styles.conditionNotes}>
                        <Text style={styles.conditionDetailLabel}>{t.notes}:</Text> {surgery.notes}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderAnalisesTab = () => {
    if (analysesLoading || aiLoading) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.textLight }}>{t.loading}</Text>
        </View>
      );
    }

    // Get all metrics from all sections
    const allMetrics = analysesData?.sections?.flatMap(section => section.metrics || []) || [];
    const hasSections = analysesData?.sections && analysesData.sections.length > 0;
    const hasMetrics = allMetrics.length > 0;


    return (
      <View style={styles.tabContent}>
        {/* AI Analysis */}
        {analysesAiAnalysis && (
          <AiInsight insight={{
            title: analysesAiAnalysis.title || t.analyses,
            date: analysesAiAnalysis.generated_at || new Date().toISOString(),
            concerns: analysesAiAnalysis.areas_of_concern || analysesAiAnalysis.concerns || [],
            improvements: analysesAiAnalysis.positive_trends || analysesAiAnalysis.improvements || [],
            recommendations: analysesAiAnalysis.recommendations || [],
          }} />
        )}

        {/* Display sections with their metrics */}
        {!hasSections || !hasMetrics ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
              {t.noDataAvailable || 'No data available'}
            </Text>
            {analysesData && (
              <Text style={{ color: Colors.textLight, textAlign: 'center', marginTop: 8, fontSize: 12 }}>
                Sections: {analysesData.sections?.length || 0}, Metrics: {allMetrics.length}
              </Text>
            )}
          </View>
        ) : (
          analysesData.sections.map((section) => {
            if (!section.metrics || section.metrics.length === 0) return null;
            
            
            return (
              <View key={section.id}>
                <SectionHeader title={section.display_name || section.name} showViewAll={false} />
                <View style={styles.chartsContainer}>
                  {section.metrics.map((metric) => {
                    const chartData = convertMetricToChartData(metric);
                    const latestValue = formatMetricValue(metric);
                    const referenceRange = formatReferenceRange(metric);
                    // Map backend status to frontend StatusType
                    // Backend can return: 'normal' | 'abnormal' | 'critical' | 'unknown' | null | undefined
                    const backendStatus = metric.latest_status?.toLowerCase();
                    let status: StatusType = 'normal';
                    if (backendStatus === 'critical') {
                      status = 'danger';
                    } else if (backendStatus === 'abnormal' || backendStatus === 'warning') {
                      status = 'warning';
                    } else if (backendStatus === 'normal') {
                      status = 'normal';
                    } else if (!backendStatus || backendStatus === 'unknown') {
                      // If status is unknown or missing, we need to calculate it from the value
                      // For now, default to normal, but ideally should check against reference ranges
                      status = 'normal';
                    }
                    const statusColor = status === 'normal' ? Colors.success : status === 'warning' ? Colors.warning : Colors.danger;
                    
                    return (
                      <TouchableOpacity
                        key={metric.id}
                        style={styles.chartCard}
                        onPress={() => {/* Open detailed chart */ }}
                      >
                        <View style={styles.chartHeader}>
                          <Text style={styles.chartTitle}>{metric.display_name || metric.name}</Text>
                          <View style={styles.chartHeaderRight}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                              <Text style={styles.statusText}>
                                {status === 'normal' ? t.statusNormal : t.statusAbnormal}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {chartData.length > 0 ? (
                          <LineChartComponent
                            data={chartData}
                            referenceValue={referenceRange}
                            width={screenWidth - 48}
                            height={220}
                            color={statusColor}
                            showAxis={true}
                          />
                        ) : (
                          <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.textLight }}>{t.noDataAvailable}</Text>
                          </View>
                        )}
                        <View style={styles.chartFooter}>
                          <View style={styles.valueContainer}>
                            <Text style={styles.chartValue}>
                              {latestValue} {getMetricUnit(metric) && <Text style={styles.chartUnit}>{getMetricUnit(metric)}</Text>}
                            </Text>
                          </View>
                          {referenceRange && (
                            <Text style={styles.chartReference}>{t.reference}: {referenceRange}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/add-metric', params: { type: 'analyses' } })}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.addMetric}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/upload-document')}
          >
            <Upload size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.uploadDocument}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderVitaisTab = () => {
    if (vitalsLoading || aiLoading) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.textLight }}>{t.loading}</Text>
        </View>
      );
    }

    const allMetrics = vitalsData?.sections?.flatMap(section => section.metrics || []) || [];

    return (
      <View style={styles.tabContent}>
        {/* AI Analysis */}
        {vitalsAiAnalysis && (
          <AiInsight insight={{
            title: vitalsAiAnalysis.title || t.vitals,
            date: vitalsAiAnalysis.generated_at || new Date().toISOString(),
            concerns: vitalsAiAnalysis.areas_of_concern || vitalsAiAnalysis.concerns || [],
            improvements: vitalsAiAnalysis.positive_trends || vitalsAiAnalysis.improvements || [],
            recommendations: vitalsAiAnalysis.recommendations || [],
          }} />
        )}

        {/* Display sections with their metrics */}
        {vitalsData?.sections?.length === 0 && allMetrics.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
              {t.noDataAvailable || 'No data available'}
            </Text>
          </View>
        ) : (
          vitalsData?.sections?.map((section) => {
            if (!section.metrics || section.metrics.length === 0) return null;
            
            return (
              <View key={section.id}>
                <SectionHeader title={section.display_name || section.name} showViewAll={false} />
                <View style={styles.chartsContainer}>
                  {section.metrics.map((metric) => {
                    const chartData = convertMetricToChartData(metric);
                    const latestValue = formatMetricValue(metric);
                    const referenceRange = formatReferenceRange(metric);
                    // Map backend status to frontend StatusType
                    const backendStatus = metric.latest_status?.toLowerCase();
                    let status: StatusType = 'normal';
                    if (backendStatus === 'critical') {
                      status = 'danger';
                    } else if (backendStatus === 'abnormal' || backendStatus === 'warning') {
                      status = 'warning';
                    } else if (backendStatus === 'normal') {
                      status = 'normal';
                    } else {
                      if (__DEV__ && !backendStatus) {
                        console.warn(`[Status] Missing status for metric ${metric.display_name}, defaulting to normal`);
                      }
                      status = 'normal';
                    }
                    const statusColor = status === 'normal' ? Colors.success : status === 'warning' ? Colors.warning : Colors.danger;
                    const isBloodPressure = (metric.display_name || metric.name).toLowerCase().includes('pressão') || (metric.display_name || metric.name).toLowerCase().includes('pressure');
                    
                    return (
                      <TouchableOpacity
                        key={metric.id}
                        style={styles.chartCard}
                        onPress={() => {/* Open detailed chart */ }}
                      >
                        <View style={styles.chartHeader}>
                          <Text style={styles.chartTitle}>{metric.display_name || metric.name}</Text>
                          <View style={styles.chartHeaderRight}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                              <Text style={styles.statusText}>
                                {status === 'normal' ? t.statusNormal : t.statusAbnormal}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {chartData.length > 0 ? (
                          <LineChartComponent
                            data={chartData}
                            referenceValue={referenceRange}
                            width={screenWidth - 48}
                            height={220}
                            color={statusColor}
                            isDoubleValue={isBloodPressure}
                            showAxis={true}
                          />
                        ) : (
                          <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.textLight }}>{t.noDataAvailable}</Text>
                          </View>
                        )}
                        <View style={styles.chartFooter}>
                          <View style={styles.valueContainer}>
                            <Text style={styles.chartValue}>
                              {latestValue} {getMetricUnit(metric) && <Text style={styles.chartUnit}>{getMetricUnit(metric)}</Text>}
                            </Text>
                          </View>
                          {referenceRange && (
                            <Text style={styles.chartReference}>{t.reference}: {referenceRange}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/add-metric', params: { type: 'vitals' } })}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.addMeasurement}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCorpoTab = () => {
    if (bodyLoading || aiLoading) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.textLight }}>{t.loading}</Text>
        </View>
      );
    }

    const allMetrics = bodyData?.sections?.flatMap(section => section.metrics || []) || [];

    return (
      <View style={styles.tabContent}>
        {/* AI Analysis */}
        {bodyAiAnalysis && (
          <AiInsight insight={{
            title: bodyAiAnalysis.title || t.body,
            date: bodyAiAnalysis.generated_at || new Date().toISOString(),
            concerns: bodyAiAnalysis.areas_of_concern || bodyAiAnalysis.concerns || [],
            improvements: bodyAiAnalysis.positive_trends || bodyAiAnalysis.improvements || [],
            recommendations: bodyAiAnalysis.recommendations || [],
          }} />
        )}

        {/* Display sections with their metrics */}
        {!bodyData?.sections || bodyData.sections.length === 0 || allMetrics.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
              {t.noDataAvailable || 'No data available'}
            </Text>
          </View>
        ) : (
          bodyData.sections.map((section) => {
            if (!section.metrics || section.metrics.length === 0) return null;
            
            return (
              <View key={section.id}>
                <SectionHeader title={section.display_name || section.name} showViewAll={false} />
                <View style={styles.chartsContainer}>
                  {section.metrics.map((metric) => {
                    const chartData = convertMetricToChartData(metric);
                    const latestValue = formatMetricValue(metric);
                    const referenceRange = formatReferenceRange(metric);
                    // Map backend status to frontend StatusType
                    const backendStatus = metric.latest_status?.toLowerCase();
                    let status: StatusType = 'normal';
                    if (backendStatus === 'critical') {
                      status = 'danger';
                    } else if (backendStatus === 'abnormal' || backendStatus === 'warning') {
                      status = 'warning';
                    } else if (backendStatus === 'normal') {
                      status = 'normal';
                    } else {
                      if (__DEV__ && !backendStatus) {
                        console.warn(`[Status] Missing status for metric ${metric.display_name}, defaulting to normal`);
                      }
                      status = 'normal';
                    }
                    const statusColor = status === 'normal' ? Colors.success : status === 'warning' ? Colors.warning : Colors.danger;
                    const isHeight = (metric.display_name || metric.name).toLowerCase().includes('altura') || (metric.display_name || metric.name).toLowerCase().includes('height');
                    
                    if (isHeight) {
                      // Special rendering for height
                      const heightValue = typeof metric.latest_value === 'object' && 'value' in metric.latest_value 
                        ? metric.latest_value.value 
                        : Number(metric.latest_value) || 0;
                      
                      return (
                        <TouchableOpacity
                          key={metric.id}
                          style={styles.chartCard}
                          onPress={() => {/* Open detailed chart */ }}
                        >
                          <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>{metric.display_name || metric.name}</Text>
                          </View>
                          <View style={styles.heightContainer}>
                            <View style={styles.heightVisual}>
                              <View style={styles.heightBar}>
                                <View style={styles.heightIndicator}>
                                  <Text style={styles.heightIndicatorText}>{heightValue} {metric.default_unit || metric.unit || 'cm'}</Text>
                                </View>
                              </View>
                              <View style={styles.heightScale}>
                                <Text style={styles.heightScaleText}>150</Text>
                                <Text style={styles.heightScaleText}>160</Text>
                                <Text style={styles.heightScaleText}>170</Text>
                                <Text style={styles.heightScaleText}>180</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.chartFooter}>
                            <View style={styles.valueContainer}>
                              <Text style={styles.chartValue}>{latestValue}</Text>
                              <Text style={styles.chartUnit}>{metric.default_unit || metric.unit || ''}</Text>
                            </View>
                            {metric.latest_recorded_at && (
                              <Text style={styles.chartReference}>
                                {t.lastMeasurement}: {new Date(metric.latest_recorded_at).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <TouchableOpacity
                        key={metric.id}
                        style={styles.chartCard}
                        onPress={() => {/* Open detailed chart */ }}
                      >
                        <View style={styles.chartHeader}>
                          <Text style={styles.chartTitle}>{metric.display_name || metric.name}</Text>
                          {referenceRange && (
                            <View style={styles.chartHeaderRight}>
                              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                <Text style={styles.statusText}>
                                  {status === 'normal' ? t.statusNormal : t.statusAbnormal}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                        {chartData.length > 0 ? (
                          <LineChartComponent
                            data={chartData}
                            referenceValue={referenceRange}
                            width={screenWidth - 48}
                            height={220}
                            color={statusColor}
                            showAxis={true}
                          />
                        ) : (
                          <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.textLight }}>{t.noDataAvailable}</Text>
                          </View>
                        )}
                        <View style={styles.chartFooter}>
                          <View style={styles.valueContainer}>
                            <Text style={styles.chartValue}>
                              {latestValue} {getMetricUnit(metric) && <Text style={styles.chartUnit}>{getMetricUnit(metric)}</Text>}
                            </Text>
                          </View>
                          {referenceRange && (
                            <Text style={styles.chartReference}>{t.reference}: {referenceRange}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/add-metric', params: { type: 'body' } })}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.addMeasurement}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderLifestyleTab = () => {
    if (lifestyleLoading || aiLoading) {
      return (
        <View style={[styles.tabContent, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, color: Colors.textLight }}>{t.loading}</Text>
        </View>
      );
    }

    const allMetrics = lifestyleData?.sections?.flatMap(section => section.metrics || []) || [];

    return (
      <View style={styles.tabContent}>
        {/* AI Analysis */}
        {lifestyleAiAnalysis && (
          <AiInsight insight={{
            title: lifestyleAiAnalysis.title || t.lifestyle,
            date: lifestyleAiAnalysis.generated_at || new Date().toISOString(),
            concerns: lifestyleAiAnalysis.areas_of_concern || lifestyleAiAnalysis.concerns || [],
            improvements: lifestyleAiAnalysis.positive_trends || lifestyleAiAnalysis.improvements || [],
            recommendations: lifestyleAiAnalysis.recommendations || [],
          }} />
        )}

        {/* Display sections with their metrics */}
        {!lifestyleData?.sections || lifestyleData.sections.length === 0 || allMetrics.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight, textAlign: 'center' }}>
              {t.noDataAvailable || 'No data available'}
            </Text>
          </View>
        ) : (
          lifestyleData.sections.map((section) => {
            if (!section.metrics || section.metrics.length === 0) return null;
            
            return (
              <View key={section.id}>
                <SectionHeader title={section.display_name || section.name} showViewAll={false} />
                <View style={styles.chartsContainer}>
                  {section.metrics.map((metric) => {
                    const chartData = convertMetricToChartData(metric);
                    const latestValue = formatMetricValue(metric);
                    const referenceRange = formatReferenceRange(metric);
                    // Map backend status to frontend StatusType
                    const backendStatus = metric.latest_status?.toLowerCase();
                    let status: StatusType = 'normal';
                    if (backendStatus === 'critical') {
                      status = 'danger';
                    } else if (backendStatus === 'abnormal' || backendStatus === 'warning') {
                      status = 'warning';
                    } else if (backendStatus === 'normal') {
                      status = 'normal';
                    } else {
                      if (__DEV__ && !backendStatus) {
                        console.warn(`[Status] Missing status for metric ${metric.display_name}, defaulting to normal`);
                      }
                      status = 'normal';
                    }
                    const statusColor = status === 'normal' ? Colors.success : status === 'warning' ? Colors.warning : Colors.danger;
                    // Determine chart type based on metric name or data type
                    const chartType = (metric.data_type === 'integer' || metric.data_type === 'count') ? 'bar' : 'line';
                    
                    return (
                      <TouchableOpacity
                        key={metric.id}
                        style={styles.chartCard}
                        onPress={() => {/* Open detailed chart */ }}
                      >
                        <View style={styles.chartHeader}>
                          <Text style={styles.chartTitle}>{metric.display_name || metric.name}</Text>
                          <View style={styles.chartHeaderRight}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                              <Text style={styles.statusText}>
                                {status === 'normal' ? t.statusNormal : t.statusAbnormal}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {chartData.length > 0 ? (
                          <LineChartComponent
                            data={chartData}
                            referenceValue={referenceRange}
                            width={screenWidth - 48}
                            height={220}
                            color={statusColor}
                            chartType={chartType as 'line' | 'bar'}
                            showAxis={true}
                          />
                        ) : (
                          <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.textLight }}>{t.noDataAvailable}</Text>
                          </View>
                        )}
                        <View style={styles.chartFooter}>
                          <View style={styles.valueContainer}>
                            <Text style={styles.chartValue}>
                              {latestValue} {getMetricUnit(metric) && <Text style={styles.chartUnit}>{getMetricUnit(metric)}</Text>}
                            </Text>
                          </View>
                          {referenceRange && (
                            <Text style={styles.chartReference}>{t.reference}: {referenceRange}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-activity')}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.addActivity}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderExamesTab = () => {
    const insights = getTabInsights(t);
    return (
      <View style={styles.tabContent}>
        <View style={styles.examsHeaderContainer}>
          <Text style={styles.examsHeaderTitle}>{t.aiMedicalExamsAnalysis}</Text>
        </View>

        <AiInsight insight={insights.exames} />

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>{t.aiExamsDisclaimer}</Text>
        </View>

        <View style={styles.examsListContainer}>
          {medicalExams.map((exam) => (
            <ExamItem
              key={exam.id}
              type={exam.type}
              date={exam.date}
              region={exam.region}
              conclusion={exam.conclusion}
              fileName={exam.fileName}
              risk={exam.risk}
              onView={() => {
                if (exam.fileUrl) {
                  Linking.openURL(exam.fileUrl);
                }
              }}
              onEdit={() => {
                console.log('Edit exam', exam.id);
              }}
            />
          ))}
        </View>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/upload-document')}
          >
            <Upload size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.uploadExam}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderVacinasTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.vaccineSectionHeader}>
        <Text style={styles.vaccineSectionTitle}>{t.nextVaccines}</Text>
      </View>

      <View style={styles.vaccineGrid}>
        <View style={styles.vaccineCard}>
          <Text style={styles.vaccineName}>Gripe</Text>
          <Text style={styles.vaccineDate}>
            {language === 'pt-PT' ? 'Outubro' : language === 'es-ES' ? 'Octubre' : 'October'} 2024
          </Text>
          <Text style={styles.vaccineInfo}>{t.annual}</Text>
        </View>
        <View style={styles.vaccineCard}>
          <Text style={styles.vaccineName}>Tétano</Text>
          <Text style={styles.vaccineDate}>
            {language === 'pt-PT' ? 'Março' : language === 'es-ES' ? 'Marzo' : 'March'} 2030
          </Text>
          <Text style={styles.vaccineInfo}>{t.every10Years}</Text>
        </View>
      </View>

      <View style={styles.vaccineSectionHeader}>
        <Text style={styles.vaccineSectionTitle}>{t.administeredVaccines}</Text>
      </View>

      <View style={styles.vaccineGrid}>
        {vaccinations.map((vaccine, index) => (
          <View key={index} style={styles.vaccineCard}>
            <Text style={styles.vaccineName}>{vaccine.name}</Text>
            <Text style={styles.vaccineDate}>{new Date(vaccine.date).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}</Text>
            <Text style={styles.vaccineInfo}>{vaccine.location}</Text>
            <Text style={styles.vaccineDose}>{vaccine.dose}</Text>
          </View>
        ))}
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {/* Open add vaccine modal */ }}
        >
          <Plus size={20} color={Colors.background} />
          <Text style={styles.addButtonText}>{t.addVaccine}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sumario':
        return renderSumarioTab();
      case 'historial':
        return renderHistorialTab();
      case 'analises':
        return renderAnalisesTab();
      case 'vitais':
        return renderVitaisTab();
      case 'corpo':
        return renderCorpoTab();
      case 'lifestyle':
        return renderLifestyleTab();
      case 'exames':
        return renderExamesTab();
      case 'vacinas':
        return renderVacinasTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t.healthRecords}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/add-metric', params: { type: 'analyses' } })}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.add}</Text>
          </TouchableOpacity>
        </View>

        <TabView
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
        />

        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  assessmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assessmentTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  assessmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  assessmentSection: {
    marginBottom: 8,
  },
  assessmentSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  assessmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  assessmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
  },
  assessmentText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historialContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historialSection: {
    marginBottom: 24,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  conditionText: {
    fontSize: 14,
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  historyCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  historyCardDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  historyCardContent: {
    padding: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.textLight,
    fontSize: 14,
  },
  errorContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyDescription: {
    color: Colors.textLight,
    fontSize: 12,
    textAlign: 'center',
  },
  conditionsList: {
    gap: 12,
  },
  conditionCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  conditionDetails: {
    gap: 8,
  },
  conditionDetailText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  conditionDetailLabel: {
    fontWeight: '600',
    color: Colors.text,
  },
  conditionNotes: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  chronicDiseasesContainer: {
    marginTop: 8,
  },
  chronicDiseasesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  chronicDiseaseItem: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 12,
    marginBottom: 4,
    lineHeight: 20,
  },
  chronicDiseaseComment: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  legacyConditionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chartsContainer: {
    marginBottom: 16,
  },
  chartCard: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusText: {
    fontSize: 10,
    color: Colors.background,
    fontWeight: 'bold',
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  chartValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartUnit: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
    fontWeight: 'normal',
  },
  chartReference: {
    fontSize: 12,
    color: Colors.textLight,
  },
  heightContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heightVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    width: '100%',
  },
  heightBar: {
    width: 40,
    height: '100%',
    backgroundColor: Colors.secondary + '30',
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  heightIndicator: {
    position: 'absolute',
    left: 40,
    // Position based on height (163cm) relative to scale (150-180cm)
    bottom: '43%', // Approximate position for 163cm
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heightIndicatorText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  heightScale: {
    height: '100%',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  heightScaleText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  vaccineSectionHeader: {
    marginBottom: 12,
  },
  vaccineSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  vaccineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vaccineCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  vaccineDate: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  vaccineInfo: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  vaccineDose: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  documentsContainer: {
    marginBottom: 16,
  },
  documentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentImageContainer: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  documentImage: {
    width: '100%',
    height: '100%',
  },
  documentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
  },
  documentLocation: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  documentDoctor: {
    fontSize: 12,
    color: Colors.textLight,
  },
  documentActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
  },
  documentButton: {
    padding: 8,
  },
  examsHeaderContainer: {
    marginBottom: 16,
  },
  examsHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  disclaimerContainer: {
    backgroundColor: Colors.secondary + '40',
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  examsListContainer: {
    marginBottom: 16,
  },
});