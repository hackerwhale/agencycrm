import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Project, Client } from "@shared/schema";
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
import { Progress } from "@/components/ui/progress";
import { ProjectForm } from "@/components/projects/project-form";
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
  CreditCard,
  FileBarChart
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Projects() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Success",
        description: "Project has been deleted successfully",
      });
      
      setProjectToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete.id);
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.company : `Client ${clientId}`;
  };

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

  const filteredProjects = projects?.filter((project) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      (project.description && project.description.toLowerCase().includes(searchLower)) ||
      getClientName(project.clientId).toLowerCase().includes(searchLower)
    );
  });

  const isLoading = projectsLoading || clientsLoading;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Projects</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Track and manage all your agency projects
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleAddProject}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Add New Project</span>
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <CardTitle className="text-xl dark:text-white">All Projects</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            A list of all your agency projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-neutral-700">
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Project</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Client</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Status</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Progress</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Deadline</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-b dark:border-neutral-700">
                      <TableCell>
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-2 w-full rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                )}
                
                {!isLoading && filteredProjects?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                      {searchTerm ? "No projects found matching your search." : "No projects found. Add your first project!"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredProjects?.map((project) => (
                  <TableRow key={project.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <TableCell className="py-3">
                      <div className="font-medium dark:text-white">{project.name}</div>
                      {project.description && (
                        <div className="text-neutral-500 dark:text-neutral-400 text-xs truncate max-w-xs">
                          {project.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 dark:text-neutral-300">
                      {getClientName(project.clientId)}
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(project.status)}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={project.progress || 0}
                          className="h-2 w-24"
                          indicatorClassName={
                            project.progress >= 100 
                              ? "bg-primary" 
                              : project.progress > 50 
                                ? "bg-success" 
                                : "bg-warning"
                          }
                        />
                        <span className="text-xs dark:text-neutral-400">{project.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-neutral-500 dark:text-neutral-400">
                      {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'No deadline'}
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
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Manage Payments
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileBarChart className="h-4 w-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
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

      {/* Project Form Dialog */}
      <ProjectForm 
        open={showProjectForm}
        onOpenChange={setShowProjectForm}
        defaultValues={editingProject || undefined}
        projectId={editingProject?.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{projectToDelete?.name}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProject}
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
