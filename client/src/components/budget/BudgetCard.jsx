const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
export default function BudgetCard({ budget }) {
  const pct = Math.min(100, budget.usedPercent || 0);
  const color = budget.alert === 'exceeded' ? 'bg-rose-500'
    : budget.alert === 'warning' ? 'bg-amber-500' : 'bg-brand';
  return (
    <div className="card">
      <h3 className="font-semibold">Monthly Budget</h3>
      {!budget.amount ? (
        <p className="text-sm text-gray-500 mt-3">No budget set. Go to Budget page to set one.</p>
      ) : (
        <>
          <div className="mt-3 text-sm text-gray-500">{fmt(budget.spent)} of {fmt(budget.amount)}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
            <div className={`h-3 ${color} transition-all`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-sm">
            <b>{budget.usedPercent}%</b> used • {fmt(budget.remaining)} remaining
          </div>
          {budget.alert === 'warning' && <div className="mt-2 text-amber-600 text-sm">⚠️ 80% of budget reached</div>}
          {budget.alert === 'exceeded' && <div className="mt-2 text-rose-600 text-sm">🚨 Budget exceeded!</div>}
        </>
      )}
    </div>
  );
}
