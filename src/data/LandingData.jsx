import bookImg from "../assets/book.png";
import calcImg from "../assets/calculator.png";
import chainImg from "../assets/jewelry.png";
import fanImg from "../assets/fan.png";
import watchImg from "../assets/watch.png";
import laptopImg from "../assets/macbook.png";

export const universities = [
  {
    id: "lautech",
    short: "LAUTECH",
    name: "Ladoke Akintola University of Technology",
    hub: "Ogbomoso, Oyo State",
    active: true,
  },
  {
    id: "ui",
    short: "UI",
    name: "University of Ibadan",
    hub: "coming Soon",
    active: false,
  },
  {
    id: "unilag",
    short: "UNILAG",
    name: "University of Lagos",
    hub: "Coming Soon",
    active: false,
  },
  {
    id: "oau",
    short: "OAU",
    name: "Obafemi Awolowo University",
    hub: "Coming Soon",
    active: false,
  },
  {
    id: "lasu",
    short: "LASU",
    name: "Lagos State University",
    hub: "Coming Soon",
    active: false,
  },
];
export const LISTINGS = [
  {
    id: 1,
    uni: "lautech",
    cat: "gadgets",
    title: "Minimalist Stainless Steel Men's Wristwatch",
    note: "Sleek analog design, water resistant 30m, pristine glass face.",
    price: 18500,
    tag: "Mint Condition",
    seller: "Adebayo Jewelry",
    img: watchImg, 
  },
 {
    id: 2,
    uni: "lautech",
    cat: "fashion",
    title: "Personalized Gold & Silver Ring Set",
    note: "Handcrafted stainless steel rings, non-tarnish alloy finish.",
    price: 9500,
    tag: "Brand New",
    seller: "Kafayat Styles",
    img: chainImg, // Local Asset
  },
  {
    id: 3,
    uni: "lautech",
    cat: "gadgets",
    title: "Casio fx-991EX ClassWiz Calculator",
    note: "High-resolution display, 552 functions, solar & battery dual powered.",
    price: 14000,
    tag: "Verified Original",
    seller: "BookHive LAUTECH",
    img: calcImg, // Local Asset
  },
  {
    id: 4,
    uni: "lautech",
    cat: "textbooks",
    title: "Engineering Mathematics (Thirteenth Ed)",
    note: "K.A. Stroud edition. Clean pages, no missing chapters, essential for 200L/300L.",
    price: 12500,
    tag: "Good Condition",
    seller: "Academic Vault",
    img: bookImg, 
  },
  {
    id: 5,
    uni: "lautech",
    cat: "hostel",
    title: "Rechargeable Standing Mini Fan 3-in-1 LED Lamp",
    note: "Powerful dual motor speed, USB phone charging output, 8hr battery backup.",
    price: 22000,
    tag: "Battery Tested",
    seller: "Hostel Essentials",
    img: fanImg, 
  },
  {
    id: 6,
    uni: "lautech",
    cat: "gadgets",
    title: "Current Generation Laptop for Work & Studies",
    note: "Core i5 11th Gen, 16GB RAM, 512GB NVMe SSD, crisp 1080p display.",
    price: 285000,
    tag: "Mint Condition",
    seller: "TechHub Ogbomoso",
    img: laptopImg, 
  },
];
