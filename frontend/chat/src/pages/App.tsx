import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Video, VideoOff, LogOut, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetectedObject {
  name: string;
  confidence: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AppPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      stopCamera();
      subscription.unsubscribe();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCameraActive(true);
      startAnalysis();
      toast({ title: "Camera started", description: "Real-time object detection active" });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setIsAnalyzing(false);
    setCameraActive(false);
    setDetectedObjects([]);
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current) return null;
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const startAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    analysisIntervalRef.current = setInterval(async () => {
      const frame = captureFrame();
      if (!frame) return;

      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-frame', {
          body: { frame }
        });

        if (error) throw error;
        if (data?.objects) {
          setDetectedObjects(data.objects);
        }
      } catch (error: any) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 3000);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-context', {
        body: { 
          message: inputMessage,
          detectedObjects: detectedObjects.map(obj => obj.name)
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            OmniVision AI
          </h1>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        {/* Video Panel */}
        <Card className="p-6 space-y-4 border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Camera Feed</h2>
            <Button
              onClick={cameraActive ? stopCamera : startCamera}
              className={cameraActive ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-primary hover:opacity-90"}
            >
              {cameraActive ? (
                <>
                  <VideoOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          </div>
          
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Camera is off</p>
              </div>
            )}
          </div>

          {/* Detected Objects */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Detected Objects
              {isAnalyzing && (
                <span className="text-xs text-primary animate-pulse">Analyzing...</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {detectedObjects.length > 0 ? (
                detectedObjects.map((obj, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-sm"
                  >
                    {obj.name}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No objects detected</p>
              )}
            </div>
          </div>
        </Card>

        {/* Chat Panel */}
        <Card className="p-6 flex flex-col border-border/50 bg-card/95 backdrop-blur-sm animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Start a conversation! The AI can see what's in your camera.
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about what you see..."
              disabled={isSending}
              className="bg-muted/50 border-border/50"
            />
            <Button
              onClick={sendMessage}
              disabled={isSending || !inputMessage.trim()}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AppPage;
