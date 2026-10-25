// export type Genre =
//   | "Pop"
//   | "Rock"
//   | "Hip-Hop"
//   | "Electronic"
//   | "Indie";
export const GENRES = ["Pop", "Rock", "Hip-Hop", "Electronic", "Indie"] as const;
export type Genre = (typeof GENRES)[number];

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: Genre;
  coverUrl: string;
};

export type Playlist = {
    id:string;
    name:string;
    description:string;
    trackIds: string[];
    coverUrl: string;
}

export type MusicState = {
  tracks: Track[];
  playlists: Playlist[];
  likedTrackIds:string[];
};

// For omiting id while input...

export type CreateTrackInput = Omit<Track, "id">;
export type CreatePlaylistInput = Omit<Playlist, "id">;


// Initial Seed data for Tracks and Playlists

export const tracks: Track[] = [
  {
    id: "track-001",
    title: "Ilahi",
    artist: "Arijit Singh",
    album: "Yeh Jawaani Hai Deewani",
    duration: 234,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-001/300/300",
  },
  {
    id: "track-002",
    title: "Kesariya",
    artist: "Arijit Singh",
    album: "Brahmāstra",
    duration: 268,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-002/300/300",
  },
  {
    id: "track-003",
    title: "Kho Gaye Hum Kahan",
    artist: "Prateek Kuhad",
    album: "Baar Baar Dekho",
    duration: 233,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-003/300/300",
  },
  {
    id: "track-004",
    title: "Iktara",
    artist: "Kavita Seth",
    album: "Wake Up Sid",
    duration: 255,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-004/300/300",
  },
  {
    id: "track-005",
    title: "Apna Time Aayega",
    artist: "Divine",
    album: "Gully Boy",
    duration: 158,
    genre: "Hip-Hop",
    coverUrl: "https://picsum.photos/seed/track-005/300/300",
  },
  {
    id: "track-006",
    title: "Aaj Ki Raat",
    artist: "Madhubanti Bagchi",
    album: "Stree 2",
    duration: 219,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-006/300/300",
  },
  {
    id: "track-007",
    title: "Tum Se Hi",
    artist: "Mohit Chauhan",
    album: "Jab We Met",
    duration: 308,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-007/300/300",
  },
  {
    id: "track-008",
    title: "Kasoor",
    artist: "Prateek Kuhad",
    album: "cold/mess",
    duration: 205,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-008/300/300",
  },
  {
    id: "track-009",
    title: "Chaleya",
    artist: "Arijit Singh, Shilpa Rao",
    album: "Jawan",
    duration: 200,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-009/300/300",
  },
  {
    id: "track-010",
    title: "Zinda",
    artist: "Siddharth Mahadevan",
    album: "Bhaag Milkha Bhaag",
    duration: 190,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-010/300/300",
  },
  {
    id: "track-011",
    title: "Aabaad Barbaad",
    artist: "Arijit Singh",
    album: "Ludo",
    duration: 300,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-011/300/300",
  },
  {
    id: "track-012",
    title: "Nanchaku",
    artist: "Seedhe Maut, MC Stan",
    album: "Nayaab",
    duration: 225,
    genre: "Hip-Hop",
    coverUrl: "https://picsum.photos/seed/track-012/300/300",
  },
  {
    id: "track-013",
    title: "Husn",
    artist: "Anuv Jain",
    album: "Husn",
    duration: 234,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-013/300/300",
  },
  {
    id: "track-014",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    duration: 261,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-014/300/300",
  },
  {
    id: "track-015",
    title: "Kar Har Maidaan Fateh",
    artist: "Sukhwinder Singh",
    album: "Sanju",
    duration: 336,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-015/300/300",
  },
  {
    id: "track-016",
    title: "Mere Gully Mein",
    artist: "Divine, Naezy",
    album: "Gully Boy",
    duration: 217,
    genre: "Hip-Hop",
    coverUrl: "https://picsum.photos/seed/track-016/300/300",
  },
  {
    id: "track-017",
    title: "Heeriye",
    artist: "Arijit Singh",
    album: "Heeriye",
    duration: 191,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-017/300/300",
  },
  {
    id: "track-018",
    title: "Raabta",
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 274,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-018/300/300",
  },
  {
    id: "track-019",
    title: "Shaam",
    artist: "Amit Trivedi",
    album: "Aisha",
    duration: 280,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-019/300/300",
  },
  {
    id: "track-020",
    title: "Sultan",
    artist: "Sukhwinder Singh",
    album: "Sultan",
    duration: 258,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-020/300/300",
  },
  {
    id: "track-021",
    title: "Jee Ni Karda",
    artist: "Romy",
    album: "Angrezi Medium",
    duration: 205,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-021/300/300",
  },
  {
    id: "track-022",
    title: "What Jhumka?",
    artist: "Arijit Singh, Jonita Gandhi",
    album: "Rocky Aur Rani Kii Prem Kahaani",
    duration: 203,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-022/300/300",
  },
  {
    id: "track-023",
    title: "Alag Aasmaan",
    artist: "Anuv Jain",
    album: "Alag Aasmaan",
    duration: 224,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-023/300/300",
  },
  {
    id: "track-024",
    title: "Mann Mera",
    artist: "Gajendra Verma",
    album: "Table No. 21",
    duration: 223,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-024/300/300",
  },
  {
    id: "track-025",
    title: "Galliyan",
    artist: "Ankit Tiwari",
    album: "Ek Villain",
    duration: 306,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-025/300/300",
  },
  {
    id: "track-026",
    title: "Excuse Me",
    artist: "Vishal Dadlani",
    album: "Shaadi Ke Side Effects",
    duration: 215,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-026/300/300",
  },
  {
    id: "track-027",
    title: "O Maahi",
    artist: "Arijit Singh",
    album: "Dunki",
    duration: 228,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-027/300/300",
  },
  {
    id: "track-028",
    title: "Agar Tum Saath Ho",
    artist: "Alka Yagnik, Arijit Singh",
    album: "Tamasha",
    duration: 341,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-028/300/300",
  },
  {
    id: "track-029",
    title: "Khaabon Ke Parinday",
    artist: "Mohit Chauhan, Alyssa Mendonsa",
    album: "Zindagi Na Milegi Dobara",
    duration: 289,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-029/300/300",
  },
  {
    id: "track-030",
    title: "Bhaag DK Bose",
    artist: "Ram Sampath",
    album: "Delhi Belly",
    duration: 208,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-030/300/300",
  },
  {
    id: "track-031",
    title: "Aankhon Se Batana",
    artist: "Dikshant",
    album: "Aankhon Se Batana",
    duration: 180,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-031/300/300",
  },
  {
    id: "track-032",
    title: "Maan Meri Jaan",
    artist: "King",
    album: "Champagne Talk",
    duration: 254,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-032/300/300",
  },
  {
    id: "track-033",
    title: "Aaj Se Teri",
    artist: "Arijit Singh",
    album: "Pad Man",
    duration: 308,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-033/300/300",
  },
  {
    id: "track-034",
    title: "Cold/Mess",
    artist: "Prateek Kuhad",
    album: "cold/mess",
    duration: 235,
    genre: "Indie",
    coverUrl: "https://picsum.photos/seed/track-034/300/300",
  },
  {
    id: "track-035",
    title: "Zinda Banda",
    artist: "Anirudh Ravichander",
    album: "Jawan",
    duration: 250,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-035/300/300",
  },
  {
    id: "track-036",
    title: "Sher Khul Gaye",
    artist: "Vishal Dadlani, Shekhar Ravjiani",
    album: "Fighter",
    duration: 219,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-036/300/300",
  },
  {
    id: "track-037",
    title: "Tera Ban Jaunga",
    artist: "Akhil Sachdeva, Tulsi Kumar",
    album: "Kabir Singh",
    duration: 221,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-037/300/300",
  },
  {
    id: "track-038",
    title: "Phir Se Ud Chala",
    artist: "Mohit Chauhan",
    album: "Rockstar",
    duration: 283,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-038/300/300",
  },
  {
    id: "track-039",
    title: "Aao Milo Chalo",
    artist: "Shaan, Ustad Sultan Khan",
    album: "Jab We Met",
    duration: 295,
    genre: "Pop",
    coverUrl: "https://picsum.photos/seed/track-039/300/300",
  },
  {
    id: "track-040",
    title: "Brothers Anthem",
    artist: "Vishal Dadlani",
    album: "Brothers",
    duration: 310,
    genre: "Rock",
    coverUrl: "https://picsum.photos/seed/track-040/300/300",
  },
];

