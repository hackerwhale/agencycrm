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
import { Client } from "@shared/schema";

interface RecentClientsProps {
  clients?: Client[];
  isLoading: boolean;
}

export default function RecentClients({ clients, isLoading }: RecentClientsProps) {
  // Get most recent 4 clients
  const recentClients = clients?.slice(0, 4);

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold dark:text-white">Recent Clients</h2>
          <Link href="/clients">
            <a className="text-primary text-sm hover:underline">View All</a>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:border-neutral-700">
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Client</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Projects</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Status</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Last Payment</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array(4).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b dark:border-neutral-700">
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-9 w-9 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-32 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              )}
              
              {!isLoading && recentClients?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                    No clients found. Add your first client!
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && recentClients?.map((client) => (
                <TableRow key={client.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      <div className={`h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3`}>
                        <span>{client.name.charAt(0)}{client.company.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">{client.company}</div>
                        <div className="text-neutral-500 dark:text-neutral-400 text-xs">{client.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 dark:text-neutral-300">0 Projects</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'secondary' : 'warning'}>
                      {client.status === 'active' 
                        ? 'Active' 
                        : client.status === 'inactive' 
                          ? 'Inactive' 
                          : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-neutral-500 dark:text-neutral-400">No payments yet</TableCell>
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
