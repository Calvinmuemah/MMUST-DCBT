import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../utils/api";
import { 
  Send, 
  User, 
  Bot, 
  ChevronLeft, 
  MoreVertical, 
  AlertCircle,
  ShieldAlert
} from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [session, setSession] = useState(null);
  
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get session info from navigation state
  const state = location.state || {};

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        if (state.sessionId) {
          setSession({ id: state.sessionId });
          // Load history
          const history = await getRequest(`/chat/${state.sessionId}`);
          setMessages(history.map(m => ({
            role: m.sender === 'ai' ? 'ai' : 'user',
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        } else {
          // Start new general session
          const res = await postRequest("/chat/session/start", { topic: "general" });
          setSession({ id: res.sessionId });
          setMessages([{
            role: "ai",
            text: res.message || "Hi, I’m your CBT support assistant. How are you feeling today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [state.sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !session || sending) return;

    const userText = input;
    const userMsg = { 
      role: "user", 
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await postRequest("/chat", {
        sessionId: session.id,
        message: userText
      });

      const aiMsg = { 
        role: "ai", 
        text: res.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emergency: res.emergency
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">

      {/* HEADER */}
      <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">CBT Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</p>
              </div>
            </div>
          </div>
        </div>

        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
          <MoreVertical size={20} className="text-slate-400" />
        </button>
      </div>

      {/* CHAT AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/30"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            } animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mb-1">
                  <Bot size={18} />
                </div>
              )}
              
              <div
                className={`px-6 py-4 rounded-[28px] text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : msg.emergency 
                      ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-none"
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                }`}
              >
                {msg.emergency && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-200/50">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Safety Alert</span>
                  </div>
                )}
                {msg.text}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-2 px-10 uppercase tracking-tighter">
              {msg.time}
            </p>
          </div>
        ))}

        {(loading || sending) && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto relative group">
          <input
            className="w-full pl-6 pr-16 py-5 bg-slate-50 border-2 border-slate-100 rounded-[30px] focus:bg-white focus:border-blue-600 outline-none font-medium text-slate-700 transition-all shadow-inner group-hover:border-slate-200"
            placeholder="Write your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading || sending}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || sending}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-slate-200 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-[0.2em]">
          End-to-end encrypted • Private Session
        </p>
      </div>
    </div>
  );
}
