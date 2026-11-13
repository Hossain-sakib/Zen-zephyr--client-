import { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export const NetworkContext = createContext(null);
export const useNet = () => useContext(NetworkContext);
export const message = (e) =>
  e?.response?.data?.message || e?.message || 'Please try again in a moment.';
export const time = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
export const money = (item) =>
  item.price === 0
    ? 'Free'
    : new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: item.currency,
        maximumFractionDigits: 2,
      }).format(item.price);
export const spacePath = (item) => `/${item.type === 'page' ? 'pages' : 'groups'}/${item.id}`;
export function useAction(fn, success) {
  const ctx = useNet();
  const cache = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (result) => {
      cache.invalidateQueries({ queryKey: ['social'] });
      success?.(result);
    },
    onError: (error) => ctx.toast(message(error)),
  });
}
