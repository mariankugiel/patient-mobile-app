import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Upload, Calendar, User, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const documentTypes = [
  { id: 'analises', nameKey: 'analyses' },
  { id: 'cardiologia', nameKey: 'cardiologia' },
  { id: 'imagiologia', nameKey: 'imagiologia' },
  { id: 'relatorios', nameKey: 'relatorios' },
  { id: 'prescricoes', nameKey: 'prescricoes' },
  { id: 'outros', nameKey: 'outros' },
];

export default function UploadDocumentScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.permissionRequired || 'Permission Required', 'Please grant permission to access your photos');
        return;
      }

      // Use image picker (supports images, and on some platforms PDFs)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `document.${asset.mimeType?.split('/')[1] || 'jpg'}`,
          type: asset.mimeType || 'image/jpeg',
        });
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to select file');
    }
  };

  const handleUpload = async () => {
    if (!selectedType || !documentName || !documentDate || !selectedFile) {
      Alert.alert(t.validationError || 'Validation Error', t.fieldRequired || 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await HealthRecordsApiService.uploadDocument(selectedFile, {
        document_type: selectedType,
        document_name: documentName,
        document_date: documentDate,
        doctor: doctor || undefined,
        notes: notes || undefined,
      });

      Alert.alert(t.success || 'Success', t.documentSaved || 'Document saved successfully', [
        { text: t.ok || 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.uploadDocumentTitle || 'Upload Document'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>{t.documentType || 'Document Type'}</Text>
          <View style={styles.typesContainer}>
            {documentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeItem,
                  selectedType === type.id && styles.typeItemSelected
                ]}
                onPress={() => setSelectedType(type.id)}
                disabled={isLoading}
              >
                <FileText 
                  size={24} 
                  color={selectedType === type.id ? Colors.background : Colors.primary} 
                />
                <Text 
                  style={[
                    styles.typeName,
                    selectedType === type.id && styles.typeNameSelected
                  ]}
                >
                  {t[type.nameKey as keyof typeof t] || type.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t.documentDetails || 'Document Details'}</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.documentName || 'Document Name'}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.documentNamePlaceholder || 'e.g., Blood Test'}
              value={documentName}
              onChangeText={setDocumentName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.documentDate || 'Document Date'}</Text>
            <View style={styles.dateInputContainer}>
              <Calendar size={20} color={Colors.primary} />
              <TextInput
                style={styles.dateInput}
                placeholder={t.documentDatePlaceholder || 'MM/DD/YYYY'}
                value={documentDate}
                onChangeText={setDocumentDate}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.doctorInstitution || 'Doctor/Institution'}</Text>
            <View style={styles.doctorInputContainer}>
              <User size={20} color={Colors.primary} />
              <TextInput
                style={styles.doctorInput}
                placeholder={t.doctorPlaceholder || 'Doctor or institution name'}
                value={doctor}
                onChangeText={setDoctor}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.notesOptional || 'Notes (optional)'}</Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t.addNotes || 'Add notes or observations'}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </View>

          <View style={styles.uploadContainer}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleSelectFile}
              disabled={isLoading}
            >
              <Upload size={24} color={Colors.background} />
              <Text style={styles.uploadButtonText}>
                {selectedFile ? selectedFile.name : (t.selectFile || 'Select File')}
              </Text>
              {selectedFile && (
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  style={styles.removeFileButton}
                >
                  <X size={20} color={Colors.background} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Text style={styles.uploadInfo}>
              {t.supportedFormats || 'Supported formats: PDF, JPG, PNG'}
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!selectedType || !documentName || !documentDate || !selectedFile || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleUpload}
            disabled={!selectedType || !documentName || !documentDate || !selectedFile || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.saveButtonText}>{t.saveDocument || 'Save Document'}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
  },
  typeName: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  typeNameSelected: {
    color: Colors.background,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  doctorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  doctorInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  notesInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  removeFileButton: {
    padding: 4,
  },
  uploadInfo: {
    fontSize: 14,
    color: Colors.textLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLighter,
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
