import mongoose from "mongoose";
import Location from "../models/Location.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedLocations = [
  // Metro Cities (Tier: Metro)
  {
    name: "mumbai",
    displayName: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0760,
    longitude: 72.8777,
    region: "West",
    tier: "Metro",
    popularity: 150,
  },
  {
    name: "delhi",
    displayName: "Delhi",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    region: "North",
    tier: "Metro",
    popularity: 140,
  },
  {
    name: "bangalore",
    displayName: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    region: "South",
    tier: "Metro",
    popularity: 130,
  },
  {
    name: "hyderabad",
    displayName: "Hyderabad",
    state: "Telangana",
    latitude: 17.3850,
    longitude: 78.4867,
    region: "South",
    tier: "Metro",
    popularity: 120,
  },
  {
    name: "chennai",
    displayName: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    region: "South",
    tier: "Metro",
    popularity: 110,
  },
  {
    name: "kolkata",
    displayName: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    region: "East",
    tier: "Metro",
    popularity: 100,
  },

  // Tier 1 Cities
  {
    name: "pune",
    displayName: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    region: "West",
    tier: "Tier1",
    popularity: 85,
  },
  {
    name: "ahmedabad",
    displayName: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    region: "West",
    tier: "Tier1",
    popularity: 80,
  },
  {
    name: "jaipur",
    displayName: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    region: "North",
    tier: "Tier1",
    popularity: 75,
  },
  {
    name: "lucknow",
    displayName: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8407,
    longitude: 80.9496,
    region: "North",
    tier: "Tier1",
    popularity: 70,
  },
  {
    name: "chandigarh",
    displayName: "Chandigarh",
    state: "Chandigarh",
    latitude: 30.7333,
    longitude: 76.7794,
    region: "North",
    tier: "Tier1",
    popularity: 68,
  },
  {
    name: "indore",
    displayName: "Indore",
    state: "Madhya Pradesh",
    latitude: 22.7196,
    longitude: 75.8577,
    region: "Central",
    tier: "Tier1",
    popularity: 65,
  },
  {
    name: "kochi",
    displayName: "Kochi",
    state: "Kerala",
    latitude: 9.9312,
    longitude: 76.2673,
    region: "South",
    tier: "Tier1",
    popularity: 62,
  },
  {
    name: "visakhapatnam",
    displayName: "Visakhapatnam",
    state: "Andhra Pradesh",
    latitude: 17.6869,
    longitude: 83.2185,
    region: "South",
    tier: "Tier1",
    popularity: 60,
  },

  // Tier 2 Cities
  {
    name: "nagpur",
    displayName: "Nagpur",
    state: "Maharashtra",
    latitude: 21.1458,
    longitude: 79.0882,
    region: "Central",
    tier: "Tier2",
    popularity: 45,
  },
  {
    name: "bhopal",
    displayName: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.1815,
    longitude: 77.4104,
    region: "Central",
    tier: "Tier2",
    popularity: 42,
  },
  {
    name: "surat",
    displayName: "Surat",
    state: "Gujarat",
    latitude: 21.1702,
    longitude: 72.8311,
    region: "West",
    tier: "Tier2",
    popularity: 40,
  },
  {
    name: "vadodara",
    displayName: "Vadodara",
    state: "Gujarat",
    latitude: 22.3072,
    longitude: 73.1812,
    region: "West",
    tier: "Tier2",
    popularity: 38,
  },
  {
    name: "goa",
    displayName: "Goa",
    state: "Goa",
    latitude: 15.299,
    longitude: 73.8342,
    region: "West",
    tier: "Tier2",
    popularity: 55,
  },
  {
    name: "coimbatore",
    displayName: "Coimbatore",
    state: "Tamil Nadu",
    latitude: 11.0081,
    longitude: 76.9124,
    region: "South",
    tier: "Tier2",
    popularity: 36,
  },
  {
    name: "nashik",
    displayName: "Nashik",
    state: "Maharashtra",
    latitude: 19.9975,
    longitude: 73.791,
    region: "West",
    tier: "Tier2",
    popularity: 34,
  },
  {
    name: "amritsar",
    displayName: "Amritsar",
    state: "Punjab",
    latitude: 31.6340,
    longitude: 74.8711,
    region: "North",
    tier: "Tier2",
    popularity: 35,
  },
  {
    name: "ludhiana",
    displayName: "Ludhiana",
    state: "Punjab",
    latitude: 30.904,
    longitude: 75.8573,
    region: "North",
    tier: "Tier2",
    popularity: 33,
  },
  {
    name: "kanpur",
    displayName: "Kanpur",
    state: "Uttar Pradesh",
    latitude: 26.4499,
    longitude: 80.3319,
    region: "North",
    tier: "Tier2",
    popularity: 31,
  },
  {
    name: "guwahati",
    displayName: "Guwahati",
    state: "Assam",
    latitude: 26.1445,
    longitude: 91.7362,
    region: "Northeast",
    tier: "Tier2",
    popularity: 28,
  },
  {
    name: "patna",
    displayName: "Patna",
    state: "Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
    region: "East",
    tier: "Tier2",
    popularity: 26,
  },
  {
    name: "ranchi",
    displayName: "Ranchi",
    state: "Jharkhand",
    latitude: 23.3441,
    longitude: 85.3096,
    region: "East",
    tier: "Tier2",
    popularity: 24,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing locations
    await Location.deleteMany({});
    console.log("✓ Cleared existing locations");

    // Insert seed data
    const inserted = await Location.insertMany(seedLocations);
    console.log(`✓ Seeded ${inserted.length} locations`);

    // Close connection
    await mongoose.connection.close();
    console.log("✓ Database connection closed");

    console.log("\n✅ Location data seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
