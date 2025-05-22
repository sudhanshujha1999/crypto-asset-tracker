import SearchBar from '@/components/molecule/SearchBar';
import RecentAssets from '@/components/molecule/RecentAssets';
import UserAssets from '@/components/molecule/UserAssets';
import { CryptoChart } from '@/components/organism/CryptoChart';

export default function Dashboard() {
  return (
    <div className="flex justify-center items-start self-stretch py-[1.25rem] px-[1rem] md:px-[10vw]">
      <div className="flex flex-col items-start gap-[0.75rem] w-full max-w-[960px]">
        <div className="flex flex-col items-start self-stretch text-white font-['Inter'] text-[1.5rem] md:text-[1.75rem] font-bold leading-[1.875rem] md:leading-[2.1875rem]">
          Select a cryptocurrency
        </div>
        <div className="flex flex-wrap items-end content-end gap-4 py-3 px-4 w-full">
          <div className="w-full gap-[0.5rem] flex flex-col items-start min-w-[10rem]">
            <SearchBar />
          </div>
        </div>
        <RecentAssets />
        <UserAssets />
        <CryptoChart />
      </div>
    </div>
  );
}
