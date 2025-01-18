import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

export const load = async ({ params }) => {
	const res = await fetch('https://52f89090ae014156a19cab161255b330.api.mockbin.io/');
	if (!res.ok) {
		throw error(res.status, 'Failed to fetch data');
	}
	const data = await res.json();
	return {
		id: params.id,
		message: data.message
	};
};
