/**
 * Odysseus Bank - Shake Animation Hook
 * Reusable shake effect for error feedback
 */

import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface UseShakeAnimationOptions {
  /** Shake distance in pixels */
  distance?: number;
  /** Duration of each shake movement in ms */
  duration?: number;
  /** Number of shake cycles */
  cycles?: number;
}

export function useShakeAnimation(options: UseShakeAnimationOptions = {}) {
  const { distance = 10, duration = 50, cycles = 2 } = options;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    const shakeSequence: Animated.CompositeAnimation[] = [];

    for (let i = 0; i < cycles; i++) {
      shakeSequence.push(
        Animated.timing(shakeAnim, {
          toValue: distance,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -distance,
          duration,
          useNativeDriver: true,
        })
      );
    }

    // Return to center
    shakeSequence.push(
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      })
    );

    Animated.sequence(shakeSequence).start();
  }, [shakeAnim, distance, duration, cycles]);

  const reset = useCallback(() => {
    shakeAnim.setValue(0);
  }, [shakeAnim]);

  return {
    shakeAnim,
    shake,
    reset,
  };
}
