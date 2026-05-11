import { useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar.jsx';
import CategoryPie from '../components/charts/CategoryPie.jsx';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

export default function Reports() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [data, setData] = useState(null);
  const ref = useRef();

  const load = async () => {
    const [c, i, list, s] = await Promise.all([
      api.get('/transactions/charts', { params: { month } }),
      api.get('/transactions/insights', { params: { month } }),
      api.get('/transactions', { params: { from: `${month}-01`, to: `${month}-31`, limit: 100 } }),
      api.get('/transactions/summary'),
    ]);
    setData({ charts: c.data, insights: i.data, list: list.data.items, summary: s.data });
  };
  useEffect(() => { load(); }, [month]);

  const exportPDF = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save(`report-${month}.pdf`);
  };

  const exportCSV = () => {
    const headers = 'Date,Type,Category,Amount\n';
    const rows = data.list.map(t => `${new Date(t.date).toLocaleDateString()},${t.type},${t.category},${t.amount}`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${month}.csv`;
    a.click();
  };

  if (!data) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Monthly Report</h1>
        <div className="flex gap-2">
          <input type="month" className="input w-auto" value={month} onChange={e=>setMonth(e.target.value)}/>
          <button className="btn-primary" onClick={exportPDF}>Export PDF</button>
          <button className="btn-ghost" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div ref={ref} className="space-y-6 bg-white text-gray-900 p-6 rounded-2xl">
        <h2 className="text-xl font-bold">Report — {month}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded p-4"><div className="text-xs text-gray-500">Income</div><div className="text-lg font-bold text-emerald-600">{fmt(data.insights.totalIncome)}</div></div>
          <div className="border rounded p-4"><div className="text-xs text-gray-500">Expense</div><div className="text-lg font-bold text-rose-600">{fmt(data.insights.totalExpense)}</div></div>
          <div className="border rounded p-4"><div className="text-xs text-gray-500">Net</div><div className="text-lg font-bold">{fmt(data.insights.totalIncome - data.insights.totalExpense)}</div></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded p-4"><h3 className="font-semibold mb-2">Income vs Expense</h3><IncomeExpenseBar data={data.charts.bar} /></div>
          <div className="border rounded p-4"><h3 className="font-semibold mb-2">Categories</h3><CategoryPie data={data.charts.pie} /></div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Transactions</h3>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100"><tr><th className="p-2 text-left">Date</th><th className="text-left">Type</th><th className="text-left">Category</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {data.list.map(t => (
                <tr key={t._id} className="border-t">
                  <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.type}</td><td>{t.category}</td>
                  <td className="text-right">{fmt(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
