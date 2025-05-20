import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, Banknote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  activeClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

interface DashboardMetricsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function DashboardMetrics({ stats, isLoading }: DashboardMetricsProps) {
  const metricCards = [
    {
      title: "Active Clients",
      value: stats?.activeClients || 0,
      icon: <Users className="h-5 w-5" />,
      iconBg: "bg-primary/10 text-primary",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || 0,
      icon: <Briefcase className="h-5 w-5" />,
      iconBg: "bg-secondary/10 text-secondary",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Monthly Revenue",
      value: stats ? `$${stats.monthlyRevenue.toLocaleString()}` : "$0",
      icon: <TrendingUp className="h-5 w-5" />,
      iconBg: "bg-accent/10 text-accent",
      change: "+17%",
      changeType: "positive",
    },
    {
      title: "Pending Invoices",
      value: stats ? `$${stats.pendingInvoices.toLocaleString()}` : "$0",
      icon: <Banknote className="h-5 w-5" />,
      iconBg: "bg-warning/10 text-warning",
      change: "-5%",
      changeType: "negative",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metricCards.map((card, index) => (
        <Card key={index} className="bg-white dark:bg-neutral-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">{card.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-semibold mt-1 dark:text-white">{card.value}</h3>
                )}
              </div>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className={card.changeType === "positive" ? "text-success flex items-center" : "text-danger flex items-center"}>
                {card.changeType === "positive" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {card.change}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
