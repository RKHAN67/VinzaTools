export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
}

export const CATEGORIES = ["Innovation", "Architecture", "Philosophy", "Economics", "Art"];

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "The Architecture of Silence: Designing for Deep Focus",
    excerpt: "In a world that never stops talking, silence has become the ultimate luxury. We explore how physical and digital spaces are being redesigned to reclaim our attention.",
    content: `
      <p>Silence is no longer just the absence of noise; it is a deliberate architectural choice. In the modern era, where every square inch of our sensory experience is contested by notifications and advertisements, the spaces that offer true quiet are becoming the most valuable.</p>
      
      <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200" alt="Minimalist Space" />

      <h2>The Psychological Cost of Noise</h2>
      <p>Chronic exposure to low-level environmental noise isn't just annoying—it's physiologically damaging. Studies have shown that constant auditory stimulation keeps our cortisol levels elevated, preventing the brain from entering the 'default mode network' where creative synthesis happens.</p>
      
      <blockquote>"The quieter you become, the more you are able to hear." — Rumi</blockquote>
      
      <h2>Designing for the Human Scale</h2>
      <p>Modern architecture is shifting away from the open-plan chaos of the 2010s. We are seeing a return to 'cellular' design—spaces that provide acoustic isolation while maintaining visual connection. This is the 'Quiet Revolution' in workspace design.</p>
      
      <p>But it's not just about walls. Digital architecture is following suit. Apps are being designed with 'Zen Modes', and operating systems are prioritizing 'Focus Filters'. We are finally building tools that respect the finite nature of human attention.</p>
    `,
    author: "Julian Thorne",
    authorRole: "Architectural Critic",
    date: "March 22, 2026",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
    readTime: "8 min read",
    featured: true
  },
  {
    id: "2",
    title: "The New Economics of Generative Creativity",
    excerpt: "In an era of infinite production, the value of human labor is shifting from the act of creation to the art of curation and strategic prompt engineering.",
    content: `
      <p>We are entering the age of post-scarcity creativity. When the cost of generating a high-fidelity image or a coherent essay drops to near zero, the economic value of the 'act' of creation itself begins to evaporate. What remains, however, is the value of intent, taste, and strategic direction.</p>
      
      <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" alt="AI Art Generation" />

      <h2>The Shift from Maker to Curator</h2>
      <p>In the traditional economy, the bottleneck was the skill required to execute an idea. In the generative economy, the bottleneck is the idea itself. The artist is no longer the person holding the brush, but the person directing the vision.</p>
      
      <blockquote>"The future of art is not in the generation of images, but in the selection of meaning."</blockquote>
      
      <h2>The Rise of the Prompt Engineer</h2>
      <p>Prompt engineering is often dismissed as a temporary hack, but it represents a fundamental shift in how humans interface with machines. It is the art of precise communication—the ability to translate a complex human vision into a language the machine can optimize.</p>
    `,
    author: "Elena Vance",
    authorRole: "Tech Economist",
    date: "March 20, 2026",
    category: "Economics",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    readTime: "12 min read",
    trending: true
  },
  {
    id: "3",
    title: "Organic Minimalism: The Post-Digital Aesthetic",
    excerpt: "Why the next decade of design is moving away from sharp edges and cold glass towards warmth, tactile texture, and the beauty of imperfection.",
    content: `
      <p>For two decades, digital design has been obsessed with perfection. Flat interfaces, sharp corners, and clinical white spaces defined the 'modern' look. But as we spend more of our lives behind screens, we are beginning to crave the opposite: the organic, the tactile, and the imperfect.</p>
      
      <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200" alt="Organic Design" />

      <h2>The Wabi-Sabi of the Web</h2>
      <p>We are seeing a return to 'Wabi-Sabi'—the Japanese aesthetic centered on the acceptance of transience and imperfection. In design, this translates to soft shadows, irregular shapes, and textures that mimic natural materials like paper, stone, and wood.</p>
      
      <blockquote>"Design is not just what it looks like and feels like. Design is how it works... and how it breathes."</blockquote>
      
      <h2>Warmth as a Feature</h2>
      <p>Warmth is becoming a functional requirement. Cold, clinical interfaces are being replaced by palettes of cream, terracotta, and sage. This isn't just a trend; it's a response to the digital exhaustion of the modern world.</p>
    `,
    author: "Marcus Chen",
    authorRole: "Creative Director",
    date: "March 18, 2026",
    category: "Art",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
    trending: true
  },
  {
    id: "4",
    title: "The Stoic's Guide to Modern Volatility",
    excerpt: "Applying ancient wisdom to navigate the rapid shifts of the 21st-century landscape with equanimity and purpose.",
    content: `
      <p>The world of 2026 is defined by volatility. From geopolitical shifts to the rapid evolution of AI, the only constant is change. In this environment, the ancient philosophy of Stoicism is finding a new and urgent relevance.</p>
      
      <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" alt="Stoic Meditation" />

      <h2>The Dichotomy of Control</h2>
      <p>The core of Stoic practice is the 'dichotomy of control'—the ability to distinguish between what we can influence and what we cannot. In a world of global crises, focusing our energy solely on our own actions and judgments is the ultimate survival strategy.</p>
      
      <blockquote>"You have power over your mind—not outside events. Realize this, and you will find strength." — Marcus Aurelius</blockquote>
      
      <h2>Amor Fati: Loving the Fate</h2>
      <p>Stoicism isn't just about enduring hardship; it's about embracing it. 'Amor Fati'—the love of fate—is the practice of seeing every challenge as an opportunity for growth and a necessary part of the human experience.</p>
    `,
    author: "Sarah Jenkins",
    authorRole: "Philosophy Professor",
    date: "March 15, 2026",
    category: "Philosophy",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    readTime: "10 min read",
    trending: true
  },
  {
    id: "5",
    title: "Quantum Computing and the End of Encryption",
    excerpt: "Preparing for 'Q-Day': The moment current security protocols become obsolete and how we are building the post-quantum future.",
    content: `
      <p>The 'Quantum Apocalypse' is no longer a theoretical concern. As quantum computers grow in power, the encryption that secures our global financial systems, private communications, and national secrets is becoming increasingly vulnerable.</p>
      
      <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200" alt="Quantum Processor" />

      <h2>The Race for Post-Quantum Cryptography</h2>
      <p>We are currently in a global race to develop and deploy 'Post-Quantum Cryptography' (PQC)—mathematical algorithms that are resistant to quantum attacks. This is the most significant upgrade to the internet's security infrastructure in its history.</p>
      
      <blockquote>"The greatest threat to security is the belief that it is already achieved."</blockquote>
      
      <h2>Preparing for Q-Day</h2>
      <p>Q-Day is the hypothetical point at which a quantum computer can break RSA-2048 encryption. While we don't know exactly when it will arrive, the transition to quantum-resistant systems must happen now, as data captured today can be decrypted tomorrow.</p>
    `,
    author: "David Wu",
    authorRole: "Security Researcher",
    date: "March 12, 2026",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    readTime: "15 min read"
  }
];
