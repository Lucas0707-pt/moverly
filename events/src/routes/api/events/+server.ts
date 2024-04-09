import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

// Get all events
export const GET = (async () => {
	const events = await prisma.event.findMany();

	const data = JSON.stringify({ events });

	return new Response(data);
}) satisfies RequestHandler;
