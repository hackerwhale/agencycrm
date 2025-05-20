import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Button } from "@/components/ui/button";
import { FileDown, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Payment, Project } from "@shared/schema";

export default function Reports() {
  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const isLoading = clientsLoading || projectsLoading || paymentsLoading || statsLoading;

  // Sample data for reports
  const monthlyRevenue = [
    { month: 'Jan', revenue: 35000 },
    { month: 'Feb', revenue: 42000 },
    { month: 'Mar', revenue: 58000 },
    { month: 'Apr', revenue: 47000 },
    { month: 'May', revenue: 53000 },
    { month: 'Jun', revenue: 62000 },
    { month: 'Jul', revenue: 68000 },
    { month: 'Aug', revenue: 72000 },
    { month: 'Sep', revenue: 65000 },
    { month: 'Oct', revenue: 59000 },
    { month: 'Nov', revenue: 61000 },
    { month: 'Dec', revenue: 70000 },
  ];

  const clientDistribution = [
    { name: 'Tech Sector', value: 40 },
    { name: 'Retail', value: 20 },
    { name: 'Finance', value: 15 },
    { name: 'Healthcare', value: 10 },
    { name: 'Other', value: 15 },
  ];

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const projectStatusData = [
    { status: 'In Progress', count: 18 },
    { status: 'Completed', count: 12 },
    { status: 'On Hold', count: 3 },
    { status: 'Cancelled', count: 1 },
  ];

  const clientGrowth = [
    { month: 'Jan', clients: 16 },
    { month: 'Feb', clients: 18 },
    { month: 'Mar', clients: 19 },
    { month: 'Apr', clients: 20 },
    { month: 'May', clients: 21 },
    { month: 'Jun', clients: 22 },
    { month: 'Jul', clients: 24 },
    { month: 'Aug', clients: 24 },
    { month: 'Sep', clients: 25 },
    { month: 'Oct', clients: 26 },
    { month: 'Nov', clients: 28 },
    { month: 'Dec', clients: 30 },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Track your agency performance with detailed analytics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
          <Button>
            <FileDown className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Clients</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-semibold dark:text-white">
                        {clients?.length || 0}
                      </h3>
                    )}
                  </div>
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Projects</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-semibold dark:text-white">
                        {projects?.length || 0}
                      </h3>
                    )}
                  </div>
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-semibold dark:text-white">
                        ${payments?.reduce((total, payment) => 
                          payment.status === 'paid' ? total + payment.amount : total, 0
                        ).toLocaleString() || "0"}
                      </h3>
                    )}
                  </div>
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Pending Invoices</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <h3 className="text-2xl font-semibold dark:text-white">
                        ${payments?.reduce((total, payment) => 
                          payment.status === 'pending' ? total + payment.amount : total, 0
                        ).toLocaleString() || "0"}
                      </h3>
                    )}
                  </div>
                  <div className="p-2 bg-warning/10 text-warning rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Monthly Revenue</CardTitle>
                <CardDescription>Revenue trend over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-80 flex items-center justify-center">
                    <Skeleton className="w-full h-64" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={monthlyRevenue}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                      <XAxis dataKey="month" className="text-neutral-700 dark:text-neutral-300" />
                      <YAxis className="text-neutral-700 dark:text-neutral-300" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderColor: '#e2e8f0',
                          color: '#0f172a' 
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Client Distribution</CardTitle>
                <CardDescription>Client breakdown by industry</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-80 flex items-center justify-center">
                    <Skeleton className="w-full h-64" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={clientDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderColor: '#e2e8f0',
                          color: '#0f172a' 
                        }} 
                        formatter={(value, name, props) => [`${value}%`, `${name}`]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="bg-white dark:bg-neutral-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Client Growth</CardTitle>
              <CardDescription>Client acquisition over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="w-full h-64" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={clientGrowth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                    <XAxis dataKey="month" className="text-neutral-700 dark:text-neutral-300" />
                    <YAxis className="text-neutral-700 dark:text-neutral-300" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderColor: '#e2e8f0',
                        color: '#0f172a' 
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="clients" name="Active Clients" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Client Retention Rate</CardTitle>
                <CardDescription>Client retention over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">94%</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Average Retention Rate
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-success flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        3%
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-2">from last year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Client Satisfaction</CardTitle>
                <CardDescription>Based on client feedback</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-accent mb-2">4.8/5</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Average Client Rating
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-white dark:bg-neutral-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Project Status Distribution</CardTitle>
              <CardDescription>Current status of all projects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="w-full h-64" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={projectStatusData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                    <XAxis type="number" className="text-neutral-700 dark:text-neutral-300" />
                    <YAxis dataKey="status" type="category" className="text-neutral-700 dark:text-neutral-300" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderColor: '#e2e8f0',
                        color: '#0f172a' 
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="count" name="Number of Projects" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Average Project Duration</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">46 days</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Average Completion Time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Project Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">92%</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Projects Completed Successfully
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Project Overruns</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-warning mb-2">14%</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Projects with Timeline Overruns
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Annual Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">$820,450</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Total Revenue This Year
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-success flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        22%
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-2">from last year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Average Project Value</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">$12,450</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Per Project
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-success flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        8%
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-2">from last quarter</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">96%</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Invoice Collection Rate
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <span className="text-success flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 010-2h6a1 1 0 011 1zm-6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        3%
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-2">from last year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-neutral-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Revenue by Service Type</CardTitle>
              <CardDescription>Distribution of revenue by service category</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="w-full h-64" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      { service: 'Web Development', revenue: 320000 },
                      { service: 'Social Media Marketing', revenue: 180000 },
                      { service: 'SEO & Content', revenue: 120000 },
                      { service: 'Branding', revenue: 90000 },
                      { service: 'PPC Advertising', revenue: 110000 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                    <XAxis dataKey="service" className="text-neutral-700 dark:text-neutral-300" />
                    <YAxis className="text-neutral-700 dark:text-neutral-300" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderColor: '#e2e8f0',
                        color: '#0f172a' 
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
