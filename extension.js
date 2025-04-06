// extension.js
const vscode = require("vscode");

// State management
let currentNamespace = generateRandomNamespace();
let currentIncrement = 0;
let maxIncrement = 999; // Default max based on 3 digits

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("ID Generator extension is now active");

  // Read configuration
  updateConfigurationValues();

  // Register configuration change listener
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("idGenerator")) {
        updateConfigurationValues();
      }
    }),
  );

  // Register generate ID command
  let generateIdCommand = vscode.commands.registerCommand(
    "idGenerator.generateId",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      const id = generateId();
      editor.edit((editBuilder) => {
        editor.selections.forEach((selection) => {
          editBuilder.insert(selection.active, id);
        });
      });

      // Increment counter for next use
      currentIncrement++;

      // Check if we need to reset
      if (currentIncrement > maxIncrement) {
        resetIncrementer();
      }
    },
  );

  // Register reset command
  let resetCommand = vscode.commands.registerCommand(
    "idGenerator.resetIncrementer",
    function () {
      resetIncrementer();
      vscode.window.showInformationMessage(
        `ID Generator reset. New namespace: ${currentNamespace}`,
      );
    },
  );

  context.subscriptions.push(generateIdCommand);
  context.subscriptions.push(resetCommand);
}

/**
 * Update configuration values from settings
 */
function updateConfigurationValues() {
  const config = vscode.workspace.getConfiguration("idGenerator");
  const slugLength = config.get("slugLength", 5);
  const namespaceLength = config.get("namespaceLength", 3);
  const incrementorLength = config.get("incrementorLength", 3);

  // Set max incrementor based on number of digits
  maxIncrement = Math.pow(10, incrementorLength) - 1;

  // If current namespace length doesn't match config, regenerate it
  if (currentNamespace.length !== namespaceLength) {
    currentNamespace = generateRandomNamespace(namespaceLength);
  }
}

/**
 * Reset the incrementer and generate a new namespace
 */
function resetIncrementer() {
  currentIncrement = 0;

  // Get namespace length from config
  const config = vscode.workspace.getConfiguration("idGenerator");
  const namespaceLength = config.get("namespaceLength", 3);

  currentNamespace = generateRandomNamespace(namespaceLength);
}

/**
 * Generate a random namespace of uppercase letters
 * @param {number} length - Length of the namespace
 * @returns {string} Random namespace
 */
function generateRandomNamespace(length = 3) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Generate random alphanumeric characters
 * @param {number} length - Length of the random string
 * @returns {string} Random alphanumeric string
 */
function generateRandomSlug(length = 5) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Generate an ID in the format XXXXX-AAA-000 or "XXXXX-AAA-000"
 * @returns {string} Generated ID
 */
function generateId() {
  const config = vscode.workspace.getConfiguration("idGenerator");
  const slugLength = config.get("slugLength", 5);
  const incrementorLength = config.get("incrementorLength", 3);
  const includeQuotes = config.get("includeQuotes", false);

  // Generate random slug
  const slug = generateRandomSlug(slugLength);

  // Format increment with leading zeros
  const increment = currentIncrement
    .toString()
    .padStart(incrementorLength, "0");

  // Create the ID with or without quotes
  const baseId = `${slug}-${currentNamespace}-${increment}`;
  return includeQuotes ? `"${baseId}"` : baseId;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
