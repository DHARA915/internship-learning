export interface LaptopColor {
  name: string;
  hex: string;
}

export interface Laptop {
  id: string;
  category: "laptops";

  brand: string;
  model: string;
  name: string;
  variant: string;
  image: string;
  price: number;
  releaseDate: string;

  display: {
    size: string;
    type: string;
    resolution: string;
    refreshRate: string;
  };

  processor: string;
  ram: string;

  storage: {
    capacity: string;
    type: string;
  };

  graphics: {
    type: "Integrated" | "Dedicated";
    name: string;
    memory?: string;
  };

  os: string;

  ports: string[];

  battery: {
    capacity: string;
    life: string;
  };

  connectivity: string[];

  keyboard: string;
  webcam: string;

  dimensions: string;
  weight: string;

  colors: LaptopColor[];
}

export const laptopSeed: Laptop[] = [
  {
    id: "lap_macbook_air_m3",
    category: "laptops",
    brand: "Apple",
    model: "MacBook Air M3",
    name: "Apple MacBook Air 13-inch M3",
    variant: "8GB RAM, 256GB SSD",
    image: "",
    price: 99900,
    releaseDate: "2024-03-04",

    display: {
      size: "13.6 inch",
      type: "Liquid Retina IPS",
      resolution: "2560 × 1664 pixels",
      refreshRate: "60 Hz",
    },

    processor: "Apple M3",
    ram: "8 GB",

    storage: {
      capacity: "256 GB",
      type: "SSD",
    },

    graphics: {
      type: "Integrated",
      name: "Apple M3 GPU",
    },

    os: "macOS",

    ports: [
      "2 × Thunderbolt / USB 4",
      "3.5mm Headphone Jack",
      "MagSafe 3",
    ],

    battery: {
      capacity: "52.6 Wh",
      life: "Up to 18 hours",
    },

    connectivity: [
      "Wi-Fi 6E",
      "Bluetooth 5.3",
    ],

    keyboard: "Backlit Magic Keyboard",
    webcam: "1080p FaceTime HD",

    dimensions: "30.41 × 21.5 × 1.13 cm",
    weight: "1.24 kg",

    colors: [
      { name: "Midnight", hex: "#2e3235" },
      { name: "Starlight", hex: "#f0e4d0" },
      { name: "Silver", hex: "#c0c0c0" },
      { name: "Space Gray", hex: "#777777" },
    ],
  },

  {
    id: "lap_dell_xps13",
    category: "laptops",
    brand: "Dell",
    model: "XPS 13",
    name: "Dell XPS 13",
    variant: "16GB RAM, 512GB SSD",
    image: "",
    price: 109999,
    releaseDate: "2024-02-01",

    display: {
      size: "13.4 inch",
      type: "FHD+ IPS",
      resolution: "1920 × 1200 pixels",
      refreshRate: "60 Hz",
    },

    processor: "Intel Core Ultra 7",
    ram: "16 GB",

    storage: {
      capacity: "512 GB",
      type: "SSD",
    },

    graphics: {
      type: "Integrated",
      name: "Intel Arc Graphics",
    },

    os: "Windows 11",

    ports: [
      "2 × Thunderbolt 4",
      "USB-C",
    ],

    battery: {
      capacity: "55 Wh",
      life: "Up to 15 hours",
    },

    connectivity: [
      "Wi-Fi 7",
      "Bluetooth 5.4",
    ],

    keyboard: "Backlit Keyboard",
    webcam: "1080p Webcam",

    dimensions: "29.5 × 19.9 × 1.48 cm",
    weight: "1.19 kg",

    colors: [
      { name: "Platinum", hex: "#d5d5d5" },
      { name: "Graphite", hex: "#3b3b3b" },
    ],
  },

  {
    id: "lap_asus_rog_g16",
    category: "laptops",
    brand: "ASUS",
    model: "ROG Strix G16",
    name: "ASUS ROG Strix G16",
    variant: "16GB RAM, 1TB SSD",
    image: "",
    price: 139999,
    releaseDate: "2024-01-15",

    display: {
      size: "16 inch",
      type: "IPS-level",
      resolution: "2560 × 1600 pixels",
      refreshRate: "240 Hz",
    },

    processor: "Intel Core i9",
    ram: "16 GB",

    storage: {
      capacity: "1 TB",
      type: "NVMe SSD",
    },

    graphics: {
      type: "Dedicated",
      name: "NVIDIA GeForce RTX 4060",
      memory: "8 GB",
    },

    os: "Windows 11",

    ports: [
      "2 × USB-C",
      "2 × USB-A",
      "HDMI 2.1",
      "RJ45 Ethernet",
      "3.5mm Audio Jack",
    ],

    battery: {
      capacity: "90 Wh",
      life: "Up to 8 hours",
    },

    connectivity: [
      "Wi-Fi 6E",
      "Bluetooth 5.3",
    ],

    keyboard: "RGB Backlit Keyboard",
    webcam: "720p HD Webcam",

    dimensions: "35.4 × 26.4 × 2.26 cm",
    weight: "2.5 kg",

    colors: [
      { name: "Eclipse Gray", hex: "#4a4a4a" },
    ],
  },
];
