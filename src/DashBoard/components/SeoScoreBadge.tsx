interface SeoScoreBadgeProps {
  score: number;
}

export function SeoScoreBadge({ score }: SeoScoreBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800';
  let typeLabel = 'N/A';
  
  if (score >= 80) {
    colorClass = 'bg-green-100 text-green-800';
    typeLabel = 'Good';
  } else if (score >= 50) {
    colorClass = 'bg-yellow-100 text-yellow-800';
    typeLabel = 'Average';
  } else if (score > 0) {
    colorClass = 'bg-red-100 text-red-800';
    typeLabel = 'Poor';
  } else {
    colorClass = 'bg-gray-100 text-gray-800';
    typeLabel = 'None';
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 whitespace-nowrap w-max ${colorClass}`}>
      {typeLabel} &bull; {score}/100
    </span>
  );
}
