import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { colors } from '@theme/colors';
import { typography, type TypographyVariantKey } from '@theme/typography';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type TextColor = keyof typeof colors.text | string;

interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TypographyVariantKey;
  color?: TextColor;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export function Text({
  variant = 'bodyMedium',
  color = 'primary',
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const variantStyle = typography[variant];

  const textColor =
    color in colors.text
      ? colors.text[color as keyof typeof colors.text]
      : color;

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        { color: textColor },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text.primary,
  },
});

export default Text;
