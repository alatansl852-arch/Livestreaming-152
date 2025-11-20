import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

const mockMessages: ChatMessage[] = [
  { id: "1", username: "Viewer123", message: "Great stream!", timestamp: "2m ago" },
  { id: "2", username: "Fan456", message: "Love the content!", timestamp: "3m ago" },
  { id: "3", username: "Supporter789", message: "Keep it up!", timestamp: "5m ago" },
];

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: message,
      timestamp: "Just now",
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    console.log('Message sent:', message);
  };

  return (
    <div className="flex h-full flex-col border-l bg-card">
      <div className="border-b p-4">
        <h2 className="font-semibold">Stream Chat</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4" data-testid="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">{msg.username[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{msg.username}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            data-testid="input-chat"
          />
          <Button size="icon" onClick={handleSend} data-testid="button-send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
