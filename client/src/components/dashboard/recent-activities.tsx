import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Activity } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, PlusCircle, Clock, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivitiesProps {
  activities?: Activity[];
  isLoading: boolean;
}

export default function RecentActivities({ activities, isLoading }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment_created':
      case 'payment_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CheckCircle className="h-4 w-4" />
          </div>
        );
      case 'project_created':
        return (
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <PlusCircle className="h-4 w-4" />
          </div>
        );
      case 'project_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
            <Clock className="h-4 w-4" />
          </div>
        );
      case 'client_added':
      case 'client_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <UserPlus className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            <Clock className="h-4 w-4" />
          </div>
        );
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Activities</h2>
        
        {isLoading ? (
          <ul className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <li key={i} className="flex">
                <div className="flex-shrink-0 mr-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-5 w-full max-w-xs" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </li>
            ))}
          </ul>
        ) : activities?.length === 0 ? (
          <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
            No recent activity found.
          </div>
        ) : (
          <ul className="space-y-4">
            {activities?.map((activity) => (
              <li key={activity.id} className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm dark:text-neutral-200">{activity.description}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <Link href="/activities">
          <a className="text-primary text-sm block text-center mt-4 hover:underline">
            View All Activities
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
