import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Send, Loader2, FileText, BarChart3, PieChart,
  Table, Wand2, Code2, ArrowLeft, Play, Copy, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "@/hooks/use-toast";

const MANUAL_TEMPLATES = [
  { label: "Employee Training Summary", query: `supabase\n  .from('event_enrollments')\n  .select('employee_id, enrollment_status, completed_at, events(title, start_date)')` },
  { label: "Assessment Pass Rates", query: `supabase\n  .from('assessment_results')\n  .select('score, status, assessments(title, passing_score)')` },
  { label: "Department Headcount", query: `supabase\n  .from('departments')\n  .select('name, employee_count, is_active')\n  .eq('is_active', true)` },
  { label: "Program Budget Overview", query: `supabase\n  .from('events')\n  .select('title, budget_allocated, budget_spent, status')` },
];

const AI_SUGGESTED_PROMPTS = [
  "Show me training completion rates by department",
  "Which programs have the lowest attendance?",
  "Employee assessment performance over the last quarter",
  "Budget utilization across all training events",
  "Top 10 employees by completed trainings",
  "Content library usage breakdown",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ManualBuilder() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            Query Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MANUAL_TEMPLATES.map((t, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="justify-start h-auto py-2 text-left"
              onClick={() => setQuery(t.query)}
            >
              <Play className="h-3 w-3 mr-2 shrink-0" />
              {t.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            Supabase Query Editor
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Write a Supabase JS query using <code className="bg-muted px-1 rounded">.from().select()</code> syntax. Only SELECT queries are supported.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`supabase\n  .from('profiles')\n  .select('full_name, department, designation')\n  .eq('is_active', true)`}
            className="font-mono text-sm min-h-[200px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!query.trim()}
              className="gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Query"}
            </Button>
            <p className="text-xs text-muted-foreground ml-auto">
              Paste this query into your application code to generate the report
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Available Tables Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
            {[
              "profiles", "training_programs", "events", "event_enrollments",
              "assessments", "assessment_results", "departments", "locations",
              "trainers", "attendance", "content_items", "kirkpatrick_evaluations",
              "competencies"
            ].map((t) => (
              <Badge key={t} variant="secondary" className="justify-start font-mono">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/client-report-builder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: updatedMessages, mode: "ai" }),
        }
      );

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { upsertAssistant("⚠️ Rate limited. Please try again in a moment."); setIsLoading(false); return; }
        if (resp.status === 402) { upsertAssistant("⚠️ AI credits exhausted. Please add credits."); setIsLoading(false); return; }
        throw new Error("Failed to connect to AI");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      upsertAssistant(`❌ Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Suggested Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {AI_SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="w-full text-left text-sm p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors border border-transparent hover:border-border"
            >
              {prompt}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
              <Brain className="h-12 w-12 opacity-30" />
              <div>
                <p className="font-medium">Describe the report you need</p>
                <p className="text-sm">I'll generate the query, suggest visualizations, and recommend filters</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Badge variant="outline" className="flex items-center gap-1"><Table className="h-3 w-3" /> Tables</Badge>
                <Badge variant="outline" className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Charts</Badge>
                <Badge variant="outline" className="flex items-center gap-1"><PieChart className="h-3 w-3" /> Analytics</Badge>
                <Badge variant="outline" className="flex items-center gap-1"><FileText className="h-3 w-3" /> Reports</Badge>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the report you need..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function ReportBuilder() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/reports")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Report Builder
          </h1>
          <p className="text-muted-foreground">Build custom reports manually with queries or let AI generate them for you</p>
        </div>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai" className="gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            AI-Powered
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-1.5">
            <Code2 className="h-3.5 w-3.5" />
            Manual Query
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <AIBuilder />
        </TabsContent>

        <TabsContent value="manual">
          <ManualBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
