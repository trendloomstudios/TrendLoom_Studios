"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/crm";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Briefcase,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function TasksView({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // Lazy initialize state to keep render pure
  const [formData, setFormData] = useState(() => ({
    title: "",
    description: "",
    due_date: "2026-03-10",
    priority: "high" as TaskPriority,
    related_to_title: "",
  }));

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus: TaskStatus =
          t.status === "completed" ? "pending" : "completed";
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: formData.title,
      description: formData.description || undefined,
      due_date: formData.due_date,
      priority: formData.priority,
      status: "pending",
      related_to_title: formData.related_to_title || undefined,
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      due_date: "2026-03-10",
      priority: "high",
      related_to_title: "",
    });
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="gap-1 uppercase text-[10px]">
            <AlertTriangle className="h-3 w-3" /> Urgent
          </Badge>
        );
      case "high":
        return <Badge variant="warning" className="uppercase text-[10px]">High</Badge>;
      case "medium":
        return <Badge variant="default" className="uppercase text-[10px]">Medium</Badge>;
      case "low":
        return <Badge variant="secondary" className="uppercase text-[10px]">Low</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tasks & Action Items
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize sales follow-ups, contract reviews, and client deliverables.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {["all", "pending", "in_progress", "completed"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              statusFilter === st
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <Card className="py-12 text-center text-slate-400 text-xs shadow-2xs">
            No tasks found in this view.
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 shadow-2xs transition-all hover:border-slate-300 ${
                task.status === "completed" ? "bg-slate-50/70 opacity-70" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition"
                  aria-label={
                    task.status === "completed"
                      ? "Mark task incomplete"
                      : "Mark task completed"
                  }
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        task.status === "completed"
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Due {formatDate(task.due_date)}</span>
                    </div>
                    {task.related_to_title && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{task.related_to_title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Create Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Task Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Follow up on Enterprise agreement redlines"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details, link to document, or action notes..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Due Date</label>
                  <Input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Related Deal or Account</label>
                <Input
                  value={formData.related_to_title}
                  onChange={(e) => setFormData({ ...formData, related_to_title: e.target.value })}
                  placeholder="e.g. Apex Global Cloud"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
