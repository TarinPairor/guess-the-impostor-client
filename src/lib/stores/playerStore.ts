import { writable } from 'svelte/store';

// Writable store for the player's role
export const playerRole = writable<number | null>(null);
export const playerWord = writable<string | null>(null);
