import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPushNotificationsEnabled, setPushSubscription } from '../store/slices/uiSlice';

// VAPID public key - should be set in environment variables
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// Convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const dispatch = useDispatch();
  const { pushNotificationsEnabled, pushSubscription } = useSelector((state) => state.ui);
  
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 
                      'PushManager' in window && 
                      'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (err) {
      setError('Failed to request notification permission');
      return false;
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Request permission first
      const granted = await requestPermission();
      if (!granted) {
        setError('Notification permission denied');
        setLoading(false);
        return null;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription
        const options = {
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY 
            ? urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            : undefined,
        };

        subscription = await registration.pushManager.subscribe(options);
      }

      // Save subscription to state
      dispatch(setPushSubscription(JSON.parse(JSON.stringify(subscription))));
      dispatch(setPushNotificationsEnabled(true));

      // Send subscription to backend
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(subscription),
        });
      } catch (e) {
        console.warn('Failed to save subscription to server:', e);
      }

      setLoading(false);
      return subscription;
    } catch (err) {
      console.error('Push subscription error:', err);
      setError(err.message || 'Failed to subscribe to push notifications');
      setLoading(false);
      return null;
    }
  }, [isSupported, requestPermission, dispatch]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notify backend
        try {
          const token = localStorage.getItem('token');
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
        } catch (e) {
          console.warn('Failed to remove subscription from server:', e);
        }
      }

      dispatch(setPushSubscription(null));
      dispatch(setPushNotificationsEnabled(false));
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Push unsubscribe error:', err);
      setError(err.message || 'Failed to unsubscribe from push notifications');
      setLoading(false);
      return false;
    }
  }, [dispatch]);

  // Show a local notification (for testing)
  const showNotification = useCallback(async (title, options = {}) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Cannot show notification: not supported or permission denied');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        vibrate: [100, 50, 100],
        ...options,
      });
      return true;
    } catch (err) {
      console.error('Show notification error:', err);
      return false;
    }
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    isEnabled: pushNotificationsEnabled,
    subscription: pushSubscription,
    loading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  };
};

export default usePushNotifications;
