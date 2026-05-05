import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
export default function DailyLine({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
