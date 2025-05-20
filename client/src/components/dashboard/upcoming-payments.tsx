import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Payment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays } from "date-fns";

interface UpcomingPaymentsProps {
  payments?: Payment[];
  isLoading: boolean;
}

export default function UpcomingPayments({ payments, isLoading }: UpcomingPaymentsProps) {
  // Filter for pending payments with due dates and sort by due date
  const upcomingPayments = payments
    ?.filter(payment => payment.status === 'pending' && payment.dueDate)
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  const getDueDaysText = (dueDate: string | null | undefined) => {
    if (!dueDate) return "No due date";
    
    const days = differenceInDays(new Date(dueDate), new Date());
    
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    
    return `Due in ${days} days`;
  };

  const getDueDaysClass = (dueDate: string | null | undefined) => {
    if (!dueDate) return "text-neutral-500 dark:text-neutral-400";
    
    const days = differenceInDays(new Date(dueDate), new Date());
    
    if (days < 0) return "text-danger";
    if (days <= 2) return "text-danger";
    if (days <= 5) return "text-warning";
    
    return "text-neutral-500 dark:text-neutral-400";
  };

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Upcoming Payments</h2>
        
        {isLoading ? (
          <ul className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <li key={i} className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-700 pb-3">
                <div>
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
              </li>
            ))}
          </ul>
        ) : upcomingPayments?.length === 0 ? (
          <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
            No upcoming payments found.
          </div>
        ) : (
          <ul className="space-y-3">
            {upcomingPayments?.map((payment, index) => (
              <li 
                key={payment.id} 
                className={`flex justify-between items-center ${
                  index < upcomingPayments.length - 1 ? "border-b border-neutral-100 dark:border-neutral-700 pb-3" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-sm dark:text-white">Client {payment.clientId}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Invoice #{payment.invoiceNumber || `INV-${payment.id}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold dark:text-white">${payment.amount.toLocaleString()}</p>
                  <p className={`text-xs ${getDueDaysClass(payment.dueDate)}`}>
                    {getDueDaysText(payment.dueDate)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <Link href="/payments">
          <a className="text-primary text-sm block text-center mt-4 hover:underline">
            View All Payments
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
