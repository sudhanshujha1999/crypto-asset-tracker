import { act } from 'react';
import { useCryptoStore, type CryptoData } from '../../store/useCryptoStore'; // Corrected import path

describe('useCryptoStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        act(() => useCryptoStore.setState(useCryptoStore.getInitialState()));
    });

    it('should initialize with default values', () => {
        const state = useCryptoStore.getState();
        expect(state.selectedAssets).toEqual(['bitcoin']);
        expect(state.data).toEqual({});
        expect(state.timeRange).toBe('7');
        expect(state.loading).toBe(false);
        expect(state.lastAccessed).toEqual({});
        expect(state.assetDetails).toEqual({});
    });

    it('should set selected assets', () => {
        const newSelectedAssets = ['ethereum', 'litecoin'];
        act(() => useCryptoStore.getState().setSelectedAssets(newSelectedAssets));
        const state = useCryptoStore.getState();
        expect(state.selectedAssets).toEqual(newSelectedAssets);
    });

    it('should set asset data', () => {
        const assetId = 'bitcoin';
        const timeRange = '7';
        const cryptoData = { prices: [[1, 100], [2, 101]], market_caps: [[1, 1000], [2, 1001]], total_volumes: [[1, 10000], [2, 10001]], lastFetched: Date.now() } as CryptoData;
        act(() => useCryptoStore.getState().setAssetData(assetId, timeRange, cryptoData));
        const state = useCryptoStore.getState();
        expect(state.data[assetId][timeRange]).toEqual({
            ...cryptoData,
            lastFetched: expect.any(Number)
        });
        expect(state.lastAccessed[assetId]).toEqual(expect.any(Number));
    });

    it('should set asset details', () => {
        const assetId = 'ethereum';
        const details = { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 200, price_change_percentage_24h: 5, market_cap: 20000 };
        act(() => useCryptoStore.getState().setAssetDetails(assetId, details));
        const state = useCryptoStore.getState();
        expect(state.assetDetails[assetId]).toEqual(details);
    });

    it('should set time range', () => {
        const newTimeRange = '30';
        act(() => useCryptoStore.getState().setTimeRange(newTimeRange));
        const state = useCryptoStore.getState();
        expect(state.timeRange).toBe(newTimeRange);
    });

    it('should set loading state', () => {
        act(() => useCryptoStore.getState().setLoading(true));
        const state = useCryptoStore.getState();
        expect(state.loading).toBe(true);
    });

    it('should remove asset', () => {
        const assetId = 'bitcoin';
        const timeRange = '7';
        const cryptoData = { prices: [[1, 100], [2, 101]], market_caps: [[1, 1000], [2, 1001]], total_volumes: [[1, 10000], [2, 10001]], lastFetched: Date.now() } as CryptoData;
        const details = { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 100, price_change_percentage_24h: 1, market_cap: 100000 };

        act(() => {
            useCryptoStore.getState().setAssetData(assetId, timeRange, cryptoData);
            useCryptoStore.getState().setAssetDetails(assetId, details);
            useCryptoStore.getState().updateLastAccessed(assetId);
        });

        let state = useCryptoStore.getState();
        expect(state.data[assetId]).toBeDefined();
        expect(state.assetDetails[assetId]).toBeDefined();
        expect(state.lastAccessed[assetId]).toBeDefined();

        act(() => useCryptoStore.getState().removeAsset(assetId));

        state = useCryptoStore.getState();
        expect(state.data[assetId]).toBeUndefined();
        expect(state.assetDetails[assetId]).toBeUndefined();
        expect(state.lastAccessed[assetId]).toBeUndefined();
        expect(state.selectedAssets).not.toContain(assetId);
    });

    it('should update last accessed time', () => {
        const assetId = 'bitcoin';
        act(() => useCryptoStore.getState().updateLastAccessed(assetId));
        const state = useCryptoStore.getState();
        expect(state.lastAccessed[assetId]).toEqual(expect.any(Number));
        const initialTime = state.lastAccessed[assetId];

        // Simulate time passing
        jest.advanceTimersByTime(1000);

        act(() => useCryptoStore.getState().updateLastAccessed(assetId));
        const updatedState = useCryptoStore.getState();
        expect(updatedState.lastAccessed[assetId]).toBeGreaterThan(initialTime);
    });

    it('should refresh data by resetting lastFetched', () => {
        const assetId = 'ethereum';
        const timeRange = '30';
        const cryptoData = { prices: [[1, 100], [2, 101]], market_caps: [[1, 1000], [2, 1001]], total_volumes: [[1, 10000], [2, 10001]], lastFetched: Date.now() } as CryptoData;

        act(() => useCryptoStore.getState().setAssetData(assetId, timeRange, cryptoData));
        let state = useCryptoStore.getState();
        expect(state.data[assetId][timeRange].lastFetched).toBeGreaterThan(0);

        act(() => useCryptoStore.getState().refreshData(assetId, timeRange));
        state = useCryptoStore.getState();
        expect(state.data[assetId][timeRange].lastFetched).toBe(0);
        expect(state.lastAccessed[assetId]).toEqual(expect.any(Number));
    });
}); 