import { searchCrypto, fetchCryptoChartData } from '../coingecko';

// Mock the global fetch function
global.fetch = jest.fn();

describe('CoinGecko API', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('searchCrypto', () => {
        it('should return an empty array for empty query', async () => {
            const results = await searchCrypto('');
            expect(results).toEqual([]);
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should fetch and return search results', async () => {
            const mockResponse = {
                coins: [
                    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1 },
                    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', market_cap_rank: 2 },
                ],
            };
            const mockFetchPromise = Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
                status: 200,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const query = 'bitcoin';
            const results = await searchCrypto(query);

            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
            );
            expect(results).toEqual(mockResponse.coins);
        });

        it('should throw an error on API rate limit (429)', async () => {
            const mockFetchPromise = Promise.resolve({
                ok: false,
                status: 429,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const query = 'bitcoin';
            await expect(searchCrypto(query)).rejects.toThrow(
                'API rate limit reached. Please try again in a minute.'
            );
            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
            );
        });

        it('should throw an error on other non-ok responses', async () => {
            const mockFetchPromise = Promise.resolve({
                ok: false,
                status: 500,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const query = 'bitcoin';
            await expect(searchCrypto(query)).rejects.toThrow(
                'Failed to search cryptocurrencies'
            );
            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
            );
        });
    });

    describe('fetchCryptoChartData', () => {
        it('should fetch and return chart data', async () => {
            const mockResponse = {
                prices: [[1678886400000, 20000], [1678972800000, 21000]],
                market_caps: [[1678886400000, 400000000], [1678972800000, 420000000]],
                total_volumes: [[1678886400000, 2000000000], [1678972800000, 2100000000]],
            };
            const mockFetchPromise = Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
                status: 200,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const id = 'bitcoin';
            const days = '7';
            const chartData = await fetchCryptoChartData(id, days);

            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
            );
            expect(chartData).toEqual({
                ...mockResponse,
                lastFetched: expect.any(Number)
            });
        });

        it('should throw an error on API rate limit (429)', async () => {
            const mockFetchPromise = Promise.resolve({
                ok: false,
                status: 429,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const id = 'bitcoin';
            await expect(fetchCryptoChartData(id)).rejects.toThrow(
                'API rate limit reached. Please try again in a minute.'
            );
            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
            );
        });

        it('should throw an error on other non-ok responses', async () => {
            const mockFetchPromise = Promise.resolve({
                ok: false,
                status: 500,
            }) as Promise<Response>;
            (fetch as jest.Mock).mockImplementationOnce(() => mockFetchPromise);

            const id = 'bitcoin';
            await expect(fetchCryptoChartData(id)).rejects.toThrow(
                'Failed to fetch chart data'
            );
            expect(fetch).toHaveBeenCalledWith(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
            );
        });
    });
}); 