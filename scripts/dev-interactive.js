#!/usr/bin/env node

const readline = require("readline");
const { spawn } = require("child_process");
const path = require("path");

const IS_WIN = process.platform === "win32";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => {
		rl.question(query, resolve);
	});
}

function spawnPnpm(args, options = {}) {
	return spawn("pnpm", args, {
		cwd: path.join(__dirname, ".."),
		stdio: "inherit",
		shell: IS_WIN,
		...options,
	});
}

function waitForExit(child) {
	return new Promise((resolve, reject) => {
		child.on("error", reject);
		child.on("close", (code) => resolve(code ?? 0));
	});
}

async function main() {
	console.log("\n🚀 Select services to run:\n");

	const runBackend = await question("Run backend? (Y/n): ");
	const runWeb = await question("Run web? (Y/n): ");
	const runMobile = await question("Run mobile? (Y/n): ");

	rl.close();

	const shouldRunBackend = runBackend.toLowerCase() !== "n";
	const shouldRunWeb = runWeb.toLowerCase() !== "n";
	const shouldRunMobile = runMobile.toLowerCase() !== "n";

	if (!shouldRunBackend && !shouldRunWeb && !shouldRunMobile) {
		console.log("\n❌ No services selected. Exiting...\n");
		process.exit(0);
	}

	const commands = [];
	const children = new Map();
	let shuttingDown = false;

	function killAll() {
		for (const child of children.values()) {
			if (child && !child.killed) child.kill();
		}
	}

	function attachLifecycle(name, child) {
		children.set(name, child);
		child.on("exit", (code, signal) => {
			if (shuttingDown) return;
			shuttingDown = true;
			killAll();
			if (signal) process.exit(1);
			process.exit(code ?? 0);
		});
		child.on("error", (err) => {
			if (shuttingDown) return;
			shuttingDown = true;
			console.error(`Error in ${name}:`, err);
			killAll();
			process.exit(1);
		});
	}

	process.on("SIGINT", () => {
		shuttingDown = true;
		killAll();
		process.exit(130);
	});

	// Start backend first if selected (so it's ready for type generation)
	let backendProcess = null;
	if (shouldRunBackend) {
		console.log("\n🚀 Starting backend...\n");
		backendProcess = spawnPnpm(["backend:dev"]);
		attachLifecycle("backend", backendProcess);
	}

	// Update IP before running frontend services
	if (shouldRunWeb || shouldRunMobile) {
		console.log("\n📡 Updating IP configuration...\n");
		const updateIp = spawn("node", ["scripts/update-ip.js"], {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit",
		});
		const updateIpCode = await waitForExit(updateIp);
		if (updateIpCode !== 0) {
			if (backendProcess) backendProcess.kill();
			process.exit(updateIpCode);
		}

		// Generate types (wait-on will wait for backend to be ready)
		console.log("\n🔄 Generating types (waiting for backend)...\n");
		const generateTypes = spawnPnpm(["generate-types"]);
		const generateTypesCode = await waitForExit(generateTypes);
		if (generateTypesCode !== 0) {
			if (backendProcess) backendProcess.kill();
			process.exit(generateTypesCode);
		}
	}

	if (shouldRunWeb) {
		commands.push("web");
	}

	if (shouldRunMobile) {
		commands.push("mobile");
	}

	// If only backend is selected, it's already running
	if (shouldRunBackend && !shouldRunWeb && !shouldRunMobile) {
		console.log("\n✅ Backend is running\n");
		backendProcess.on("close", (code) => {
			process.exit(code);
		});
		return;
	}

	// Start frontend services if selected
	if (commands.length > 0) {
		console.log(`\n✅ Starting: ${commands.join(", ")}\n`);

		if (shouldRunWeb) {
			const web = spawnPnpm(["web:dev"]);
			attachLifecycle("web", web);
		}

		if (shouldRunMobile) {
			// Best-effort cleanup of adb before starting Expo/Android tooling
			const taskkill = spawn(
				"taskkill",
				["/F", "/IM", "adb.exe", "/T", "/FI", "status eq running"],
				{ stdio: "ignore", shell: IS_WIN }
			);
			await waitForExit(taskkill).catch(() => {});

			const mobile = spawnPnpm(["mobile:dev"]);
			attachLifecycle("mobile", mobile);
		}
	}
}

main().catch((error) => {
	console.error("Error:", error);
	process.exit(1);
});
