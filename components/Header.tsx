import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Plus, MessageSquare, X, Activity, FileUp, CheckSquare, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/lib/auth/auth-store';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';

interface HeaderProps {
  unreadMessages?: number;
  unreadNotifications?: number;
}

export default function Header({ unreadMessages = 2, unreadNotifications = 1 }: HeaderProps) {
  const router = useRouter();
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const { profile } = useAuthStore();

  // Use avatar from profile in auth store (already fetched during authentication)
  const avatarUrl = profile?.avatar_url;
  const hasAvatar = avatarUrl && avatarUrl.trim() !== '' && avatarUrl !== 'null';
  const initials = getInitials(profile?.full_name);
  const avatarColor = getAvatarColor(profile?.full_name);

  const handleAddAction = (action: string) => {
    setActionModalVisible(false);
    
    switch (action) {
      case 'metric':
        router.push('/add-metric');
        break;
      case 'document':
        router.push('/upload-document');
        break;
      case 'activity':
        router.push('/add-activity');
        break;
      case 'appointment':
        router.push('/add-appointment');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => router.push('/profile')}
        >
          {hasAvatar ? (
          <Image 
              source={{ uri: avatarUrl }} 
            style={styles.profileImage} 
          />
          ) : (
            <View style={[styles.avatarInitials, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarInitialsText}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.text} />
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/messages')}
          >
            <MessageSquare size={24} color={Colors.text} />
            {unreadMessages > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadMessages}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setActionModalVisible(true)}
          >
            <Plus size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* Action Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={actionModalVisible}
          onRequestClose={() => setActionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setActionModalVisible(false)}
                >
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddAction('metric')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
                    <Activity size={24} color={Colors.background} />
                  </View>
                  <Text style={styles.actionText}>Nova medição</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddAction('document')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.primaryDark }]}>
                    <FileUp size={24} color={Colors.background} />
                  </View>
                  <Text style={styles.actionText}>Upload de documento</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddAction('activity')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.success }]}>
                    <CheckSquare size={24} color={Colors.background} />
                  </View>
                  <Text style={styles.actionText}>Atividade desempenhada</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddAction('appointment')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.warning }]}>
                    <Calendar size={24} color={Colors.background} />
                  </View>
                  <Text style={styles.actionText}>Marcar consulta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  avatarInitials: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  avatarInitialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.background,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
  },
  addButton: {
    backgroundColor: Colors.primary,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  actionButtonsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    color: Colors.text,
  },
});