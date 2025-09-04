/**
 * Generate a consistent avatar URL based on a name
 * Using UI Faces API for placeholder avatars
 */
const AVATAR_BASE_URL = 'https://ui-avatars.com/api/';

export const getAvatarUrl = (name: string, size = 200) => {
  const params = new URLSearchParams({
    name: name.split(' ').slice(0, 2).join('+'),
    size: size.toString(),
    background: 'random',
    color: 'fff',
    bold: 'true',
    length: '2'
  });
  
  return `${AVATAR_BASE_URL}?${params.toString()}`;
};