export const playlists:Playlist[] = [
  {
    "id": "playlist-chill-vibes",
    "name": "Chill Vibes",
    "description": "Relaxing Hindi songs for slow mornings, sunsets and quiet evenings.",
    "trackIds": [
      "track-004",
      "track-008",
      "track-013",
      "track-019",
      "track-023",
      "track-024",
      "track-028",
      "track-031",
      "track-034",
      "track-042",
      "track-044",
      "track-047"
    ],
    "coverUrl": "https://picsum.photos/seed/chill-vibes/300/300"
  },
  {
    "id": "playlist-workout",
    "name": "Workout",
    "description": "High-energy Hindi songs to keep you motivated and moving.",
    "trackIds": [
      "track-005",
      "track-006",
      "track-010",
      "track-015",
      "track-016",
      "track-020",
      "track-030",
      "track-035",
      "track-036",
      "track-040",
      "track-041",
      "track-045"
    ],
    "coverUrl": "https://picsum.photos/seed/workout/300/300"
  },
  {
    "id": "playlist-night-drive",
    "name": "Night Drive",
    "description": "Smooth Hindi songs for late-night drives, city lights and long roads.",
    "trackIds": [
      "track-001",
      "track-003",
      "track-007",
      "track-009",
      "track-011",
      "track-018",
      "track-021",
      "track-025",
      "track-027",
      "track-029",
      "track-032",
      "track-037",
      "track-038",
      "track-039",
      "track-042",
      "track-046",
      "track-048"
    ],
    "coverUrl": "https://picsum.photos/seed/night-drive/300/300"
  },
  {
    "id": "playlist-pop-favorites",
    "name": "Pop Favorites",
    "description": "Popular Hindi songs for feel-good moments and everyday listening.",
    "trackIds": [
      "track-002",
      "track-006",
      "track-009",
      "track-014",
      "track-017",
      "track-022",
      "track-026",
      "track-032",
      "track-033",
      "track-037",
      "track-041",
      "track-043",
      "track-046",
      "track-048"
    ],
    "coverUrl": "https://picsum.photos/seed/pop-favorites/300/300"
  }
]