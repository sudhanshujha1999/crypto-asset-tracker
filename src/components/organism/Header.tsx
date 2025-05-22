import { WalletConnectButton } from "../molecule/WalletConnectButton";

export const Header = () => (
  <div className="py-[0.75rem] px-[1rem] md:px-[2.5rem] flex justify-between items-center self-stretch border-b border-b-[#e5e8eb]">
    <div className="flex items-center gap-[0.75rem]">
      <div className="flex flex-col items-start">
        <div className="w-4">
          <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.02663 7L0.333333 5.41597L2.31846 1.91739L5.01333 3.4987L5.01487 0.333333H8.98513L8.98667 3.4987L11.6815 1.91739L13.6667 5.41597L10.9733 7L13.6667 8.58403L11.6815 12.0826L8.98667 10.5013L8.98513 13.6667H5.01487L5.01333 10.5013L2.31846 12.0826L0.333333 8.58403L3.02663 7Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-start crypto_tracker self-stretch text-white font-['Inter'] text-base md:text-lg font-bold leading-[1.25rem] md:leading-[1.4375rem]">
        Crypto Tracker
      </div>
    </div>
    <div className="depth_3__frame_1 flex justify-end items-start gap-4 md:gap-8">
      <div className="flex justify-center items-center py-0 px-2 md:px-4 h-10 min-w-[5.25rem] max-w-[480px] rounded-xl">
        <WalletConnectButton />
      </div>
    </div>
  </div>
);
