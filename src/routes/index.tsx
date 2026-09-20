import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight, Bot, Building2, CalendarDays, Check, ChevronLeft, ChevronRight,
  CircleDollarSign, Globe2, Layers3, Menu, MessageSquareText, Mic2,
  Play, Send, Sparkles, Star, Workflow, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { BusinessHub } from "@/components/business-hub/business-hub";
import { HeroCore } from "@/components/hero-core";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Business Operating System | LIEN PHAT AI" },
      { name: "description", content: "Launch one connected AI operating system for CRM, voice, sales, marketing, websites, automation, and customer growth." },
      { property: "og:title", content: "Launch Your AI-Powered Business Operating System" },
      { property: "og:description", content: "Replace disconnected tools with one intelligent business ecosystem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type LeadIntent = "trial" | "strategy" | "website" | "growth" | "deploy" | "enterprise";

const intentLabels: Record<LeadIntent, { title: string; qualifier: string; options: string[] }> = {
  trial: { title: "Start your 30-day trial", qualifier: "What would you automate first?", options: ["Lead follow-up", "Appointments", "Customer communication", "Sales pipeline", "Not sure yet"] },
  strategy: { title: "Book an AI strategy call", qualifier: "What is your biggest growth bottleneck?", options: ["Missed leads", "Slow follow-up", "Too many tools", "Manual work", "Scaling operations"] },
  website: { title: "Build your website system", qualifier: "When would you like to launch?", options: ["Within 30 days", "1–3 months", "3–6 months", "Exploring options"] },
  growth: { title: "Build your growth system", qualifier: "What level of support do you need?", options: ["Full implementation", "Strategy + build", "Optimization", "Not sure yet"] },
  deploy: { title: "Deploy an AI employee", qualifier: "Which AI employee interests you most?", options: ["AI Voice Agent", "Appointment Setter", "Sales Assistant", "Customer Support", "Conversation AI"] },
  enterprise: { title: "Apply for enterprise", qualifier: "How many locations or teams do you support?", options: ["1–5", "6–20", "21–50", "51+"] },
};

function Index() {
  const [intent, setIntent] = useState<LeadIntent | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const openLead = (next: LeadIntent, source: string) => {
    track("cta_click", { intent: next, source });
    if (typeof window !== "undefined") sessionStorage.setItem("cta_source", source);
    setIntent(next);
  };
  useEffect(() => { track("page_view", { path: window.location.pathname }); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onOpen={openLead} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <Hero onOpen={openLead} />
        <ImpactStrip />
        <OneHub />
        <Framework />
        <AIEmployees onOpen={openLead} />
        <BusinessHub />
        <Automation />
        <Websites onOpen={openLead} />
        <Marketing onOpen={openLead} />
        <Transformation />
        <RoiCalculator onOpen={openLead} />
        <Pricing onOpen={openLead} />
        <Industries />
        <Proof />
        <Faq />
        <FinalCta onOpen={openLead} />
      </main>
      <Footer />
      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <Button variant="premium" size="lg" className="w-full shadow-2xl" onClick={() => openLead("trial", "mobile_sticky")}>Start 30-Day Trial <ArrowRight /></Button>
      </div>
      <LeadDialog intent={intent} onClose={() => setIntent(null)} />
    </div>
  );
}

function Header({ onOpen, mobileOpen, setMobileOpen }: { onOpen: (i: LeadIntent, s: string) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const links = [["System", "#system"], ["AI Employees", "#ai-employees"], ["Solutions", "#solutions"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
    <div className="bg-primary text-primary-foreground"><div className="section-shell flex min-h-11 items-center justify-between gap-4 py-2"><strong className="text-xs sm:text-sm">Take Your System To The Next Level</strong><button onClick={() => onOpen("trial", "announcement_bar")} className="min-h-8 rounded-md border border-primary-foreground/45 px-3 text-[10px] font-semibold transition-colors hover:bg-primary-foreground hover:text-primary">Start 30 Day Trial <span className="hidden sm:inline">· No Obligation. Cancel Anytime</span></button></div></div>
    <nav aria-label="Primary navigation" className="section-shell flex h-16 items-center justify-between">
      <a href="#top" className="flex items-center gap-2 text-sm font-bold"><span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-warm"><img src="/lienphat-icon-approved.webp" alt="" className="size-[86%] object-contain" /></span><span>LIEN PHAT <span className="text-primary">AI</span></span></a>
      <div className="hidden items-center gap-7 lg:flex">{links.map(([label, href]) => <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}</div>
      <div className="hidden md:block"><Button variant="premium" onClick={() => onOpen("strategy", "nav")}>Book AI Strategy Call <ArrowRight /></Button></div>
      <Button aria-label={mobileOpen ? "Close menu" : "Open menu"} variant="ghost" size="icon" className="min-h-11 min-w-11 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</Button>
    </nav>
    {mobileOpen && <div className="border-t border-border bg-background p-5 md:hidden"><div className="flex flex-col gap-1">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className="min-h-11 py-3 text-lg">{label}</a>)}</div></div>}
  </header>;
}

function SectionHeading({ eyebrow, title, copy, dark = true }: { eyebrow: string; title: string; copy?: string; dark?: boolean }) {
  return <div className="reveal max-w-4xl"><p className={dark ? "eyebrow text-cyan" : "eyebrow text-primary"}>{eyebrow}</p><h2 className="mt-5 text-balance text-4xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h2>{copy && <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${dark ? "text-muted-foreground" : "text-secondary-foreground/70"}`}>{copy}</p>}</div>;
}

function Hero({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) {
  return <section id="top" className="grain scan-grid relative min-h-[96svh] overflow-hidden border-b border-border pt-36 sm:pt-40">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_35%),linear-gradient(180deg,transparent_55%,color-mix(in_oklab,var(--accent)_12%,transparent))]" />
    <div className="section-shell relative grid min-h-[calc(96svh-10rem)] items-center gap-14 pb-16 lg:grid-cols-[1.08fr_.92fr]">
      <div className="max-w-4xl pt-8"><p className="eyebrow text-primary">AI Infrastructure for modern business</p><h1 className="mt-6 text-balance text-[clamp(3rem,7vw,7.5rem)] font-semibold leading-[.91]">Launch Your Own <span className="text-primary">AI-Powered</span> Business Operating System.</h1><p className="mt-7 max-w-2xl text-lg font-medium italic leading-relaxed text-muted-foreground">Replace 10+ tools with a fully automated CRM, AI employees, marketing automation, and funnels.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button variant="premium" size="lg" onClick={() => onOpen("trial", "hero_primary")}>Launch Your AI Business <ArrowRight /></Button><Button variant="luminous" size="lg" asChild><a href="#system" onClick={() => track("cta_click", { source: "hero_video" })}><Play /> Watch The System</a></Button></div><p className="mt-4 text-xs text-muted-foreground">Start your 30-day trial. No obligation. Cancel anytime.</p><p className="mt-12 font-mono text-xs uppercase tracking-[.16em] text-foreground/60">Your business. <span className="text-primary">Powered by AI.</span></p></div>
      <div className="flex w-full justify-center lg:-translate-y-10">
        <HeroCore />
      </div>
    </div>
  </section>;
}

function ImpactStrip() {
  const stats = [["1M+", "AI Voice Calls"], ["7M+", "Leads Generated"], ["2M+", "Appointments Won"], ["$2.5B", "Sales Facilitated"]];
  return <section className="bg-warm py-10 text-secondary-foreground sm:py-14"><div className="section-shell grid grid-cols-2 gap-px overflow-hidden border border-secondary-foreground/10 bg-secondary-foreground/10 lg:grid-cols-4">{stats.map(([value,label])=><div key={label} className="bg-warm px-4 py-7 text-center"><strong className="block text-3xl font-bold sm:text-5xl">{value}</strong><span className="mt-2 block text-[10px] font-bold uppercase text-accent">{label}</span></div>)}</div></section>;
}

function OneHub() {
  const apps = ["CRM", "SMS", "Email", "Funnels", "Calendar", "Reviews", "Payments", "Calls"];
  return <section id="system" className="relative overflow-hidden py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="System consolidation" title="STOP RUNNING YOUR BUSINESS THROUGH 15 DIFFERENT APPS." copy="One system. One login. One team helping you scale." /><div className="reveal relative mt-20 min-h-[520px] overflow-hidden border-y border-border bg-surface/40 p-5 sm:p-12"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{apps.map((x, i) => <div key={x} className="glass flex h-20 items-center justify-between rounded-md px-4 text-sm text-muted-foreground"><span className="font-mono text-[10px]">0{i+1}</span>{x}<span className="size-2 rounded-full bg-destructive/70" /></div>)}</div><div className="absolute inset-x-6 bottom-10 mx-auto max-w-3xl border border-primary/50 bg-background/95 p-6 shadow-[0_0_80px_color-mix(in_oklab,var(--primary)_25%,transparent)] sm:p-9"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="eyebrow text-cyan">Unified & synchronized</p><h3 className="mt-2 text-2xl font-medium sm:text-4xl">LIEN PHAT BUSINESS HUB</h3></div><div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px] text-muted-foreground"><span>1 LOGIN</span><span>1 SOURCE</span><span>1 SYSTEM</span></div></div></div></div></div></section>;
}

function Framework() {
  const stages = [
    ["CAPTURE", "Every opportunity enters one system.", ["Website", "Facebook", "Instagram", "Google", "Phone", "Forms"]],
    ["NURTURE", "AI responds while workflows move.", ["Instant reply", "SMS", "Email", "Qualification", "Follow-up"]],
    ["CLOSE", "Qualified prospects become appointments.", ["Pipeline", "Booking", "Sales tasks", "Notifications"]],
    ["RETAIN", "Relationships compound after the sale.", ["Reviews", "Campaigns", "Reactivation", "Support"]],
    ["SCALE", "Infrastructure grows without fragmentation.", ["Teams", "Locations", "Volume", "Visibility"]],
  ] as const;
  const [active, setActive] = useState(0);
  const currentStage = stages[active] ?? stages[0];
  return <section className="bg-warm py-28 text-secondary-foreground sm:py-40"><div className="section-shell"><SectionHeading dark={false} eyebrow="The growth loop" title="One operating system. Every stage of the customer journey."/><div className="mt-16 grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-2">{stages.map(([title, copy], i) => <button key={title} onClick={() => setActive(i)} className={`group min-h-11 w-full border-l-2 p-5 text-left transition-all ${active === i ? "border-primary bg-secondary-foreground" : "border-warm/15 bg-background hover:border-primary"}`}><span className="font-mono text-xs text-warm/85">0{i+1}</span><strong className="ml-5 text-xl text-warm">{title}</strong><span className="mt-2 block text-sm text-warm/80">{copy}</span></button>)}</div><div className="sticky top-24 h-fit min-h-[470px] overflow-hidden bg-secondary-foreground p-6 shadow-2xl sm:p-10"><div className="flex items-center justify-between border-b border-warm/15 pb-5"><span className="font-mono text-xs text-warm">LIVE JOURNEY / {currentStage[0]}</span><span className="size-2 animate-pulse rounded-full bg-primary"/></div><div className="mt-10 grid gap-4 sm:grid-cols-2">{currentStage[2].map((x, i) => <div key={x} className="flex min-h-24 items-center gap-4 border border-warm/10 bg-warm/5 p-4"><span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4"/></span><div><span className="font-mono text-[9px] text-primary">STEP {i+1}</span><p className="mt-1 font-medium text-warm">{x}</p></div></div>)}</div><div className="mt-8 h-1 overflow-hidden bg-warm/10"><div className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700" style={{ width: `${(active+1)*20}%` }}/></div></div></div></div></section>;
}

const employees = [
  { name: "AI Voice Agent", icon: Mic2, label: "VOICE / INBOUND", steps: ["Incoming Call", "AI Answering", "Lead Qualified", "Appointment Booked", "CRM Updated", "Team Notified"] },
  { name: "Conversation AI", icon: MessageSquareText, label: "CHAT / 24-7", steps: ["New website chat", "Intent detected", "Needs clarified", "Time selected", "Booking confirmed"] },
  { name: "AI Sales Assistant", icon: Zap, label: "SALES / PIPELINE", steps: ["Lead scored", "Follow-up sent", "Objection handled", "Opportunity advanced"] },
  { name: "AI Customer Support", icon: Bot, label: "SUPPORT / ALWAYS ON", steps: ["Question received", "Context reviewed", "Answer delivered", "Record updated"] },
  { name: "AI Appointment Setter", icon: CalendarDays, label: "BOOKING / AUTOMATED", steps: ["Interest detected", "Calendar checked", "Slot reserved", "Reminder queued"] },
];

function AIEmployees({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 410, behavior: "smooth" });
  return <section id="ai-employees" className="overflow-hidden py-28 sm:py-40"><div className="section-shell"><div className="flex items-end justify-between gap-6"><SectionHeading eyebrow="Digital workforce" title="Put AI To Work Inside Your Business."/><div className="hidden gap-2 sm:flex"><Button aria-label="Previous AI employee" variant="luminous" size="icon" onClick={() => scroll(-1)}><ChevronLeft/></Button><Button aria-label="Next AI employee" variant="luminous" size="icon" onClick={() => scroll(1)}><ChevronRight/></Button></div></div></div><div ref={ref} tabIndex={0} aria-label="AI employee product demos" className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2))] pb-7 [scrollbar-width:none]">{employees.map((item, idx) => <article key={item.name} className="glass min-w-[85vw] snap-center overflow-hidden rounded-lg p-5 sm:min-w-[390px] sm:p-7"><div className="flex items-center justify-between"><span className="eyebrow text-cyan">{item.label}</span><item.icon className="text-cyan"/></div><h3 className="mt-8 text-2xl font-medium">{item.name}</h3><div className="mt-8 space-y-2">{item.steps.map((step, i) => <div key={step} className="flex items-center gap-3 border border-border bg-background/70 p-3"><span className={`size-2 rounded-full ${i <= 2 ? "bg-cyan shadow-[0_0_12px_var(--cyan)]" : "bg-muted-foreground/30"}`}/><span className="flex-1 text-sm">{step}</span><span className="font-mono text-[9px] text-muted-foreground">{String(i+1).padStart(2,"0")}</span></div>)}</div><Button variant={idx === 0 ? "premium" : "luminous"} className="mt-7 w-full" onClick={() => onOpen("deploy", `ai_employee_${item.name}`)}>Deploy {item.name} <ArrowRight/></Button></article>)}</div></section>;
}

function Automation() {
  const nodes = ["Lead Captured", "AI Qualification", "SMS", "Email", "Calendar Booking", "CRM Update", "Reminder", "Sales Notification"];
  return <section className="py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="Intelligent orchestration" title="Your Business Should Work Even When You Aren’t Working."/><div className="reveal relative mt-16 overflow-hidden border-y border-border py-16"><div className="absolute left-10 right-10 top-1/2 hidden h-px bg-gradient-to-r from-primary via-accent to-primary lg:block"/><div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-8">{nodes.map((x,i)=><div key={x} className="glass group min-h-28 p-4"><span className="font-mono text-[9px] text-cyan">NODE {String(i+1).padStart(2,"0")}</span><p className="mt-5 text-sm font-medium">{x}</p><span className="mt-4 block h-px w-8 bg-primary transition-all group-hover:w-full"/></div>)}</div></div></div></section>;
}

function Websites({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) {
  return <section id="solutions" className="bg-warm py-28 text-secondary-foreground sm:py-40"><div className="section-shell grid items-center gap-16 lg:grid-cols-[.9fr_1.1fr]"><div><SectionHeading dark={false} eyebrow="Done-for-you web systems" title="Your Website Should Be More Than An Online Brochure." copy="It should capture, qualify, nurture and convert."/><Button variant="premium" size="lg" className="mt-9" onClick={() => onOpen("website", "website_section")}>Build My Website System <ArrowRight/></Button></div><div className="relative min-h-[530px]"><div className="absolute left-0 top-12 w-[84%] border border-secondary-foreground/15 bg-background p-3 text-foreground shadow-2xl"><div className="flex gap-1.5 border-b border-border pb-3"><i className="size-2 rounded-full bg-destructive"/><i className="size-2 rounded-full bg-accent"/><i className="size-2 rounded-full bg-cyan"/></div><div className="grid min-h-[350px] place-items-center bg-[radial-gradient(circle_at_60%_20%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent_35%)] p-8 text-center"><div><p className="eyebrow text-cyan">Conversion engine</p><p className="mt-5 text-4xl font-medium">Every visit becomes a journey.</p><span className="mt-7 inline-flex bg-primary px-5 py-3 text-sm">Book a consultation</span></div></div></div><div className="absolute bottom-0 right-0 w-52 border border-secondary-foreground/15 bg-warm p-5 shadow-xl"><p className="font-mono text-[9px] text-primary">CONNECTED SYSTEMS</p>{["CRM", "AI Chat", "Calendars", "Forms", "Funnels", "Automation"].map(x=><p key={x} className="mt-3 flex items-center justify-between border-b border-secondary-foreground/10 pb-2 text-xs">{x}<Check className="size-3 text-primary"/></p>)}</div></div></div></section>;
}

function Marketing({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) {
  const items = ["Social Media", "Email", "SMS", "Funnels", "Landing Pages", "Advertising", "Database Reactivation", "Reviews", "Campaigns", "AI Follow-Up"];
  return <section className="py-28 sm:py-40"><div className="section-shell"><div className="grid items-end gap-10 lg:grid-cols-2"><SectionHeading eyebrow="Growth infrastructure" title="Turn Marketing Into A System." copy="Premium done-for-you growth implementation, connected to the same customer intelligence layer."/><div className="lg:text-right"><Button variant="luminous" size="lg" onClick={() => onOpen("growth", "marketing_section")}>Explore Growth Implementation <ArrowRight/></Button></div></div><div className="reveal mt-16 grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-3 lg:grid-cols-5">{items.map((x,i)=><div key={x} className="group min-h-40 bg-background p-5 transition-colors hover:bg-surface-raised"><span className="font-mono text-[9px] text-muted-foreground">M/{String(i+1).padStart(2,"0")}</span><p className="mt-12 text-sm group-hover:text-cyan">{x}</p></div>)}</div></div></section>;
}

function Transformation() {
  const before = ["15 apps", "Missed calls", "Manual follow-up", "Scattered data", "Multiple vendors", "Lost leads", "Slow response", "No visibility"];
  const after = ["One ecosystem", "24/7 AI", "Automated follow-up", "Centralized CRM", "Connected communication", "Automated scheduling", "Pipeline visibility", "Scalable infrastructure"];
  return <section className="border-y border-border bg-surface py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="The transformation" title="From fragmented operations to compounding intelligence."/><div className="mt-16 grid gap-6 lg:grid-cols-2"><div className="border border-border bg-background p-6 sm:p-9"><p className="eyebrow text-destructive">Before LIEN PHAT AI</p><div className="mt-7 grid gap-2 sm:grid-cols-2">{before.map(x=><p key={x} className="flex min-h-12 items-center gap-3 border border-border p-3 text-sm text-muted-foreground"><X className="size-4 text-destructive"/>{x}</p>)}</div></div><div className="border border-primary/50 bg-background p-6 shadow-[var(--shadow-glow)] sm:p-9"><p className="eyebrow text-cyan">After LIEN PHAT AI</p><div className="mt-7 grid gap-2 sm:grid-cols-2">{after.map(x=><p key={x} className="flex min-h-12 items-center gap-3 border border-border p-3 text-sm"><Check className="size-4 text-cyan"/>{x}</p>)}</div></div></div></div></section>;
}

function RoiCalculator({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) {
  const [leads, setLeads] = useState(100); const [value, setValue] = useState(2500); const [close, setClose] = useState(20); const [lost, setLost] = useState(35);
  const calc = useMemo(() => { const opp = leads * lost / 100; const revenue = opp * close / 100 * value; return { opp, revenue }; }, [leads,value,close,lost]);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fields = [["Monthly leads",leads,setLeads,1,10000],["Average customer value",value,setValue,1,100000],["Current close rate (%)",close,setClose,0,100],["Leads currently lost (%)",lost,setLost,0,100]] as const;
  return <section className="py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="Opportunity model" title="What is slow follow-up costing you?" copy="Adjust the assumptions to estimate the opportunity inside your current lead flow."/><div className="reveal mt-16 grid overflow-hidden border border-border lg:grid-cols-2"><div className="bg-surface p-6 sm:p-10"><div className="space-y-6">{fields.map(([label,val,set,min,max])=><div key={label}><div className="mb-2 flex items-center justify-between"><Label htmlFor={label}>{label}</Label><span className="font-mono text-sm text-cyan">{label.includes("value") ? money.format(val) : val.toLocaleString()}</span></div><input id={label} type="range" min={min} max={max} step={label.includes("value")?100:1} value={val} onChange={e=>set(Number(e.target.value))} className="h-11 w-full accent-[var(--primary)]"/></div>)}</div></div><div className="flex flex-col justify-between bg-warm p-6 text-secondary-foreground sm:p-10"><div><p className="eyebrow text-primary">Estimated monthly opportunity</p><p className="mt-5 text-5xl font-medium sm:text-7xl">{money.format(calc.revenue)}</p><div className="mt-9 grid grid-cols-2 gap-5 border-t border-secondary-foreground/15 pt-6"><div><p className="text-xs text-secondary-foreground/60">Revenue currently at risk</p><p className="mt-2 text-2xl">{money.format(calc.revenue)}</p></div><div><p className="text-xs text-secondary-foreground/60">Recoverable opportunities</p><p className="mt-2 text-2xl">{Math.round(calc.opp)}</p></div></div></div><div><p className="mt-10 text-xs leading-relaxed text-secondary-foreground/55">Illustrative estimate only, based on your inputs. Results are not guaranteed and depend on execution, market conditions, and lead quality.</p><Button variant="premium" size="lg" className="mt-5 w-full" onClick={() => { track("calculator_completion", { leads, value, close, lost, estimated: calc.revenue }); onOpen("strategy", "roi_calculator"); }}>Review My Opportunity <ArrowRight/></Button></div></div></div></div></section>;
}

const plans: Array<{name:string;price:string;features:string[];cta:string;intent:LeadIntent;featured?:boolean}> = [
  { name:"LIEN PHAT BUSINESS HUB", price:"Starting at $97/month", features:["CRM","Automation","Communication","Scheduling","Funnels","Customer Management"], cta:"Start Trial", intent:"trial" },
  { name:"AI EMPLOYEE SYSTEM", price:"Starting at $197–$497/month", features:["AI Voice","Conversation AI","Lead Qualification","Appointment Booking","Automation"], cta:"Deploy AI", intent:"deploy", featured:true },
  { name:"AI WEBSITE LAUNCH", price:"Starting at approximately $1,500", features:["Professional Website","Domain Integration","CRM","Lead Capture","Calendars","Basic Automation","AI Chat"], cta:"Build My Website", intent:"website" },
  { name:"AI GROWTH IMPLEMENTATION", price:"Starting around $3,000", features:["Website","CRM","AI","Automation","Funnels","Marketing","Campaigns","Lead Nurture"], cta:"Build My Growth System", intent:"growth", featured:true },
  { name:"ENTERPRISE", price:"Custom pricing", features:["Advanced AI infrastructure","Multi-location systems","Custom workflows","Dedicated implementation"], cta:"Apply To Qualify", intent:"enterprise" },
];
function Pricing({ onOpen }: { onOpen: (i: LeadIntent, s: string) => void }) { return <section id="pricing" className="border-y border-border bg-surface py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="Choose your path" title="Software when you want control. Implementation when you want velocity."/><div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{plans.map((p,i)=><article key={p.name} className={`flex min-h-[450px] flex-col border p-6 sm:p-8 ${p.featured?"border-primary bg-background shadow-[var(--shadow-glow)]":"border-border bg-background"}`}><div className="flex items-center justify-between"><span className="eyebrow text-cyan">{i<2?"Software":"Done for you"}</span>{p.featured&&<Star className="size-4 text-cyan"/>}</div><h3 className="mt-7 text-xl font-medium">{p.name}</h3><p className="mt-3 text-sm text-muted-foreground">{p.price}</p><ul className="mt-8 flex-1 space-y-3">{p.features.map(x=><li key={x} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-cyan"/>{x}</li>)}</ul><Button variant={p.featured?"premium":"luminous"} size="lg" className="mt-8 w-full" onClick={()=>{track("pricing_cta_click",{plan:p.name});onOpen(p.intent,`pricing_${p.name}`)}}>{p.cta}<ArrowRight/></Button></article>)}</div><p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">Starting and approximate prices are planning guides, not final quotes. Actual pricing depends on scope, usage, integrations, implementation requirements, and ongoing support.</p></div></section>; }

function Industries() {
  const industries = ["Real Estate","Multifamily","Private Equity","Financial Services","Tax Advisory","Healthcare","Medical Practices","Dental","Home Services","HVAC","Roofing","Law Firms","Insurance","Consulting","Professional Services","Gyms","Restaurants","Local Businesses","Multi-location Companies"];
  const [active,setActive]=useState(industries[0]);
  return <section className="py-28 sm:py-40"><div className="section-shell"><SectionHeading eyebrow="Built around your operation" title="Infrastructure that adapts to the way your business moves."/><div className="mt-14 grid gap-6 lg:grid-cols-[1fr_.7fr]"><div className="flex flex-wrap gap-2">{industries.map(x=><button key={x} onClick={()=>setActive(x)} className={`min-h-11 border px-4 py-2 text-sm transition-colors ${active===x?"border-primary bg-primary text-primary-foreground":"border-border bg-surface text-muted-foreground hover:text-foreground"}`}>{x}</button>)}</div><div className="glass min-h-72 p-7"><Building2 className="text-cyan"/><p className="eyebrow mt-9 text-cyan">Selected industry</p><h3 className="mt-3 text-3xl">{active}</h3><p className="mt-5 text-sm leading-relaxed text-muted-foreground">Connect lead capture, rapid response, scheduling, customer communication, pipeline visibility, and automation around your operating model.</p><div className="mt-7 flex items-center gap-2 font-mono text-[10px] text-cyan"><span className="size-2 animate-pulse rounded-full bg-cyan"/> SYSTEM MODEL READY</div></div></div></div></section>;
}

function Proof() { return <section className="bg-warm py-28 text-secondary-foreground sm:py-40"><div className="section-shell"><SectionHeading dark={false} eyebrow="Proof, without fiction" title="Real outcomes belong here. Nothing invented." copy="This area is intentionally reserved for reviewed, permissioned customer evidence."/><div className="mt-14 grid gap-4 md:grid-cols-3">{["Verified case study coming here","Approved customer quote coming here","Validated implementation result coming here"].map((x,i)=><article key={x} className="border border-secondary-foreground/15 bg-background p-7 text-foreground"><span className="font-mono text-[9px] text-cyan">VERIFIED CONTENT ONLY / 0{i+1}</span><h3 className="mt-20 text-xl">{x}</h3><p className="mt-4 text-sm text-muted-foreground">Reserved for customer, challenge, implementation, measurable result, and verification date.</p></article>)}</div></div></section>; }

const faqs = [
  ["What does LIEN PHAT AI do?","We connect CRM, AI employees, communication, sales, marketing, websites, scheduling, payments, and workflows into one operating system."],
  ["What is an AI Voice Agent?","An AI Voice Agent can answer calls, handle routine conversations, qualify leads, book appointments, and update connected systems based on your approved workflow."],
  ["How does Conversation AI work?","It responds across supported messaging channels, gathers context, answers approved questions, qualifies opportunities, and moves conversations toward the next action."],
  ["Do you implement the system for us?","Yes. You can choose software access, focused implementation, or a broader done-for-you growth system."],
  ["Can it connect with our current tools?","Integration scope depends on your current systems and their available connections. We assess this before recommending an implementation."],
  ["Do you provide marketing services?","Yes. Growth implementation can include campaigns, funnels, database reactivation, follow-up systems, and connected marketing operations."],
  ["Can you build our website?","Yes. AI Website Launch combines a professional site with lead capture, CRM, calendars, automation, and optional AI chat."],
  ["Will AI replace our staff?","The goal is to automate repetitive work and support your team. The right operating model keeps people in control of consequential decisions."],
  ["How much does it cost?","Software starts at the prices shown above. Implementation is scoped around requirements, integrations, usage, and support."],
  ["Is training and support included?","Training and support are matched to the selected plan and implementation scope, and are confirmed before launch."],
];
function Faq() { return <section id="faq" className="py-28 sm:py-40"><div className="section-shell grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><SectionHeading eyebrow="Clarity before commitment" title="Questions, answered."/><Accordion type="single" collapsible className="border-t border-border">{faqs.map(([q,a],i)=><AccordionItem key={q} value={`faq-${i}`}><AccordionTrigger className="min-h-16 text-base hover:no-underline">{q}</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>; }

function FinalCta({ onOpen }: { onOpen:(i:LeadIntent,s:string)=>void }) { return <section className="grain scan-grid relative grid min-h-[90svh] place-items-center overflow-hidden border-y border-border py-24 text-center"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_38%)]"/><div className="section-shell relative"><p className="eyebrow text-cyan">The next operating model</p><h2 className="mx-auto mt-7 max-w-6xl text-balance text-5xl font-semibold leading-[.95] sm:text-7xl lg:text-9xl">Your Business Doesn’t Need More Apps. <span className="text-primary">It Needs A Better System.</span></h2><p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">Build the infrastructure that captures opportunities, automates repetitive work and prepares your company to scale.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="premium" size="lg" onClick={()=>onOpen("growth","final_primary")}>Build My AI Business <ArrowRight/></Button><Button variant="luminous" size="lg" onClick={()=>onOpen("trial","final_secondary")}>Start 30-Day Trial</Button></div></div></section>; }

