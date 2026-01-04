import { createClient } from '../supabase/client';
import { SecureTokenStorage } from '../storage/secure-storage';
import { ProfileApiService } from './profile-api';

/**
 * Upload profile picture to Supabase Storage
 * @param fileUri - Local file URI from expo-image-picker
 * @param userId - User ID (Supabase user ID)
 * @returns Public URL of uploaded image
 */
export async function uploadProfilePicture(
  fileUri: string,
  userId: string
): Promise<string> {
  try {
    const supabase = createClient();

    // Get file extension from URI
    const fileExtension = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatar.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    // Read file as blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // List existing avatars in user's folder
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (!listError && existingFiles && existingFiles.length > 0) {
      // Find all avatar files
      const avatarFiles = existingFiles
        .filter((file) => file.name.startsWith('avatar.'))
        .map((file) => `${userId}/${file.name}`);

      if (avatarFiles.length > 0) {
        // Delete old avatar files
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove(avatarFiles);

        if (deleteError) {
          console.warn('Could not delete old avatars:', deleteError.message);
        }
      }
    }

    // Upload new avatar
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload: ${uploadError.message}`);
    }

    // Get Supabase URL from environment
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }

    // Generate signed URL (1 year expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 31536000); // 1 year in seconds

    if (signedUrlError || !signedUrlData) {
      throw new Error(
        `Failed to generate URL: ${signedUrlError?.message || 'Unknown error'}`
      );
    }

    // Extract token from signed URL
    const signedUrlObj = new URL(signedUrlData.signedUrl);
    const token = signedUrlObj.searchParams.get('token');

    if (!token) {
      throw new Error('Failed to extract token from signed URL');
    }

    // Construct final signed URL
    const finalSignedUrl = `${supabaseUrl}/storage/v1/object/sign/avatars/${filePath}?token=${token}`;

    // Update profile with new avatar URL
    try {
      await ProfileApiService.updateProfile({
        avatar_url: finalSignedUrl,
      });
    } catch (profileError) {
      console.warn('Failed to update profile with avatar URL:', profileError);
      // Continue anyway - the upload was successful
    }

    return finalSignedUrl;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    throw new Error(error.message || 'Failed to upload profile picture');
  }
}

/**
 * Get profile picture URL for a user
 * @param userId - User ID (Supabase user ID)
 * @returns URL of profile picture or placeholder
 */
export async function getProfilePictureUrl(userId: string): Promise<string> {
  try {
    const supabase = createClient();
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

    // First, try to get from user profile
    try {
      const profile = await ProfileApiService.getProfile();
      if (profile.avatar_url) {
        return profile.avatar_url;
      }
    } catch (error) {
      // Profile might not exist yet, continue to check storage
    }

    // List files in user's folder
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (filesError || !files || files.length === 0) {
      return '/placeholder-user.jpg';
    }

    // Find avatar file
    const avatarFile = files.find((file) => file.name.startsWith('avatar.'));

    if (!avatarFile) {
      return '/placeholder-user.jpg';
    }

    // Generate signed URL
    const filePath = `${userId}/${avatarFile.name}`;
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 31536000);

    if (signedUrlError || !signedUrlData) {
      return '/placeholder-user.jpg';
    }

    // Extract token and construct URL
    const signedUrlObj = new URL(signedUrlData.signedUrl);
    const token = signedUrlObj.searchParams.get('token');

    if (!token) {
      return '/placeholder-user.jpg';
    }

    return `${supabaseUrl}/storage/v1/object/sign/avatars/${filePath}?token=${token}`;
  } catch (error: any) {
    console.error('Error getting profile picture URL:', error);
    return '/placeholder-user.jpg';
  }
}


