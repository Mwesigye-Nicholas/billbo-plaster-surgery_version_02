import esbuild from "esbuild";

esbuild.build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node18",
    format:"esm",
    outfile: "dist/server.bundle.js",
    minify: true,
    sourcemap: false,
    external: [
    "mongodb",
    "mongoose",
    "redis",
    "bcrypt",
]
}).then(() => {
    console.log("✅ Backend bundled successfully");
}).catch(() => process.exit(1))