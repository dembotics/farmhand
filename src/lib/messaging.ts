import { createClient } from '@/lib/supabase/client';

/**
 * Find an existing conversation between two users, or create a new one.
 * Returns the conversation ID.
 */
export async function getOrCreateConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string | null> {
  const supabase = createClient();

  // Check if conversation already exists (in either direction)
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(
      `and(participant_1_id.eq.${currentUserId},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${currentUserId})`
    )
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new conversation
  const { data: newConvo, error } = await supabase
    .from('conversations')
    .insert({
      participant_1_id: currentUserId,
      participant_2_id: otherUserId,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return newConvo.id;
}
