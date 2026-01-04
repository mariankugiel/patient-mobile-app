import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Mic } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { messages } from '@/constants/patient';

interface Message {
  id: number;
  sender: string;
  content: string;
  date: string;
  time: string;
  read: boolean;
  isUser: boolean;
  senderImage?: string;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  date: string;
  unreadCount: number;
  image: string | null;
  isUser: boolean;
}

export default function MessagesScreen() {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Group messages by sender
  const groupedMessages: Record<string, Message[]> = {};
  
  messages.forEach((message: Message) => {
    const senderId = message.sender;
    if (!groupedMessages[senderId]) {
      groupedMessages[senderId] = [];
    }
    groupedMessages[senderId].push(message);
  });
  
  // Get unique contacts
  const contacts: Contact[] = Object.keys(groupedMessages).map(sender => {
    const messagesForSender = groupedMessages[sender];
    const lastMessage = messagesForSender[messagesForSender.length - 1];
    const unreadCount = messagesForSender.filter((m: Message) => !m.read && !m.isUser).length;
    
    return {
      id: sender,
      name: sender,
      lastMessage: lastMessage.content,
      time: lastMessage.time,
      date: lastMessage.date,
      unreadCount,
      image: messagesForSender[0].senderImage || null,
      isUser: messagesForSender[0].isUser || false
    };
  }).filter(contact => !contact.isUser);

  const renderContactItem = ({ item }: { item: Contact }) => {
    const isSelected = selectedContact && selectedContact.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => setSelectedContact(item)}
      >
        <View style={styles.contactImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.contactImage} />
          ) : (
            <View style={[styles.contactInitial, { backgroundColor: Colors.primary }]}>
              <Text style={styles.initialText}>{item.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <View style={styles.lastMessageContainer}>
            <Text 
              style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]} 
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const messageDate = new Date(item.date);
    const formattedDate = messageDate.toLocaleDateString('pt-PT');
    
    return (
      <View style={[
        styles.messageItem, 
        item.isUser ? styles.userMessage : styles.contactMessage
      ]}>
        {!item.isUser && (
          <View style={styles.messageSenderImage}>
            {item.senderImage ? (
              <Image source={{ uri: item.senderImage }} style={styles.senderImage} />
            ) : (
              <View style={[styles.senderInitial, { backgroundColor: Colors.primary }]}>
                <Text style={styles.initialText}>{item.sender.charAt(0)}</Text>
              </View>
            )}
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.contactBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.contactMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTimeInBubble,
            item.isUser ? styles.userMessageTime : styles.contactMessageTime
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Mensagens</Text>
          <View style={{ width: 24 }} />
        </View>

        {!selectedContact ? (
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contactsList}
          />
        ) : (
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.backToContacts}
                onPress={() => setSelectedContact(null)}
              >
                <ArrowLeft size={20} color={Colors.text} />
              </TouchableOpacity>
              <View style={styles.chatHeaderInfo}>
                {selectedContact.image ? (
                  <Image source={{ uri: selectedContact.image }} style={styles.chatHeaderImage} />
                ) : (
                  <View style={[styles.chatHeaderInitial, { backgroundColor: Colors.primary }]}>
                    <Text style={styles.initialText}>{selectedContact.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.chatHeaderName}>{selectedContact.name}</Text>
              </View>
            </View>
            
            <FlatList
              data={groupedMessages[selectedContact.id]}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />
            
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color={Colors.textLight} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Escreva uma mensagem..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              {newMessage.trim() ? (
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={() => {
                    // In a real app, you would send the message here
                    setNewMessage('');
                  }}
                >
                  <Send size={20} color={Colors.background} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micButton}>
                  <Mic size={20} color={Colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
  contactsList: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedContact: {
    backgroundColor: Colors.secondary,
  },
  contactImageContainer: {
    marginRight: 12,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.textLighter,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backToContacts: {
    marginRight: 12,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  chatHeaderInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  contactMessage: {
    alignSelf: 'flex-start',
  },
  messageSenderImage: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  senderImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  senderInitial: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    minWidth: 80,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  contactBubble: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userMessageText: {
    color: Colors.background,
  },
  contactMessageText: {
    color: Colors.text,
  },
  messageTimeInBubble: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: Colors.background,
    opacity: 0.8,
  },
  contactMessageTime: {
    color: Colors.textLighter,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    padding: 8,
  },
});