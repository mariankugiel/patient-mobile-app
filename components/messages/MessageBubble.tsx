import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import Colors from '@/constants/colors';
import type { Message } from '@/types/messages';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  showAvatar?: boolean;
  avatar?: string;
  initials?: string;
  onLongPress?: () => void;
}

export default function MessageBubble({ 
  message, 
  isUser, 
  showAvatar = false,
  avatar,
  initials,
  onLongPress 
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isRead = message.status === 'read' || !!message.read_at;
  const isDelivered = message.status === 'delivered' || message.status === 'read';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.contactContainer]}>
      {!isUser && showAvatar && (
        <View style={styles.avatarContainer}>
          {avatar ? (
            <View style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary }]}>
              <Text style={styles.initials}>{initials || '?'}</Text>
            </View>
          )}
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.contactBubble,
        ]}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.contactText,
        ]}>
          {message.content}
        </Text>
        <View style={styles.footer}>
          <Text style={[
            styles.time,
            isUser ? styles.userTime : styles.contactTime,
          ]}>
            {formatTime(message.created_at)}
          </Text>
          {isUser && (
            <View style={styles.statusIcon}>
              {isRead ? (
                <CheckCheck size={14} color={Colors.primary} />
              ) : isDelivered ? (
                <CheckCheck size={14} color={Colors.textLighter} />
              ) : (
                <Check size={14} color={Colors.textLighter} />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  contactContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  contactBubble: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: Colors.background,
  },
  contactText: {
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 11,
  },
  userTime: {
    color: Colors.background,
    opacity: 0.8,
  },
  contactTime: {
    color: Colors.textLighter,
  },
  statusIcon: {
    marginLeft: 2,
  },
});
