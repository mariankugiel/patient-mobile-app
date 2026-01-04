import apiClient from './axios-config';

/**
 * Helper function to handle API errors
 */
const handleApiError = (error: any, defaultMessage: string): Error => {
  // Handle timeout errors specifically
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return new Error('Connection failed. Please check your internet connection and try again.');
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return new Error('Unable to connect to server. Please check your internet connection.');
  }

  const message = error.response?.data?.detail || error.message || defaultMessage;
  return new Error(message);
};

export interface MetricWithData {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  unit?: string;
  default_unit?: string;
  reference_data?: any;
  threshold?: {
    min: number;
    max: number;
  };
  data_type?: string;
  // Backend returns these field names
  latest_value?: any; // Can be object {value: number} or primitive
  latest_status?: 'normal' | 'abnormal' | 'critical' | 'unknown';
  latest_recorded_at?: string;
  total_records?: number;
  trend?: 'improving' | 'declining' | 'stable' | 'unknown';
  change_from_previous?: number;
  data_points?: any[];
  section_id: number;
  section_name?: string;
  health_record_type_id: number;
}

export interface SummaryData {
  wellness: {
    recommended: MetricWithData[];
    recent: MetricWithData[];
  };
  analysis: {
    recommended: MetricWithData[];
    recent: MetricWithData[];
  };
}

export interface AIAnalysis {
  id?: number;
  title?: string;
  summary?: string;
  areas_of_concern?: string[];
  positive_trends?: string[];
  recommendations?: string[];
  generated_at?: string;
  health_record_type_id?: number;
  // Legacy field names for compatibility
  concerns?: string[];
  improvements?: string[];
}

export interface HealthRecordSection {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  health_record_type_id: number;
  section_template_id?: number;
  metrics: MetricWithData[];
}

export interface DashboardData {
  sections: HealthRecordSection[];
}

export class HealthRecordsApiService {
  /**
   * Get health records summary data
   */
  static async getSummary(): Promise<SummaryData> {
    try {
      const response = await apiClient.get('/health-records/summary');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch health records summary');
    }
  }

