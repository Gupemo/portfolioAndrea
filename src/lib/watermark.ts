import sharp from "sharp";

export type WatermarkType = "none" | "text" | "signature";
export type WatermarkPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

function getCoordinates(
  imageWidth: number,
  imageHeight: number,
  markWidth: number,
  markHeight: number,
  position: WatermarkPosition,
) {
  const margin = Math.max(18, Math.round(Math.min(imageWidth, imageHeight) * 0.035));
  const positions = {
    "top-left": { left: margin, top: margin },
    "top-right": { left: imageWidth - markWidth - margin, top: margin },
    center: { left: Math.round((imageWidth - markWidth) / 2), top: Math.round((imageHeight - markHeight) / 2) },
    "bottom-left": { left: margin, top: imageHeight - markHeight - margin },
    "bottom-right": { left: imageWidth - markWidth - margin, top: imageHeight - markHeight - margin },
  };
  return positions[position];
}

function textWatermark(width: number) {
  const markWidth = Math.max(280, Math.round(width * 0.3));
  const markHeight = Math.round(markWidth * 0.18);
  const fontSize = Math.round(markHeight * 0.45);
  return {
    width: markWidth,
    height: markHeight,
    buffer: Buffer.from(`<svg width="${markWidth}" height="${markHeight}" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="600"
        fill="white" fill-opacity="0.72" stroke="black" stroke-opacity="0.28" stroke-width="2">
        Andrea Larrumbide
      </text>
    </svg>`),
  };
}

async function signatureWatermark(signature: Buffer, width: number) {
  const resized = await sharp(signature)
    .resize({ width: Math.max(180, Math.round(width * 0.24)), withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });
  const encoded = resized.data.toString("base64");
  return {
    width: resized.info.width,
    height: resized.info.height,
    buffer: Buffer.from(`<svg width="${resized.info.width}" height="${resized.info.height}" xmlns="http://www.w3.org/2000/svg">
      <image width="100%" height="100%" opacity="0.72" href="data:image/png;base64,${encoded}" />
    </svg>`),
  };
}

export async function createDisplayImage(
  original: Buffer,
  type: WatermarkType,
  position: WatermarkPosition,
  signature?: Buffer,
) {
  const resized = await sharp(original, { failOn: "error" }).rotate().resize({
    width: 2400,
    height: 2400,
    fit: "inside",
    withoutEnlargement: true,
  }).toBuffer({ resolveWithObject: true });
  const width = resized.info.width;
  const height = resized.info.height;
  if (!width || !height) throw new Error("INVALID_IMAGE");
  const base = sharp(resized.data);

  if (type === "none") return base.webp({ quality: 88 }).toBuffer();
  const mark = type === "text"
    ? textWatermark(width)
    : await signatureWatermark(signature ?? Buffer.alloc(0), width);
  const coordinates = getCoordinates(width, height, mark.width, mark.height, position);
  return base.composite([{ input: mark.buffer, ...coordinates }]).webp({ quality: 88 }).toBuffer();
}
