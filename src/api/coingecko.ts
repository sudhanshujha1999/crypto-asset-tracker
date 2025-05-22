const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export interface CryptoChartData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
  lastFetched: number
}

export interface SearchResult {
  id: string
  symbol: string
  name: string
  market_cap_rank: number
}

export const searchCrypto = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  
  const response = await fetch(
    `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`
  );

  if (response.status === 429) {
    throw new Error('API rate limit reached. Please try again in a minute.');
  }

  if (!response.ok) {
    throw new Error('Failed to search cryptocurrencies');
  }

  const data = await response.json();
  return data.coins.slice(0, 10); // Return top 10 results
}

export const fetchCryptoChartData = async (
  id: string,
  days: string = '7'
): Promise<CryptoChartData> => {
  const response = await fetch(
    `${COINGECKO_API_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  );

  if (response.status === 429) {
    throw new Error('API rate limit reached. Please try again in a minute.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch chart data');
  }

  const data = await response.json();
  return {
    prices: data.prices,
    market_caps: data.market_caps,
    total_volumes: data.total_volumes,
    lastFetched: Date.now()
  };
}; 