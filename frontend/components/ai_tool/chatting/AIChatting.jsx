"use client";

import { useState, useRef, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const AIChatting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    // Initial welcome message from AI
    {
      id: 1,
      role: "assistant",
      content: {
        text: "Hello! I'm your BetterStart AI assistant. How can I help you with your projects today?",
        suggestions: [
          "Create a new project",
          "Help me organize tasks",
          "Show project analytics",
        ],
      },
    },
    // User question
    {
      id: 2,
      role: "user",
      content: { text: "I need to create a new web development project" },
    },
    // AI response
    {
      id: 3,
      role: "assistant",
      content: {
        text: "Great! I can help you set up a new web development project. What's the name of your project?",
      },
    },
    // User response
    {
      id: 4,
      role: "user",
      content: { text: "Let's call it 'E-commerce Dashboard'" },
    },
    // AI help with project setup
    {
      id: 5,
      role: "assistant",
      content: {
        text: "I've created a new project called 'E-commerce Dashboard'. Would you like me to help you set up the initial structure with recommended tasks and milestones?",
      },
    },
    // User confirmation
    {
      id: 6,
      role: "user",
      content: { text: "Yes, that would be helpful" },
    },
    // AI detailed response
    {
      id: 7,
      role: "assistant",
      content: {
        text: "I've added the following structure to your E-commerce Dashboard project:\n\n1. Research & Planning (2 weeks)\n2. Design Phase (3 weeks)\n3. Frontend Development (4 weeks)\n4. Backend Integration (4 weeks)\n5. Testing (2 weeks)\n6. Deployment (1 week)\n\nEach phase has detailed tasks. Would you like me to show you the tasks for any specific phase?",
      },
    },
    // User question
    {
      id: 8,
      role: "user",
      content: { text: "Show me the tasks for the Design Phase" },
    },
    // AI response with details
    {
      id: 9,
      role: "assistant",
      content: {
        text: "Here are the tasks I've created for the Design Phase:\n\n1. Create wireframes for all pages\n2. Design UI components and style guide\n3. Create high-fidelity mockups\n4. Get stakeholder approval\n5. Prepare assets for development\n\nWould you like me to assign team members or set due dates for these tasks?",
      },
    },
    // User follow-up
    {
      id: 10,
      role: "user",
      content: {
        text: "Let's assign team members. I have Sarah for UI design and Mike for UX.",
      },
    },
    // AI confirmation
    {
      id: 11,
      role: "assistant",
      content: {
        text: "I've assigned Sarah (UI Designer) and Mike (UX Designer) to the Design Phase tasks. Sarah will focus on UI components and mockups, while Mike will handle wireframes and user flows. Is there anything else you'd like to adjust in this project plan?",
      },
    },
    // User question
    {
      id: 12,
      role: "user",
      content: {
        text: "What tech stack would you recommend for this e-commerce dashboard?",
      },
    },
    // AI technical recommendation
    {
      id: 13,
      role: "assistant",
      content: {
        text: "Based on your project requirements, I recommend this stack:\n\n**Frontend:**\n- React with Next.js for SEO benefits\n- TailwindCSS for styling\n- React Query for state management\n\n**Backend:**\n- Node.js with Express\n- MongoDB for database\n- Auth0 for authentication\n\n**Deployment:**\n- Vercel for frontend\n- Railway for backend\n\nThis stack offers good performance, developer experience, and scalability for your e-commerce dashboard. Would you like me to create a setup guide for this stack?",
      },
    },
    // User agreement
    {
      id: 14,
      role: "user",
      content: {
        text: "That sounds perfect. Yes, please create a setup guide.",
      },
    },
    // AI response
    {
      id: 15,
      role: "assistant",
      content: {
        text: "I've created a detailed setup guide in your project documentation. You can access it from the Project > Documents section. The guide includes:\n\n1. Setting up a Next.js project with TailwindCSS\n2. Configuring MongoDB Atlas\n3. Creating Express API routes\n4. Implementing Auth0 authentication\n5. Setting up CI/CD with GitHub Actions\n\nI've also added links to relevant documentation and starter code templates. Is there a specific part you'd like me to explain in more detail?",
      },
    },
    // User question
    {
      id: 16,
      role: "user",
      content: { text: "What about project timeline and budget estimates?" },
    },
    // AI response with estimates
    {
      id: 17,
      role: "assistant",
      content: {
        text: "Based on your project scope and team composition, here are my estimates:\n\n**Timeline:**\n- Total: 14-16 weeks (3.5-4 months)\n- With realistic buffers for revisions and unforeseen challenges\n\n**Budget Estimate:**\n- Development: $40,000-$60,000\n- Design: $10,000-$15,000\n- Ongoing maintenance: $1,500-$2,500/month\n\nThese estimates assume a team of 4-6 developers and 2 designers. Would you like me to create a detailed budget breakdown or suggest ways to optimize costs?",
      },
    },
    // User follow-up
    {
      id: 18,
      role: "user",
      content: {
        text: "Can you suggest ways to optimize costs without compromising quality?",
      },
    },
    // AI cost optimization suggestions
    {
      id: 19,
      role: "assistant",
      content: {
        text: "Here are several ways to optimize costs while maintaining quality:\n\n1. **Phased Implementation**: Start with core features and add others later\n2. **Use UI Libraries**: Leverage Material UI or Chakra UI to reduce custom design work\n3. **Serverless Architecture**: Use Vercel and Supabase to reduce backend costs\n4. **Managed Services**: Use Auth0's free tier and MongoDB Atlas's shared clusters\n5. **Automated Testing**: Invest in test automation early to reduce QA costs later\n6. **Regular Sprints**: Focus on weekly deliverables to avoid scope creep\n\nWith these optimizations, you could potentially reduce costs by 20-30%. Would you like me to update your project plan with these optimizations?",
      },
    },
    // User final request
    {
      id: 20,
      role: "user",
      content: {
        text: "Yes, please update the plan with these optimizations and share it with the team.",
      },
    },
    // AI final response
    {
      id: 21,
      role: "assistant",
      content: {
        text: "I've updated your project plan with the cost optimizations and shared it with your team members. The new plan includes:\n\n1. Phased delivery approach with core features prioritized\n2. Integration of Chakra UI to accelerate frontend development\n3. Serverless architecture using Vercel and Supabase\n4. Revised timeline of 12-14 weeks\n5. Updated budget estimate of $35,000-$50,000\n\nYou and your team can review the complete details in the Project Dashboard. Is there anything specific you'd like me to explain to the team about these changes?",
      },
    },
  ]);
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: {
          text: "Hello! I'm your BetterStart AI assistant. How can I help you with your projects today?",
          suggestions: [
            "Create a new project",
            "Help me organize tasks",
            "Show project analytics",
          ],
        },
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        onNewChat={handleNewChat}
      />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col h-full lg:pl-64">
        <ChatHeader onMenuClick={toggleSidebar} onNewChat={handleNewChat} />

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto py-6">
          <ChatMessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input area */}
        <div className="sticky bottom-0 w-full p-3 sm:py-4 bg-gray-50">
          <ChatInput
            onSendMessage={(text) => {
              if (text.trim()) {
                setMessages([
                  ...messages,
                  {
                    id: Date.now(),
                    role: "user",
                    content: { text },
                  },
                  // Simulate AI response after user message
                  {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: {
                      text:
                        "I'm processing your request about \"" +
                        text.substring(0, 30) +
                        (text.length > 30 ? "..." : "") +
                        '". Please give me a moment while I prepare a response.',
                    },
                  },
                ]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatting;
