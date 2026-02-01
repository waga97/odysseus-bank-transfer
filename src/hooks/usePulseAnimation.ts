/**
 * Ryt Bank - Pulse Animation Hook
 * Reusable pulsing effect for loading states
 */

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UsePulseAnimationOptions {
  /** Minimum scale */
  minScale?: number;
  /** Maximum scale */
  maxScale?: number;
  /** Duration of one pulse cycle in ms */
  duration?: number;
  /** Whether the animation is active */
  active?: boolean;
}

export function usePulseAnimation(options: UsePulseAnimationOptions = {}) {
  const {
    minScale = 1,
    maxScale = 1.1,
    duration = 800,
    active = false,
  } = options;

  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    if (active) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: maxScale,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: minScale,
            duration,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(minScale);
    }
    return undefined;
  }, [active, pulseAnim, minScale, maxScale, duration]);

  return pulseAnim;
}
