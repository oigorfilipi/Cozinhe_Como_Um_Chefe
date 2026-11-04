const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export async function resizeProfilePhoto(file) {
  if (!file || !allowedTypes.has(file.type)) throw new Error('Escolha uma imagem PNG, JPG ou WebP.');
  if (file.size > MAX_PHOTO_BYTES) throw new Error('A foto deve ter até 5 MB.');
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    canvas.getContext('2d').drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side, side, 0, 0, 256, 256,
    );
    return canvas.toDataURL('image/webp', 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
