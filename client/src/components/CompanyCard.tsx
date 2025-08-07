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
      className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-[var(--royal-blue)] mb-2">
        {company.name}
      </h3>

      {company.website && (
        <a 
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm mb-2 block"
        >
          {company.website}
        </a>
      )}

      <div className="text-sm text-gray-600">
        <span className="font-medium">{formatTier(company.tier)}</span>
      </div>
    </div>
  );
};

export default CompanyCard;