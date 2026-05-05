import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
export default function IncomeExpenseBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
        <Bar dataKey="income" fill="#10b981" radius={[6,6,0,0]} />
        <Bar dataKey="expense" fill="#f43f5e" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
