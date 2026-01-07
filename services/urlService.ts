import LZString from 'lz-string';

/**
 * Encodes a string to a base64 URL-safe string using LZString compression.
 * This significantly reduces URL length and ensures character safety.
 */
export const encodeStateToHash = (content: string): string => {
  try {
    const json = JSON.stringify({ c: content, t: Date.now() });
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error("Failed to encode state", e);
    return "";
  }
};

/**
 * Decodes a string from the URL hash.
 * Supports both new LZString compressed format and legacy Base64 format.
 */
export const decodeStateFromHash = (hash: string): string | null => {
  try {
    const safeHash = hash.replace(/^#/, '');
    if (!safeHash) return null;

    // 1. Try LZString decompression (New Format)
    const decompressed = LZString.decompressFromEncodedURIComponent(safeHash);
    if (decompressed) {
      try {
        const data = JSON.parse(decompressed);
        if (data.c) return data.c;
      } catch (e) {
        // Not a valid JSON after decompression, might be coincidence, try legacy
      }
    }

    // 2. Fallback to Legacy Base64 Decoding (Old Format)
    // Legacy logic: base64 -> solid bytes -> percent encoded -> decodeURIComponent
    try {
      const jsonString = decodeURIComponent(atob(safeHash).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const data = JSON.parse(jsonString);
      return data.c || null;
    } catch (e) {
      // Not legacy format either
    }

    return null;
  } catch (e) {
    console.error("Failed to decode state", e);
    return null;
  }
};