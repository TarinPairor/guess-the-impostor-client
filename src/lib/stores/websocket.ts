import { writable } from 'svelte/store';

export const websocket = writable<WebSocket | null>(null);

export function initializeWebSocket(url: string): WebSocket {
	let existingWebSocket: WebSocket | null = null;

	websocket.subscribe((ws) => {
		existingWebSocket = ws;
	});

	if (existingWebSocket && existingWebSocket.readyState === WebSocket.OPEN) {
		console.log('WebSocket already initialized');
		return existingWebSocket;
	}

	const ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('WebSocket connection opened');
	};

	ws.onmessage = (event: MessageEvent) => {
		console.log('Message received:', event.data);
	};

	ws.onclose = () => {
		console.log('WebSocket connection closed');
	};

	ws.onerror = (error: Event) => {
		console.error('WebSocket error:', error);
	};

	websocket.set(ws);

	return ws;
}
