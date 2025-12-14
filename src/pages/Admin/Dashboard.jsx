import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/dashboardSlice';
import { useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { StatsCardSkeleton } from '../../components/Skeleton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform hover:scale-105 duration-300">
        <div className={`p-4 rounded-xl ${color} text-white shadow-lg`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            {trend && <span className="text-green-500 text-xs font-bold">{trend}</span>}
        </div>
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const handleDownloadReport = () => {
        if (!stats) return;

        const reportData = [
            ['ModernPOS Sales Report'],
            [`Date: ${new Date().toLocaleString()}`],
            [''],
            ['--- Summary ---'],
            [`Total Revenue: $${stats.totalSales}`],
            [`Total Orders: ${stats.totalOrders}`],
            [`Net Profit: $${stats.profit || 0}`],
            [''],
            ['--- Top Selling Products ---'],
            ...(stats.bestSellers || []).map(p => [`${p.name}`, `Sold: ${p.quantitySold}`, `Revenue: ${p.revenue}`]),
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + reportData.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pos_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading || !stats) {
        return (
            <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            </div>
        );
    }

    // Default graph data if full stats unavailable
    // For production, the backend should return daily sales array
    const graphData = [65, 59, 80, 81, 56, 55, 40];

    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales ($)',
                data: graphData,
                borderColor: 'rgb(249, 115, 22)', // primary-500
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'gray' }
            },
            title: {
                display: true,
                text: 'Daily Sales Performance',
                color: 'gray'
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    className="bg-white dark:bg-gray-800 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Sales" value={`Rs ${stats.totalSales?.toLocaleString() || 0}`} icon={DollarSign} color="bg-primary-500" />
                <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingBag} color="bg-purple-500" />
                <StatsCard title="Total Products" value={stats.totalProducts || 0} icon={Users} color="bg-orange-500" />
                <StatsCard title="Profit (Est.)" value={`Rs ${stats.profit?.toLocaleString() || 0}`} icon={TrendingUp} color="bg-emerald-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <Line options={chartOptions} data={lineChartData} />
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Top Categories</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: stats.bestSellers && stats.bestSellers.length > 0 ? stats.bestSellers.map(i => i.name) : ['No Data'],
                                datasets: [{
                                    data: stats.bestSellers && stats.bestSellers.length > 0 ? stats.bestSellers.map(i => i.quantitySold) : [1],
                                    backgroundColor: ['#f97316', '#fb923c', '#fdba74', '#10b981', '#ef4444'],
                                    borderWidth: 0
                                }]
                            }}
                            options={{
                                plugins: { legend: { position: 'bottom' } },
                                cutout: '70%'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* New Bar Chart: Quantity Sold by Category */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Revenue by Product</h3>
                <div className="h-80 w-full">
                    <Bar
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                x: { grid: { display: false } }
                            }
                        }}
                        data={{
                            labels: stats.bestSellers && stats.bestSellers.length > 0 ? stats.bestSellers.map(i => i.name) : ['No Data'],
                            datasets: [{
                                label: 'Revenue',
                                data: stats.bestSellers && stats.bestSellers.length > 0 ? stats.bestSellers.map(i => i.revenue) : [0],
                                backgroundColor: 'rgba(99, 102, 241, 0.5)', // primary/indigo
                                borderRadius: 4,
                            }]
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
