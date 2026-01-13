import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bot } from 'lucide-react-native';
import Colors from '@/constants/colors';
import type { BotConversation } from '@/types/messages';

interface BotConversationItemProps {
  conversation: BotConversation;
  onPress: () => void;
  unreadCount?: number;
}

export default function BotConversationItem({ conversation, onPress, unreadCount = 0 }: BotConversationItemProps) {
  const lastMessagePreview = conversation.lastMessage?.content || '';
  const truncatedMessage = lastMessagePreview.length > 50 
    ? lastMessagePreview.substring(0, 50) + '...' 
    : lastMessagePreview;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.botAvatar}>
          <Bot size={24} color={Colors.background} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{conversation.contact_name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{conversation.contact_role}</Text>
            </View>
          </View>
          {conversation.lastMessageTime && (
            <Text style={styles.time}>{formatTime(conversation.lastMessageTime)}</Text>
          )}
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message} numberOfLines={1}>
            {truncatedMessage || 'Start a conversation with Saluso Support'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  avatarContainer: {
    marginRight: 12,
  },
  botAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: Colors.textLighter,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
