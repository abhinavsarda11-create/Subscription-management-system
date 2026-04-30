export const SEED_SUBSCRIPTIONS = [
  { id: 1,  name: "Netflix",         category: "Entertainment", cost: 649,  billing: "monthly", color: "#E50914", icon: "🎬", renewalDate: "2026-05-03", status: "active",  description: "Stream unlimited movies and TV shows" },
  { id: 2,  name: "Spotify",         category: "Music",         cost: 199,  billing: "monthly", color: "#1DB954", icon: "🎵", renewalDate: "2026-04-28", status: "active",  description: "Music streaming and podcasts" },
  { id: 3,  name: "Amazon Prime",    category: "Shopping",      cost: 299,  billing: "monthly", color: "#FF9900", icon: "📦", renewalDate: "2026-05-15", status: "active",  description: "Fast shipping + Prime Video" },
  { id: 4,  name: "Adobe CC",        category: "Productivity",  cost: 4999, billing: "monthly", color: "#FF0000", icon: "🎨", renewalDate: "2026-05-01", status: "active",  description: "Creative Cloud — Photoshop, Illustrator & more" },
  { id: 5,  name: "YouTube Premium", category: "Entertainment", cost: 189,  billing: "monthly", color: "#FF0000", icon: "▶️",  renewalDate: "2026-04-30", status: "active",  description: "Ad-free YouTube + YouTube Music" },
  { id: 6,  name: "Notion",          category: "Productivity",  cost: 800,  billing: "monthly", color: "#a78bfa", icon: "📝", renewalDate: "2026-06-10", status: "paused",  description: "All-in-one workspace for notes and docs" },
  { id: 7,  name: "Hotstar",         category: "Entertainment", cost: 299,  billing: "monthly", color: "#1f80e0", icon: "📺", renewalDate: "2026-05-20", status: "active",  description: "Disney+ Hotstar — sports, shows, movies" },
  { id: 8,  name: "GitHub Pro",      category: "Development",   cost: 750,  billing: "monthly", color: "#6e40c9", icon: "💻", renewalDate: "2026-07-01", status: "active",  description: "Advanced GitHub features for developers" },
  { id: 9,  name: "Figma",           category: "Design",        cost: 1200, billing: "monthly", color: "#F24E1E", icon: "🖌️", renewalDate: "2026-05-08", status: "active",  description: "Collaborative interface design tool" },
  { id: 10, name: "Duolingo Plus",   category: "Education",     cost: 350,  billing: "monthly", color: "#58CC02", icon: "🦉", renewalDate: "2026-05-25", status: "active",  description: "Ad-free language learning" },
];

export const CATEGORIES = [
  { id: "all",           label: "All",           icon: "⚡", color: "#6366f1" },
  { id: "Entertainment", label: "Entertainment", icon: "🎭", color: "#a78bfa" },
  { id: "Music",         label: "Music",         icon: "🎵", color: "#34d399" },
  { id: "Shopping",      label: "Shopping",      icon: "🛍️", color: "#fb923c" },
  { id: "Productivity",  label: "Productivity",  icon: "⚡", color: "#60a5fa" },
  { id: "Development",   label: "Development",   icon: "💻", color: "#f472b6" },
  { id: "Design",        label: "Design",        icon: "🎨", color: "#fbbf24" },
  { id: "Education",     label: "Education",     icon: "📚", color: "#4ade80" },
  { id: "Health",        label: "Health",        icon: "💊", color: "#f87171" },
  { id: "Finance",       label: "Finance",       icon: "💰", color: "#fb923c" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

export const CURRENCY_API_URL = "https://api.exchangerate-api.com/v4/latest/INR";
