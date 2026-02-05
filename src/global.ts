import { createLogoSoup } from "./createLogoSoup";
import { processLogos } from "./processLogos";
import { getVisualCenterTransform } from "./utils/getVisualCenterTransform";
import { cropToDataUrl } from "./utils/measure";
import { DEFAULT_ALIGN_BY } from "./constants";

(globalThis as any).LogoSoup = {
  createLogoSoup,
  processLogos,
  getVisualCenterTransform,
  cropToDataUrl,
  DEFAULT_ALIGN_BY,
};
