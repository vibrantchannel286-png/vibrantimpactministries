import { MediaItem } from '../types';

export const fetchFacebookVideos = async (pageId: string, accessToken: string): Promise<Partial<MediaItem>[]> => {
  try {
    // We use the Facebook Graph API to fetch the latest videos from the page
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/videos?fields=id,title,description,source,picture,created_time&access_token=${accessToken}&limit=10`
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return (data.data || []).map((v: any) => ({
      type: 'video' as const,
      title: v.title || v.description?.substring(0, 50) || 'Facebook Video',
      description: v.description || '',
      url: v.source, // This is the direct MP4 link if available, or the video URL
      category: 'Facebook Upload',
      language: 'English',
      externalId: v.id,
      uploadedAt: new Date(v.created_time)
    }));
  } catch (error) {
    console.error("Facebook Sync Error:", error);
    return [];
  }
};