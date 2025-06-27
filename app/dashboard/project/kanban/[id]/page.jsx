"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "../../../../../components/common/Breadcrumb";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

import KanbanBoard from "./_components/KanbanBoard";
import AddTaskModal from "./_components/AddTaskModal";
import { TAG_COLORS, formatStatusLabel } from "./_components/kanbanConstants";

const KanbanPage = () => {
  const params = useParams();
  const projectId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState({
    pending: [],
    inProgress: [],
    complete: [],
  });
  const [draggingTask, setDraggingTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    tag: "Design",
    dueDate: "",
  });

  // Fetch project data and tasks
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        // Simulate API call - would be replaced with real API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock project data
        setProjectName("Website Redesign");

        // Mock tasks data
        setTasks({
          pending: [
            {
              id: "task-1",
              title: "Create wireframes for homepage",
              assignees: [1, 2],
              tags: ["Design", "Research"],
              dueDate: "June 20, 2025",
            },
            {
              id: "task-2",
              title: "Content audit for existing pages",
              assignees: [3],
              tags: ["Research", "Writer"],
              dueDate: "June 22, 2025",
            },
          ],
          inProgress: [
            {
              id: "task-3",
              title: "Design navigation menu",
              assignees: [1, 4],
              tags: ["Design", "Prototype"],
              dueDate: "June 18, 2025",
            },
          ],
          complete: [
            {
              id: "task-4",
              title: "Stakeholder interviews",
              assignees: [2, 3],
              tags: ["Research"],
              dueDate: "June 15, 2025",
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        setError("Failed to load project data");
        toast.error("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Handle drag start
  const handleDragStart = (e, task, status) => {
    setDraggingTask({ task, sourceStatus: status });
    e.currentTarget.classList.add("opacity-50");
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggingTask(null);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();

    if (!draggingTask) return;

    const { task, sourceStatus } = draggingTask;

    if (!isValidMove(sourceStatus, targetStatus)) {
      toast.error("Tasks can only move forward in the workflow.");
      return;
    }

    const updatedTasks = { ...tasks };

    updatedTasks[sourceStatus] = updatedTasks[sourceStatus].filter(
      (t) => t.id !== task.id
    );

    updatedTasks[targetStatus] = [...updatedTasks[targetStatus], task];

    setTasks(updatedTasks);
    toast.success(`Task moved to ${formatStatusLabel(targetStatus)}`);
  };

  // Check if move is valid
  const isValidMove = (source, target) => {
    const statuses = ["pending", "inProgress", "complete"];
    const sourceIndex = statuses.indexOf(source);
    const targetIndex = statuses.indexOf(target);

    const isOneStep = Math.abs(targetIndex - sourceIndex) === 1;

    const isForwardOnly = targetIndex > sourceIndex;

    return isOneStep && isForwardOnly;
  };

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    const updatedTasks = { ...tasks };
    const newTaskObj = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      assignees: [1], // Default assignee
      tags: [newTask.tag],
      dueDate: newTask.dueDate || "Not set",
    };

    updatedTasks.pending = [...updatedTasks.pending, newTaskObj];
    setTasks(updatedTasks);

    // Reset form and close modal
    setNewTask({
      title: "",
      tag: "Design",
      dueDate: "",
    });
    setShowAddTaskModal(false);

    toast.success("New task added to To Do");
  };

  if (isLoading) {
    return <LoadingSpinner size="large" fullScreen />;
  }

  if (error) {
    return (
      <>
        <div className="mt-20">
          <Breadcrumb
            items={[
              { label: "Projects Overview", href: "/dashboard/project" },
              {
                label: projectName,
                href: `/dashboard/project/${projectId}`,
              },
            ]}
            currentPage="Kanban Board"
          />
          <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error Loading Project
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-20">
        <Breadcrumb
          items={[{ label: "Projects Overview", href: "/dashboard/project" }]}
          currentPage={projectName}
        />

        {/* Main content */}
        <div className="max-w-[95rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-8 mx-auto bg-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {projectName} - Kanban Board
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Drag tasks between columns to update their status
              </p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add new task
            </button>
          </div>

          {/* Kanban board */}
          <KanbanBoard
            tasks={tasks}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        newTask={newTask}
        setNewTask={setNewTask}
        onSubmit={handleAddTask}
        tagColors={TAG_COLORS}
      />
    </>
  );
};

export default KanbanPage;
