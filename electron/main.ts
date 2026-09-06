import { app, BrowserWindow } from "electron";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
import fs from "fs";
import { Long, MongoClient } from "mongodb";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcessWithoutNullStreams | null = null;
let redisProcess: ChildProcessWithoutNullStreams | null = null;
let mongoProcess: ChildProcessWithoutNullStreams | null = null;

function getBasePath() {
  return app.isPackaged ? process.resourcesPath : path.join(__dirname, "..");
}

function getRedisPath() {
  const base = getBasePath();

  return path.join(base, "bin", "redis", "win", "redis-server.exe");
}

function getMongoPath() {
  const base = getBasePath();

  return path.join(base, "bin", "mongodb", "win", "mongod.exe");
}

function getMongoDataPath() {
  return path.join(app.getPath("userData"), "mongodb-data");
}

function getNodePath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "bin", "node", "node.exe")
    : path.join(getBasePath(), "electron", "bin", "node", "node.exe");
}

function startBackend() {
  const base = getBasePath();
  const serverPath = path.join(base, "server/dist/server.js");

  backendProcess = spawn(getNodePath(), [serverPath], {
    cwd: base,
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data.toString()}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data.toString()}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend exited with code ${code}`);
  });
  backendProcess.on("error", (error) => {
    console.error("Backend process Failed.", error);
  });

  backendProcess.on("exit", (code, signal) => {
    console.error(`Backend exited (${code}, ${signal})`);
    backendProcess = null;
  });
}

function startRedis() {
  const redisPath = getRedisPath();

  redisProcess = spawn(redisPath, ["--port", "6380"], {
    cwd: getBasePath(),
  });

  redisProcess.stdout.on("data", (data) => {
    console.log(`Redis: ${data.toString()}`);
  });

  redisProcess.stderr.on("data", (data) => {
    console.error(`Redis Error: ${data.toString()}`);
  });

  redisProcess.on("close", (code) => {
    console.log(`Redis exited with code ${code}`);
  });

  redisProcess.on("error", (error) => {
    console.error("Redis Process Failed.", error);
  });

  redisProcess.on("exit", (code, signal) => {
    console.error(`Redis exited (${code}, ${signal})`);
    redisProcess = null;
  });
}

async function waitForMongoDBReady(interval = 1000, maxRetries = 30) {

  console.log("⏳ Waiting for MongoDB to be ready...")

  for (let i = 0; i < maxRetries; i++){
    try {
      const tempClient = new MongoClient("mongodb://127.0.0.1:27017", {
        serverSelectionTimeoutMS: 2000,
        directConnection: true
      });

      await tempClient.connect();
      await tempClient.close();

      console.log("✅ MongoDB is ready");
      return;
    } catch (error: any) {
       console.log(`Attempt ${i + 1}/${maxRetries}: MongoDB not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
   throw new Error("MongoDB not ready after maximum retries");
}

