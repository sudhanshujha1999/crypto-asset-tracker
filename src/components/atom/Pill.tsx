interface PillProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const Pill = ({ children, onClick, selected, disabled }: PillProps) => {
  return (
    <div
      className={`flex justify-center items-center gap-[0.5rem] py-[0.25rem] px-[1rem] h-[auto] rounded-[0.25rem] bg-[#243647] cursor-pointer transition-colors ${
        selected ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-[#2c4054]'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex flex-col items-start self-stretch text-white font-['Inter'] text-sm font-medium leading-[1.3125rem]">
        {children}
      </div>
    </div>
  );
};

export default Pill;
