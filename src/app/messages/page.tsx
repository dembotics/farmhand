'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  unread_count: number;
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Fetch conversations where user is a participant
      const { data: convos, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
        return;
      }

      if (!convos || convos.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get all other user IDs
      const otherUserIds = convos.map(c =>
        c.participant_1_id === user.id ? c.participant_2_id : c.participant_1_id
      );

      // Fetch profiles for other users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', otherUserIds);

      // Fetch unread counts
      const { data: unreadCounts } = await supabase
        .from('messages')
        .select('conversation_id')
        .in('conversation_id', convos.map(c => c.id))
        .eq('is_read', false)
        .neq('sender_id', user.id);

      // Build conversation list with other user info
      const conversationsWithUsers = convos.map(conv => {
        const otherUserId = conv.participant_1_id === user.id
          ? conv.participant_2_id
          : conv.participant_1_id;
        const otherUser = profiles?.find(p => p.id === otherUserId) || {
          id: otherUserId,
          full_name: 'Unknown User',
          avatar_url: null
        };
        const unreadCount = unreadCounts?.filter(m => m.conversation_id === conv.id).length || 0;

        return {
          ...conv,
          other_user: otherUser,
          unread_count: unreadCount
        };
      });

      setConversations(conversationsWithUsers);
      setLoading(false);
    };

    if (!authLoading) {
      fetchConversations();
    }
  }, [user, authLoading]);

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          const updated = payload.new as { id: string; last_message: string; last_message_at: string };
          setConversations(prev =>
            prev.map(c =>
              c.id === updated.id
                ? { ...c, last_message: updated.last_message, last_message_at: updated.last_message_at }
                : c
            ).sort((a, b) => {
              if (!a.last_message_at) return 1;
              if (!b.last_message_at) return -1;
              return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>
        <div className="card text-center py-12">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>
        <div className="card text-center py-16">
          <MessageSquare className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to view messages</h2>
          <p className="text-muted mb-6">
            You need to be logged in to access your messages.
          </p>
          <Link href="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No messages yet</h2>
          <p className="text-muted mb-6">
            When you connect with farmers or workers, your conversations will appear here.
          </p>
          <Link href="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {conversation.other_user.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {conversation.other_user.full_name}
                  </h3>
                  {conversation.last_message_at && (
                    <span className="text-xs text-muted flex-shrink-0">
                      {formatTime(conversation.last_message_at)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted truncate">
                    {conversation.last_message || 'No messages yet'}
                  </p>
                  {conversation.unread_count > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
