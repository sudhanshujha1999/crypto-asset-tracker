import { create } from "zustand";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface CryptoData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
  lastFetched: number; // timestamp of last fetch
}

interface State {
  selectedAssets: string[];
  data: Record<string, Record<string, CryptoData>>; // assetId -> timeRange -> data
  assetDetails: Record<string, CryptoPrice>; // assetId -> basic asset details
  timeRange: "7" | "30" | "365";
  loading: boolean;
  lastAccessed: Record<string, number>; // assetId -> timestamp
  setSelectedAssets: (assets: string[]) => void;
  setAssetData: (assetId: string, timeRange: string, data: CryptoData) => void;
  setAssetDetails: (assetId: string, details: CryptoPrice) => void;
  setTimeRange: (range: "7" | "30" | "365") => void;
  setLoading: (loading: boolean) => void;
  removeAsset: (assetId: string) => void;
  refreshData: (assetId: string, timeRange: string) => void;
  updateLastAccessed: (assetId: string) => void;
}

export const useCryptoStore = create<State>((set) => ({
  selectedAssets: ["bitcoin"],
  data: {},
  assetDetails: {},
  timeRange: "7",
  loading: false,
  lastAccessed: {},
  setSelectedAssets: (assets) => set({ selectedAssets: assets }),
  setAssetData: (assetId, timeRange, data) => 
    set((state) => ({
      data: {
        ...state.data,
        [assetId]: {
          ...state.data[assetId],
          [timeRange]: {
            ...data,
            lastFetched: Date.now()
          }
        }
      },
      lastAccessed: {
        ...state.lastAccessed,
        [assetId]: Date.now()
      }
    })),
  setAssetDetails: (assetId, details) =>
    set((state) => ({
      assetDetails: {
        ...state.assetDetails,
        [assetId]: details
      }
    })),
  setTimeRange: (range) => set({ timeRange: range }),
  setLoading: (loading) => set({ loading }),
  removeAsset: (assetId) => 
    set((state) => {
      const newData = { ...state.data };
      const newLastAccessed = { ...state.lastAccessed };
      const newAssetDetails = { ...state.assetDetails };
      delete newData[assetId];
      delete newLastAccessed[assetId];
      delete newAssetDetails[assetId];
      return {
        selectedAssets: state.selectedAssets.filter(id => id !== assetId),
        data: newData,
        lastAccessed: newLastAccessed,
        assetDetails: newAssetDetails
      };
    }),
  refreshData: (assetId, timeRange) =>
    set((state) => ({
      data: {
        ...state.data,
        [assetId]: {
          ...state.data[assetId],
          [timeRange]: {
            ...state.data[assetId]?.[timeRange],
            lastFetched: 0 // Reset lastFetched to force refresh
          }
        }
      },
      lastAccessed: {
        ...state.lastAccessed,
        [assetId]: Date.now()
      }
    })),
  updateLastAccessed: (assetId) =>
    set((state) => ({
      lastAccessed: {
        ...state.lastAccessed,
        [assetId]: Date.now()
      }
    }))
}));
