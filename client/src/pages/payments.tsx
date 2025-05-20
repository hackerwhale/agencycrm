import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Payment, Client, Project } from "@shared/schema";
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
import { PaymentForm } from "@/components/payments/payment-form";
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
  CheckCircle,
  FileText,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isAfter } from "date-fns";

export default function Payments() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/payments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Success",
        description: "Payment has been deleted successfully",
      });
      
      setPaymentToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/payments/${id}`, {
        status: "paid",
        paidDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Success",
        description: "Payment has been marked as paid",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentForm(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const handleDeletePayment = (payment: Payment) => {
    setPaymentToDelete(payment);
  };

  const confirmDeletePayment = () => {
    if (paymentToDelete) {
      deletePaymentMutation.mutate(paymentToDelete.id);
    }
  };

  const handleMarkAsPaid = (payment: Payment) => {
    markAsPaidMutation.mutate(payment.id);
  };

  const getClientName = (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.company : `Client ${clientId}`;
  };

  const getProjectName = (projectId: number | null | undefined) => {
    if (!projectId) return "N/A";
    const project = projects?.find(p => p.id === projectId);
    return project ? project.name : `Project ${projectId}`;
  };

  const getStatusBadge = (status: string, dueDate?: string | null) => {
    if (status === 'paid') return <Badge variant="success">Paid</Badge>;
    if (status === 'cancelled') return <Badge variant="secondary">Cancelled</Badge>;
    
    // For pending payments, check if overdue
    if (status === 'pending' && dueDate && isAfter(new Date(), new Date(dueDate))) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
    if (status === 'overdue') return <Badge variant="destructive">Overdue</Badge>;
    
    return <Badge variant="outline">{status}</Badge>;
  };

  const filteredPayments = payments?.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      getClientName(payment.clientId).toLowerCase().includes(searchLower) ||
      (payment.invoiceNumber && payment.invoiceNumber.toLowerCase().includes(searchLower)) ||
      (payment.projectId && getProjectName(payment.projectId).toLowerCase().includes(searchLower))
    );
  });

  const isLoading = paymentsLoading || clientsLoading || projectsLoading;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payments</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage client payments and invoices
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleAddPayment}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Create New Payment</span>
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <CardTitle className="text-xl dark:text-white">All Payments</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            A list of all your agency payments and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-neutral-700">
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Invoice</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Client</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Project</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Amount</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Status</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Due Date</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-b dark:border-neutral-700">
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                )}
                
                {!isLoading && filteredPayments?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                      {searchTerm ? "No payments found matching your search." : "No payments found. Create your first payment!"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredPayments?.map((payment) => (
                  <TableRow key={payment.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <TableCell className="py-3 font-medium dark:text-white">
                      {payment.invoiceNumber || `INV-${payment.id.toString().padStart(4, '0')}`}
                    </TableCell>
                    <TableCell className="py-3 dark:text-neutral-300">
                      {getClientName(payment.clientId)}
                    </TableCell>
                    <TableCell className="py-3 dark:text-neutral-300">
                      {payment.projectId ? getProjectName(payment.projectId) : "N/A"}
                    </TableCell>
                    <TableCell className="py-3 font-semibold dark:text-white">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(payment.status, payment.dueDate)}
                    </TableCell>
                    <TableCell className="py-3 text-neutral-500 dark:text-neutral-400">
                      {payment.dueDate 
                        ? format(new Date(payment.dueDate), 'MMM dd, yyyy') 
                        : 'No due date'}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Payment
                          </DropdownMenuItem>
                          {payment.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePayment(payment)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Payment
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

      {/* Payment Form Dialog */}
      <PaymentForm 
        open={showPaymentForm}
        onOpenChange={setShowPaymentForm}
        defaultValues={editingPayment || undefined}
        paymentId={editingPayment?.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!paymentToDelete} onOpenChange={(open) => !open && setPaymentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment record and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePayment}
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
