const address = require("address");
const fs = require("fs");
const path = require("path");

const localIp = address.ip();
const envContent = `NEXT_PUBLIC_API_URL=http://localhost:5273\nEXPO_PUBLIC_API_URL=http://${localIp}:5273`;

const paths = [
	path.join(__dirname, "../apps/web/.env.local"),
	path.join(__dirname, "../apps/mobile/.env"),
];

paths.forEach((p) => {
	fs.writeFileSync(p, envContent);
});
