import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Calendar, Clock, MapPin, Video, Phone, ChevronRight, X, Menu, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppointments } from '@/hooks/useAppointments';
import { FrontendAppointment } from '@/lib/api/appointments-api';
import TabView from '@/components/TabView';
import SideDrawer from '@/components/SideDrawer';

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { appointments, loading, error, cancelAppointment, rescheduleAppointment, refresh } = useAppointments();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Filter appointments by status
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      
      if (activeTab === 'upcoming') {
        return apt.status === 'upcoming' && appointmentDate >= now;
      } else if (activeTab === 'past') {
        return apt.status === 'completed' || (apt.status === 'upcoming' && appointmentDate < now);
      } else if (activeTab === 'cancelled') {
        return apt.status === 'cancelled';
      }
      return false;
    }).sort((a, b) => {
      // Sort by date: upcoming = ascending, past = descending
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
    });
  }, [appointments, activeTab]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : 'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString(
        language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : 'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      );
    } catch {
      return '';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person':
        return <MapPin size={16} color={Colors.primary} />;
      case 'virtual':
        return <Video size={16} color={Colors.primary} />;
      case 'phone':
        return <Phone size={16} color={Colors.primary} />;
      default:
        return <MapPin size={16} color={Colors.primary} />;
    }
  };

  const getAppointmentTypeText = (type: string) => {
    switch (type) {
      case 'in-person':
        return t.inPerson || 'In Person';
      case 'virtual':
        return t.byVideo || 'Video';
      case 'phone':
        return t.byPhone || 'Phone';
      default:
        return t.inPerson || 'In Person';
    }
  };

  const handleCancelAppointment = (appointment: FrontendAppointment) => {
    Alert.alert(
      t.appointmentsConfirmCancel || 'Confirm Cancellation',
      t.appointmentsCancelConfirmDesc || 'Are you sure you want to cancel this appointment?',
      [
        {
          text: t.cancel || 'Cancel',
          style: 'cancel',
        },
        {
          text: t.cancel || 'Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(appointment.id);
              await cancelAppointment(appointment.id);
              Alert.alert(
                t.success || 'Success',
                t.appointmentsCancelledSuccess || 'Appointment cancelled successfully'
              );
            } catch (err: any) {
              Alert.alert(
                t.validationError || 'Error',
                err.message || 'Failed to cancel appointment'
              );
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  const handleJoinCall = async (appointment: FrontendAppointment) => {
    if (appointment.virtual_meeting_url) {
      try {
        const supported = await Linking.canOpenURL(appointment.virtual_meeting_url);
        if (supported) {
          await Linking.openURL(appointment.virtual_meeting_url);
        } else {
          Alert.alert(t.validationError || 'Error', 'Cannot open the video call link');
        }
      } catch (err) {
        Alert.alert(t.validationError || 'Error', 'Failed to open video call');
      }
    }
  };

  const handleRescheduleAppointment = (appointment: FrontendAppointment) => {
    // Navigate to add-appointment screen with appointment data for rescheduling
    router.push({
      pathname: '/add-appointment',
      params: {
        rescheduleId: appointment.id.toString(),
        doctorId: appointment.doctor_id?.toString() || '',
        appointmentTypeId: appointment.appointment_type_id?.toString() || '',
        date: appointment.date,
        notes: appointment.notes || '',
      },
    });
  };

  const handleViewLocation = async (location: string) => {
    try {
      // Encode the location for URL
      const encodedLocation = encodeURIComponent(location);
      // Open in maps app (works on both iOS and Android)
      const mapsUrl = `https://maps.google.com/?q=${encodedLocation}`;
      const supported = await Linking.canOpenURL(mapsUrl);
      if (supported) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert(t.validationError || 'Error', 'Cannot open maps application');
      }
    } catch (err) {
      Alert.alert(t.validationError || 'Error', 'Failed to open location in maps');
    }
  };

  const renderAppointmentCard = (appointment: FrontendAppointment) => {
    const isCancelling = cancellingId === appointment.id;
    
    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointment.doctor}</Text>
            {appointment.specialty && (
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            )}
          </View>
          {appointment.status === 'cancelled' && (
            <View style={styles.cancelledBadge}>
              <Text style={styles.cancelledText}>
                {t.appointmentsCancelled || 'Cancelled'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.detailText}>
              {t.appointmentsDate || 'Date'}: {formatDate(appointment.date)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.primary} />
            <Text style={styles.detailText}>
              {t.appointmentsTime || 'Time'}: {formatTime(appointment.date)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            {getAppointmentTypeIcon(appointment.type)}
            <Text style={styles.detailText}>
              {t.appointmentsType || 'Type'}: {getAppointmentTypeText(appointment.type)}
            </Text>
          </View>

          {appointment.location && (
            <View style={styles.detailItem}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.detailText}>{appointment.location}</Text>
            </View>
          )}

          {appointment.cost !== undefined && appointment.cost !== null && (
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>
                {t.appointmentsCost || 'Cost'}: ${appointment.cost.toFixed(2)}
              </Text>
            </View>
          )}

          {appointment.notes && (
            <Text style={styles.notes}>
              {t.appointmentsNotes || 'Notes'}: {appointment.notes}
            </Text>
          )}
        </View>

        {appointment.status === 'upcoming' && (
          <View style={styles.appointmentActions}>
            {appointment.type === 'virtual' && appointment.virtual_meeting_url && (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinCall(appointment)}
                disabled={isCancelling}
              >
                <Video size={16} color={Colors.background} />
                <Text style={styles.joinButtonText}>
                  {t.appointmentsJoinCall || 'Join Call'}
                </Text>
              </TouchableOpacity>
            )}

            {appointment.type === 'in-person' && appointment.location && (
              <TouchableOpacity
                style={styles.viewLocationButton}
                onPress={() => handleViewLocation(appointment.location!)}
                disabled={isCancelling}
              >
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.viewLocationButtonText}>
                  {t.appointmentsViewLocation || 'View Location'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() => handleRescheduleAppointment(appointment)}
              disabled={isCancelling}
            >
              <RefreshCw size={16} color={Colors.primary} />
              <Text style={styles.rescheduleButtonText}>
                {t.rescheduleAppointment || 'Reschedule'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(appointment)}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator size="small" color={Colors.danger} />
              ) : (
                <Text style={styles.cancelButtonText}>
                  {t.cancel || 'Cancel'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {appointment.status === 'completed' && (
          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>
                {t.appointmentsViewReport || 'View Report'}
              </Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {t.appointmentsLoading || 'Loading appointments...'}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>{t.retry || 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredAppointments.length === 0) {
      let emptyText = '';
      if (activeTab === 'upcoming') {
        emptyText = t.appointmentsNoUpcoming || 'No upcoming appointments';
      } else if (activeTab === 'past') {
        emptyText = t.appointmentsNoPast || 'No past appointments';
      } else {
        emptyText = t.appointmentsNoCancelled || 'No cancelled appointments';
      }

      return (
        <View style={styles.centerContainer}>
          <Calendar size={64} color={Colors.textLight} />
          <Text style={styles.emptyStateText}>{emptyText}</Text>
          {activeTab === 'upcoming' && (
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => router.push('/add-appointment')}
            >
              <Text style={styles.emptyStateButtonText}>
                {t.appointmentsBookAppointment || 'Book Appointment'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAppointments.map(renderAppointmentCard)}
      </ScrollView>
    );
  };

  // Calculate counts for each tab from all appointments
  const now = new Date();
  const upcomingCount = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    return apt.status === 'upcoming' && appointmentDate >= now;
  }).length;

  const pastCount = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    return apt.status === 'completed' || (apt.status === 'upcoming' && appointmentDate < now);
  }).length;

  const cancelledCount = appointments.filter(apt => apt.status === 'cancelled').length;

  const tabs = [
    {
      key: 'upcoming',
      title: `${t.appointmentsUpcoming || t.upcoming || 'Upcoming'}${upcomingCount > 0 ? `(${upcomingCount})` : ''}`,
      icon: Calendar,
    },
    {
      key: 'past',
      title: `${t.appointmentsPast || t.past || 'Past'}${pastCount > 0 ? `(${pastCount})` : ''}`,
      icon: Clock,
    },
    {
      key: 'cancelled',
      title: `${t.appointmentsCancelled || t.cancelled || 'Cancelled'}${cancelledCount > 0 ? `(${cancelledCount})` : ''}`,
      icon: X,
    },
  ];

  // Hide header add button when there are no appointments or while loading
  const hasAppointments = !loading && filteredAppointments.length > 0;

  return (
    <View style={styles.container}>
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onOpen={() => setDrawerVisible(true)} />
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Menu size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{t.appointments || 'Appointments'}</Text>
        {hasAppointments && (
          <TouchableOpacity
            style={styles.topHeaderAddButton}
            onPress={() => router.push('/add-appointment')}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.topHeaderAddButtonText}>
              {t.appointmentsBookAppointment || 'Book'}
            </Text>
          </TouchableOpacity>
        )}
        {!hasAppointments && <View style={{ width: 40 }} />}
      </View>

      <TabView
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuButton: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  topHeaderAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  topHeaderAddButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  appointmentCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  notes: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  joinButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 4,
  },
  viewLocationButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 4,
  },
  rescheduleButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  cancelButtonText: {
    color: Colors.danger,
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
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
    fontSize: 16,
  },
});
