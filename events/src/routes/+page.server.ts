import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import prisma from '$lib/prisma';

function translateCoords(latitude: number, longitude: number): [number, number] {
	const baseLatitude = 32.760199,
		baseLongitue = -16.962468;
	const step = 0.45343;
	return [(latitude - baseLatitude) / step, (longitude - baseLongitue) / step];
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();

		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const price = Number(data.get('price') as string);
		let date: string | Date = data.get('date') as string;
		const latitude = Number.parseFloat(data.get('latitude') as string);
		const longitude = Number.parseFloat(data.get('longitude') as string);

		const [yCoord, xCoord] = translateCoords(latitude, longitude);

		if (!name || !description || !latitude || !longitude || !date) {
			return fail(400, { name, description, latitude, longitude, date, price, missing: true });
		}

		if (isNaN(price) || price < 0) {
			return fail(400, { price, incorrect: true });
		}

		date = new Date(date);

		if (date.getTime() <= Date.now()) {
			return fail(400, { date, incorrect: true });
		}

		await prisma.event.create({
			data: {
				name,
				description,
				price,
				date,
				xCoord,
				yCoord
			}
		});

		return { success: true };
	}
} satisfies Actions;
