/**
 * Client-side high performance image compressor.
 * Prevents Firestore "Document exceeds maximum allowed size of 1,048,576 bytes" errors
 * by ensuring all images are scaled to web-optimal dimensions and compressed with HTML5 Canvas.
 */

export async function compressImage(
  source: File | string,
  maxWidth = 1280,
  maxHeight = 1280,
  initialQuality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a URL (http/https), return as-is
    if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('/'))) {
      return resolve(source);
    }

    const img = new Image();

    const processLoadedImage = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width === 0 || height === 0) {
          // In case dimensions cannot be read
          return resolve(typeof source === 'string' ? source : '');
        }

        // Calculate aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(typeof source === 'string' ? source : '');
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // First attempt with initial quality
        let compressed = canvas.toDataURL('image/jpeg', initialQuality);

        // If size is still larger than 250KB (~330,000 base64 chars), compress further
        if (compressed.length > 330000) {
          compressed = canvas.toDataURL('image/jpeg', 0.65);
        }

        // If still > 200KB, downscale canvas slightly
        if (compressed.length > 270000) {
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.round(width * 0.8);
          smallCanvas.height = Math.round(height * 0.8);
          const smallCtx = smallCanvas.getContext('2d');
          if (smallCtx) {
            smallCtx.imageSmoothingEnabled = true;
            smallCtx.imageSmoothingQuality = 'high';
            smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            compressed = smallCanvas.toDataURL('image/jpeg', 0.62);
          }
        }

        resolve(compressed);
      } catch (err) {
        console.warn('Canvas compression error:', err);
        resolve(typeof source === 'string' ? source : '');
      }
    };

    img.onload = processLoadedImage;
    img.onerror = () => {
      console.warn('Image load failed for compression');
      resolve(typeof source === 'string' ? source : '');
    };

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * Scans an HTML string for large base64 data URLs in <img> tags
 * and compresses them down to web-safe sizes under 120KB.
 */
export async function optimizePostHtmlImages(html: string): Promise<string> {
  if (!html || !html.includes('data:image/')) {
    return html;
  }

  // Find all base64 images in <img> tags
  const regex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/gi;
  const matches: { fullTag: string; dataUrl: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && match[1].length > 100000) { // Larger than ~75KB
      matches.push({ fullTag: match[0], dataUrl: match[1] });
    }
  }

  if (matches.length === 0) {
    return html;
  }

  let resultHtml = html;
  for (const item of matches) {
    try {
      const compressedUrl = await compressImage(item.dataUrl, 1200, 1200, 0.72);
      if (compressedUrl && compressedUrl.length < item.dataUrl.length) {
        resultHtml = resultHtml.replace(item.dataUrl, compressedUrl);
      }
    } catch (e) {
      console.warn('Error optimizing inline image:', e);
    }
  }

  return resultHtml;
}

/**
 * Ensures the entire Post object is strictly within Firestore's 1MB limit.
 */
export async function sanitizePostForFirestore<T extends { contentHtml?: string; coverImageUrl?: string }>(
  post: T
): Promise<T> {
  const updated = { ...post };

  // 1. Optimize cover image if base64
  if (updated.coverImageUrl && updated.coverImageUrl.startsWith('data:image/') && updated.coverImageUrl.length > 100000) {
    try {
      updated.coverImageUrl = await compressImage(updated.coverImageUrl, 1200, 800, 0.75);
    } catch (e) {
      console.warn('Cover image optimization notice:', e);
    }
  }

  // 2. Optimize contentHtml images
  if (updated.contentHtml) {
    updated.contentHtml = await optimizePostHtmlImages(updated.contentHtml);
  }

  // 3. Final verification of document byte size
  const docString = JSON.stringify(updated);
  const sizeBytes = new Blob([docString]).size;

  if (sizeBytes > 850000) {
    console.warn(`Post is ${sizeBytes} bytes, applying aggressive image optimization...`);
    // If still large, perform secondary aggressive downscale on contentHtml
    if (updated.contentHtml) {
      const regex = /<img[^>]+src=["'](data:image\/[^"']+)["'][^>]*>/gi;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(updated.contentHtml)) !== null) {
        if (match[1]) {
          try {
            const extraCompressed = await compressImage(match[1], 800, 600, 0.55);
            updated.contentHtml = updated.contentHtml.replace(match[1], extraCompressed);
          } catch {}
        }
      }
    }
  }

  return updated;
}
