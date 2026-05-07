const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const colorFor = alert => alert === 'exceeded' ? 'bg-rose-500'
  : alert === 'warning' ? 'bg-amber-500'
  : alert === 'notice' ? 'bg-sky-500'
  : 'bg-brand';

const messageFor = alert => alert === 'exceeded' ? 'Budget exceeded'
  : alert === 'warning' ? '80% of budget reached'
  : alert === 'notice' ? '50% of budget reached'
  : null;

function BudgetProgress({ label, item }) {
  const pct = Math.min(100, item.usedPercent || 0);
  const message = messageFor(item.alert);
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{fmt(item.spent)} / {fmt(item.amount)}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
        <div className={`h-3 ${colorFor(item.alert)} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between gap-3 text-sm text-gray-500">
        <span><b>{item.usedPercent}%</b> used</span>
        <span>{fmt(item.remaining)} remaining</span>
      </div>
      {message && <div className={`text-sm ${item.alert === 'exceeded' ? 'text-rose-600' : item.alert === 'warning' ? 'text-amber-600' : 'text-sky-600'}`}>{message}</div>}
    </div>
  );
}

export default function BudgetCard({ budget }) {
  return (
    <div className="card space-y-5">
      <h3 className="font-semibold">Monthly Budget</h3>
      {!budget.amount ? (
        <p className="text-sm text-gray-500">No budget set. Go to Budget page to set one.</p>
      ) : (
        <BudgetProgress label="Overall" item={budget} />
      )}
      {!!budget.categories?.length && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Category budgets</h4>
          {budget.categories.map(c => <BudgetProgress key={c.category} label={c.category} item={c} />)}
        </div>
      )}
    </div>
  );
}
