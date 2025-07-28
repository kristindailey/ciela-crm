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
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            { isLoading ? loadingText : children }
        </button>
    );
};

export default AuthButton;