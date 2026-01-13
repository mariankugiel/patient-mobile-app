import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, MessageSquare, X, Activity, FileUp, CheckSquare, Calendar, User, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/lib/auth/auth-store';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  onOpen?: () => void;
  unreadMessages?: number;
  unreadNotifications?: number;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;

export default function SideDrawer({ visible, onClose, onOpen, unreadMessages = 2, unreadNotifications = 1 }: SideDrawerProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { profile, logout } = useAuthStore();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Pan responder for swipe gestures
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Respond if starting from left edge (within 20px) when closed, or if drawer is open
        if (!visible && evt.nativeEvent.pageX < 20) {
          return true;
        }
        return visible;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations
        slideAnim.stopAnimation();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0 && !visible) {
          // Swiping right from left edge - opening drawer
          const newValue = Math.min(0, -DRAWER_WIDTH + gestureState.dx);
          slideAnim.setValue(newValue);
          overlayOpacity.setValue(Math.min(1, gestureState.dx / DRAWER_WIDTH));
        } else if (gestureState.dx > 0 && visible) {
          // Already open, ignore right swipe
          return;
        } else if (gestureState.dx < 0 && visible) {
          // Swiping left - closing drawer
          const newValue = Math.max(-DRAWER_WIDTH, gestureState.dx);
          slideAnim.setValue(newValue);
          overlayOpacity.setValue(Math.max(0, 1 + gestureState.dx / DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = DRAWER_WIDTH * 0.3;
        
        if (gestureState.dx > threshold && !visible) {
          // Swiped enough to open from closed state
          if (onOpen) {
            onOpen();
          }
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
            Animated.spring(overlayOpacity, {
              toValue: 1,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
          ]).start();
        } else if (gestureState.dx < -threshold && visible) {
          // Swiped enough to close
          onClose();
        } else {
          // Snap back to current state
          if (visible) {
            Animated.parallel([
              Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
              }),
              Animated.spring(overlayOpacity, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
              }),
            ]).start();
          } else {
            Animated.parallel([
              Animated.spring(slideAnim, {
                toValue: -DRAWER_WIDTH,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
              }),
              Animated.spring(overlayOpacity, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
              }),
            ]).start();
          }
        }
      },
    })
  ).current;

  const handleAddAction = (action: string) => {
    onClose();
    
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

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace('/auth/login');
  };

  // Use avatar from profile in auth store
  const avatarUrl = profile?.avatar_url;
  const hasAvatar = avatarUrl && avatarUrl.trim() !== '' && avatarUrl !== 'null';
  const initials = getInitials(profile?.full_name);
  const avatarColor = getAvatarColor(profile?.full_name);

  return (
    <>
      {/* Overlay - always present for gesture handling, but invisible when closed */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'box-none'}
        {...panResponder.panHandlers}
      >
        {visible && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        )}
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.drawerContent}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <TouchableOpacity
              style={styles.profileSection}
              onPress={() => {
                onClose();
                router.push('/profile');
              }}
            >
              {hasAvatar ? (
                <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
              ) : (
                <View style={[styles.avatarInitials, { backgroundColor: avatarColor }]}>
                  <Text style={styles.avatarInitialsText}>{initials}</Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile?.full_name || t.profile || 'Profile'}</Text>
                <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onClose();
                router.push('/notifications');
              }}
            >
              <View style={styles.menuItemLeft}>
                <Bell size={24} color={Colors.text} />
                <Text style={styles.menuItemText}>{t.notifications || 'Notifications'}</Text>
              </View>
              {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onClose();
                router.push('/messages');
              }}
            >
              <View style={styles.menuItemLeft}>
                <MessageSquare size={24} color={Colors.text} />
                <Text style={styles.menuItemText}>{t.messages || 'Messages'}</Text>
              </View>
              {unreadMessages > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadMessages}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onClose();
                router.push('/profile');
              }}
            >
              <View style={styles.menuItemLeft}>
                <User size={24} color={Colors.text} />
                <Text style={styles.menuItemText}>{t.profile || 'Profile'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add Actions Section */}
          <View style={styles.addSection}>
            <Text style={styles.sectionTitle}>{t.add || 'Add'}</Text>
            
            <TouchableOpacity
              style={styles.addActionItem}
              onPress={() => handleAddAction('metric')}
            >
              <View style={[styles.addActionIcon, { backgroundColor: Colors.primary }]}>
                <Activity size={20} color={Colors.background} />
              </View>
              <Text style={styles.addActionText}>{t.addMeasurement || 'New Measurement'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addActionItem}
              onPress={() => handleAddAction('document')}
            >
              <View style={[styles.addActionIcon, { backgroundColor: Colors.primaryDark || Colors.primary }]}>
                <FileUp size={20} color={Colors.background} />
              </View>
              <Text style={styles.addActionText}>{t.uploadLabDocument || 'Upload Lab Document'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addActionItem}
              onPress={() => handleAddAction('activity')}
            >
              <View style={[styles.addActionIcon, { backgroundColor: Colors.success }]}>
                <CheckSquare size={20} color={Colors.background} />
              </View>
              <Text style={styles.addActionText}>{t.addActivity || 'Activity Performed'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addActionItem}
              onPress={() => handleAddAction('appointment')}
            >
              <View style={[styles.addActionIcon, { backgroundColor: Colors.warning }]}>
                <Calendar size={20} color={Colors.background} />
              </View>
              <Text style={styles.addActionText}>{t.appointmentsBookAppointment || 'Book Appointment'}</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <LogOut size={24} color={Colors.danger} />
            <Text style={styles.logoutText}>{t.logout || 'Logout'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.background,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 60,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.background,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  menuSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  addActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addActionText: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 12,
    fontWeight: '600',
  },
});
