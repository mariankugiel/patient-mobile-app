import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Calendar, Clock, MapPin, Video, Phone, ChevronRight, X } from 'lucide-react-native';
import Header from '@/components/Header';
import TabView from '@/components/TabView';
import Colors from '@/constants/colors';

interface Appointment {
  id: number;
  doctor: string;
  doctorImage: string;
  specialty: string;
  date: string;
  time: string;
  type: 'presencial' | 'video' | 'telefone';
  location?: string;
  status: 'upcoming' | 'past' | 'cancelled';
  notes?: string;
}

// Mock data for appointments
const appointmentsData: Appointment[] = [
  {
    id: 1,
    doctor: "Dra. Ana Silva",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    specialty: "Cardiologia",
    date: "2023-12-15",
    time: "14:30",
    type: "video",
    status: "upcoming",
    notes: "Consulta de rotina para verificar a pressão arterial"
  },
  {
    id: 2,
    doctor: "Dr. João Martins",
    doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    specialty: "Neurologia",
    date: "2023-12-20",
    time: "10:00",
    type: "presencial",
    location: "Hospital da Luz, Piso 3, Consultório 305",
    status: "upcoming",
    notes: "Trazer exames anteriores"
  },
  {
    id: 3,
    doctor: "Dra. Maria Costa",
    doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop",
    specialty: "Dermatologia",
    date: "2023-11-10",
    time: "09:15",
    type: "presencial",
    location: "Clínica Dermatológica, Rua das Flores 123",
    status: "past",
    notes: "Consulta para avaliação de sinais"
  },
  {
    id: 4,
    doctor: "Dr. Pedro Santos",
    doctorImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop",
    specialty: "Ortopedia",
    date: "2023-11-25",
    time: "16:00",
    type: "telefone",
    status: "cancelled",
    notes: "Consulta para avaliação de dor no joelho"
  },
  {
    id: 5,
    doctor: "Dra. Sofia Almeida",
    doctorImage: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=200&auto=format&fit=crop",
    specialty: "Nutrição",
    date: "2023-10-05",
    time: "11:30",
    type: "video",
    status: "past",
    notes: "Consulta de acompanhamento nutricional"
  }
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  const getAppointmentsByStatus = (status: string) => {
    return appointmentsData.filter(appointment => appointment.status === status);
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'presencial':
        return <MapPin size={16} color={Colors.primary} />;
      case 'video':
        return <Video size={16} color={Colors.primary} />;
      case 'telefone':
        return <Phone size={16} color={Colors.primary} />;
      default:
        return <MapPin size={16} color={Colors.primary} />;
    }
  };

  const getAppointmentTypeText = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'Presencial';
      case 'video':
        return 'Videochamada';
      case 'telefone':
        return 'Telefone';
      default:
        return 'Presencial';
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const renderAppointmentItem = (appointment: Appointment) => {
    const formattedDate = formatDate(appointment.date);
    
    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Image 
            source={{ uri: appointment.doctorImage }} 
            style={styles.doctorImage} 
          />
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointment.doctor}</Text>
            <Text style={styles.specialty}>{appointment.specialty}</Text>
          </View>
          {appointment.status === 'cancelled' && (
            <View style={styles.cancelledBadge}>
              <Text style={styles.cancelledText}>Cancelada</Text>
            </View>
          )}
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.primary} />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            {getAppointmentTypeIcon(appointment.type)}
            <Text style={styles.detailText}>{getAppointmentTypeText(appointment.type)}</Text>
          </View>
          
          {appointment.location && (
            <View style={styles.detailItem}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.detailText}>{appointment.location}</Text>
            </View>
          )}
          
          {appointment.notes && (
            <Text style={styles.notes}>{appointment.notes}</Text>
          )}
        </View>
        
        {appointment.status === 'upcoming' && (
          <View style={styles.appointmentActions}>
            {appointment.type === 'video' && (
              <TouchableOpacity style={styles.joinButton}>
                <Video size={16} color={Colors.background} />
                <Text style={styles.joinButtonText}>Entrar na Consulta</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        {appointment.status === 'past' && (
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver Relatório</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleAddAppointment = () => {
    router.push('/add-appointment');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Consultas</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddAppointment}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>Marcar</Text>
          </TouchableOpacity>
        </View>
        
        <TabView
          tabs={[
            { key: 'upcoming', title: 'Próximas', icon: Calendar },
            { key: 'past', title: 'Passadas', icon: Clock },
            { key: 'cancelled', title: 'Canceladas', icon: X }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'upcoming' && (
            <>
              {getAppointmentsByStatus('upcoming').length > 0 ? (
                getAppointmentsByStatus('upcoming').map(renderAppointmentItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Não tem consultas agendadas</Text>
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={handleAddAppointment}
                  >
                    <Text style={styles.emptyStateButtonText}>Marcar Consulta</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          
          {activeTab === 'past' && (
            <>
              {getAppointmentsByStatus('past').length > 0 ? (
                getAppointmentsByStatus('past').map(renderAppointmentItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Não tem consultas passadas</Text>
                </View>
              )}
            </>
          )}
          
          {activeTab === 'cancelled' && (
            <>
              {getAppointmentsByStatus('cancelled').length > 0 ? (
                getAppointmentsByStatus('cancelled').map(renderAppointmentItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Não tem consultas canceladas</Text>
                </View>
              )}
            </>
          )}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: Colors.textLight,
  },
  cancelledBadge: {
    backgroundColor: Colors.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cancelledText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
});