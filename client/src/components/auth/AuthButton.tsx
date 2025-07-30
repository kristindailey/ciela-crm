interface AuthButtonProps {
    isLoading: boolean;
    loadingText: string;
    children: React.ReactNode;
}

const AuthButton = ({ isLoading, loadingText, children }: AuthButtonProps) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border-3 border-transparent px-5 py-[0.6em] text-base font-medium font-inherit bg-[var(--soft-lavender)] text-[var(--royal-blue)] cursor-pointer transition-colors duration-250 hover:border-[#535bf2] focus:outline-4 focus:outline-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
            { isLoading ? loadingText : children }
        </button>
    );
};

export default AuthButton;