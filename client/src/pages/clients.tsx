import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Client, ServiceTypes } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientForm } from "@/components/clients/client-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Pencil, 
  Trash2,
  UserCog
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Clients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Success",
        description: "Client has been deleted successfully",
      });
      
      setClientToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete.id);
    }
  };

  const filteredClients = clients?.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.company.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.phone && client.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Clients</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage all your agency clients in one place
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleAddClient}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Add New Client</span>
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <CardTitle className="text-xl dark:text-white">All Clients</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            A list of all your agency clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-neutral-700">
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Client</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Contact</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Service</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Status</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Projects</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-b dark:border-neutral-700">
                      <TableCell>
                        <div className="flex items-center">
                          <Skeleton className="h-9 w-9 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-4 w-24 mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-4 w-36 mt-1" />
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                )}
                
                {!isLoading && filteredClients?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                      {searchTerm ? "No clients found matching your search." : "No clients found. Add your first client!"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredClients?.map((client) => (
                  <TableRow key={client.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <TableCell className="py-3">
                      <div className="flex items-center">
                        <div className={`h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3`}>
                          <span>{client.name.charAt(0)}{client.company.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium dark:text-white">{client.company}</div>
                          {client.website && (
                            <div className="text-neutral-500 dark:text-neutral-400 text-xs">{client.website}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="font-medium dark:text-neutral-300">{client.name}</div>
                      <div className="text-neutral-500 dark:text-neutral-400 text-xs">{client.email}</div>
                      {client.phone && (
                        <div className="text-neutral-500 dark:text-neutral-400 text-xs">{client.phone}</div>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {client.service === ServiceTypes.WEB_DESIGN 
                          ? 'Web Design' 
                          : client.service === ServiceTypes.SEO 
                            ? 'SEO' 
                            : client.service === ServiceTypes.SOCIAL_MEDIA
                              ? 'Social Media'
                              : 'Custom'}
                      </Badge>
                      {client.service === ServiceTypes.CUSTOM && client.customService && (
                        <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">{client.customService}</div>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'secondary' : 'warning'}>
                        {client.status === 'active' 
                          ? 'Active' 
                          : client.status === 'inactive' 
                            ? 'Inactive' 
                            : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 dark:text-neutral-300">0 Projects</TableCell>
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            Manage Projects
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Client Form Dialog */}
      <ClientForm 
        open={showClientForm}
        onOpenChange={setShowClientForm}
        defaultValues={editingClient || undefined}
        clientId={editingClient?.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client "{clientToDelete?.company}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
