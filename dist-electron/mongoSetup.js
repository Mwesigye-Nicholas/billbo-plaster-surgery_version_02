import { MongoClient } from "mongodb";
const MONGO_URI = "mongodb://127.0.0.1:27017";
const REPL_SET_NAME = "rs0";
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
export async function initializeReplicaSet() {
    let client = null;
    let admin = null;
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
        attempts++;
        try {
            client = new MongoClient(MONGO_URI);
            await client.connect();
            admin = client.db("admin");
            const status = await admin.command({ replSetGetStatus: 1 });
            const members = status?.members ?? [];
            const primary = members.find((m) => m.state === 1 && m.health === 1);
            const isFullyReady = status?.ok === 1 &&
                primary &&
                primary.state === 1 &&
                primary.health === 1;
            if (isFullyReady) {
                console.log("Replica set FULLY READY (PRIMARY stable + healthy members)");
                return;
            }
            console.log("Replica set initializing... waiting for PRIMARY");
            await sleep(2000);
            continue;
        }
        catch (error) {
            const msgGenerated = error?.message || "";
            const code = error?.code;
            const msg = msgGenerated.toLowerCase();
            if (msg.includes("already initialized") ||
                msg.includes("already initiated") ||
                code === 23) {
                console.log("Replica set already initializing....");
                await sleep(1500);
                continue;
            }
            if (code === 94 || msg.includes("notyetinitialized")) {
                console.log(`Attempting replica set init (attempt ${attempts})`);
                if (!admin) {
                    throw new Error("Admin DB unavailable");
                }
                await admin.command({
                    replSetInitiate: {
                        _id: REPL_SET_NAME,
                        members: [
                            {
                                _id: 0,
                                host: "127.0.0.1:27017",
                            },
                        ],
                    },
                });
                await sleep(2000);
                continue;
            }
            if (msg.includes("server selection") ||
                msg.includes("topology") ||
                msg.includes("not primary") ||
                msg.includes("econnreset")) {
                console.log("Transient replica set startup state");
                await sleep(1000);
                continue;
            }
            throw error;
        }
        finally {
            if (client) {
                await client.close();
            }
        }
    }
    throw new Error("Failed to initialize replica set after multiple attempts");
}
