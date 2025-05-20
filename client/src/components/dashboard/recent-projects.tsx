import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@shared/schema";
import { format } from "date-fns";

interface RecentProjectsProps {
  projects?: Project[];
  isLoading: boolean;
}

export default function RecentProjects({ projects, isLoading }: RecentProjectsProps) {
  // Get most recent 4 projects
  const recentProjects = projects?.slice(0, 4);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="success">In Progress</Badge>;
      case 'completed':
        return <Badge variant="primary">Completed</Badge>;
      case 'review':
        return <Badge variant="warning">Review</Badge>;
      case 'on_hold':
        return <Badge variant="destructive">On Hold</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold dark:text-white">Recent Projects</h2>
          <Link href="/projects">
            <a className="text-primary text-sm hover:underline">View All</a>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:border-neutral-700">
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Project</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Client</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Status</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Deadline</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array(4).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b dark:border-neutral-700">
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-20 mt-1" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              )}
              
              {!isLoading && recentProjects?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                    No projects found. Create your first project!
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && recentProjects?.map((project) => (
                <TableRow key={project.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <TableCell className="py-3">
                    <div className="font-medium dark:text-white">{project.name}</div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-xs">
                      Progress: {project.progress}%
                    </div>
                  </TableCell>
                  <TableCell className="py-3 dark:text-neutral-300">
                    Client {project.clientId}
                  </TableCell>
                  <TableCell className="py-3">
                    {getStatusBadge(project.status)}
                  </TableCell>
                  <TableCell className="py-3 text-neutral-500 dark:text-neutral-400">
                    {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'No deadline'}
                  </TableCell>
                  <TableCell className="py-3">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