function LeadDialog({ intent, onClose }: { intent: LeadIntent | null; onClose:()=>void }) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle"); const [started,setStarted]=useState(false); const current=intent?intentLabels[intent]:null;
  useEffect(()=>{if(intent){setStatus("idle");setStarted(false);track("form_open",{intent});}},[intent]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!intent)return;setStatus("loading");track("form_submit",{intent});const fd=new FormData(e.currentTarget);const params=new URLSearchParams(window.location.search);const {error}=await supabase.from("leads").insert({first_name:String(fd.get("first_name")),last_name:String(fd.get("last_name")),email:String(fd.get("email")),phone:String(fd.get("phone")),company:String(fd.get("company")),request_type:intent,qualification:String(fd.get("qualification")),consent:fd.get("consent")==="on",utm_source:params.get("utm_source"),utm_medium:params.get("utm_medium"),utm_campaign:params.get("utm_campaign"),utm_content:params.get("utm_content"),utm_term:params.get("utm_term"),referrer:document.referrer||null,cta_source:String(sessionStorage.getItem("cta_source")||intent),landing_page:window.location.href});if(error){setStatus("error");return;}setStatus("success");track("form_success",{intent});}
  return <Dialog open={Boolean(intent)} onOpenChange={v=>{if(!v)onClose()}}><DialogContent className="max-h-[92svh] overflow-y-auto border-border bg-surface p-6 sm:max-w-2xl sm:p-8">{status==="success"?<div className="py-12 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-primary"><Check/></span><DialogTitle className="mt-6 text-3xl">You’re on the way.</DialogTitle><DialogDescription className="mx-auto mt-3 max-w-md text-base">Your request has been received. The LIEN PHAT AI team can now review your goals and next best step.</DialogDescription><Button className="mt-7" variant="luminous" onClick={onClose}>Close</Button></div>:<><DialogHeader><p className="eyebrow text-cyan">Start the conversation</p><DialogTitle className="mt-2 text-2xl sm:text-3xl">{current?.title}</DialogTitle><DialogDescription>Tell us where you are now. We’ll use this to prepare the right next step.</DialogDescription></DialogHeader><form onSubmit={submit} onFocus={()=>{if(!started){setStarted(true);track("form_start",{intent})}}} className="mt-3 space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field id="first_name" label="First name"/><Field id="last_name" label="Last name"/><Field id="email" label="Work email" type="email"/><Field id="phone" label="Phone" type="tel"/><div className="sm:col-span-2"><Field id="company" label="Business / company"/></div><div className="sm:col-span-2"><Label htmlFor="qualification">{current?.qualifier}</Label><select id="qualification" name="qualification" required defaultValue="" className="mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="" disabled>Select one</option>{current?.options.map(x=><option key={x}>{x}</option>)}</select></div></div><div className="flex items-start gap-3"><Checkbox id="consent" name="consent" required className="mt-0.5"/><Label htmlFor="consent" className="text-xs font-normal leading-relaxed text-muted-foreground">I agree to be contacted about this request by phone, email, or text. Consent is not a condition of purchase. Message and data rates may apply. [Privacy and terms links to be added before launch.]</Label></div>{status==="error"&&<p role="alert" className="text-sm text-destructive">Your request could not be sent. Please review your information and try again.</p>}<Button type="submit" variant="premium" size="lg" className="w-full" disabled={status==="loading"}>{status==="loading"?"Sending securely…":"Submit Request"}<ArrowRight/></Button></form></>}</DialogContent></Dialog>;
}
function Field({id,label,type="text"}:{id:string;label:string;type?:string}) { const autoComplete = id === "first_name" ? "given-name" : id === "last_name" ? "family-name" : id === "company" ? "organization" : id; return <div><Label htmlFor={id}>{label}</Label><Input id={id} name={id} type={type} required maxLength={id==="email"?320:200} autoComplete={autoComplete} className="mt-2 min-h-11 bg-background text-base sm:text-sm"/></div>; }

function Footer(){return <footer className="pb-24 pt-14 md:pb-14"><div className="section-shell flex flex-col justify-between gap-8 border-t border-border pt-8 sm:flex-row"><div><p className="font-semibold">LIEN PHAT <span className="text-cyan">AI</span></p><p className="mt-2 max-w-sm text-xs text-muted-foreground">AI-powered business infrastructure for modern companies.</p></div><div className="text-xs text-muted-foreground"><p>© {new Date().getFullYear()} LIEN PHAT AI. All rights reserved.</p><p className="mt-2">Privacy • Terms • Accessibility</p></div></div></footer>}