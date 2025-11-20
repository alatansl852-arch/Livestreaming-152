import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
  streamerId: string;
  initialSubscribed?: boolean;
}

export default function SubscribeButton({ streamerId, initialSubscribed = false }: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);

  const handleToggle = () => {
    setSubscribed(!subscribed);
    console.log(`${subscribed ? 'Unsubscribed from' : 'Subscribed to'} streamer ${streamerId}`);
  };

  return (
    <Button
      variant={subscribed ? "secondary" : "default"}
      size="lg"
      className="gap-2 font-semibold"
      onClick={handleToggle}
      data-testid="button-subscribe"
    >
      {subscribed ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
      {subscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}
