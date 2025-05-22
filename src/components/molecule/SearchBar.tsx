import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, ChevronUp, ChevronDown, X } from 'lucide-react';
import { searchCrypto, type SearchResult } from '../../api/coingecko';
import { useCryptoStore } from '../../store/useCryptoStore';
import { useSnackbar } from 'notistack';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedAssets, setSelectedAssets, setAssetDetails } = useCryptoStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchCrypto(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching crypto:', error);
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Effect for debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, debouncedSearch]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    const asset = searchResults.find(a => a.id === value);
    if (asset) {
      setAssetDetails(value, {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        current_price: 0, // These values will be updated when price data is fetched
        price_change_percentage_24h: 0,
        market_cap: 0
      });
    }

    const newSelected = selectedAssets.includes(value)
      ? selectedAssets.filter((v) => v !== value)
      : [...selectedAssets, value];
    setSelectedAssets(newSelected);
  };

  const isAllSelected = searchResults.length > 0 && 
    searchResults.every((a) => selectedAssets.includes(a.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAssets([]);
    } else {
      const newSelected = searchResults.map((a) => a.id);
      setSelectedAssets(newSelected);
      // Store details for all selected assets
      searchResults.forEach(asset => {
        setAssetDetails(asset.id, {
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          current_price: 0,
          price_change_percentage_24h: 0,
          market_cap: 0
        });
      });
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      {/* Dropdown button */}
      <div
        className="flex box-border flex-wrap flex-row justify-between items-center border border-gray-700 bg-gray-900 px-[0.75rem] py-[0.5rem] rounded-[0.25rem] text-sm gap-[0.5rem] cursor-pointer min-h-[48px]"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-1 flex-row flex-wrap gap-[0.5rem] items-center">
          {selectedAssets.length > 0 &&
            selectedAssets.map((val) => (
              <div
                key={val}
                className="flex justify-center items-center gap-[0.5rem] py-[0.25rem] px-[1rem] h-[auto] rounded-[0.25rem] bg-[#243647]"
              >
                <div className="flex flex-wrap flex-col items-start self-stretch text-white font-['Inter'] text-sm font-medium leading-[1.3125rem]">
                  <div className="bg-gray-800 text-white gap-[0.5rem] py-0.5 rounded-full flex items-center gap-1">
                    <div className='whitespace-nowrap'>{searchResults.find((a) => a.id === val)?.name || val.charAt(0).toUpperCase() + val.slice(1)}</div>
                    <X
                      className="w-[1rem] h-[1rem] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValue(val);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={selectedAssets.length === 0 ? 'Search cryptocurrencies...' : ''}
            className="w-full flex-1 h-auto px-2 py-1 rounded bg-inherit text-[1rem] text-[white] placeholder-gray-400 outline-none border-none mb-2"
          />
        </div>

        <div className="ml-auto w-fit">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Dropdown list */}
      {open && (
        <div 
          className="absolute box-border flex flex-col z-10 w-full max-h-[32rem] overflow-auto bg-[#1d1e20] border border-t-0 border-gray-700 rounded-[0.25rem] py-[1rem] px-[1rem] space-y-1 text-sm gap-[1rem]"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div
                className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] hover:bg-gray-800 rounded cursor-pointer"
                onClick={handleSelectAll}
              >
                <div className="w-[1rem] h-[1rem] flex items-center justify-center border border-gray-600 rounded-sm">
                  {isAllSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>Select all</span>
              </div>

              {searchResults.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => toggleValue(asset.id)}
                >
                  <div className="w-[1rem] h-[1rem] flex items-center justify-center border border-gray-600 rounded-[0.25rem]">
                    {selectedAssets.includes(asset.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{asset.name} ({asset.symbol.toUpperCase()})</span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-gray-400">
              {search ? 'No results found' : 'Start typing to search...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 