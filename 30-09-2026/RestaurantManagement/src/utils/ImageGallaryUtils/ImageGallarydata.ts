export interface ImageGallaryType {
  id: string;
  image: string;
  title: string;
  category: string;
  isLike: boolean;
  createdAt: string;
}

export interface Options {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SortType = "newest" | "oldest" | "title-asc" | "title-desc"

export const sortOptions: Options[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name A-Z", value: "title-asc" },
  { label: "Name Z-A", value: "title-desc" },
]

export interface ImageCardProps {
  item: ImageGallaryType,
  toggleLike: (id: string) => void;
  onOpen?:()=>void
}

export const ImageGallarydata: ImageGallaryType[] = [
  // Nature
  {
    id: "1",
    image: "https://i.pinimg.com/236x/e3/08/5b/e3085b77479f9958b75299388b67979d.jpg",
    title: "Forest",
    category: "Nature",
    isLike: false,
    createdAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "2",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlwTGgWfPFiQWGYaObzN79Gki0hm7s4DC2WWpo12DPbA&s=10",
    title: "Mountain",
    category: "Nature",
    isLike: false,
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "3",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP2HZly57Vhs6OGEfKLZfuh5H_FfL6_qaBtkj58LisAg&s=10",
    title: "River",
    category: "Nature",
    isLike: false,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "4",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCQcPvj-6qS9elSqeanvBzetbKQ5NQIPUtC9BziHrzw&s=10",
    title: "Mountain",
    category: "Nature",
    isLike: false,
    createdAt: "2026-02-03T10:00:00Z",
  },
  {
    id: "5",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYvrPrPChluZBgNpTKsU1zGL2XGTlPW8uyT2Ba1vjN9g&s=10",
    title: "River",
    category: "Nature",
    isLike: false,
    createdAt: "2026-02-14T10:00:00Z",
  },

  // Birds
  {
    id: "6",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTozQgCKBDgT3VgRds58rdBJs5a3f-hfYS0XFgfmh6U1g&s=10",
    title: "peocock",
    category: "Birds",
    isLike: false,
    createdAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "7",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoOJkf4YDylFw50QHfuq8tYr3clFVZ_QPuMLCJ1kLsew&s=10",
    title: "Owl",
    category: "Birds",
    isLike: false,
    createdAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "8",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhiJKMksPDVHkBTk5lSyUGhnzQeIR65FyMW3Z1j5EtJQ&s=10",
    title: "Parrot",
    category: "Birds",
    isLike: false,
    createdAt: "2026-03-19T10:00:00Z",
  },
  {
    id: "9",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCT4zvBfFXXkVG5Td4mRDlUljc9UCfv-5JY5R8QGrwUA&s=10",
    title: "Peocock",
    category: "Birds",
    isLike: false,
    createdAt: "2026-04-02T10:00:00Z",
  },
  {
    id: "10",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5591pNxGN1z6QFTPP6ik_L-U4-X8nLFcs2sersL-dA&s=10",
    title: "Eagle",
    category: "Birds",
    isLike: false,
    createdAt: "2026-04-15T10:00:00Z",
  },

  // Animals
  {
    id: "11",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh22WYqsoPgSA1BW_WAdLps2MEdAjkf0FDh9IO5xUYPg&s=10",
    title: "Lion",
    category: "Animals",
    isLike: false,
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "12",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8AvkHF7XW1uPb_c9DivbBsXJ_qI9pUq_rirEaUa_HEA&s=10",
    title: "Panda",
    category: "Animals",
    isLike: false,
    createdAt: "2026-05-18T10:00:00Z",
  },
  {
    id: "13",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq8EwlD7Y3yZqJ7kAZVEx-69YO-2zLPyvsalyZsXxd8g&s=10",
    title: "Elephant",
    category: "Animals",
    isLike: false,
    createdAt: "2026-06-06T10:00:00Z",
  },
  {
    id: "14",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSAhrklliO3cCATe6mLwVHHgGWOZHvJ-cSjbS-efLPgw&s=10",
    title: "Dog",
    category: "Animals",
    isLike: false,
    createdAt: "2026-06-22T10:00:00Z",
  },
  {
    id: "15",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIXHlIWwNlozgmkjciRkTxQkh82HHLZLTKoxKqQamEgw&s",
    title: "Cat",
    category: "Animals",
    isLike: false,
    createdAt: "2026-07-10T10:00:00Z",
  },
];