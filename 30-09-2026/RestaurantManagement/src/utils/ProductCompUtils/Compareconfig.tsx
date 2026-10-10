import {
  Smartphone, Laptop, Refrigerator, Image as ImageIcon, Tag, Building2, Package, CalendarDays,
  Monitor, Cpu, Gauge, Database, Camera, BatteryFull, Settings, Zap, Scale, Palette, Layers,
  Plug, Wifi, Keyboard, Ruler, LayoutGrid, DoorOpen, Repeat, Snowflake, Leaf, Volume2,
  Sparkles, Droplets, ShieldCheck,
} from "lucide-react";
 
import type { CompareProduct } from "../../Redux/Slices/ProductCompareSlice/compareSlice";
import { phoneSeed } from "./Phonedata";
import { laptopSeed } from "./Laptopdata";
import { refrigeratorSeed } from "./Refrigeratordata";
import ProductImage  from "../../components/ProductImage";
import { formatINR, row } from "../../modules/CompareProducts/Helper/CompareHelper";
import type { CompareCategoryConfig , SpecRow } from "../../modules/CompareProducts/Helper/Comparetype";

// Every Category Shares same Row
const baseRows: SpecRow[] = [
  {
    key: "image",
    label: "Image",
    icon: ImageIcon,
    group: "none",
    render: (p) => <ProductImage src={p.image} alt={p.name} className="mx-auto h-36 w-28" />,
  },
  {
    key: "price",
    label: "Price",
    icon: Tag,
    group: "basic",
    render: (p) => <strong className="text-base">{formatINR(p.price)}</strong>,
  },
  row("Brand", "brand", Building2, "basic"),
  row("Model", "model", Package, "basic"),
  {
    key: "releaseDate",
    label: "Release Date",
    icon: CalendarDays,
    group: "basic",
    render: (p) =>
      new Date(p.releaseDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
  },
];

// For Phone Category
const phoneSpecs : SpecRow[]=[
    ...baseRows,
  row("Display", "display", Monitor, "display"),
  row("Processor", "processor", Cpu, "display"),
  row("RAM", "ram", Gauge, "display"),
  row("Storage Options", "storage", Database, "display"),
  row("Rear Camera", "rearCamera", Camera, "camera"),
  row("Front Camera", "frontCamera", Camera, "camera"),
  row("Battery", "battery", BatteryFull, "camera"),
  row("Operating System", "os", Settings, "additional"),
  row("Charging", "charging", Zap, "additional"),
  row("Weight", "weight", Scale, "additional"),
  row("Colors", "colors", Palette, "additional"),
]

// For laptop Category
const laptopSpecs: SpecRow[] = [
  ...baseRows,
  row("Display", "display", Monitor, "display"),
  row("Processor", "processor", Cpu, "display"),
  row("RAM", "ram", Gauge, "display"),
  row("Storage", "storage", Database, "display"),
  row("Graphics", "graphics", Layers, "display"),
  row("Battery", "battery", BatteryFull, "camera"),
  row("Connectivity", "connectivity", Wifi, "camera"),
  row("Ports", "ports", Plug, "camera"),
  row("Operating System", "os", Settings, "additional"),
  row("Keyboard", "keyboard", Keyboard, "additional"),
  row("Webcam", "webcam", Camera, "additional"),
  row("Dimensions", "dimensions", Ruler, "additional"),
  row("Weight", "weight", Scale, "additional"),
  row("Colors", "colors", Palette, "additional"),
];

// For Fridge Category
const fridgeSpecs: SpecRow[] = [
  ...baseRows,
  row("Color", "color", Palette, "basic"),
  row("Capacity", "capacity", Package, "display", { labels: true }),
  row("Configuration", "configuration", LayoutGrid, "display"),
  row("Doors", "doors", DoorOpen, "display"),
  row("Convertible", "convertible", Repeat, "display"),
  row("Cooling", "cooling", Snowflake, "camera"),
  row("Compressor", "compressor", Settings, "camera"),
  row("Energy Rating", "energyRating", Leaf, "camera"),
  row("Noise Level", "noiseLevel", Volume2, "camera"),
  row("Dimensions", "dimensions", Ruler, "additional", { labels: true }),
  row("Shelves", "shelves", Layers, "additional"),
  row("Features", "features", Sparkles, "additional"),
  row("Dispenser", "dispenser", Droplets, "additional"),
  row("Smart Features", "smartFeatures", Wifi, "additional"),
  row("Weight", "weight", Scale, "additional"),
  row("Warranty", "warranty", ShieldCheck, "additional", { labels: true }),
];

export const COMPARE_CATEGORIES: CompareCategoryConfig[] = [
  {
    id: "phones",
    title: "Phones",
    description: "Compare smartphones",
    noun: "phone",
    plural: "phones",
    icon: Smartphone,
    items: phoneSeed as CompareProduct[],
    specs: phoneSpecs,
    groups: {
      basic: { label: "Basic Information", hint: "Price, Brand, Model, Release Date" },
      display: { label: "Display & Performance", hint: "Display, Processor, RAM, Storage" },
      camera: { label: "Camera & Battery", hint: "Rear & front camera, Battery" },
      additional: { label: "Additional Details", hint: "OS, Charging, Weight, Colors" },
    },
    highlights: (p) =>
      [p.display?.size, p.processor, p.ram && `${p.ram} RAM`, p.battery?.capacity].filter(Boolean),
  },
  {
    id: "laptops",
    title: "Laptops",
    description: "Compare laptops",
    noun: "laptop",
    plural: "laptops",
    icon: Laptop,
    items: laptopSeed as CompareProduct[],
    specs: laptopSpecs,
    groups: {
      basic: { label: "Basic Information", hint: "Price, Brand, Model, Release Date" },
      display: { label: "Display & Performance", hint: "Display, Processor, RAM, Storage, Graphics" },
      camera: { label: "Battery & Connectivity", hint: "Battery, Connectivity, Ports" },
      additional: { label: "Additional Details", hint: "OS, Keyboard, Webcam, Dimensions, Weight, Colors" },
    },
    highlights: (p) =>
      [p.display?.size, p.processor, p.ram && `${p.ram} RAM`, p.storage?.capacity].filter(Boolean),
  },
  {
    id: "refrigerators",
    title: "Refrigerators",
    description: "Compare refrigerators",
    noun: "refrigerator",
    plural: "refrigerators",
    icon: Refrigerator,
    items: refrigeratorSeed as CompareProduct[],
    specs: fridgeSpecs,
    groups: {
      basic: { label: "Basic Information", hint: "Price, Brand, Model, Release Date, Color" },
      display: { label: "Capacity & Configuration", hint: "Capacity, Configuration, Doors, Convertible" },
      camera: { label: "Cooling & Efficiency", hint: "Cooling, Compressor, Energy Rating, Noise" },
      additional: { label: "Features & Details", hint: "Dimensions, Shelves, Features, Smart, Weight, Warranty" },
    },
    highlights: (p) =>
      [p.capacity?.total, p.configuration, p.energyRating, p.cooling?.type].filter(Boolean),
  },
];
