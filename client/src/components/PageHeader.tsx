import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { TbUpload } from "react-icons/tb";

interface PageHeaderProps {
    title: string;
    searchValue: string;
    searchPlaceholder: string;
    onSearchChange: (value: string) => void;
    onAddClick?: () => void;
    onUploadClick?: () => void;
}

const PageHeader = ({ title, searchValue, searchPlaceholder, onSearchChange, onAddClick, onUploadClick }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-between w-full mt-20 ml-5 mr-5">
            <div className="flex items-center gap-4">
                <h1 className="text-script font-pacifico text-5xl">{title}</h1>

                {onAddClick && (
                    <button 
                        onClick={onAddClick}
                        className="inline-flex h-8 w-8 mt-3 items-center justify-center rounded-full bg-sidebar text-lavender drop-shadow-sm transition-colors duration-150 hover:bg-lavender hover:text-heading"
                    >
                        <FaPlus className="text-sidebar-text"/>
                    </button>
                )}
                
                {onUploadClick && (
                    <button 
                        onClick={onUploadClick}
                        className="inline-flex h-8 w-8 mt-3 items-center justify-center rounded-full bg-sidebar text-lavender drop-shadow-sm transition-colors duration-150 hover:bg-lavender hover:text-heading"
                    >
                        <TbUpload className="text-sidebar-text" />
                    </button>
                )}
            </div>

            <div className="relative mt-2 mr-5">
                <input 
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder} 
                    className="pl-9 py-1 w-75 border border-2 border-heading rounded-full text-primary"
                />

                <div className="absolute left-3 top-1/2 translate -translate-y-1/2">
                    <FaMagnifyingGlass className="text-heading"/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PageHeader;