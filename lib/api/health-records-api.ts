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
   * Upload and analyze a lab document (returns parsed results, doesn't create records)
   */
  static async uploadAndAnalyzeLabDocument(
    file: { uri: string; type: string; name: string },
    documentData: {
      lab_test_date?: string;
      lab_test_type?: string;
      provider?: string;
      description?: string;
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
      if (documentData.description) {
        formData.append('description', documentData.description);
      }
      if (documentData.lab_test_date) {
        formData.append('doc_date', documentData.lab_test_date);
      }
      if (documentData.lab_test_type) {
        formData.append('doc_type', documentData.lab_test_type);
      }
      if (documentData.provider) {
        formData.append('provider', documentData.provider);
      }
      formData.append('use_ocr', 'false');
      
      const response = await apiClient.post('/health-records/health-record-doc-lab/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to upload and analyze document');
    }
  }

  /**
   * Bulk create health records from lab document analysis results
   */
  static async bulkCreateLabRecords(bulkData: {
    records: Array<{
      lab_name?: string;
      type_of_analysis?: string;
      metric_name: string;
      date_of_value?: string;
      value: string | number;
      unit?: string;
      reference?: string;
    }>;
    file_name: string;
    description?: string;
    s3_url: string;
    lab_test_date: string;
    provider?: string;
    document_type?: string;
    detected_language?: string;
    translation_applied?: boolean;
    user_language?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/health-records/health-record-doc-lab/bulk', bulkData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create health records');
    }
  }

  /**
   * Get medical documents (lab documents)
   */
  static async getMedicalDocuments(
    skip: number = 0,
    limit: number = 100,
    documentType?: string
  ): Promise<any[]> {
    try {
      const params: any = {
        skip: skip.toString(),
        limit: limit.toString(),
      };
      if (documentType) {
        params.document_type = documentType;
      }
      const response = await apiClient.get('/health-records/health-record-doc-lab', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch medical documents');
    }
  }

  /**
   * Update medical document (lab document)
   */
  static async updateMedicalDocument(
    documentId: number,
    updateData: {
      lab_test_date?: string;
      lab_doc_type?: string;
      provider?: string;
      description?: string;
    }
  ): Promise<any> {
    try {
      const response = await apiClient.put(
        `/health-records/health-record-doc-lab/${documentId}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update medical document');
    }
  }

  /**
   * Upload and analyze medical image (exam) PDF
   */
  static async uploadMedicalImage(
    file: { uri: string; type: string; name: string }
  ): Promise<{
    success: boolean;
    message: string;
    extracted_info?: any;
    translated_info?: any;
    detected_language?: string;
    user_language?: string;
    translation_applied?: boolean;
    s3_key: string;
    filename: string;
    duplicate_found?: boolean;
    existing_document?: any;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      const response = await apiClient.post('/health-records/images/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to upload medical image');
    }
  }

  /**
   * Save medical image (exam) after upload and analysis
   */
  static async saveMedicalImage(imageData: {
    image_type: string;
    body_part?: string;
    image_date: string;
    interpretation?: string;
    conclusions?: string;
    doctor_name?: string;
    doctor_number?: string;
    original_filename: string;
    file_size_bytes: number;
    content_type: string;
    s3_key: string;
    findings?: string;
  }): Promise<{ success: boolean; message: string; id: number }> {
    try {
      const response = await apiClient.post('/health-records/health-record-doc-exam', imageData, {
        timeout: 60000,
      });
      return {
        success: true,
        message: 'Medical image saved successfully',
        id: response.data.id,
      };
    } catch (error: any) {
      throw handleApiError(error, 'Failed to save medical image');
    }
  }

  /**
   * Get medical images (exams) list
   */
  static async getMedicalImages(
    skip: number = 0,
    limit: number = 100
  ): Promise<Array<{
    id: number;
    image_type: string;
    body_part?: string;
    image_date: string;
    findings?: string;
    conclusions?: string;
    interpretation?: string;
    original_filename: string;
    file_size_bytes: number;
    content_type: string;
    s3_key: string;
    doctor_name?: string;
    doctor_number?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  }>> {
    try {
      const response = await apiClient.get('/health-records/health-record-doc-exam', {
        params: {
          skip: skip.toString(),
          limit: limit.toString(),
        },
      });
      return response.data.images || response.data || [];
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch medical images');
    }
  }

  /**
   * Update medical image
   */
  static async updateMedicalImage(
    imageId: number,
    updateData: {
      image_type?: string;
      body_part?: string;
      findings?: string;
      notes?: string;
      interpretation?: string;
      conclusions?: string;
      doctor_name?: string;
      doctor_number?: string;
    }
  ): Promise<any> {
    try {
      const response = await apiClient.put(
        `/health-records/health-record-doc-exam/${imageId}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update medical image');
    }
  }

  /**
   * Delete medical image
   */
  static async deleteMedicalImage(imageId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/health-records/health-record-doc-exam/${imageId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete medical image');
    }
  }

  /**
   * Get medical image download URL
   */
  static async getMedicalImageViewUrl(imageId: number): Promise<{ download_url: string; filename: string }> {
    try {
      const response = await apiClient.get(`/health-records/health-record-doc-exam/${imageId}/download`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get medical image download URL');
    }
  }

  /**
   * Upload a document (legacy method - kept for backward compatibility)
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

