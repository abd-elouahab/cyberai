import React, { useState, useEffect, useRef } from "react";
import {
  Mountain,
  MapPin,
  Search,
  Users,
  Calendar,
  ChevronLeft,
  Star,
  ArrowRight,
  Plus,
  Trash2,
  X,
  Menu,
  Coffee,
  Check,
  MessageCircle,
  Send,
  Map,
  DollarSign,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "fr" | "ar";

interface Listing {
  id: number;
  title: string;
  title_fr?: string;
  title_ar?: string;
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
  location: string;
  region: string;
  activity: string;
  price: number;
  rating: number;
  badge: string;
  tag: string;
  image_url: string;
  host_name?: string;
  capacity?: number;
  amenities?: string[];
}

interface Story {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  avatar: string;
  region: string;
}

interface Booking {
  listing_title: string;
  listing_location: string;
  check_in: string;
  check_out: string;
  guests: number;
  total: number;
}

interface ChatMessage {
  role: "tourist" | "system";
  text: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

interface Itinerary {
  title: string;
  region: string;
  days: ItineraryDay[];
  essentials: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTitle(listing: Listing, lang: Lang): string {
  if (lang === "fr" && listing.title_fr) return listing.title_fr;
  if (lang === "ar" && listing.title_ar) return listing.title_ar;
  return listing.title;
}

function getDescription(listing: Listing, lang: Lang): string {
  if (lang === "fr" && listing.description_fr) return listing.description_fr;
  if (lang === "ar" && listing.description_ar) return listing.description_ar;
  return listing.description_en || "";
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}>
    {children}
  </span>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = ({
  activePage,
  onNav,
  lang,
  onLang,
}: {
  activePage: string;
  onNav: (p: string) => void;
  lang: Lang;
  onLang: (l: Lang) => void;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Stays" },
    { id: "stories", label: "Stories" },
    { id: "experiences", label: "Experiences" },
    { id: "planner", label: "Plan Trip" },
  ];

  const handleNav = (id: string) => {
    onNav(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink">
      <div className="h-16 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav("home")}>
          <Mountain className="w-6 h-6 text-sand" />
          <span className="font-serif text-xl font-bold text-sand tracking-wide">Atlas Connect</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all pb-1 border-b-2 ${
                activePage === item.id ? "text-gold border-gold" : "text-sand/50 border-transparent hover:text-sand"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex items-center gap-1 ml-2 bg-white/10 rounded-lg p-0.5">
            {(["en", "fr", "ar"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => onLang(l)}
                className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md transition-all ${
                  lang === l ? "bg-clay text-white" : "text-sand/60 hover:text-sand"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>
        <button
          className="md:hidden text-sand p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink border-t border-sand/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activePage === item.id
                      ? "bg-clay text-white"
                      : "text-sand/70 hover:text-sand hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-sand/40 mr-1">Lang:</span>
                {(["en", "fr", "ar"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onLang(l)}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                      lang === l ? "bg-clay text-white" : "text-sand/60 border border-sand/20 hover:text-sand"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = ({
  title,
  sub,
  eyebrow,
  count,
  label,
}: {
  title: React.ReactNode;
  sub: string;
  eyebrow: string;
  count: number;
  label: string;
}) => (
  <section className="relative bg-ink overflow-hidden pt-32 pb-16 mb-12 w-full">
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C17B4A' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
    <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-clay mb-4 block">✦ {eyebrow}</span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-sand leading-[1.1] mb-6">{title}</h1>
        <p className="text-sand/70 text-lg font-light leading-relaxed mb-8">{sub}</p>
        <div className="inline-flex items-center gap-2 bg-clay/20 border border-clay/30 px-4 py-1.5 rounded-full">
          <span className="text-clay text-xs font-bold leading-none">
            ✦ {count} {label} available
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── ListingCard ──────────────────────────────────────────────────────────────

const ListingCard = ({
  listing,
  lang,
  onShowDetail,
  onDelete,
}: {
  listing: Listing;
  lang: Lang;
  onShowDetail: (l: Listing) => void;
  onDelete: (id: number) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="group bg-white rounded-3xl overflow-hidden border border-clay/10 shadow-sm hover:shadow-xl transition-all duration-500"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={listing.image_url || "https://placehold.co/600x400/2C1A0E/F5EDD8?text=Atlas"}
        alt={getTitle(listing, lang)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      <div className="absolute top-4 right-4 bg-rust text-white px-3 py-1.5 rounded-xl text-lg font-bold shadow-lg">
        ${listing.price ?? 0} <span className="text-[10px] font-normal opacity-80">/night</span>
      </div>
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-ink">
        {listing.badge || "Local Host"}
      </div>
    </div>
    <div className="p-6">
      <h3 className={`font-serif text-2xl font-bold text-ink mb-1 ${lang === "ar" ? "text-right" : ""}`}>
        {getTitle(listing, lang)}
      </h3>
      <div className="flex items-center gap-1.5 text-smoke text-sm mb-4">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        {listing.location}
      </div>
      <div className="pt-4 border-t border-clay/10 flex items-center justify-between">
        <span className="bg-fog text-smoke px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          {listing.tag || "authentic"}
        </span>
        <div className="flex items-center gap-1 text-clay font-bold">
          <Star className="w-4 h-4 fill-clay" />
          {(listing.rating ?? 4.5).toFixed(1)}
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onShowDetail(listing)}
          className="flex-1 bg-fog hover:bg-clay hover:text-white text-ink text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all"
        >
          View Details
        </button>
        <button
          onClick={() => onDelete(listing.id)}
          className="px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

// ─── Chat Widget ──────────────────────────────────────────────────────────────

const ChatWidget = ({ listing }: { listing: Listing }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "tourist", text }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, listingId: listing.id }),
      });
      const data = await res.json();
      const reply = data.translation
        ? `${data.translation}\n\n— ${data.note}`
        : data.note || "Message sent to host.";
      setMessages((m) => [...m, { role: "system", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "system", text: "Could not send message. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mt-8 border-t border-clay/10 pt-6">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-clay mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" /> Message the Host
      </h4>
      <div className="bg-fog/50 rounded-2xl p-4 h-48 overflow-y-auto mb-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-smoke text-xs text-center mt-12">
            Ask the host a question — it'll be translated to Darija automatically.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "tourist" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === "tourist"
                  ? "bg-clay text-white rounded-br-sm"
                  : "bg-white border border-clay/10 text-smoke rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about breakfast, directions, availability…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none transition-all"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="px-4 bg-clay hover:bg-rust disabled:opacity-40 text-white rounded-xl transition-all"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ─── DetailView ───────────────────────────────────────────────────────────────

const DetailView = ({
  listing,
  lang,
  onClose,
  onBook,
}: {
  listing: Listing;
  lang: Lang;
  onClose: () => void;
  onBook: (b: any) => void;
}) => {
  const [bookingDone, setBookingDone] = useState(false);
  const [activeTab, setActiveTab] = useState<"book" | "chat">("book");
  const [formData, setFormData] = useState({
    guest_name: "",
    email: "",
    phone: "",
    guests: 2,
    check_in: new Date().toISOString().split("T")[0],
    check_out: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  });

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(formData.check_out).getTime() - new Date(formData.check_in).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const subtotal = nights * (listing.price ?? 0);
  const fee = Math.floor(subtotal * 0.12);
  const total = subtotal + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest_name || !formData.email) return;
    onBook({ ...formData, listing_title: listing.title, listing_location: listing.location, total, nights });
    setBookingDone(true);
  };

  const description = getDescription(listing, lang);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-6xl max-h-full overflow-y-auto rounded-[32px] shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-ink backdrop-blur-md px-4 py-2 rounded-full shadow-md transition-all border border-clay/20 group"
        >
          <ChevronLeft className="w-4 h-4 text-clay group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
        </button>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-ink/30 hover:bg-ink/50 text-white backdrop-blur-md p-2 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left panel — details */}
          <div className="flex-1 p-6 lg:p-12">
            <div className="rounded-[24px] overflow-hidden h-72 lg:h-[400px] mb-8 relative">
              <img
                src={listing.image_url || "https://placehold.co/600x400/2C1A0E/F5EDD8?text=Atlas"}
                alt={getTitle(listing, lang)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <h2
                  className={`font-serif text-4xl lg:text-5xl font-bold text-sand mb-2 ${lang === "ar" ? "text-right" : ""}`}
                >
                  {getTitle(listing, lang)}
                </h2>
                <p className="text-sand/80 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {listing.location}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <div className="bg-clay/10 text-clay border border-clay/20 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-clay" /> {(listing.rating ?? 4.5).toFixed(1)} rating
              </div>
              <div className="bg-fog text-smoke border border-clay/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {listing.badge || "Local Host"}
              </div>
              <div className="bg-fog text-smoke border border-clay/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {listing.activity}
              </div>
              {listing.host_name && (
                <div className="bg-fog text-smoke border border-clay/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Host: {listing.host_name}
                </div>
              )}
            </div>

            <div className="space-y-10">
              <section>
                <h3 className="font-serif text-2xl font-bold text-ink mb-4">About this experience</h3>
                <p className={`text-smoke leading-relaxed ${lang === "ar" ? "text-right" : ""}`}>
                  {description ||
                    `Immerse yourself in the living heritage of Morocco at ${listing.title}. Nestled in ${listing.location}, this is an invitation to slow down, learn a craft, share a meal, and connect with the people who have preserved these traditions for generations.`}
                </p>
              </section>

              <section>
                <h3 className="font-serif text-2xl font-bold text-ink mb-6">What's included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(listing.amenities?.length
                    ? listing.amenities
                    : [
                        "Traditional mint tea on arrival",
                        "Handwoven linens & blankets",
                        "Guided mountain walk option",
                        "Locally-sourced breakfast",
                        "Wi-Fi & private bathroom",
                        "Cultural activity session",
                      ]
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-fog px-4 py-3 rounded-2xl text-sm text-smoke">
                      <Coffee className="w-4 h-4 text-clay shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right panel — book / chat tabs */}
          <div className="lg:w-[420px] bg-white lg:border-l border-clay/10 p-6 lg:p-10">
            {bookingDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center"
              >
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-green-900 mb-2">Réservation confirmée !</h3>
                <p className="text-green-800 text-sm mb-6">
                  Booking confirmed. We've sent the details to your email. Get ready for an unforgettable journey.
                </p>
                <div className="text-left space-y-2 text-sm text-green-900 bg-white/50 p-4 rounded-2xl">
                  <div className="flex justify-between">
                    <span>Check-in</span> <span className="font-bold">{formData.check_in}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights</span> <span className="font-bold">{nights}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                    <span>Total Paid</span> <span className="font-bold">${total}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[11px]"
                >
                  Wonderful
                </button>
                <ChatWidget listing={listing} />
              </motion.div>
            ) : (
              <div className="sticky top-10">
                {/* Tab switcher */}
                <div className="flex gap-2 mb-6 bg-fog rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("book")}
                    className={`flex-1 text-[11px] font-bold uppercase tracking-widest py-2 rounded-lg transition-all ${
                      activeTab === "book" ? "bg-white shadow text-ink" : "text-smoke"
                    }`}
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`flex-1 text-[11px] font-bold uppercase tracking-widest py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "chat" ? "bg-white shadow text-ink" : "text-smoke"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Ask Host
                  </button>
                </div>

                {activeTab === "book" ? (
                  <>
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-clay block mb-1">
                        Price per night
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-4xl font-bold text-rust">${listing.price ?? 0}</span>
                        <span className="text-smoke">/ night</span>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-smoke block">Your stay</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={formData.check_in}
                            onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                            className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                          />
                          <input
                            type="date"
                            value={formData.check_out}
                            onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                            className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-smoke block">Guests</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                          className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div className="bg-fog rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-smoke">
                          <span>${listing.price ?? 0} × {nights} nights</span>
                          <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-smoke">
                          <span>Service fee (12%)</span>
                          <span>${fee}</span>
                        </div>
                        <div className="flex justify-between border-t border-clay/20 pt-2 mt-2 font-bold text-ink">
                          <span>Total</span>
                          <span>${total}</span>
                        </div>
                      </div>
                      <div className="pt-4 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-smoke block">Guest details</label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.guest_name}
                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                            className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Phone (optional)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2 text-sm outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-clay hover:bg-rust text-white font-bold uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg transition-all"
                        >
                          ✦ Confirm Reservation
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <ChatWidget listing={listing} />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Trip Planner Page ────────────────────────────────────────────────────────

const PlannerPage = ({ regions }: { regions: string[] }) => {
  const [form, setForm] = useState({ region: "High Atlas", days: "3", interests: "all" });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState("");

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary(null);
    try {
      const res = await fetch("/api/trip-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: form.region, days: parseInt(form.days), interests: form.interests }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setItinerary(data);
    } catch {
      setError("Could not generate itinerary. Make sure GEMINI_API_KEY is set in .env and restart the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero
        eyebrow="AI Trip Planner"
        title={<>Your Perfect <span className="italic text-clay">Atlas</span><br />Journey</>}
        sub="Tell us your region, duration, and interests — our AI builds your personalised Moroccan itinerary in seconds."
        count={0}
        label="days crafted"
      />
      <div className="px-6 lg:px-12 max-w-3xl mx-auto">
        <form onSubmit={generate} className="bg-fog/40 border border-clay/10 rounded-[32px] p-8 mb-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-clay block">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {["High Atlas", "Ourika Valley", "Sahara Edge", ...regions.filter(r => !["High Atlas","Ourika Valley","Sahara Edge"].includes(r))].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-clay block">Days</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-clay block">Interests</label>
              <select
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                className="w-full bg-white border-2 border-clay/20 focus:border-clay rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                <option value="all">All experiences</option>
                <option value="hiking and trekking">Hiking & Trekking</option>
                <option value="cooking and food">Cooking & Food</option>
                <option value="culture and crafts">Culture & Crafts</option>
                <option value="photography and nature">Photography & Nature</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clay hover:bg-rust disabled:opacity-50 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Crafting your journey…</>
            ) : (
              <><Map className="w-4 h-4" /> ✦ Generate Itinerary</>
            )}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <AnimatePresence>
          {itinerary && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif text-3xl font-bold text-ink mb-2">{itinerary.title}</h2>
              <p className="text-smoke text-sm mb-8 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-clay" /> {itinerary.region}
              </p>
              <div className="space-y-6 mb-10">
                {itinerary.days?.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: day.day * 0.08 }}
                    className="bg-white border border-clay/10 rounded-[24px] p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-clay text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {day.day}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-ink">{day.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {[
                        { label: "Morning", text: day.morning },
                        { label: "Afternoon", text: day.afternoon },
                        { label: "Evening", text: day.evening },
                      ].map(({ label, text }) => (
                        <div key={label} className="bg-fog/50 rounded-2xl p-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-clay block mb-2">{label}</span>
                          <p className="text-smoke text-sm leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-clay/10 border border-clay/20 rounded-xl px-4 py-2 text-sm text-clay flex items-start gap-2">
                      <span className="font-bold shrink-0">💡 Tip:</span> {day.tip}
                    </div>
                  </motion.div>
                ))}
              </div>
              {itinerary.essentials?.length > 0 && (
                <div className="bg-ink text-sand rounded-[24px] p-8">
                  <h3 className="font-serif text-xl font-bold mb-4">What to Pack</h3>
                  <ul className="space-y-2">
                    {itinerary.essentials.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sand/80 text-sm">
                        <Check className="w-4 h-4 text-clay mt-0.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [lang, setLang] = useState<Lang>("en");
  const [listings, setListings] = useState<Listing[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [showStoryForm, setShowStoryForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: "", content: "", author: "", region: "High Atlas" });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedRegion, selectedActivity, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({ region: selectedRegion, activity: selectedActivity });
    try {
      const [listRes, regRes, actRes, storyRes] = await Promise.all([
        fetch(`/api/listings?${params}`),
        fetch("/api/regions"),
        fetch("/api/activities"),
        fetch("/api/stories"),
      ]);
      const [list, regs, acts, storyList] = await Promise.all([
        listRes.json(),
        regRes.json(),
        actRes.json(),
        storyRes.json(),
      ]);
      setListings(list);
      setRegions(regs);
      setActivities(acts);
      setStories(storyList);
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setLoading(false);
    }
  };

  const submitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newStory, avatar: `https://i.pravatar.cc/150?u=${newStory.author}` }),
    });
    if (res.ok) {
      setNewStory({ title: "", content: "", author: "", region: "High Atlas" });
      setShowStoryForm(false);
      fetchData();
    }
  };

  const deleteListing = async (id: number) => {
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addBooking = async (booking: any) => {
    setBookings((prev) => [...prev, booking]);
    await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
  };

  // ── Earnings summary computed from booking history ──
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const revenueByListing = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.listing_title] = (acc[b.listing_title] || 0) + b.total;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white font-sans text-ink selection:bg-clay selection:text-white">
      <Navbar activePage={currentPage} onNav={setCurrentPage} lang={lang} onLang={setLang} />

      <main className="pb-32">
        {/* ── Home ── */}
        {currentPage === "home" && (
          <>
            <Hero
              eyebrow="Authentic Morocco"
              title={<>Explore <span className="italic text-clay">Authentic</span><br />Atlas Stays</>}
              sub="Discover real experiences from villages across the Atlas Mountains — created by local hosts, for curious souls."
              count={listings.length}
              label="heritage stays"
            />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12">
              <aside className="lg:w-64 space-y-12">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay mb-6">Filter by Region</h4>
                  <div className="space-y-1">
                    {["All", ...regions].map((reg) => (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`block w-full text-left px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          selectedRegion === reg ? "bg-clay text-white shadow-md" : "text-smoke hover:bg-fog"
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent bookings */}
                {bookings.length > 0 && (
                  <div className="pt-12 border-t border-clay/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay mb-6">Recent Bookings</h4>
                    <div className="space-y-3">
                      {bookings.slice(-3).reverse().map((b, i) => (
                        <div key={i} className="bg-fog p-4 rounded-2xl text-[10px] space-y-1.5">
                          <div className="flex justify-between font-bold">
                            <span className="text-ink truncate pr-2">{b.listing_title}</span>
                            <span className="text-rust shrink-0">${b.total}</span>
                          </div>
                          <div className="flex items-center gap-1 text-smoke">
                            <Calendar className="w-3 h-3" /> {b.check_in}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Host earnings dashboard */}
                {bookings.length > 0 && (
                  <div className="pt-8 border-t border-clay/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay mb-6 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> Revenue Summary
                    </h4>
                    <div className="bg-ink text-sand rounded-2xl p-4 mb-4">
                      <p className="text-[9px] uppercase tracking-widest text-sand/50 mb-1">Total Earned</p>
                      <p className="font-serif text-2xl font-bold">${totalRevenue}</p>
                      <p className="text-[10px] text-sand/50 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(revenueByListing).map(([title, amount]) => (
                        <div key={title} className="flex justify-between text-[10px] text-smoke bg-fog/50 px-3 py-2 rounded-xl">
                          <span className="truncate pr-2">{title}</span>
                          <span className="font-bold text-ink shrink-0">${amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-clay animate-spin" />
                  </div>
                ) : listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        lang={lang}
                        onShowDetail={(l) => setSelectedListing(l)}
                        onDelete={deleteListing}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-fog/30 rounded-[40px] border border-dashed border-clay/20">
                    <Search className="w-12 h-12 text-clay opacity-20 mx-auto mb-4" />
                    <h3 className="font-serif text-2xl font-bold text-clay mb-2">No stays found</h3>
                    <p className="text-smoke text-sm">Try different filters to find heritage experiences.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Stories ── */}
        {currentPage === "stories" && (
          <>
            <Hero
              eyebrow="Atlas Community"
              title={<>Village <span className="italic text-clay">Voices</span><br />& Family Tales</>}
              sub="A community archive of travelers and families sharing their soul-stirring moments in the High Atlas."
              count={stories.length}
              label="shared stories"
            />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-ink">Community Feed</h2>
                <button
                  onClick={() => setShowStoryForm(true)}
                  className="bg-ink text-sand text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-clay transition-all"
                >
                  <Plus className="w-4 h-4" /> Share Your Story
                </button>
              </div>
              <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
                {stories.map((story) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={story.id}
                    className="break-inside-avoid bg-fog/30 border border-clay/10 p-8 rounded-[32px] hover:bg-white hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={story.avatar}
                        alt={story.author}
                        className="w-12 h-12 rounded-full border-2 border-clay/20"
                      />
                      <div>
                        <h4 className="font-bold text-ink text-sm">{story.author}</h4>
                        <span className="text-[10px] text-smoke uppercase tracking-wider">{story.date}</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-ink mb-3 group-hover:text-clay transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-smoke text-sm leading-relaxed mb-6 italic">"{story.content}"</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-clay" />
                      <span className="text-[10px] font-bold text-clay uppercase tracking-widest">{story.region}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {showStoryForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white w-full max-w-lg p-10 rounded-[40px] relative shadow-2xl"
                  >
                    <button onClick={() => setShowStoryForm(false)} className="absolute top-6 right-6 text-smoke hover:text-ink">
                      <X className="w-6 h-6" />
                    </button>
                    <h2 className="font-serif text-3xl font-bold text-ink mb-2">Write a Story</h2>
                    <p className="text-smoke text-sm mb-8">Share a family memory or a personal discovery.</p>
                    <form onSubmit={submitStory} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Story Title"
                        required
                        className="w-full bg-fog/50 border-2 border-transparent focus:border-clay/30 rounded-2xl px-4 py-3 outline-none"
                        value={newStory.title}
                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Your Family / Name"
                        required
                        className="w-full bg-fog/50 border-2 border-transparent focus:border-clay/30 rounded-2xl px-4 py-3 outline-none"
                        value={newStory.author}
                        onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                      />
                      <textarea
                        placeholder="What happened? Keep it soulful..."
                        required
                        rows={4}
                        className="w-full bg-fog/50 border-2 border-transparent focus:border-clay/30 rounded-2xl px-4 py-3 outline-none resize-none"
                        value={newStory.content}
                        onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                      />
                      <button
                        type="submit"
                        className="w-full bg-clay text-white font-bold uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg hover:bg-rust transition-all"
                      >
                        ✦ Publish to Community
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ── Experiences ── */}
        {currentPage === "experiences" && (
          <>
            <Hero
              eyebrow="Cultural Immersion"
              title={<>Handcrafted <span className="italic text-clay">Soul</span><br />& Workshops</>}
              sub="Beyond just a stay — participate in ancient crafts, cooking, and trekking led by true masters."
              count={listings.length}
              label="workshops & activities"
            />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12">
              <aside className="lg:w-64 space-y-12">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay mb-6">Experience Type</h4>
                  <div className="space-y-1">
                    {["All", ...activities].map((act) => (
                      <button
                        key={act}
                        onClick={() => setSelectedActivity(act)}
                        className={`block w-full text-left px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          selectedActivity === act ? "bg-clay text-white shadow-md" : "text-smoke hover:bg-fog"
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {listings.map((exp) => (
                    <motion.div
                      layout
                      key={exp.id}
                      className="group bg-white rounded-[32px] overflow-hidden border border-clay/10 flex hover:shadow-xl transition-all duration-500"
                    >
                      <div className="w-1/3 h-full min-h-[240px] overflow-hidden">
                        <img
                          src={exp.image_url || "https://placehold.co/600x400/2C1A0E/F5EDD8?text=Atlas"}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                          alt={getTitle(exp, lang)}
                        />
                      </div>
                      <div className="flex-1 p-8 flex flex-col justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-clay mb-2">{exp.activity}</span>
                        <h3 className={`font-serif text-2xl font-bold text-ink mb-2 ${lang === "ar" ? "text-right" : ""}`}>
                          {getTitle(exp, lang)}
                        </h3>
                        <p className="text-smoke text-sm mb-6 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {exp.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rust">
                            ${exp.price ?? 0} <span className="text-[10px] font-normal text-smoke">/pp</span>
                          </span>
                          <button
                            onClick={() => setSelectedListing(exp)}
                            className="bg-ink text-sand text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-clay transition-all"
                          >
                            Explore
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── AI Trip Planner ── */}
        {currentPage === "planner" && <PlannerPage regions={regions} />}
      </main>

      <footer className="bg-ink w-full py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Mountain className="w-8 h-8 text-sand" />
          <span className="font-serif text-3xl font-bold text-sand tracking-wide">Atlas Connect</span>
        </div>
        <p className="text-sand/40 max-w-md mx-auto text-sm leading-relaxed mb-12">
          Preserving heritage through sustainable exploration.
          <br />
          Every journey supports a local artisan community.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {["The Mission", "Sustainable Travel", "Local Impact", "Contact"].map((item) => (
            <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-sand/60 hover:text-sand transition-colors">
              {item}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-sand/20 uppercase tracking-[0.2em]">© 2026 ATLAS CONNECT · ALL RIGHTS RESERVED</p>
      </footer>

      <AnimatePresence>
        {selectedListing && (
          <DetailView
            listing={selectedListing}
            lang={lang}
            onClose={() => setSelectedListing(null)}
            onBook={addBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
