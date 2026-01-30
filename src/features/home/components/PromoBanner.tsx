/**
 * Odysseus Bank - Promo Banner
 * Smart Transfer promotional card
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';

interface PromoBannerProps {
  onPress?: () => void;
}

export function PromoBanner({ onPress }: PromoBannerProps) {
  return (
    <Card variant="outlined" style={styles.container}>
      {/* Background Pattern - Dots */}
      <View style={styles.patternOverlay} />

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Icon Badge */}
        <View style={styles.iconBadge}>
          <Icon name="trending-up" size={20} color={palette.primary.main} />
        </View>

        {/* Decorative Icon */}
        <View style={styles.decorativeIcon}>
          <Icon name="globe" size={64} color={palette.primary.main} />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text variant="headlineSmall" color="primary">
            Smart Transfer
          </Text>
          <Text
            variant="bodySmall"
            color="secondary"
            style={styles.description}
          >
            Save on fees with intelligent routing algorithms.
          </Text>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.ctaButton} onPress={onPress}>
          <Text variant="labelSmall" color="inverse">
            Learn More
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    padding: spacing[6],
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.primary,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '33%',
    backgroundColor: palette.primary.main,
    opacity: 0.05,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  decorativeIcon: {
    position: 'absolute',
    top: -spacing[4],
    right: -spacing[4],
    opacity: 0.15,
    transform: [{ rotate: '12deg' }],
  },
  textContent: {
    marginBottom: spacing[4],
  },
  description: {
    marginTop: spacing[1],
    maxWidth: '80%',
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
});

export default PromoBanner;
