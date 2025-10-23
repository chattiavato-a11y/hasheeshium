#!/usr/bin/env node
import { execSync } from 'node:child_process';
import os from 'node:os';

const log = (message) => {
  console.log(`\u001b[36m[nmp-diagnose]\u001b[0m ${message}`);
};

const warn = (message) => {
  console.warn(`\u001b[33m[nmp-diagnose]\u001b[0m ${message}`);
};

const error = (message) => {
  console.error(`\u001b[31m[nmp-diagnose]\u001b[0m ${message}`);
};

const checkNpmVersion = () => {
  try {
    const version = execSync('npm -v', { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
    log(`npm detected (v${version}).`);
    return true;
  } catch (err) {
    error('npm was not detected on your PATH. Install Node.js 18+ to proceed.');
    return false;
  }
};

const checkNodeVersion = () => {
  const version = process.version;
  if (!version) {
    warn('Unable to determine Node.js version.');
    return;
  }

  const major = Number(version.replace('v', '').split('.')[0]);
  if (Number.isNaN(major) || major < 18) {
    warn(`Detected Node.js ${version}. Upgrade to >=18.18.0 for parity with OPS CySec Core toolchain.`);
  } else {
    log(`Node.js runtime ${version} detected on ${os.platform()} (${os.arch()}).`);
  }
};

const checkRegistryReachability = async () => {
  if (typeof fetch !== 'function') {
    warn('Global fetch API is unavailable in this Node runtime; skipping registry reachability check.');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch('https://registry.npmjs.org/-/ping', { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      log('Reachability check succeeded: npm registry responded to ping request.');
    } else {
      warn(`npm registry responded with status ${response.status}. There may be partial connectivity issues.`);
    }
  } catch (err) {
    clearTimeout(timeout);
    warn('Unable to reach https://registry.npmjs.org/-/ping.');
    warn('If you are developing offline or behind a restricted network, use cached dependencies or mirror registries.');
    warn(`Captured error: ${err.message}`);
  }
};

const checkCacheFolder = () => {
  try {
    const cache = execSync('npm config get cache', { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
    log(`npm cache directory: ${cache}`);
  } catch (err) {
    warn('Unable to resolve npm cache directory.');
  }
};

const run = async () => {
  checkNodeVersion();
  const hasNpm = checkNpmVersion();
  if (hasNpm) {
    checkCacheFolder();
    await checkRegistryReachability();
    log('Diagnostics complete. Run `npm install` to hydrate dependencies, or attach your preferred tooling.');
  }
};

run();
