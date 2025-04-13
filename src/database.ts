import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("Mongo URI is missing in your .env file");
    process.exit(1); // Exit the application if Mongo URI is not available
}

const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true
  });
let db: Db;

// For Auto-Restart
const MAX_RETRIES = 25;
const RETRY_DELAY_MS = 5_000; // 10 seconds
// These lines add support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE_PATH = path.join(__dirname, '..', 'mongo-error.log');

// Function to log errors with simplified English messages to both file and console
function logErrorToFile(error: unknown) {
    const errorMessage = `[${new Date().toISOString()}] ${String(error)}\n`;

    // Log to console (Railway will capture this)
    console.error(errorMessage);

    // Also save locally (for development use)
    fs.appendFileSync(LOG_FILE_PATH, errorMessage);
}


function logSimpleErrorToConsole(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // If the error message is too long, truncate it
    const maxLength = 200; // Limit to 200 characters for cleaner output
    const shortErrorMessage = errorMessage.length > maxLength 
        ? errorMessage.substring(0, maxLength) + '...'
        : errorMessage;

    console.error(`Oops! Something went wrong: ${shortErrorMessage}`);
    console.error("Please check the log file for more details.");
}

async function connectToDatabase(retries: number = MAX_RETRIES): Promise<void> {
    try {
        await client.connect();
        db = client.db("BotData");
        console.log("Connected to MongoDB!");
    } catch (error) {
        const errorMessage = String(error);

        // Log the error in simple English
        logSimpleErrorToConsole("Could not connect to MongoDB. Retrying...");

        // Log the detailed error to the file
        logErrorToFile(errorMessage);

        if (retries > 0) {
            console.log(`🔁 Retrying in ${RETRY_DELAY_MS / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => {
                connectToDatabase(retries - 1);
            }, RETRY_DELAY_MS);
        } else {
            console.error("❌ All retry attempts failed. Restarting in 5 seconds...");
            setTimeout(() => {
                process.exit(1);
            }, 5000);
        }
    }
}

export async function getDb(): Promise<Db> {
    if (!db) {
        console.log("Database is not initialized yet. Initializing...");
        console.log("🟡 initializeDatabase() called");
        await connectToDatabase();  // Ensure DB is connected before using it
    }
    return db!;
}

// Initialize the database
export async function initializeDatabase(): Promise<void> {
    console.log("🟠 connectToDatabase() called...")
    await connectToDatabase();
    
}
