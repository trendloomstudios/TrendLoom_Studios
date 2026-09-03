import { getTasks } from "@/lib/data-service";
import { TasksView } from "./tasks-view";

export const metadata = {
  title: "Tasks & Deliverables | TrendLoom Studios CRM Workspace",
  description: "Track action items, follow-ups, and sales tasks",
};

export default async function TasksPage() {
  const tasks = await getTasks();
  return <TasksView initialTasks={tasks} />;
}
