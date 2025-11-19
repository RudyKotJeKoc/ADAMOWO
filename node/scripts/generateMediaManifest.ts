#!/usr/bin/env node
/**
 * Media Manifest Generator
 *
 * Scans media directories and generates a manifest JSON file with:
 * - All images in public/media/images
 * - All videos in public/media/video
 * - Audio tracks from playlist.json
 * - Metadata extraction (dimensions, duration, file size)
 * - Checksums for integrity verification
 *
 * Usage:
 *   pnpm tsx node/scripts/generateMediaManifest.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
  tags?: string[];
  createdAt: string;
  fileSize?: number;
  checksum?: string;
}

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  [key: string]: string | number | boolean | object;
}

interface MediaManifest {
  version: string;
  generatedAt: string;
  images: MediaItem[];
  videos: MediaItem[];
  audio: AudioTrack[];
  totalSize: number;
  checksums: Record<string, string>;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const ROOT_DIR = path.resolve(__dirname, '../..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'media/images');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'media/video');
const MUSIC_DIR = path.join(PUBLIC_DIR, 'music');
const PLAYLIST_PATH = path.join(MUSIC_DIR, 'playlist.json');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'data/media-manifest.json');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Calculate file checksum (SHA-256)
 */
function calculateChecksum(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Get file stats
 */
function getFileStats(filePath: string) {
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    createdAt: stats.birthtime.toISOString(),
    modifiedAt: stats.mtime.toISOString(),
  };
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Generate unique ID from filename
 */
function generateId(filename: string, type: string): string {
  const nameWithoutExt = path.parse(filename).name;
  return `${type}-${nameWithoutExt}-${Date.now().toString(36)}`;
}

/**
 * Convert file path to public URL
 */
function toPublicUrl(filePath: string): string {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  return '/' + relativePath.replace(/\\/g, '/');
}

// ============================================================================
// MEDIA SCANNING
// ============================================================================

/**
 * Scan directory for files with specific extensions
 */
function scanDirectory(dir: string, extensions: string[]): string[] {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return [];
  }

  const files: string[] = [];

  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return files;
}

/**
 * Process image files into MediaItems
 */
function processImages(imagePaths: string[]): MediaItem[] {
  console.log(`\n🖼️  Processing ${imagePaths.length} images...`);

  return imagePaths.map((filePath) => {
    const filename = path.basename(filePath);
    const stats = getFileStats(filePath);
    const checksum = calculateChecksum(filePath);

    // Extract title from filename
    const title = path.parse(filename).name.replace(/[-_]/g, ' ');

    const item: MediaItem = {
      id: generateId(filename, 'image'),
      type: 'image',
      url: toPublicUrl(filePath),
      title,
      createdAt: stats.createdAt,
      fileSize: stats.size,
      checksum,
      tags: [],
    };

    console.log(`  ✓ ${filename} (${(stats.size / 1024).toFixed(2)} KB)`);

    return item;
  });
}

/**
 * Process video files into MediaItems
 */
function processVideos(videoPaths: string[]): MediaItem[] {
  console.log(`\n🎥 Processing ${videoPaths.length} videos...`);

  return videoPaths.map((filePath) => {
    const filename = path.basename(filePath);
    const stats = getFileStats(filePath);
    const checksum = calculateChecksum(filePath);

    // Extract title from filename
    const title = path.parse(filename).name.replace(/[-_]/g, ' ');

    const item: MediaItem = {
      id: generateId(filename, 'video'),
      type: 'video',
      url: toPublicUrl(filePath),
      title,
      createdAt: stats.createdAt,
      fileSize: stats.size,
      checksum,
      tags: [],
    };

    console.log(`  ✓ ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    return item;
  });
}

/**
 * Load audio tracks from playlist.json
 */
function loadAudioTracks(): AudioTrack[] {
  console.log(`\n🎵 Loading audio tracks from playlist...`);

  if (!fs.existsSync(PLAYLIST_PATH)) {
    console.warn(`⚠️  Playlist not found: ${PLAYLIST_PATH}`);
    return [];
  }

  try {
    const playlistContent = fs.readFileSync(PLAYLIST_PATH, 'utf-8');
    const tracks = JSON.parse(playlistContent);

    if (!Array.isArray(tracks)) {
      console.error('❌ Playlist is not an array');
      return [];
    }

    console.log(`  ✓ Loaded ${tracks.length} tracks`);
    return tracks;
  } catch (error) {
    console.error('❌ Failed to load playlist:', error);
    return [];
  }
}

// ============================================================================
// MANIFEST GENERATION
// ============================================================================

/**
 * Generate complete media manifest
 */
function generateManifest(): MediaManifest {
  console.log('🚀 Generating media manifest...\n');
  console.log(`Root directory: ${ROOT_DIR}`);
  console.log(`Public directory: ${PUBLIC_DIR}`);

  // Ensure directories exist
  ensureDir(IMAGES_DIR);
  ensureDir(VIDEOS_DIR);
  ensureDir(path.dirname(OUTPUT_PATH));

  // Scan media directories
  const imagePaths = scanDirectory(IMAGES_DIR, IMAGE_EXTENSIONS);
  const videoPaths = scanDirectory(VIDEOS_DIR, VIDEO_EXTENSIONS);

  // Process media files
  const images = processImages(imagePaths);
  const videos = processVideos(videoPaths);
  const audio = loadAudioTracks();

  // Calculate totals
  const totalSize = [
    ...images.map((i) => i.fileSize || 0),
    ...videos.map((v) => v.fileSize || 0),
  ].reduce((sum, size) => sum + size, 0);

  // Generate checksums map
  const checksums: Record<string, string> = {};
  [...images, ...videos].forEach((item) => {
    if (item.checksum) {
      checksums[item.url] = item.checksum;
    }
  });

  // Create manifest
  const manifest: MediaManifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    images,
    videos,
    audio,
    totalSize,
    checksums,
  };

  return manifest;
}

/**
 * Save manifest to file
 */
function saveManifest(manifest: MediaManifest) {
  console.log(`\n💾 Saving manifest to: ${OUTPUT_PATH}`);

  const json = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(OUTPUT_PATH, json, 'utf-8');

  console.log('✅ Manifest saved successfully!\n');
}

/**
 * Print summary
 */
function printSummary(manifest: MediaManifest) {
  console.log('📊 Manifest Summary:');
  console.log('─'.repeat(50));
  console.log(`  Images:     ${manifest.images.length}`);
  console.log(`  Videos:     ${manifest.videos.length}`);
  console.log(`  Audio:      ${manifest.audio.length}`);
  console.log(`  Total Size: ${(manifest.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Version:    ${manifest.version}`);
  console.log(`  Generated:  ${new Date(manifest.generatedAt).toLocaleString()}`);
  console.log('─'.repeat(50));
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  try {
    const manifest = generateManifest();
    saveManifest(manifest);
    printSummary(manifest);

    console.log('\n✨ Done! Media manifest generated successfully.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generating manifest:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateManifest, saveManifest };
