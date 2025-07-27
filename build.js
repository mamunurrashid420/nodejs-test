const fs = require('fs');
const path = require('path');

// Build configuration
const BUILD_DIR = 'dist';
const SOURCE_FILES = ['app.js', 'package.json'];

console.log('🔨 Starting build process...');

// Clean and create build directory
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true });
  console.log('🧹 Cleaned existing build directory');
}

fs.mkdirSync(BUILD_DIR, { recursive: true });
console.log('📁 Created build directory');

// Copy source files to build directory
SOURCE_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    const destPath = path.join(BUILD_DIR, file);
    fs.copyFileSync(file, destPath);
    console.log(`📄 Copied ${file} to ${destPath}`);
  }
});

// Create optimized app.js for production
const appContent = fs.readFileSync('app.js', 'utf8');

// Add production optimizations
const optimizedContent = `// Production build - Generated on ${new Date().toISOString()}
${appContent}

// Production optimizations
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
`;

fs.writeFileSync(path.join(BUILD_DIR, 'app.js'), optimizedContent);
console.log('⚡ Created optimized production app.js');

// Create production package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const prodPackageJson = {
  ...packageJson,
  scripts: {
    start: "node app.js"
  },
  devDependencies: undefined // Remove dev dependencies for production
};

fs.writeFileSync(
  path.join(BUILD_DIR, 'package.json'), 
  JSON.stringify(prodPackageJson, null, 2)
);
console.log('📦 Created production package.json');

// Create README for the build
const buildReadme = `# Production Build

This directory contains the production-ready build of the Hello World Node.js application.

## Files:
- app.js: Optimized application with graceful shutdown handling
- package.json: Production package configuration

## To run:
\`\`\`bash
cd dist
npm start
\`\`\`

Built on: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}
`;

fs.writeFileSync(path.join(BUILD_DIR, 'README.md'), buildReadme);
console.log('📖 Created build README');

console.log('✅ Build completed successfully!');
console.log(`📂 Build output: ./${BUILD_DIR}/`);
console.log('🚀 Run "npm run serve" to start the production build');
