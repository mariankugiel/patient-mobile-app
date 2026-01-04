import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, Modal, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Filter, ChevronDown, Check, X, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { doctors, specialties, insuranceProviders, appointmentTypes, locations } from '@/constants/doctors';

export default function AddAppointmentScreen() {
  const router = useRouter();
  
  // Filters
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedInsurance, setSelectedInsurance] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Selection states
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDoctorLocationIndex, setSelectedDoctorLocationIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  // Modal states
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showDoctorInfoModal, setShowDoctorInfoModal] = useState(false);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState<any>(null);
  
  // Filtered data
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [availableDates, setAvailableDates] = useState<{date: string, locationIndex: number}[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Apply filters to doctors
  useEffect(() => {
    let filtered = [...doctors];
    
    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    // Filter by insurance
    if (selectedInsurance !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.acceptedInsurance.includes(selectedInsurance)
      );
    }
    
    // Filter by consultation type
    if (selectedType !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.consultationTypes.includes(selectedType)
      );
    }
    
    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.locations.some(loc => loc.city.toLowerCase().includes(selectedLocation.toLowerCase()))
      );
    }
    
    setFilteredDoctors(filtered);
    
    // Reset selections if needed
    if (selectedDoctor && !filtered.some(d => d.id === selectedDoctor)) {
      setSelectedDoctor(null);
      setSelectedDoctorLocationIndex(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableDates([]);
      setAvailableTimeSlots([]);
    }
  }, [selectedSpecialty, selectedInsurance, selectedType, selectedLocation]);

  // Update available dates when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        // Group dates by location
        const dates = doctor.availability.map(a => ({
          date: a.date,
          locationIndex: a.locationIndex
        }));
        
        // Filter dates by selected location if needed
        let filteredDates = dates;
        if (selectedLocation !== 'all') {
          const locationCity = selectedLocation.toLowerCase();
          filteredDates = dates.filter(dateObj => {
            const location = doctor.locations[dateObj.locationIndex];
            return location.city.toLowerCase().includes(locationCity);
          });
        }
        
        setAvailableDates(filteredDates);
        
        // Reset date and time if previously selected
        setSelectedDate(null);
        setSelectedDoctorLocationIndex(null);
        setSelectedTime(null);
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableDates([]);
      setSelectedDate(null);
      setSelectedDoctorLocationIndex(null);
      setSelectedTime(null);
    }
  }, [selectedDoctor, selectedLocation]);

  // Update available time slots when date is selected
  useEffect(() => {
    if (selectedDoctor && selectedDate && selectedDoctorLocationIndex !== null) {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        const dateAvailability = doctor.availability.find(a => 
          a.date === selectedDate && a.locationIndex === selectedDoctorLocationIndex
        );
        
        if (dateAvailability) {
          setAvailableTimeSlots(dateAvailability.slots);
        } else {
          setAvailableTimeSlots([]);
        }
        setSelectedTime(null);
      }
    } else {
      setAvailableTimeSlots([]);
      setSelectedTime(null);
    }
  }, [selectedDoctor, selectedDate, selectedDoctorLocationIndex]);

  const handleSave = () => {
    // In a real app, you would save the appointment here
    router.back();
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getSpecialtyName = (id: string) => {
    const specialty = specialties.find(s => s.id === id);
    return specialty ? specialty.name : 'Todas as especialidades';
  };

  const getInsuranceName = (id: string) => {
    const insurance = insuranceProviders.find(i => i.id === id);
    return insurance ? insurance.name : 'Todos os seguros';
  };

  const getLocationName = (id: string) => {
    const location = locations.find(l => l.id === id);
    return location ? location.name : 'Todas as localizações';
  };

  const getAppointmentTypeName = (id: string) => {
    const type = appointmentTypes.find(t => t.id === id);
    return type ? type.name : 'Todos os tipos';
  };

  const getAppointmentTypeIcon = (id: string) => {
    switch (id) {
      case 'presencial':
        return <MapPin size={20} color={Colors.primary} />;
      case 'video':
        return <Video size={20} color={Colors.primary} />;
      case 'telefone':
        return <Phone size={20} color={Colors.primary} />;
      default:
        return null;
    }
  };

  const showDoctorDetails = (doctor: any) => {
    setSelectedDoctorInfo(doctor);
    setShowDoctorInfoModal(true);
  };

  // Get doctor location based on selected doctor and date
  const getDoctorLocation = () => {
    if (!selectedDoctor || selectedDoctorLocationIndex === null) return null;
    
    const doctor = doctors.find(d => d.id === selectedDoctor);
    return doctor && doctor.locations[selectedDoctorLocationIndex] 
      ? doctor.locations[selectedDoctorLocationIndex].address 
      : null;
  };

  // Handle date selection with location
  const handleDateSelection = (date: string, locationIndex: number) => {
    setSelectedDate(date);
    setSelectedDoctorLocationIndex(locationIndex);
    setShowDateModal(false);
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
          <Text style={styles.headerTitle}>Marcar Consulta</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Filters Section */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>
              <Filter size={16} color={Colors.text} /> Filtros
            </Text>
            
            <View style={styles.filterRow}>
              {/* Specialty Filter */}
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowSpecialtyModal(true)}
              >
                <Text style={styles.filterButtonText} numberOfLines={1}>
                  {getSpecialtyName(selectedSpecialty)}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
              
              {/* Insurance Filter */}
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowInsuranceModal(true)}
              >
                <Text style={styles.filterButtonText} numberOfLines={1}>
                  {getInsuranceName(selectedInsurance)}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterRow}>
              {/* Location Filter */}
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowLocationModal(true)}
              >
                <Text style={styles.filterButtonText} numberOfLines={1}>
                  {getLocationName(selectedLocation)}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
              
              {/* Empty space for alignment */}
              <View style={styles.filterButtonPlaceholder} />
            </View>
            
            {/* Appointment Type Filter */}
            <View style={styles.typeContainer}>
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeItem,
                    selectedType === type.id && styles.typeItemSelected
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  {type.icon ? (
                    <View style={styles.typeIconContainer}>
                      {getAppointmentTypeIcon(type.id)}
                    </View>
                  ) : null}
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
          </View>

          {/* Doctors Section */}
          <Text style={styles.sectionTitle}>Médico</Text>
          {filteredDoctors.length > 0 ? (
            <View style={styles.doctorsContainer}>
              {filteredDoctors.map((doctor) => (
                <View key={doctor.id} style={styles.doctorItemWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.doctorItem,
                      selectedDoctor === doctor.id && styles.doctorItemSelected
                    ]}
                    onPress={() => setSelectedDoctor(doctor.id)}
                  >
                    <Image 
                      source={{ uri: doctor.image }} 
                      style={styles.doctorImage} 
                    />
                    <View style={styles.doctorInfo}>
                      <Text 
                        style={[
                          styles.doctorName,
                          selectedDoctor === doctor.id && styles.doctorNameSelected
                        ]}
                      >
                        {doctor.name}
                      </Text>
                      <Text 
                        style={[
                          styles.doctorSpecialty,
                          selectedDoctor === doctor.id && styles.doctorSpecialtySelected
                        ]}
                      >
                        {getSpecialtyName(doctor.specialty)}
                      </Text>
                      
                      {/* Show locations for the doctor */}
                      <View style={styles.doctorLocationContainer}>
                        <MapPin size={14} color={selectedDoctor === doctor.id ? Colors.background : Colors.primary} />
                        <Text 
                          style={[
                            styles.doctorLocation,
                            selectedDoctor === doctor.id && styles.doctorLocationSelected
                          ]}
                        >
                          {doctor.locations.map(loc => loc.city).join(', ')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Info button to show doctor details */}
                  <TouchableOpacity 
                    style={styles.doctorInfoButton}
                    onPress={() => showDoctorDetails(doctor)}
                  >
                    <Info size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum médico encontrado com os filtros selecionados
              </Text>
            </View>
          )}

          {/* Location Confirmation for In-Person Appointments */}
          {selectedDoctor && selectedType === 'presencial' && selectedDoctorLocationIndex !== null && getDoctorLocation() && (
            <View style={styles.locationConfirmation}>
              <Text style={styles.locationConfirmationTitle}>Local da Consulta:</Text>
              <View style={styles.locationConfirmationContent}>
                <MapPin size={18} color={Colors.primary} />
                <Text style={styles.locationConfirmationText}>{getDoctorLocation()}</Text>
              </View>
            </View>
          )}

          {/* Date and Time Section */}
          <Text style={styles.sectionTitle}>Data e Hora</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={[
                styles.dateContainer,
                !selectedDoctor && styles.disabledInput
              ]}
              onPress={() => {
                if (selectedDoctor && availableDates.length > 0) {
                  setShowDateModal(true);
                }
              }}
              disabled={!selectedDoctor || availableDates.length === 0}
            >
              <Calendar size={20} color={selectedDoctor ? Colors.primary : Colors.textLighter} />
              <Text 
                style={[
                  styles.dateInput,
                  !selectedDate && styles.placeholderText,
                  !selectedDoctor && styles.disabledText
                ]}
              >
                {selectedDate ? formatDate(selectedDate) : "Selecionar data"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeContainer,
                (!selectedDoctor || !selectedDate) && styles.disabledInput
              ]}
              onPress={() => {
                if (selectedDoctor && selectedDate && availableTimeSlots.length > 0) {
                  setShowTimeModal(true);
                }
              }}
              disabled={!selectedDoctor || !selectedDate || availableTimeSlots.length === 0}
            >
              <Clock size={20} color={(selectedDoctor && selectedDate) ? Colors.primary : Colors.textLighter} />
              <Text 
                style={[
                  styles.timeInput,
                  !selectedTime && styles.placeholderText,
                  (!selectedDoctor || !selectedDate) && styles.disabledText
                ]}
              >
                {selectedTime || "Selecionar hora"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <Text style={styles.sectionTitle}>Notas (opcional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Adicione notas ou observações"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!selectedDoctor || !selectedDate || !selectedTime) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!selectedDoctor || !selectedDate || !selectedTime}
          >
            <Text style={styles.saveButtonText}>Marcar Consulta</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Specialty Modal */}
        <Modal
          visible={showSpecialtyModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Especialidade</Text>
                <TouchableOpacity onPress={() => setShowSpecialtyModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={specialties}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedSpecialty(item.id);
                      setShowSpecialtyModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    {selectedSpecialty === item.id && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Insurance Modal */}
        <Modal
          visible={showInsuranceModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seguro</Text>
                <TouchableOpacity onPress={() => setShowInsuranceModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={insuranceProviders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedInsurance(item.id);
                      setShowInsuranceModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    {selectedInsurance === item.id && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Location Modal */}
        <Modal
          visible={showLocationModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Localização</Text>
                <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={locations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedLocation(item.id);
                      setShowLocationModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    {selectedLocation === item.id && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Date Modal */}
        <Modal
          visible={showDateModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Data Disponível</Text>
                <TouchableOpacity onPress={() => setShowDateModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={availableDates}
                keyExtractor={(item, index) => `${item.date}-${index}`}
                renderItem={({ item }) => {
                  const doctor = doctors.find(d => d.id === selectedDoctor);
                  const locationName = doctor ? doctor.locations[item.locationIndex].city : '';
                  
                  return (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleDateSelection(item.date, item.locationIndex)}
                    >
                      <View style={styles.modalItemWithLocation}>
                        <Text style={styles.modalItemText}>{formatDate(item.date)}</Text>
                        <Text style={styles.modalItemLocation}>{locationName}</Text>
                      </View>
                      {selectedDate === item.date && selectedDoctorLocationIndex === item.locationIndex && (
                        <Check size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Time Modal */}
        <Modal
          visible={showTimeModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Horário Disponível</Text>
                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={availableTimeSlots}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedTime(item);
                      setShowTimeModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                    {selectedTime === item && (
                      <Check size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Doctor Info Modal */}
        <Modal
          visible={showDoctorInfoModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Informações do Médico</Text>
                <TouchableOpacity onPress={() => setShowDoctorInfoModal(false)}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              {selectedDoctorInfo && (
                <View style={styles.doctorDetailContainer}>
                  <Image 
                    source={{ uri: selectedDoctorInfo.image }} 
                    style={styles.doctorDetailImage} 
                  />
                  
                  <Text style={styles.doctorDetailName}>{selectedDoctorInfo.name}</Text>
                  <Text style={styles.doctorDetailSpecialty}>
                    {getSpecialtyName(selectedDoctorInfo.specialty)}
                  </Text>
                  
                  {selectedDoctorInfo.bio && (
                    <View style={styles.doctorBioContainer}>
                      <Text style={styles.doctorBioTitle}>Sobre</Text>
                      <Text style={styles.doctorBioText}>{selectedDoctorInfo.bio}</Text>
                    </View>
                  )}
                  
                  <View style={styles.doctorDetailSection}>
                    <Text style={styles.doctorDetailSectionTitle}>Formação</Text>
                    {selectedDoctorInfo.education ? (
                      selectedDoctorInfo.education.map((edu: string, index: number) => (
                        <Text key={index} style={styles.doctorDetailText}>• {edu}</Text>
                      ))
                    ) : (
                      <Text style={styles.doctorDetailText}>Informação não disponível</Text>
                    )}
                  </View>
                  
                  <View style={styles.doctorDetailSection}>
                    <Text style={styles.doctorDetailSectionTitle}>Idiomas</Text>
                    {selectedDoctorInfo.languages ? (
                      <Text style={styles.doctorDetailText}>
                        {selectedDoctorInfo.languages.join(', ')}
                      </Text>
                    ) : (
                      <Text style={styles.doctorDetailText}>Português</Text>
                    )}
                  </View>
                  
                  {selectedDoctorInfo.locations && selectedDoctorInfo.locations.length > 0 && (
                    <View style={styles.doctorDetailSection}>
                      <Text style={styles.doctorDetailSectionTitle}>Localizações</Text>
                      {selectedDoctorInfo.locations.map((location: any, index: number) => (
                        <View key={index} style={styles.doctorLocationDetailContainer}>
                          <MapPin size={16} color={Colors.primary} />
                          <Text style={styles.doctorDetailText}>{location.address}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.doctorDetailSection}>
                    <Text style={styles.doctorDetailSectionTitle}>Seguros Aceitos</Text>
                    <Text style={styles.doctorDetailText}>
                      {selectedDoctorInfo.acceptedInsurance.map((ins: string) => 
                        getInsuranceName(ins)
                      ).join(', ')}
                    </Text>
                  </View>
                  
                  <View style={styles.doctorDetailSection}>
                    <Text style={styles.doctorDetailSectionTitle}>Tipos de Consulta</Text>
                    <View style={styles.consultationTypesContainer}>
                      {selectedDoctorInfo.consultationTypes.map((type: string) => (
                        <View key={type} style={styles.consultationType}>
                          {getAppointmentTypeIcon(type)}
                          <Text style={styles.consultationTypeName}>
                            {getAppointmentTypeName(type)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setShowDoctorInfoModal(false)}
              >
                <Text style={styles.closeModalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  filtersContainer: {
    backgroundColor: Colors.secondary + '40',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonPlaceholder: {
    flex: 0.48,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  doctorsContainer: {
    gap: 12,
  },
  doctorItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  doctorItemSelected: {
    backgroundColor: Colors.primary,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorNameSelected: {
    color: Colors.background,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  doctorSpecialtySelected: {
    color: Colors.background + 'CC',
  },
  doctorLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorLocation: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  doctorLocationSelected: {
    color: Colors.background + 'CC',
  },
  doctorInfoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeName: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  typeNameSelected: {
    color: Colors.background,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  timeInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.textLight,
  },
  disabledInput: {
    backgroundColor: Colors.secondary + '60',
  },
  disabledText: {
    color: Colors.textLighter,
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLighter,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemWithLocation: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  modalItemLocation: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary + '40',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  // Doctor Detail Modal
  doctorDetailContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  doctorDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  doctorDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorDetailSpecialty: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
  },
  doctorBioContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: Colors.secondary + '40',
    borderRadius: 8,
    padding: 12,
  },
  doctorBioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  doctorBioText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  doctorDetailSection: {
    width: '100%',
    marginBottom: 16,
  },
  doctorDetailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  doctorDetailText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  doctorLocationDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultationTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  consultationType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  consultationTypeName: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 6,
  },
  closeModalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Location confirmation
  locationConfirmation: {
    backgroundColor: Colors.secondary + '60',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  locationConfirmationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  locationConfirmationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationConfirmationText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
});