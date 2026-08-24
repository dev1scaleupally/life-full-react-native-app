/**
 * The ONLY file you need to edit to point the app at a real backend.
 *
 * Fill in API_BASE_URL with the deployed API's root (no trailing slash, no
 * /v1 — every request in services/api/httpClient.ts appends /v1 itself).
 * e.g. 'https://api.lifefull.app' or 'http://localhost:3000' for a local
 * server (use your machine's LAN IP, not localhost, when testing on a
 * physical device or a simulator that can't reach the host's loopback).
 */
export const API_BASE_URL = 'http://localhost:3000';

export const isApiConfigured = () => API_BASE_URL.length > 0;
