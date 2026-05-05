const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
export default function StatCards({ summary }) {
  const items = [
    { label: 'Balance', value: summary.balance, color: 'text-brand' },
    { label: 'Income',  value: summary.income,  color: 'text-emerald-500' },
    { label: 'Expense', value: summary.expense, color: 'text-rose-500' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(i => (
        <div key={i.label} className="card">
          <div className="text-sm text-gray-500">{i.label}</div>
          <div className={`text-2xl font-bold mt-1 ${i.color}`}>{fmt(i.value)}</div>
        </div>
      ))}
    </div>
  );
}
