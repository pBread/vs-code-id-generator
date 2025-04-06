# VSCode ID Generator

A lightweight extension for generating easily readable IDs in your VSCode editor.

## Features

This extension generates IDs in the format `XXXXX-AAA-000` where:

- `XXXXX` is a random alphanumeric slug (length configurable)
- `AAA` is a persistent namespace of random capital letters (length configurable)
- `000` is an incrementing number (length configurable)

The IDs are designed to be both unique and human-readable, with the consistent namespace and incrementing numbers making it easier to track related IDs.

## Usage

### Commands

- **Generate ID** (`Ctrl+I`): Insert a newly generated ID at the cursor position
- **Reset ID Incrementer** (`Ctrl+Shift+I`): Reset the incrementer back to 000 and generate a new namespace

### Behavior

- The incrementer automatically increases by 1 with each generated ID
- When the incrementer reaches its maximum (e.g., 999 for 3 digits), it automatically resets to 000 and a new namespace is randomly generated
- You can manually reset the incrementer at any time using the reset command

## Configuration

You can customize the ID format through the following settings:

- `idGenerator.slugLength`: Length of the random slug portion (default: 5)
- `idGenerator.namespaceLength`: Length of the namespace portion (default: 3)
- `idGenerator.incrementorLength`: Length of the incrementor portion (default: 3)
- `idGenerator.includeQuotes`: Whether to include quotation marks around the generated ID (default: false)

## Installation

1. Download the `.vsix` file from the releases
2. In VSCode, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Select "Extensions: Install from VSIX..." and choose the downloaded file
4. Reload VSCode when prompted

## Building from Source

1. Clone this repository
2. Run `npm install` to install development dependencies
3. Run `npm run package` to create the `.vsix` file
4. Install the extension as described above

## No Dependencies

This extension is built with zero dependencies, using only the VSCode API.
