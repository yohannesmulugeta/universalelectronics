import { withBase } from './paths';
import imageManifest from '../generated/image-manifest.json';

type Variants = Record<string, string>;
const manifest = imageManifest as Record<string, Variants>;

/** Uses build-generated, losslessly preserved source URLs as fallback. */
export function responsiveImage(original: string | undefined, preferredWidth = 960) {
  if (!original) return { src: '', srcSet: undefined as string | undefined };
  const variants = manifest[original];
  if (!variants || Object.keys(variants).length === 0) return { src: withBase(original), srcSet: undefined };
  const widths = Object.keys(variants).map(Number).sort((a, b) => a - b);
  const bestWidth = widths.find((width) => width >= preferredWidth) ?? widths[widths.length - 1];
  const src = withBase(variants[String(bestWidth)]);
  const srcSet = widths.map((width) => `${withBase(variants[String(width)])} ${width}w`).join(', ');
  return { src, srcSet };
}
