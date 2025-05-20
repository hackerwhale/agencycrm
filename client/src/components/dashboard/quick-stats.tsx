import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuickStats() {
  const stats = [
    { 
      label: "This Month Revenue", 
      value: "$24,500 / $30,000", 
      progress: 82, 
      progressColor: "bg-primary" 
    },
    { 
      label: "Project Completion", 
      value: "12 / 15", 
      progress: 80, 
      progressColor: "bg-secondary" 
    },
    { 
      label: "Client Satisfaction", 
      value: "95%", 
      progress: 95, 
      progressColor: "bg-accent" 
    },
  ];

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Stats</h2>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-500 dark:text-neutral-400">{stat.label}</span>
                <span className="font-medium dark:text-white">{stat.value}</span>
              </div>
              <Progress value={stat.progress} className="h-2 bg-neutral-200 dark:bg-neutral-700" indicatorClassName={stat.progressColor} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
