import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Menu, Search, Home } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMessages } from '@/hooks/useMessages';
import { useAIChat } from '@/hooks/useAIChat';
import { useAuthStore } from '@/lib/auth/auth-store';
import SideDrawer from '@/components/SideDrawer';
import BotConversationItem from '@/components/messages/BotConversationItem';
import ConversationItem from '@/components/messages/ConversationItem';
import MessageBubble from '@/components/messages/MessageBubble';
import MessageInput from '@/components/messages/MessageInput';
import type { Conversation, BotConversation, Message } from '@/types/messages';
import { SALUSO_SUPPORT_CONVERSATION_ID as BOT_ID } from '@/types/messages';

export default function MessagesScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuthStore();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // Backend will get patient_id from the auth token, so we don't need to pass it
  const patientId = undefined;
  const {
    conversations,
    botConversation,
    selectedConversation,
    messages,
    unreadCount,
    loading,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    error,
    selectConversation,
    sendMessage,
    uploadFile,
    markAsRead,
    refreshConversations,
    loadMoreMessages,
    handleMedicationAction,
    handleAppointmentAction,
  } = useMessages(patientId);

  const {
    messages: aiMessages,
    loading: aiLoading,
    error: aiError,
    sendMessage: sendAIMessage,
    clearMessages: clearAIMessages,
  } = useAIChat();

  // Determine if we're in bot conversation
  const isBotConversation = selectedConversation?.id === BOT_ID;
  const displayMessages = isBotConversation ? aiMessages : messages;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (displayMessages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayMessages.length]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && !isBotConversation) {
      markAsRead();
    }
  }, [selectedConversation, isBotConversation, markAsRead]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      refreshConversations();
    }, [refreshConversations])
  );

  const handleBack = () => {
    if (selectedConversation) {
      // Don't clear AI messages when going back - preserve chat history
      selectConversation('__clear__');
    } else {
      // Navigate to tabs (home) instead of just going back
      // This ensures users can always get back to the main app
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/records');
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    if (conversationId === BOT_ID) {
      selectConversation(BOT_ID);
    } else {
      selectConversation(conversationId);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      if (isBotConversation) {
        await sendAIMessage(text);
      } else {
        await sendMessage(text, 'general');
      }
    } catch (err: any) {
      Alert.alert(t.failedToSend || 'Failed to send', err.message || 'An error occurred');
    }
  };

  const handleAttachFile = async (file: { uri: string; name: string; type: string; size?: number }) => {
    try {
      if (isBotConversation) {
        Alert.alert('Info', 'File attachments are not supported for AI chat');
        return;
      }
      const attachment = await uploadFile(file);
      // For now, just send a message with the file name
      // In a full implementation, you'd send the attachment with the message
      await sendMessage(`📎 ${file.name}`, 'general', [attachment]);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Failed to upload file');
    }
  };

  const renderConversationList = () => {
    if (loadingConversations) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading || 'Loading...'}</Text>
        </View>
      );
    }

    if (conversations.length === 0 && !botConversation) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{t.noConversations || 'No conversations yet'}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          botConversation ? (
            <BotConversationItem
              conversation={botConversation}
              onPress={() => handleSelectConversation(BOT_ID)}
              unreadCount={0}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => handleSelectConversation(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loadingConversations}
            onRefresh={refreshConversations}
            colors={[Colors.primary]}
          />
        }
      />
    );
  };

  const renderChatView = () => {
    if (loadingMessages && displayMessages.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading || 'Loading...'}</Text>
        </View>
      );
    }

    if (displayMessages.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {isBotConversation 
              ? (t.startConversation || 'Start a conversation with Saluso Support')
              : (t.noMessagesYet || 'No messages yet')
            }
          </Text>
        </View>
      );
    }

    // Get current user ID from auth store user object (string) or use 0 as fallback
    const currentUserId = user?.id ? Number(user.id) : 0;

    return (
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        keyExtractor={(item) => {
          if ('id' in item) {
            return item.id;
          }
          return `msg-${item.id}`;
        }}
        renderItem={({ item }) => {
          if (isBotConversation) {
            // AI chat messages
            const aiMessage = item as any;
            const isUser = aiMessage.role === 'user';
            return (
              <MessageBubble
                message={{
                  id: aiMessage.id,
                  conversation_id: BOT_ID,
                  sender_id: isUser ? currentUserId : 0,
                  content: aiMessage.content,
                  message_type: 'ai_chat',
                  priority: 'normal',
                  status: 'read',
                  created_at: aiMessage.timestamp,
                } as Message}
                isUser={isUser}
              />
            );
          } else {
            // Regular messages
            const message = item as Message;
            const isUser = message.sender_id === currentUserId;
            const conversation = selectedConversation as Conversation;
            return (
              <MessageBubble
                message={message}
                isUser={isUser}
                showAvatar={!isUser}
                avatar={conversation?.contact_avatar}
                initials={conversation?.contact_initials}
              />
            );
          }
        }}
        contentContainerStyle={styles.messagesList}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
        inverted={false}
      />
    );
  };

  const getHeaderTitle = () => {
    if (selectedConversation) {
      if (isBotConversation) {
        return t.salusoSupport || 'Saluso Support';
      }
      return (selectedConversation as Conversation).contact_name || t.messages || 'Messages';
    }
    return t.messages || 'Messages';
  };

  return (
    <View style={styles.container}>
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onOpen={() => setDrawerVisible(true)} />
      
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={selectedConversation ? handleBack : () => router.replace('/(tabs)/records')}
        >
          {selectedConversation ? (
            <ArrowLeft size={24} color={Colors.text} />
          ) : (
            <Home size={24} color={Colors.text} />
          )}
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{getHeaderTitle()}</Text>
        {!selectedConversation && (
          <>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Search size={20} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setDrawerVisible(true)}
            >
              <Menu size={24} color={Colors.text} />
            </TouchableOpacity>
          </>
        )}
        {selectedConversation && <View style={{ width: 40 }} />}
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {selectedConversation ? (
          <>
            <View style={styles.chatContainer}>
              {renderChatView()}
            </View>
            <MessageInput
              onSend={handleSendMessage}
              onAttach={handleAttachFile}
              placeholder={t.typeMessage || 'Type a message...'}
              disabled={loading || sendingMessage || aiLoading}
              sending={sendingMessage || aiLoading}
            />
          </>
        ) : (
          renderConversationList()
        )}
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  menuButton: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  messagesList: {
    padding: 16,
  },
});
