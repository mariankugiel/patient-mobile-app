/**
 * Get user initials from full name
 * @param name - Full name string
 * @returns Initials string (e.g., "VA" for "Victor Alves")
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return '?';
  }
  
  try {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) {
      // Single word: take first 2 characters
      return parts[0].slice(0, 2).toUpperCase();
    }
    // Multiple words: take first letter of first and last word
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } catch (error) {
    console.warn('Error generating initials:', error, 'name:', name);
    return '?';
  }
}

/**
 * Get a color for the avatar background based on the name
 * This ensures consistent colors for the same user
 */
export function getAvatarColor(name: string | null | undefined): string {
  if (!name) return '#6B7280'; // Gray fallback
  
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a color from the hash
  const hue = Math.abs(hash) % 360;
  // Use a more saturated color palette
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash) % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

