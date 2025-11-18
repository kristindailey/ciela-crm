import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { TbUpload } from "react-icons/tb";

interface PageHeaderProps {
    title: string;
    searchValue: string;
    searchPlaceholder: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onUploadClick: () => void;
}

const PageHeader = ({ title, searchValue, searchPlaceholder, onSearchChange, onAddClick, onUploadClick }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
            <div className="flex items-center gap-4">
                <h1 className="text-[var(--royal-blue)] font-pacifico text-5xl">{title}</h1>

                <button 
                    onClick={onAddClick}
                    className="inline-flex h-10 w-10 mt-2 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)]"
                >
                    <FaPlus className="text-xl"/>
                </button>

                <button 
                    onClick={onUploadClick}
                    className="inline-flex h-10 w-10 mt-2 items-center justify-center rounded-full bg-[var(--royal-blue)] text-[var(--soft-lavender)] drop-shadow-sm transition-colors duration-150 hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)]"
                >
                    <TbUpload className="text-xl" />
                </button>
            </div>

            <div className="relative mt-2 mr-5">
                <input 
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder} 
                    className="pl-9 py-1 w-75 border border-2 border-[var(--royal-blue)] rounded-full text-black"
                />

                <div className="absolute left-3 top-1/2 translate -translate-y-1/2">
                    <FaMagnifyingGlass className="text-[var(--royal-blue)]"/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PageHeader;