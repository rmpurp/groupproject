import { build } from 'esbuild';
import { execSync } from 'child_process';
import { cpSync } from 'fs';

try {
  // Step 1: Type-check with tsc
  console.log("🧠 Type-checking with tsc...");
  execSync('npx tsc --noEmit', { stdio: 'inherit' });

  // Step 2: Copy static files
  console.log('🧼 Copying static files...');
  cpSync('public', 'dist', { recursive: true });


  // Step 3: Bundle with esbuild
  console.log("📦 Bundling with esbuild...");

  const ctx = await build({
    entryPoints: ['src/popup.tsx'],
    bundle: true,
    outfile: 'dist/popup.js',
    sourcemap: true,
    minify: false,
    target: 'es2022',
    format: 'esm',
    jsx: 'automatic',
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx'
    }
  });
  console.log("✅ Build complete.");
} catch (err) {
  console.error("🚨 Build failed.");
  console.error(err);
  process.exit(1);
}
