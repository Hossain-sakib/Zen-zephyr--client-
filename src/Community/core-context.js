import { createContext, useContext } from 'react';
export const CommunityContext = createContext(null);
export const useCommunity = () => useContext(CommunityContext);
export const topics = [
  'Everyday life',
  'Design',
  'Technology',
  'Photography',
  'Questions',
  'Art & culture',
];
export const topicEmojis = ['☀️', '✳️', '💡', '📷', '💬', '🎨'];
export const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
export function relativeTime(value) {
  if (!value) return 'Just now';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
