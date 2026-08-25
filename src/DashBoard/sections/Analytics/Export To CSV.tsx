// Export To CSV.tsx

export function exportKeywordsToCSV(keywords: any[], filename: string = 'seo_rank_tracking.csv') {
  if (!keywords || keywords.length === 0) {
    alert("No data available to export.");
    return;
  }

  // 1. Define CSV Headers
  const headers = [
    "Keyword",
    "URL",
    "Current Position",
    "Previous Position",
    "Position Change",
    "Search Volume",
    "SEO Difficulty",
    "Difficulty Updated"
  ];

  // 2. Map data to CSV rows
  const csvRows = [];
  csvRows.push(headers.join(',')); // Add header row

  keywords.forEach((kw) => {
    // Format change: +1, -2, or 0
    let changeStr = '0';
    if (kw.up) changeStr = `+${kw.change}`;
    else if (kw.down) changeStr = `-${kw.change}`;

    const row = [
      `"${kw.keyword.replace(/"/g, '""')}"`, // escape quotes in keyword
      `"${kw.url}"`,
      kw.pos,
      kw.oldPos,
      changeStr,
      kw.vol,
      kw.diff,
      `"${kw.diffTime}"`
    ];
    csvRows.push(row.join(','));
  });

  // 3. Create Blob and trigger download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('url');
  
  // Feature detection for download attribute
  if ((navigator as any).msSaveBlob) { // IE 10+
    (navigator as any).msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
