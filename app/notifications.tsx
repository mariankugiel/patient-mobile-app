import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Pill, FileText, Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "Lembrete de Medicação",
    message: "Não se esqueça de tomar Loratadina hoje às 08:00.",
    time: "Hoje, 07:30",
    type: "medication",
    read: false,
  },
  {
    id: 2,
    title: "Consulta Amanhã",
    message: "Tem uma consulta com Dra. Ana Ferreira amanhã às 14:30.",
    time: "Hoje, 10:15",
    type: "appointment",
    read: false,
  },
  {
    id: 3,
    title: "Nova Mensagem",
    message: "Dr. João Santos enviou-lhe uma mensagem.",
    time: "Ontem, 15:20",
    type: "message",
    read: true,
  },
  {
    id: 4,
    title: "Resultados de Análises",
    message: "Os seus resultados de análises estão disponíveis.",
    time: "Ontem, 11:45",
    type: "results",
    read: true,
  },
  {
    id: 5,
    title: "Objetivo Atingido",
    message: "Parabéns! Atingiu o seu objetivo de passos diários.",
    time: "2 dias atrás, 19:30",
    type: "achievement",
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const renderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill size={20} color={Colors.background} />;
      case 'appointment':
        return <Calendar size={20} color={Colors.background} />;
      case 'message':
        return <Bell size={20} color={Colors.background} />;
      case 'results':
        return <FileText size={20} color={Colors.background} />;
      case 'achievement':
        return <Heart size={20} color={Colors.background} />;
      default:
        return <Bell size={20} color={Colors.background} />;
    }
  };

  const getIconBackgroundColor = (type: string) => {
    switch (type) {
      case 'medication':
        return Colors.primary;
      case 'appointment':
        return Colors.primaryDark;
      case 'message':
        return Colors.warning;
      case 'results':
        return Colors.success;
      case 'achievement':
        return Colors.danger;
      default:
        return Colors.primary;
    }
  };

  const renderNotificationItem = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        item.read ? styles.notificationRead : styles.notificationUnread
      ]}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getIconBackgroundColor(item.type) }
        ]}
      >
        {renderIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.notificationsList}
      />
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
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationUnread: {
    backgroundColor: Colors.background,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationRead: {
    backgroundColor: Colors.secondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.textLighter,
  },
});