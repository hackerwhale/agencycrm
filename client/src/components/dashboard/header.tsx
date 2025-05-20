import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  onAddClient: () => void;
}

export default function DashboardHeader({ onAddClient }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Welcome back, Alex! Here's what's happening with your agency today.
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button 
          onClick={onAddClient}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Add New Client</span>
        </Button>
      </div>
    </div>
  );
}
