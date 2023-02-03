import { Injectable } from '@nestjs/common';

type ValueWithTTL<V = any> = {
	value: V;
	ttl: number;
};

const cache = new Map<string, ValueWithTTL>([]);

@Injectable()
export class CacheManager {
	public async get<V>(key: string): Promise<V> {
		return cache.get(key)?.value;
	}

	public async set<V>(key: string, value: V, ttl = 5) {
		const endTTL = Date.now() + ttl * 1000;

		cache.set(key, { value, ttl: endTTL });
	}

	public async del(key: string) {
		cache.delete(key);
	}

	public async reset() {
		cache.clear();
	}
}

export function cacheTicker() {
	const timer = setInterval(() => {
		for (const [key, item] of cache) {
			if (Date.now() > item.ttl) {
				cache.delete(key);
			}
		}
	}, 1000);

	return () => {
		clearInterval(timer);
	};
}