async function waitForPrimaryElection(maxWaitMs = 30000) {
  const startTime = Date.now();

  let client = null;
  while (Date.now() - startTime < maxWaitMs) {
    try {
      client = new MongoClient("mongodb://127.0.0.1:27017/?replicaSet=rs0", {
        serverSelectionTimeoutMS: 3000,
        directConnection: false
      });

      await client.connect();
      const admin = client.db("admin");

      const isMaster = await admin.command({ isMaster: 1 });

      if (isMaster.isMaster) {
        console.log("✅ Primary node elected!");
        return true;
      }

       console.log("⏳ Waiting for primary election (current state not primary)...");

    } catch (error) {
      console.log("⏳ Waiting for replica set to elect primary...");
    } finally {
       if (client) {
        await client.close().catch(() => {});
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error("Primary election timeout after " + maxWaitMs + "ms");
}

async function initializeReplicaSet(){
  let client;

  try {
    console.log("🔄 Initializing replica set...");

    await waitForMongoDBReady();

    client = new MongoClient("mongodb://127.0.0.1:27017/", {
      directConnection: true,  // Connect directly, no replica set discovery
      serverSelectionTimeoutMS: 5000
    })
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const admin = client.db("admin");

    //checking whether replica set already initialized
    try {
      const isMaster = await admin.command({ isMaster: 1 });
      if (isMaster.setName === "rs0") {
        console.log("✅ Replica set 'rs0' is already configured");
        return true;
      }
    } catch (error) {
       console.log("No existing replica set config found");
    }

    const config = {
      _id: "rs0",
      members: [
        {
          _id: 0,
          host:  "127.0.0.1:27017",
          priority: 1
        }
      ]
    }
    
    console.log("📝 Initiating replica set with config:", config);
    const result = await admin.command({ replSetInitiate: config });
    
    console.log("✅ Replica set initiated:", result);
    console.log("⏳ Waiting for primary election...");
    await waitForPrimaryElection();
    
    console.log("🎉 Replica set is fully ready for transactions!");
    return true;
  } catch (error: any) {
    console.error("❌ Failed to initialize replica set:", error);

    //case where it is already initializing
    if (error.codeName === "AlreadyInitialized") {
        console.log("Replica set already initializing, waiting for primary...");
        await waitForPrimaryElection();
      return true;
    }
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}



function startMongoDB() {
  const dbPath = getMongoDataPath();

  const mongoPath = getMongoPath();
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  console.log("Mongo Path:", mongoPath);
  console.log("DB Path:", dbPath);
  console.log("MongoDB executable:", mongoPath);
  console.log("mongo exists:", fs.existsSync(mongoPath));

  mongoProcess = spawn(
    mongoPath,
    ["--dbpath", dbPath, "--replSet", "rs0", "--bind_ip", "127.0.0.1", "--oplogSize", "128"],
    {
      cwd: getBasePath(),
    },
  );

  mongoProcess.stdout.on("data", (data) => {
    console.log(`MongoDB: ${data.toString()}`);
  });
  mongoProcess.stderr.on("data", (data) => {
    console.error(`MongoDB Error: ${data.toString()}`);
  });

  mongoProcess.on("close", (code) => {
    console.log(`Mongo closed with code ${code}`);
  });

  mongoProcess.on("error", (error) => {
    console.error("Mongo spawn error", error);
  });

  mongoProcess.on("exit", (code, signal) => {
    console.error(`Mongo exited (${code}, ${signal})`);
    mongoProcess = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    //icon: path.join(process.resourcesPath, "icon.ico"),
  });

  if (app.isPackaged) {
    const indexPath = path.join(__dirname, "../client/dist/index.html");

    console.log("Loading:....", indexPath);
    mainWindow.loadFile(indexPath);
  } else {
    const indexPath = path.join(__dirname, "../client/dist/index.html");
    console.log("Loading:....", indexPath);
    mainWindow.loadFile(indexPath);
    
  }
}

function waitForPort(port: number, host = "127.0.0.1", timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let done = false;

    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error(`Timeout waiting for port ${port}`));
      }
    }, timeoutMs);

    const interval = setInterval(() => {
      const socket = net.createConnection(port, host);

      socket.on("connect", () => {
        if (done) return;
        done = true;

        clearTimeout(timeout);
        clearInterval(interval);
        socket.end();
        resolve(true);
      });

      socket.on("error", () => {
        socket.destroy();
      });
    }, 300);
  });
}

app.whenReady().then(async () => {
  try {
    
    console.log("Starting MongoDB... AND Replica set...")
    startMongoDB();
    await waitForMongoDBReady();
    await initializeReplicaSet();
    console.log("MongoDB connection successfully");

    console.log("Connecting to Redis DB.")
    startRedis();

    await waitForPort(6380);

    console.log("Redis Database connected successfully");

    console.log("Starting backend initialized....")
    startBackend();
     console.log("Starting express initialized....")
    await waitForPort(5000);
    console.log("Express started successfully, and is listening....");

    createWindow();
  } catch (error) {
    console.error("Startup failed", error);
    app.quit();
  }
});

app.on("will-quit", () => {
  if (backendProcess) backendProcess.kill("SIGTERM");
  if (redisProcess) redisProcess.kill("SIGTERM");
  if (mongoProcess) mongoProcess.kill("SIGTERM");
});
