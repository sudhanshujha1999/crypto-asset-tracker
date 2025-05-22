'use client';

import { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useCryptoStore } from '@/store/useCryptoStore';
import { Button } from '@/components/atom/Button';
import { RefreshCw } from 'lucide-react';
import { fetchCryptoChartData } from '@/api/coingecko';
import { useSnackbar } from 'notistack';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']; // blue, green, orange, red, purple

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Custom tooltip formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Custom Y-axis formatter
const formatYAxis = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const CryptoChart = () => {
  const { selectedAssets, data, timeRange, setAssetData, setLoading, refreshData } = useCryptoStore();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async (assetId: string) => {
    const currentData = data[assetId]?.[timeRange];
    const now = Date.now();
    
    // Check if we need to fetch new data
    if (!currentData || !currentData.lastFetched || (now - currentData.lastFetched) > CACHE_DURATION) {
      try {
        setLoading(true);
        const newData = await fetchCryptoChartData(assetId, timeRange);
        setAssetData(assetId, timeRange, newData);
      } catch (error) {
        console.error(`Error fetching data for ${assetId}:`, error);
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { 
            variant: 'error'});
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch data for all selected assets
  useEffect(() => {
    selectedAssets.forEach(fetchData);
  }, [selectedAssets, timeRange]);

  // Transform each dataset into merged format by date
  const mergedData = (() => {
    if (selectedAssets.length === 0) return [];

    const baseAsset = selectedAssets[0];
    const timestamps = data[baseAsset]?.[timeRange]?.prices?.map(([ts]) => ts) ?? [];

    return timestamps.map((ts, i) => {
      const entry: any = {
        date: new Date(ts).toLocaleDateString(),
      };
      selectedAssets.forEach((asset) => {
        entry[asset] = data[asset]?.[timeRange]?.prices?.[i]?.[1] ?? null;
      });
      return entry;
    });
  })();

  const handleRefresh = () => {
    selectedAssets.forEach(assetId => {
      refreshData(assetId, timeRange);
      fetchData(assetId);
    });
  };

  if (selectedAssets.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        Select assets to view chart
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[0.5rem] md:gap-0 mb-[1rem]">
        <h3 className="text-base my-[0.5rem] md:text-lg font-semibold">Price Chart ({timeRange} days)</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => useCryptoStore.getState().setTimeRange("7")}
            className={timeRange === "7" ? "bg-blue-500 text-white" : ""}
          >
            1W
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useCryptoStore.getState().setTimeRange("30")}
            className={timeRange === "30" ? "bg-blue-500 text-white" : ""}
          >
            1M
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useCryptoStore.getState().setTimeRange("365")}
            className={timeRange === "365" ? "bg-blue-500 text-white" : ""}
          >
            1Y
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full aspect-[2]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
              labelStyle={{ color: '#f1f5f9' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            {selectedAssets.map((asset, idx) => (
              <Line
                key={asset}
                type="monotone"
                dataKey={asset}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
