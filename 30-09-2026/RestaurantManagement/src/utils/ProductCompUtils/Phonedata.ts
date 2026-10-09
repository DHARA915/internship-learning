export interface PhoneColor{
    name:string;
    hex:string
}

export interface Phone {
  id: string;
  category: "phones";
  brand: string;
  model: string;
  name: string;
  variant: string; 
  image: string;
  price: number;
  releaseDate: string; 
  display: { size: string; type: string; resolution: string };
  processor: string;
  ram: string;
  storage: string[];
  rearCamera: string[];
  frontCamera: string;
  battery: { capacity: string; life: string };
  os: string;
  charging: string[];
  weight: string;
  colors: PhoneColor[];
}
 
export const phoneSeed: Phone[] = [
  {
    id: "ph_iphone15",
    category: "phones",
    brand: "Apple",
    model: "iPhone 15",
    name: "Apple iPhone 15",
    variant: "128GB, Black",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxS-PVTrjEAt3NlL3GNff9z2x1lpoZAaONRGSA4tWAMg&s",
    price: 79900,
    releaseDate: "2023-09-22",
    display: { size: "6.1 inch", type: "Super Retina XDR, OLED", resolution: "2556 × 1179 pixels" },
    processor: "A16 Bionic",
    ram: "6 GB",
    storage: ["128 GB", "256 GB", "512 GB"],
    rearCamera: ["48 MP (Main)", "12 MP (Ultra Wide)"],
    frontCamera: "12 MP",
    battery: { capacity: "3349 mAh", life: "Up to 20 hours video playback" },
    os: "iOS 17",
    charging: ["20W wired", "15W MagSafe", "7.5W Qi"],
    weight: "171 grams",
    colors: [
      { name: "Black", hex: "#1d1d1f" },
      { name: "Pink", hex: "#f4c7c3" },
      { name: "Yellow", hex: "#f7e7a1" },
      { name: "Green", hex: "#b9dcb9" },
      { name: "Blue", hex: "#c5d3ef" },
    ],
  },
  {
    id: "ph_s24",
    category: "phones",
    brand: "Samsung",
    model: "Galaxy S24",
    name: "Samsung Galaxy S24",
    variant: "128GB, Onyx Black",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSglFHpRf_gc9VCYOLjBzj0RLBbaRW3h1XKYThRBs1zyg&s=10",
    price: 74999,
    releaseDate: "2024-01-24",
    display: { size: "6.2 inch", type: "Dynamic AMOLED 2X", resolution: "2340 × 1080 pixels" },
    processor: "Exynos 2400",
    ram: "8 GB",
    storage: ["128 GB", "256 GB", "512 GB"],
    rearCamera: ["50 MP (Main)", "12 MP (Ultra Wide)", "10 MP (Telephoto)"],
    frontCamera: "12 MP",
    battery: { capacity: "4000 mAh", life: "Up to 29 hours video playback" },
    os: "Android 14 (One UI 6.1)",
    charging: ["25W wired", "15W wireless", "4.5W reverse wireless"],
    weight: "167 grams",
    colors: [
      { name: "Onyx Black", hex: "#1b1b1b" },
      { name: "Marble Gray", hex: "#4a4a4d" },
      { name: "Cobalt Violet", hex: "#6a4fb3" },
      { name: "Amber Yellow", hex: "#efe0a0" },
    ],
  },
  {
    id: "ph_pixel8",
    category: "phones",
    brand: "Google",
    model: "Pixel 8",
    name: "Google Pixel 8",
    variant: "128GB, Obsidian",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCkv-bt-EqBhwLu92VNjxMLvmXaZ2AetenG0Pl-qN1_w&s=10",
    price: 75999,
    releaseDate: "2023-10-12",
    display: { size: "6.2 inch", type: "Actua OLED", resolution: "2400 × 1080 pixels" },
    processor: "Google Tensor G3",
    ram: "8 GB",
    storage: ["128 GB", "256 GB"],
    rearCamera: ["50 MP (Main)", "12 MP (Ultra Wide)"],
    frontCamera: "10.5 MP",
    battery: { capacity: "4575 mAh", life: "Up to 24 hours mixed use" },
    os: "Android 14",
    charging: ["27W wired", "18W wireless"],
    weight: "187 grams",
    colors: [
      { name: "Obsidian", hex: "#1f1f21" },
      { name: "Hazel", hex: "#8d9a86" },
      { name: "Rose", hex: "#f2bab1" },
    ],
  },
  {
    id: "ph_oneplus12",
    category: "phones",
    brand: "OnePlus",
    model: "OnePlus 12",
    name: "OnePlus 12",
    variant: "256GB, Silky Black",
    image: "",
    price: 64999,
    releaseDate: "2024-01-23",
    display: { size: "6.82 inch", type: "LTPO AMOLED", resolution: "3168 × 1440 pixels" },
    processor: "Snapdragon 8 Gen 3",
    ram: "12 GB",
    storage: ["256 GB", "512 GB"],
    rearCamera: ["50 MP (Main)", "48 MP (Ultra Wide)", "64 MP (Periscope Telephoto)"],
    frontCamera: "32 MP",
    battery: { capacity: "5400 mAh", life: "Up to 2 days typical use" },
    os: "Android 14 (OxygenOS 14)",
    charging: ["100W wired", "50W wireless"],
    weight: "220 grams",
    colors: [
      { name: "Silky Black", hex: "#16161a" },
      { name: "Flowy Emerald", hex: "#1f6f5c" },
    ],
  },
  {
    id: "ph_xiaomi14",
    category: "phones",
    brand: "Xiaomi",
    model: "Xiaomi 14",
    name: "Xiaomi 14",
    variant: "256GB, Black",
    image: "",
    price: 69999,
    releaseDate: "2024-03-07",
    display: { size: "6.36 inch", type: "LTPO AMOLED", resolution: "2670 × 1200 pixels" },
    processor: "Snapdragon 8 Gen 3",
    ram: "12 GB",
    storage: ["256 GB", "512 GB", "1 TB"],
    rearCamera: ["50 MP (Main)", "50 MP (Telephoto)", "50 MP (Ultra Wide)"],
    frontCamera: "32 MP",
    battery: { capacity: "4610 mAh", life: "Up to 18 hours video playback" },
    os: "Android 14 (HyperOS)",
    charging: ["90W wired", "50W wireless"],
    weight: "193 grams",
    colors: [
      { name: "Black", hex: "#141414" },
      { name: "White", hex: "#f2f2f2" },
      { name: "Jade Green", hex: "#5fa88a" },
    ],
  },
];