import type { Company } from "../types/company";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const formatTier = (tier: string) => {
    return tier
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
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
        <span className="font-medium">Tier: {formatTier(company.tier)}</span>
      </div>
    </div>
  );
};

export default CompanyCard;