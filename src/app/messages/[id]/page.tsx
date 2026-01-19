'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface OtherUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      if (!user || !params.id) {
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Fetch conversation to get other user
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (convError || !conversation) {
        console.error('Error fetching conversation:', convError);
        router.push('/messages');
        return;
      }

      // Verify user is a participant
      if (conversation.participant_1_id !== user.id && conversation.participant_2_id !== user.id) {
        router.push('/messages');
        return;
      }

      // Get other user's profile
      const otherUserId = conversation.participant_1_id === user.id
        ? conversation.participant_2_id
        : conversation.participant_1_id;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', otherUserId)
        .single();

      setOtherUser(profile || { id: otherUserId, full_name: 'Unknown User', avatar_url: null });

      // Fetch messages
      const { data: msgs, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true });

      if (msgsError) {
        console.error('Error fetching messages:', msgsError);
      } else {
        setMessages(msgs || []);
      }

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', params.id)
        .neq('sender_id', user.id);

      setLoading(false);
    };

    if (!authLoading) {
      fetchConversation();
    }
  }, [user, authLoading, params.id, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!user || !params.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${params.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);

          // Mark as read if from other user
          if (newMsg.sender_id !== user.id) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, params.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || sending) return;

    setSending(true);
    const supabase = createClient();

    try {
      // Insert the message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.id,
          sender_id: user.id,
          content: newMessage.trim(),
        });

      if (msgError) throw msgError;

      // Update conversation's last message
      const { error: convError } = await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim().substring(0, 100),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (convError) throw convError;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-muted">Please sign in to view messages.</p>
          <Link href="/login" className="btn-primary mt-4">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/messages"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {otherUser && (
            <>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {otherUser.full_name.charAt(0)}
              </div>
              <h1 className="font-semibold text-foreground">{otherUser.full_name}</h1>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="card mb-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.sender_id === user.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input flex-1"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
