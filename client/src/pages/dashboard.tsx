import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/header";
import DashboardMetrics from "@/components/dashboard/metrics";
import RecentClients from "@/components/dashboard/recent-clients";
import RecentProjects from "@/components/dashboard/recent-projects";
import RecentActivities from "@/components/dashboard/recent-activities";
import UpcomingPayments from "@/components/dashboard/upcoming-payments";
import QuickStats from "@/components/dashboard/quick-stats";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClientForm } from "@/components/clients/client-form";

export default function Dashboard() {
  const [showClientForm, setShowClientForm] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities?limit=4"],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const isLoading = statsLoading || clientsLoading || projectsLoading || activitiesLoading || paymentsLoading;

  const handleAddClient = () => {
    setShowClientForm(true);
  };

  return (
    <>
      <DashboardHeader onAddClient={handleAddClient} />
      <DashboardMetrics stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentClients clients={clients} isLoading={clientsLoading} />
          <div className="mt-6">
            <RecentProjects projects={projects} isLoading={projectsLoading} />
          </div>
        </div>

        <div className="space-y-6">
          <RecentActivities activities={activities} isLoading={activitiesLoading} />
          <UpcomingPayments payments={payments} isLoading={paymentsLoading} />
          <QuickStats />
        </div>
      </div>

      <ClientForm open={showClientForm} onOpenChange={setShowClientForm} />
    </>
  );
}
