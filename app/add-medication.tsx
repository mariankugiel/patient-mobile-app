import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, AlertCircle, FileText, User, Calendar as CalendarIcon, X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';

interface Reminder {
  time: string;
  days: string[];
}

export default function AddMedicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [purpose, setPurpose] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([
    { time: '08:00', days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] }
  ]);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [medicationType, setMedicationType] = useState<'regular' | 'sos'>('regular');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedicationMutation = trpc.medications.add.useMutation({
    onSuccess: () => {
      Alert.alert('Sucesso', 'Medicação adicionada com sucesso!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('Erro', `Ocorreu um erro ao adicionar a medicação: ${error.message}`);
      setIsSubmitting(false);
    }
  });

  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      { time: '08:00', days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] }
    ]);
  };

  const handleRemoveReminder = (index: number) => {
    const updatedReminders = [...reminders];
    updatedReminders.splice(index, 1);
    setReminders(updatedReminders);
  };

  const handleUpdateReminderTime = (index: number, newTime: string) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = {
      ...updatedReminders[index],
      time: newTime
    };
    setReminders(updatedReminders);
  };

  const handleToggleDay = (reminderIndex: number, day: string) => {
    const updatedReminders = [...reminders];
    const currentDays = updatedReminders[reminderIndex].days;
    
    if (currentDays.includes(day)) {
      updatedReminders[reminderIndex].days = currentDays.filter(d => d !== day);
    } else {
      updatedReminders[reminderIndex].days = [...currentDays, day];
    }
    
    setReminders(updatedReminders);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para aceder à sua galeria.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setPrescriptionImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para aceder à sua câmara.');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setPrescriptionImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !dosage || !frequency) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha os campos obrigatórios: Nome, Dosagem e Frequência.');
      return;
    }

    setIsSubmitting(true);

    const medicationData = {
      name,
      dosage,
      frequency,
      time: medicationType === 'regular' ? time : null,
      startDate: medicationType === 'regular' ? startDate : null,
      endDate: medicationType === 'regular' ? endDate : null,
      instructions,
      purpose,
      prescribedBy,
      prescriptionDate,
      prescriptionId,
      reminders: medicationType === 'regular' ? reminders : [],
      medicationType,
      hasPrescriptionImage: !!prescriptionImage
    };

    try {
      addMedicationMutation.mutate(medicationData);
    } catch (error) {
      console.error('Error submitting medication:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar a medicação.');
      setIsSubmitting(false);
    }
  };

  const weekdays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const fullWeekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Medicação</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Tipo de Medicação</Text>
        <View style={styles.medicationTypeContainer}>
          <TouchableOpacity
            style={[
              styles.medicationTypeButton,
              medicationType === 'regular' && styles.medicationTypeSelected
            ]}
            onPress={() => setMedicationType('regular')}
          >
            <Text 
              style={[
                styles.medicationTypeText,
                medicationType === 'regular' && styles.medicationTypeTextSelected
              ]}
            >
              Regular
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.medicationTypeButton,
              medicationType === 'sos' && styles.medicationTypeSelected
            ]}
            onPress={() => setMedicationType('sos')}
          >
            <Text 
              style={[
                styles.medicationTypeText,
                medicationType === 'sos' && styles.medicationTypeTextSelected
              ]}
            >
              SOS
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Medicamento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Loratadina"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dosagem *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 10mg"
            value={dosage}
            onChangeText={setDosage}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Frequência *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1x ao dia"
            value={frequency}
            onChangeText={setFrequency}
          />
        </View>

        {medicationType === 'regular' && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Horário</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color={Colors.primary} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Ex: 08:00"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            <View style={styles.dateContainer}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Data de Início</Text>
                <View style={styles.inputWithIcon}>
                  <CalendarIcon size={20} color={Colors.primary} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="AAAA-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Data de Fim (opcional)</Text>
                <View style={styles.inputWithIcon}>
                  <CalendarIcon size={20} color={Colors.primary} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="AAAA-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Instruções</Text>
          <View style={styles.inputWithIcon}>
            <AlertCircle size={20} color={Colors.primary} />
            <TextInput
              style={styles.iconInput}
              placeholder="Ex: Tomar em jejum"
              value={instructions}
              onChangeText={setInstructions}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Finalidade</Text>
          <View style={styles.inputWithIcon}>
            <FileText size={20} color={Colors.primary} />
            <TextInput
              style={styles.iconInput}
              placeholder="Ex: Tratamento de alergias"
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Informações da Prescrição</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prescrito por</Text>
          <View style={styles.inputWithIcon}>
            <User size={20} color={Colors.primary} />
            <TextInput
              style={styles.iconInput}
              placeholder="Ex: Dra. Ana Ferreira"
              value={prescribedBy}
              onChangeText={setPrescribedBy}
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Data da Prescrição</Text>
            <View style={styles.inputWithIcon}>
              <CalendarIcon size={20} color={Colors.primary} />
              <TextInput
                style={styles.iconInput}
                placeholder="AAAA-MM-DD"
                value={prescriptionDate}
                onChangeText={setPrescriptionDate}
              />
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>ID da Prescrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: RX-2023-1245"
              value={prescriptionId}
              onChangeText={setPrescriptionId}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Imagem da Prescrição</Text>
          <View style={styles.imageUploadContainer}>
            {prescriptionImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: prescriptionImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setPrescriptionImage(null)}
                >
                  <X size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.uploadButton, { marginRight: 8 }]}
                  onPress={pickImage}
                >
                  <FileText size={20} color={Colors.background} />
                  <Text style={styles.uploadButtonText}>Galeria</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.uploadButton, { marginLeft: 8 }]}
                  onPress={takePhoto}
                >
                  <Camera size={20} color={Colors.background} />
                  <Text style={styles.uploadButtonText}>Câmara</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {medicationType === 'regular' && (
          <>
            <View style={styles.remindersSection}>
              <View style={styles.remindersSectionHeader}>
                <Text style={styles.sectionTitle}>Lembretes</Text>
                <TouchableOpacity 
                  style={styles.addReminderButton}
                  onPress={handleAddReminder}
                >
                  <Text style={styles.addReminderText}>+ Adicionar</Text>
                </TouchableOpacity>
              </View>
              
              {reminders.map((reminder, index) => (
                <View key={index} style={styles.reminderItem}>
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderTimeContainer}>
                      <Clock size={16} color={Colors.primary} />
                      <TextInput
                        style={styles.reminderTimeInput}
                        value={reminder.time}
                        onChangeText={(text) => handleUpdateReminderTime(index, text)}
                        placeholder="HH:MM"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.deleteReminderButton}
                      onPress={() => handleRemoveReminder(index)}
                    >
                      <X size={18} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.daysContainer}>
                    {fullWeekdays.map((day, dayIndex) => (
                      <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.dayButton,
                          reminder.days.includes(day) && styles.dayButtonSelected
                        ]}
                        onPress={() => handleToggleDay(index, day)}
                      >
                        <Text 
                          style={[
                            styles.dayButtonText,
                            reminder.days.includes(day) && styles.dayButtonTextSelected
                          ]}
                        >
                          {weekdays[dayIndex]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            isSubmitting && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "A guardar..." : "Guardar Medicação"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
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
  spacer: {
    width: 24,
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
  medicationTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  medicationTypeButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  medicationTypeSelected: {
    backgroundColor: Colors.primary,
  },
  medicationTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  medicationTypeTextSelected: {
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
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  iconInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageUploadContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  uploadButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
  },
  remindersSection: {
    marginTop: 16,
  },
  remindersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReminderButton: {
    padding: 4,
  },
  addReminderText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  reminderItem: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTimeInput: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  deleteReminderButton: {
    padding: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dayButtonTextSelected: {
    color: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});