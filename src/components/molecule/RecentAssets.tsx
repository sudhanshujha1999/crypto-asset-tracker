import Pill from "../atom/Pill";
import { useCryptoStore } from "@/store/useCryptoStore";
import { useShallow } from "zustand/react/shallow";

const RecentAssets = () => {
  const { data, selectedAssets, setSelectedAssets, lastAccessed, updateLastAccessed } = useCryptoStore(
    useShallow(state => ({
      data: state.data,
      selectedAssets: state.selectedAssets,
      setSelectedAssets: state.setSelectedAssets,
      lastAccessed: state.lastAccessed,
      updateLastAccessed: state.updateLastAccessed,
    }))
  );

  // Get unique assets that we have data for and sort by last accessed time
  const recentAssets = Object.keys(data)
    .filter(assetId => {
      // Only show assets that have data for any time range
      return Object.keys(data[assetId] || {}).length > 0;
    })
    .sort((a, b) => {
      const timeA = lastAccessed[a] || 0;
      const timeB = lastAccessed[b] || 0;
      return timeB - timeA; // Sort in descending order (most recent first)
    })
    .slice(0, 10); // Only take the 10 most recent

  const handleAssetClick = (assetId: string) => {
    updateLastAccessed(assetId);
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };

  if (recentAssets.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col items-start pt-1 pb-3 px-4 w-full recent self-stretch text-[#94adc7] font-['Inter'] text-sm leading-[1.3125rem]">
        Recent
      </div>
      <div className="inline-flex flex-wrap items-start content-start gap-[0.75rem] py-[0.75rem] pr-[0.75rem]">
        {recentAssets.map((assetId) => (
          <Pill 
            key={assetId}
            onClick={() => handleAssetClick(assetId)}
            selected={selectedAssets.includes(assetId)}
          >
            {assetId.charAt(0).toUpperCase() + assetId.slice(1)}
          </Pill>
        ))}
      </div>
    </div>
  );
};

export default RecentAssets; 