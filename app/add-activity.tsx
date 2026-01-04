import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, CheckSquare, Activity, Heart, Dumbbell, Footprints } from 'lucide-react-native';
import Colors from '@/constants/colors';

const activityTypes = [
  { id: 'exercise', name: 'Exercício', icon: Dumbbell },
  { id: 'walking', name: 'Caminhada', icon: Footprints },
  { id: 'cardio', name: 'Cardio', icon: Heart },
  { id: 'strength', name: 'Musculação', icon: Activity },
];

export default function AddActivityScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activityName, setActivityName] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // In a real app, you would save the activity here
    router.back();
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
          <Text style={styles.headerTitle}>Registar Atividade</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Tipo de Atividade</Text>
          <View style={styles.typesContainer}>
            {activityTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeItem,
                  selectedType === type.id && styles.typeItemSelected
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={styles.typeIconContainer}>
                  <type.icon 
                    size={24} 
                    color={selectedType === type.id ? Colors.background : Colors.primary} 
                  />
                </View>
                <Text 
                  style={[
                    styles.typeName,
                    selectedType === type.id && styles.typeNameSelected
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Detalhes da Atividade</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Atividade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Corrida no parque"
              value={activityName}
              onChangeText={setActivityName}
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Data</Text>
              <View style={styles.iconInputContainer}>
                <Calendar size={20} color={Colors.primary} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="DD/MM/AAAA"
                  value={activityDate}
                  onChangeText={setActivityDate}
                />
              </View>
            </View>
            
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Hora</Text>
              <View style={styles.iconInputContainer}>
                <Clock size={20} color={Colors.primary} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="HH:MM"
                  value={activityTime}
                  onChangeText={setActivityTime}
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duração (minutos)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Adicione notas ou observações"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!selectedType || !activityName || !activityDate || !duration) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!selectedType || !activityName || !activityDate || !duration}
          >
            <CheckSquare size={20} color={Colors.background} />
            <Text style={styles.saveButtonText}>Guardar Atividade</Text>
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
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    color: Colors.text,
  },
  typeNameSelected: {
    color: Colors.background,
  },
  formGroup: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    width: '48%',
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
  iconInputContainer: {
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
  notesInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLighter,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});