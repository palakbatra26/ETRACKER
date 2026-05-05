const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
export default function InsightsCard({ insights }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">This month's insights</h3>
      {!insights.totalExpense ? <p className="text-gray-500 text-sm">No expenses yet this month.</p> : (
        <ul className="space-y-2 text-sm">
          {insights.topCategory && <li>🔥 Highest spending: <b>{insights.topCategory.category}</b> ({insights.topCategory.percent}% / {fmt(insights.topCategory.amount)})</li>}
          <li>📅 Average daily expense: <b>{fmt(insights.averageDaily)}</b></li>
          {insights.breakdown.slice(0, 3).map(b => (
            <li key={b.category}>• You spent <b>{b.percent}%</b> on <b>{b.category}</b></li>
          ))}
        </ul>
      )}
    </div>
  );
}