  /**
   * Get AI analysis for health records
   * Uses the ai-analysis/analyze endpoint with force_check=false to get existing analysis
   */
  static async getAIAnalysis(healthRecordTypeId: number): Promise<AIAnalysis | null> {
    try {
      // Use analyze endpoint with force_check=false to get existing analysis
      const response = await apiClient.post('/ai-analysis/analyze', {
        health_record_type_id: healthRecordTypeId,
        force_check: false,
      }, {
        timeout: 30000, // 30 seconds timeout
      });
      
      // Backend returns: { success: boolean, message: string, analysis: {...}, generated_at: string, ... }
      if (response.data && response.data.analysis) {
        // Map the response to our interface
        const analysis = response.data.analysis;
        return {
          id: response.data.id,
          title: response.data.title || 'Health Assessment',
          summary: analysis.summary || analysis.overall_assessment,
          areas_of_concern: analysis.areas_of_concern || [],
          positive_trends: analysis.positive_trends || [],
          recommendations: analysis.recommendations || [],
          generated_at: response.data.generated_at,
          health_record_type_id: healthRecordTypeId,
        };
      }
      return null;
    } catch (error: any) {
      // If analysis doesn't exist or no data, return null instead of throwing
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.status === 500) {
        // Check if it's a "no data" error - backend returns 200 with success=false for no data
        // But if it's a 500, check the detail
        const detail = error.response?.data?.detail || '';
        if (detail.includes('No health data') || detail.includes('No health')) {
          return null;
        }
        // For other 500 errors, still return null to allow generate to be called
        return null;
      }
      throw handleApiError(error, 'Failed to fetch AI analysis');
    }
  }

  /**
   * Get dashboard data for a specific health record type
   * Returns sections with their metrics
   */
  static async getDashboard(healthRecordTypeId: number): Promise<DashboardData> {
    try {
      const response = await apiClient.get('/health-records/sections/combined', {
        params: {
          health_record_type_id: healthRecordTypeId,
          include_inactive: false,
        },
      });
      
      // Backend returns { user_sections: [...], admin_templates: [...] }
      // We use user_sections for the dashboard
      const userSections = response.data.user_sections || [];
      
      // Log for debugging (can be removed in production)
      if (__DEV__) {
        console.log(`[HealthRecordsAPI] Fetched ${userSections.length} sections for type ${healthRecordTypeId}`);
      }
      
      // Transform the response to match our interface
      const sections: HealthRecordSection[] = userSections.map((section: any) => {
        const sectionData: HealthRecordSection = {
          id: section.id,
          name: section.name,
          display_name: section.display_name || section.name,
          description: section.description,
          health_record_type_id: section.health_record_type_id,
          section_template_id: section.section_template_id,
          metrics: [],
        };
        
        const metrics = (section.metrics || []).map((metric: any) => {
          // Ensure data_points is properly formatted
          let dataPoints = metric.data_points || [];
          
          // If data_points is an array of objects, ensure they have the right structure
          if (Array.isArray(dataPoints) && dataPoints.length > 0) {
            dataPoints = dataPoints.map((point: any) => {
              // Handle different data point formats
              if (typeof point === 'object' && point !== null) {
                return {
                  value: point.value,
                  recorded_at: point.recorded_at || point.measure_start_time || point.created_at,
                  status: point.status,
                  source: point.source,
                };
              }
              return point;
            });
          }
          
          const metricData: MetricWithData = {
            id: metric.id,
            name: metric.name,
            display_name: metric.display_name || metric.name,
            description: metric.description,
            unit: metric.unit,
            default_unit: metric.default_unit,
            reference_data: metric.reference_data,
            threshold: metric.threshold,
            data_type: metric.data_type,
            latest_value: metric.latest_value,
            latest_status: metric.latest_status,
            latest_recorded_at: metric.latest_recorded_at,
            total_records: metric.total_records || 0,
            trend: metric.trend,
            change_from_previous: metric.change_from_previous,
            data_points: dataPoints,
            section_id: section.id,
            section_name: section.display_name || section.name,
            health_record_type_id: section.health_record_type_id,
          };
          
          // Debug logging for status
          if (__DEV__ && metric.latest_status) {
            console.log(`[HealthRecordsAPI] Metric: ${metricData.display_name}, Status from backend: ${metric.latest_status}, Type: ${typeof metric.latest_status}`);
          } else if (__DEV__ && !metric.latest_status) {
            console.warn(`[HealthRecordsAPI] Metric: ${metricData.display_name}, Status is missing/null/undefined`);
          }
          
          return metricData;
        });
        
        sectionData.metrics = metrics;
        return sectionData;
      });
      
      return { sections };
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch dashboard data');
    }
  }

  /**
   * Generate AI analysis for health records
   * Uses the ai-analysis/analyze endpoint
   */
  static async generateAIAnalysis(healthRecordTypeId: number, forceRegenerate: boolean = false): Promise<AIAnalysis> {
    try {
      const response = await apiClient.post('/ai-analysis/analyze', {
        health_record_type_id: healthRecordTypeId,
        force_check: forceRegenerate,
      }, {
        timeout: 60000, // 60 seconds timeout for AI analysis
      });
      
      // Backend returns: { success: boolean, message: string, analysis: {...}, generated_at: string, ... }
      // Even if success=false, it may still have analysis data (fallback mode)
      if (response.data && response.data.analysis) {
        // Map the response to our interface
        const analysis = response.data.analysis;
        return {
          id: response.data.id,
          title: response.data.title || 'Health Assessment',
          summary: analysis.summary || analysis.overall_assessment,
          areas_of_concern: analysis.areas_of_concern || [],
          positive_trends: analysis.positive_trends || [],
          recommendations: analysis.recommendations || [],
          generated_at: response.data.generated_at,
          health_record_type_id: healthRecordTypeId,
        };
      }
      
      // If no analysis data, check if it's a "no data" message
      if (response.data && response.data.message && response.data.message.includes('No health data')) {
        throw new Error('No health data available for analysis');
      }
      
      throw new Error('Invalid response format from AI analysis service');
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 500) {
        // Server error - might still have fallback analysis in response.data
        if (error.response?.data?.analysis) {
          const analysis = error.response.data.analysis;
          return {
            title: 'Health Assessment',
            summary: analysis.summary || analysis.overall_assessment,
            areas_of_concern: analysis.areas_of_concern || [],
            positive_trends: analysis.positive_trends || [],
            recommendations: analysis.recommendations || [],
            generated_at: new Date().toISOString(),
            health_record_type_id: healthRecordTypeId,
          };
        }
        throw handleApiError(error, 'AI analysis service error');
      } else if (error.response?.status === 403) {
        throw new Error('AI analysis not available in your region');
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        throw new Error('Network connection error. Please check your internet connection.');
      } else if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        throw new Error('AI analysis is taking longer than expected. Please try again.');
      } else {
        throw handleApiError(error, 'Failed to generate AI analysis');
      }
    }
  }

  /**
   * Create a new health record (measurement)
   */
  static async createHealthRecord(recordData: {
    section_id: number;
    metric_id: number;
    value: number | string | { value: number };
    recorded_at?: string;
    notes?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/health-records/', {
        section_id: recordData.section_id,
        metric_id: recordData.metric_id,
        value: recordData.value,
        recorded_at: recordData.recorded_at || new Date().toISOString(),
        source: 'manual',
        data_type: typeof recordData.value === 'number' ? 'float' : 'string',
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create health record');
    }
  }

  /**
   * Upload a document
   */
  static async uploadDocument(
    file: { uri: string; type: string; name: string },
    documentData: {
      document_type: string;
      document_name: string;
      document_date: string;
      doctor?: string;
      notes?: string;
    }
  ): Promise<any> {
    try {
      const formData = new FormData();
      
      // Add file
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
      
      // Add metadata
      formData.append('description', documentData.notes || '');
      formData.append('doc_date', documentData.document_date);
      formData.append('doc_type', documentData.document_type);
      formData.append('provider', documentData.doctor || '');
      formData.append('use_ocr', 'false');
      
      const response = await apiClient.post('/health-records/health-record-doc-lab/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to upload document');
    }
  }

  /**
   * Get combined sections and admin templates
   */
  static async getSectionsCombined(healthRecordTypeId?: number): Promise<{
    user_sections: HealthRecordSection[];
    admin_templates: any[];
  }> {
    try {
      const params: any = {};
      if (healthRecordTypeId) {
        params.health_record_type_id = healthRecordTypeId;
      }
      const response = await apiClient.get('/health-records/sections/combined', { params });
      return {
        user_sections: response.data.user_sections || [],
        admin_templates: response.data.admin_templates || [],
      };
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch sections');
    }
  }

  /**
   * Get admin metric templates for a section template
   */
  static async getAdminMetricTemplates(sectionTemplateId?: number, healthRecordTypeId: number = 1): Promise<any[]> {
    try {
      const params: any = { health_record_type_id: healthRecordTypeId };
      if (sectionTemplateId) {
        params.section_template_id = sectionTemplateId;
      }
      const response = await apiClient.get('/health-records/admin-templates/metrics', { params });
      return response.data || [];
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch metric templates');
    }
  }

  /**
   * Create a new section
   */
  static async createSection(sectionData: {
    name: string;
    display_name: string;
    description?: string;
    health_record_type_id: number;
    section_template_id?: number;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/health-records/sections', sectionData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create section');
    }
  }

  /**
   * Create a new metric
   */
  static async createMetric(metricData: {
    section_id: number;
    name: string;
    display_name: string;
    description?: string;
    default_unit?: string;
    reference_data?: any;
    data_type: string;
    is_default?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/health-records/metrics', metricData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create metric');
    }
  }
}

