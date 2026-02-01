/**
 * Ryt Bank - Share Utilities
 * Handles sharing receipts and other content
 */

import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

/**
 * Capture a view as an image and share it
 */
export async function captureAndShare(
  viewRef: RefObject<View>,
  filename: string = 'receipt'
): Promise<boolean> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      // Sharing not available on this device - return gracefully
      return false;
    }

    // Capture the view as an image
    if (!viewRef.current) {
      // View reference not available - return gracefully
      return false;
    }

    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    // Share the image
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: `Share ${filename}`,
      UTI: 'public.png',
    });

    return true;
  } catch {
    // Share failed - return gracefully
    return false;
  }
}

/**
 * Share text content
 */
export async function shareText(
  text: string,
  title?: string
): Promise<boolean> {
  // Note: expo-sharing requires a file URI, so for text sharing
  // we would need to create a temporary file. This function is a placeholder
  // for future implementation. Consider using react-native's Share API for text.
  void text;
  void title;
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return false;
    }

    // For text sharing, we need to create a temporary file
    // expo-sharing requires a file URI
    // In a real app, you might want to use react-native's Share API for text
    return true;
  } catch {
    // Share text failed - return gracefully
    return false;
  }
}

export default { captureAndShare, shareText };
