import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Ad } from '@/data/mockAds';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

interface AnalyticsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ad: Ad | null;
}

export function AnalyticsDialog({ isOpen, onClose, ad }: AnalyticsDialogProps) {
    if (!ad) return null;

    // Default history fallback if none exists (just plotting total views for today)
    const historyData = ad.viewHistory && ad.viewHistory.length > 0
        ? [...ad.viewHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [{ date: new Date().toISOString().split('T')[0], views: ad.views || 0 }];

    // Prepare rating distribution (how many 5-stars, 4-stars, etc.)
    const ratingDistribution = [
        { stars: '5 Stars', count: 0 },
        { stars: '4 Stars', count: 0 },
        { stars: '3 Stars', count: 0 },
        { stars: '2 Stars', count: 0 },
        { stars: '1 Star', count: 0 },
    ];

    if (ad.ratings && ad.ratings.length > 0) {
        ad.ratings.forEach(rating => {
            const index = 5 - Math.round(rating.value);
            if (index >= 0 && index <= 4) {
                ratingDistribution[index].count += 1;
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Ad Analytics
                    </DialogTitle>
                    <p className="text-muted-foreground font-medium">{ad.title}</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {/* Top Stats Cards */}
                    <Card className="bg-secondary/30 border-secondary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Eye className="w-4 h-4" /> Total Views
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{ad.views || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/30 border-secondary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" /> Avg Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{(ad.avgRating || 0).toFixed(1)}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/30 border-secondary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-500" /> Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{ad.totalRatings || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-6">
                    {/* Views Over Time Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Views over time (Last 7 Days)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData.slice(-7)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => {
                                            const date = new Date(val);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        }}
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="views"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Rating Distribution Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="stars"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={60}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#eab308" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
