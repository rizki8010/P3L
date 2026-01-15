export interface BlogPost {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  author: string;
  category: string;
}

const blogDummy: BlogPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    title: "Memahami Tangga Nada: Panduan Lengkap untuk Pemula",
    excerpt:
      "Tangga nada adalah fondasi dari semua musik. Pelajari bagaimana memahami dan mengaplikasikannya.",
    description:
      "Tangga nada merupakan susunan nada-nada yang disusun secara berurutan berdasarkan tinggi rendahnya bunyi. Pemahaman tangga nada sangat penting bagi siapa pun yang ingin belajar musik secara serius...",
    date: "2025-01-12",
    author: "Admin Musikku",
    category: "Teori Musik",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    title: "Tips Latihan Musik yang Efektif untuk Pemula",
    excerpt:
      "Latihan yang tepat akan mempercepat perkembangan kemampuan bermusik Anda.",
    description:
      "Latihan musik yang efektif tidak selalu harus lama, tetapi konsisten...",
    date: "2025-01-18",
    author: "Dimas Pratama",
    category: "Tips & Latihan",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
    title: "Mengenal Chord Dasar Gitar untuk Pemula",
    excerpt:
      "Pelajari chord dasar gitar yang wajib dikuasai agar bisa memainkan lagu favorit.",
    description:
      "Chord dasar gitar seperti C, G, D, A, dan E merupakan fondasi utama...",
    date: "2025-01-25",
    author: "Raka Mahendra",
    category: "Gitar",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1508973379-d6e3a6d6c1b4",
    title: "Perbedaan Piano dan Keyboard: Mana yang Cocok?",
    excerpt:
      "Kenali perbedaan piano dan keyboard agar tidak salah memilih instrumen.",
    description:
      "Piano dan keyboard memiliki perbedaan signifikan dari segi suara...",
    date: "2025-02-02",
    author: "Admin Musikku",
    category: "Instrumen",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    title: "Memahami Tangga Nada: Panduan Lengkap untuk Pemula",
    excerpt:
      "Tangga nada adalah fondasi dari semua musik. Pelajari bagaimana memahami dan mengaplikasikannya.",
    description:
      "Tangga nada merupakan susunan nada-nada yang disusun secara berurutan...",
    date: "2025-01-12",
    author: "Admin Musikku",
    category: "Teori Musik",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    title: "Tips Latihan Musik yang Efektif untuk Pemula",
    excerpt:
      "Latihan yang tepat akan mempercepat perkembangan kemampuan bermusik Anda.",
    description: "Latihan musik yang efektif tidak selalu harus lama...",
    date: "2025-01-18",
    author: "Dimas Pratama",
    category: "Tips & Latihan",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
    title: "Mengenal Chord Dasar Gitar untuk Pemula",
    excerpt:
      "Pelajari chord dasar gitar yang wajib dikuasai agar bisa memainkan lagu favorit.",
    description:
      "Chord dasar gitar seperti C, G, D, A, dan E merupakan fondasi utama...",
    date: "2025-01-25",
    author: "Raka Mahendra",
    category: "Gitar",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1508973379-d6e3a6d6c1b4",
    title: "Perbedaan Piano dan Keyboard: Mana yang Cocok?",
    excerpt:
      "Kenali perbedaan piano dan keyboard agar tidak salah memilih instrumen.",
    description:
      "Piano dan keyboard memiliki perbedaan signifikan dari segi suara...",
    date: "2025-02-02",
    author: "Admin Musikku",
    category: "Instrumen",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    title: "Memahami Tangga Nada: Panduan Lengkap untuk Pemula",
    excerpt:
      "Tangga nada adalah fondasi dari semua musik. Pelajari bagaimana memahami dan mengaplikasikannya.",
    description:
      "Tangga nada merupakan susunan nada-nada yang disusun secara berurutan...",
    date: "2025-01-12",
    author: "Admin Musikku",
    category: "Teori Musik",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    title: "Tips Latihan Musik yang Efektif untuk Pemula",
    excerpt:
      "Latihan yang tepat akan mempercepat perkembangan kemampuan bermusik Anda.",
    description: "Latihan musik yang efektif tidak selalu harus lama...",
    date: "2025-01-18",
    author: "Dimas Pratama",
    category: "Tips & Latihan",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
    title: "Mengenal Chord Dasar Gitar untuk Pemula",
    excerpt:
      "Pelajari chord dasar gitar yang wajib dikuasai agar bisa memainkan lagu favorit.",
    description:
      "Chord dasar gitar seperti C, G, D, A, dan E merupakan fondasi utama...",
    date: "2025-01-25",
    author: "Raka Mahendra",
    category: "Gitar",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1508973379-d6e3a6d6c1b4",
    title: "Perbedaan Piano dan Keyboard: Mana yang Cocok?",
    excerpt:
      "Kenali perbedaan piano dan keyboard agar tidak salah memilih instrumen.",
    description:
      "Piano dan keyboard memiliki perbedaan signifikan dari segi suara...",
    date: "2025-02-02",
    author: "Admin Musikku",
    category: "Instrumen",
  },
];

export default blogDummy;
