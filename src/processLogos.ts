import {
  DEFAULT_BASE_SIZE,
  DEFAULT_CONTRAST_THRESHOLD,
  DEFAULT_DENSITY_FACTOR,
  DEFAULT_SCALE_FACTOR,
} from "./constants";
import type {
  LogoSource,
  NormalizedLogo,
  ProcessLogosOptions,
} from "./types";
import {
  cropToDataUrl,
  loadImage,
  measureWithContentDetection,
} from "./utils/measure";
import { createNormalizedLogo, normalizeSource } from "./utils/normalize";

export async function processLogos(
  options: ProcessLogosOptions,
): Promise<NormalizedLogo[]> {
  const {
    logos,
    baseSize = DEFAULT_BASE_SIZE,
    scaleFactor = DEFAULT_SCALE_FACTOR,
    contrastThreshold = DEFAULT_CONTRAST_THRESHOLD,
    densityAware = true,
    densityFactor = DEFAULT_DENSITY_FACTOR,
    cropToContent = false,
  } = options;

  if (logos.length === 0) {
    return [];
  }

  const sources: LogoSource[] = logos.map(normalizeSource);

  const results = await Promise.all(
    sources.map(async (source) => {
      const img = await loadImage(source.src);
      const measurement = measureWithContentDetection(
        img,
        contrastThreshold,
        densityAware,
      );

      const effectiveDensityFactor = densityAware ? densityFactor : 0;

      const normalized = createNormalizedLogo(
        source,
        measurement,
        baseSize,
        scaleFactor,
        effectiveDensityFactor,
      );

      if (cropToContent && measurement.contentBox) {
        normalized.croppedSrc = cropToDataUrl(img, measurement.contentBox);
      }

      return normalized;
    }),
  );

  return results;
}
