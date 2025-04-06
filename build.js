// build.js - Alternative to using vsce if you prefer not to install any dependencies
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Create a simple VSIX package manually
async function buildVsix() {
  console.log("Building extension package...");

  // Create temporary build directory
  const buildDir = path.join(__dirname, "build");
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  // Create extension directory structure
  const extensionDir = path.join(buildDir, "extension");
  if (!fs.existsSync(extensionDir)) {
    fs.mkdirSync(extensionDir);
  }

  // Copy necessary files
  console.log("Copying files...");
  const filesToCopy = ["extension.js", "package.json", "README.md"];
  filesToCopy.forEach((file) => {
    fs.copyFileSync(path.join(__dirname, file), path.join(extensionDir, file));
  });

  // Read package.json to get extension name and version
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  const { name, version } = packageJson;
  const vsixFilename = `${name}-${version}.vsix`;

  // Create a simple zip file (renamed to .vsix)
  console.log("Creating VSIX package...");

  // Different commands for Windows vs Unix-like systems
  const isWindows = process.platform === "win32";
  let command;

  if (isWindows) {
    // For Windows
    command = `cd ${buildDir} && powershell Compress-Archive -Path extension -DestinationPath ${name}.zip`;
  } else {
    // For Mac/Linux
    command = `cd ${buildDir} && zip -r ${name}.zip extension`;
  }

  try {
    await execPromise(command);

    // Rename .zip to .vsix
    fs.renameSync(
      path.join(buildDir, `${name}.zip`),
      path.join(__dirname, vsixFilename),
    );

    console.log(`Successfully created ${vsixFilename}`);

    // Clean up build directory
    fs.rmSync(buildDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Failed to create package:", error);
    process.exit(1);
  }
}

// Promise wrapper for exec
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Run the build
buildVsix().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
