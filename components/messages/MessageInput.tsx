import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send, Paperclip, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface MessageInputProps {
  onSend: (text: string) => void;
  onAttach?: (file: { uri: string; name: string; type: string; size?: number }) => void;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
}

export default function MessageInput({ 
  onSend, 
  onAttach, 
  placeholder = 'Type a message...',
  disabled = false,
  sending = false
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled && !sending) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleAttach = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (onAttach) {
          onAttach({
            uri: file.uri,
            name: file.name || 'file',
            type: file.mimeType || 'application/octet-stream',
            size: file.size,
          });
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (onAttach) {
          onAttach({
            uri: asset.uri,
            name: `image_${Date.now()}.jpg`,
            type: 'image/jpeg',
            size: asset.fileSize,
          });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {onAttach && (
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={handleAttach}
          disabled={disabled || sending}
        >
          <Paperclip size={20} color={disabled ? Colors.textLighter : Colors.text} />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLighter}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={2000}
        editable={!disabled && !sending}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      {text.trim() ? (
        <TouchableOpacity
          style={[styles.sendButton, (disabled || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={disabled || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <Send size={20} color={Colors.background} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: 8,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  placeholderButton: {
    width: 40,
  },
});
