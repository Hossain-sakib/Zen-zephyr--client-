export async function uploadProfileImage(file, user) {
  const api = (import.meta.env.VITE_API_URL || 'https://zen-zephyr-api.netlify.app/api').replace(
    /\/$/,
    '',
  );
  const authorization = `Bearer ${await user.getIdToken()}`;
  const signedResponse = await fetch(`${api}/uploads/signature`, {
    method: 'POST',
    headers: { Authorization: authorization },
  });
  if (!signedResponse.ok) throw new Error('Could not authorize image upload');
  const { cloudName, apiKey, signature, params } = await signedResponse.json();
  const body = new FormData();
  body.append('file', file);
  body.append('api_key', apiKey);
  body.append('signature', signature);
  Object.entries(params).forEach(([key, value]) => body.append(key, String(value)));
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: 'POST', body },
  );
  const result = await response.json();
  if (!response.ok || !result.secure_url?.startsWith('https://'))
    throw new Error('Image upload failed');
  return result.secure_url;
}
