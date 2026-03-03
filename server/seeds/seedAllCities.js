import mongoose from "mongoose";
import Location from "../models/Location.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

// State capitals and important cities with metadata
const cityMetadata = {
    // Metros
    mumbai: { state: "Maharashtra", region: "West", tier: "Metro", popularity: 150 },
    delhi: { state: "Delhi", region: "North", tier: "Metro", popularity: 145 },
    bangalore: { state: "Karnataka", region: "South", tier: "Metro", popularity: 135 },
    bengaluru: { state: "Karnataka", region: "South", tier: "Metro", popularity: 135 },
    hyderabad: { state: "Telangana", region: "South", tier: "Metro", popularity: 125 },
    chennai: { state: "Tamil Nadu", region: "South", tier: "Metro", popularity: 115 },
    kolkata: { state: "West Bengal", region: "East", tier: "Metro", popularity: 110 },
    // Tier 1
    pune: { state: "Maharashtra", region: "West", tier: "Tier1", popularity: 90 },
    ahmedabad: { state: "Gujarat", region: "West", tier: "Tier1", popularity: 85 },
    jaipur: { state: "Rajasthan", region: "North", tier: "Tier1", popularity: 80 },
    lucknow: { state: "Uttar Pradesh", region: "North", tier: "Tier1", popularity: 75 },
    surat: { state: "Gujarat", region: "West", tier: "Tier1", popularity: 70 },
    chandigarh: { state: "Chandigarh", region: "North", tier: "Tier1", popularity: 68 },
    kochi: { state: "Kerala", region: "South", tier: "Tier1", popularity: 65 },
    indore: { state: "Madhya Pradesh", region: "Central", tier: "Tier1", popularity: 62 },
    coimbatore: { state: "Tamil Nadu", region: "South", tier: "Tier1", popularity: 60 },
    nagpur: { state: "Maharashtra", region: "Central", tier: "Tier1", popularity: 58 },
    visakhapatnam: { state: "Andhra Pradesh", region: "South", tier: "Tier1", popularity: 55 },
    bhopal: { state: "Madhya Pradesh", region: "Central", tier: "Tier1", popularity: 52 },
    thiruvananthapuram: { state: "Kerala", region: "South", tier: "Tier1", popularity: 50 },
};

// State-to-region mapping for auto-classification
const stateRegions = {
    "Maharashtra": "West", "Gujarat": "West", "Rajasthan": "North", "Goa": "West",
    "Delhi": "North", "Uttar Pradesh": "North", "Madhya Pradesh": "Central",
    "Karnataka": "South", "Tamil Nadu": "South", "Kerala": "South",
    "Telangana": "South", "Andhra Pradesh": "South",
    "West Bengal": "East", "Bihar": "East", "Jharkhand": "East", "Odisha": "East",
    "Punjab": "North", "Haryana": "North", "Himachal Pradesh": "North",
    "Uttarakhand": "North", "Jammu and Kashmir": "North",
    "Assam": "Northeast", "Meghalaya": "Northeast", "Tripura": "Northeast",
    "Manipur": "Northeast", "Mizoram": "Northeast", "Nagaland": "Northeast",
    "Arunachal Pradesh": "Northeast", "Sikkim": "Northeast",
    "Chhattisgarh": "Central", "Chandigarh": "North",
};

// Fetch all Indian cities from free API
async function fetchIndianCities() {
    console.log("📡 Fetching Indian cities from CountriesNow API...");

    const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "India" }),
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
        throw new Error("No cities returned from API");
    }

    console.log(`✓ Got ${data.data.length} cities from API`);
    return data.data;
}

// Also fetch states for better metadata
async function fetchIndianStates() {
    try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
        });
        const data = await response.json();
        return data.data?.states || [];
    } catch {
        return [];
    }
}

async function seedAllCities() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ Connected to MongoDB\n");

        // Fetch cities
        const cities = await fetchIndianCities();
        const states = await fetchIndianStates();

        // Build state lookup from API
        const stateForCity = {};
        for (const state of states) {
            if (state.state_code) {
                // Some APIs provide city-state mapping
            }
        }

        // Build location documents
        const locations = cities.map((cityName) => {
            const key = cityName.toLowerCase().trim();
            const meta = cityMetadata[key];

            return {
                name: key.replace(/\s+/g, "-"),
                displayName: cityName.trim(),
                state: meta?.state || "India",
                region: meta?.region || stateRegions[meta?.state] || "Other",
                tier: meta?.tier || "Tier3",
                popularity: meta?.popularity || 10,
            };
        });

        // Remove duplicates by name
        const seen = new Set();
        const uniqueLocations = locations.filter((loc) => {
            const key = loc.name;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // Clear existing and insert
        await Location.deleteMany({});
        console.log("✓ Cleared existing locations");

        const inserted = await Location.insertMany(uniqueLocations);
        console.log(`✓ Seeded ${inserted.length} cities across India`);

        // Show breakdown
        const tiers = {};
        for (const loc of uniqueLocations) {
            tiers[loc.tier] = (tiers[loc.tier] || 0) + 1;
        }
        console.log("\n📊 Breakdown:");
        for (const [tier, count] of Object.entries(tiers).sort()) {
            console.log(`   ${tier}: ${count} cities`);
        }

        await mongoose.connection.close();
        console.log("\n✅ All Indian cities seeded successfully!");
    } catch (error) {
        console.error("❌ Seeding error:", error.message);
        process.exit(1);
    }
}

seedAllCities();
