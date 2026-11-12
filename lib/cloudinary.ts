import crypto from "crypto";

const CLOUDINARY_FOLDER = "amanu-properties";
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Reads server-side Cloudinary credentials from environment variables.
 * Never exposes apiSecret to the client.
 */
export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration is incomplete. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Generates signed upload parameters for direct browser-to-Cloudinary uploads.
 */
export function generateCloudinaryUploadSignature() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature requires parameters sorted alphabetically
  const paramsToSign = `folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${apiSecret}`)
    .digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    signature,
  };
}

/**
 * Deletes an image asset from Cloudinary using the signed Admin/Upload Destroy API.
 * Throws if Cloudinary fails so callers never silently ignore deletion failures.
 */
export async function destroyCloudinaryAsset(publicId: string): Promise<void> {
  if (!publicId || !publicId.startsWith(`${CLOUDINARY_FOLDER}/`)) {
    throw new Error(
      `Invalid or unauthorized Cloudinary public ID: ${publicId}`,
    );
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${apiSecret}`)
    .digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown HTTP error");
    throw new Error(
      `Cloudinary destroy request failed (${response.status}): ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    result?: string;
    error?: { message?: string };
  };

  if (data.result !== "ok" && data.result !== "not found") {
    throw new Error(
      data.error?.message ||
        `Cloudinary asset deletion returned unexpected result: ${data.result}`,
    );
  }
}
