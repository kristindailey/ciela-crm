import { useNavigate } from "react-router";
import type { Company } from "../types/company";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const navigate = useNavigate();

  const formatTier = (tier: string) => {
    return tier
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^\w/, c => c.toUpperCase());
  };

  const handleClick = () => {
    navigate(`/companies/${company.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white p-6 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:bg-[var(--royal-blue)]/20 hover:border-[var(--royal-blue)]/30 transition-all"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--royal-blue)]">
          {company.name}
        </h3>

        {company.logoUrl && (
          <img 
            src={company.logoUrl} 
            alt={`${company.name} logo`}
            className="h-10 max-w-16 object-contain"
          />
        )}
      </div>
      
      <span className="text-sm text-gray-600 font-medium">{formatTier(company.tier)}</span>
    </div>
  );
};

export default CompanyCard;