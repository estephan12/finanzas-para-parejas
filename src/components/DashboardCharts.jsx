import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardCharts({ transactions }) {

    const monthlyData = useMemo(() => {
        const data = {};

        // Process transactions for the last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = d.toLocaleString('default', { month: 'short' });
            data[monthKey] = { name: monthKey, income: 0, expense: 0 };
        }

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = date.toLocaleString('default', { month: 'short' });

            if (data[monthKey]) {
                if (tx.type === 'income') {
                    data[monthKey].income += Number(tx.amount);
                } else {
                    data[monthKey].expense += Number(tx.amount);
                }
            }
        });

        return Object.values(data);
    }, [transactions]);

    const categoryData = useMemo(() => {
        const data = {};

        transactions
            .filter(tx => tx.type === 'expense')
            .forEach(tx => {
                if (!data[tx.category]) {
                    data[tx.category] = 0;
                }
                data[tx.category] += Number(tx.amount);
            });

        return Object.entries(data)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 categories
    }, [transactions]);

    if (transactions.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income vs Expense Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Balance Mensual</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="income" name="Ingresos" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Expense by Category Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoría</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
