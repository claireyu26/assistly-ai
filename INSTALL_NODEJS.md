# Installing Node.js on Windows

Node.js is required to run and build your Assistly AI project. Follow these steps:

## Option 1: Install via Official Website (Recommended)

1. **Download Node.js**:
   - Go to https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit or 32-bit)

2. **Run the Installer**:
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important**: Make sure to check "Add to PATH" during installation
   - Click "Install" and wait for completion

3. **Verify Installation**:
   - Close and reopen your terminal/PowerShell
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v20.11.0` and `10.2.4`)

## Option 2: Install via Chocolatey (If you have it)

If you have Chocolatey package manager installed:

```powershell
choco install nodejs-lts
```

## Option 3: Install via Winget (Windows 11)

If you're on Windows 11 with winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

## After Installation

1. **Close and reopen your terminal/PowerShell** (important for PATH to update)

2. **Verify it works**:
   ```powershell
   node --version
   npm --version
   ```

3. **Navigate to your project**:
   ```powershell
   cd C:\Users\clair\OneDrive\Documents\ai-biz
   ```

4. **Install project dependencies**:
   ```powershell
   npm install
   ```

5. **Build the project** (optional, for testing):
   ```powershell
   npm run build
   ```

## Troubleshooting

### If `npm` still not recognized after installation:

1. **Restart your computer** (sometimes needed for PATH changes)

2. **Check PATH manually**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path"
   - Make sure these are included:
     - `C:\Program Files\nodejs\`
     - `C:\Users\YourUsername\AppData\Roaming\npm` (optional)

3. **Reinstall Node.js** and make sure "Add to PATH" is checked

## Next Steps

Once Node.js is installed:
- You can run `npm install` to install dependencies
- You can run `npm run dev` to start the development server
- You can deploy to Vercel (Vercel will handle the build automatically)
