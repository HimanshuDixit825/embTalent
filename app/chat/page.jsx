"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AnalysisResults from "./components/AnalysisResults";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTechnologies,
  selectMainTechnology,
  selectMustHaveSkills,
  selectGoodToHaveSkills,
  selectExplanation,
  addMustHaveSkill,
  addGoodToHaveSkill,
  setExplanation,
  clearSkills,
  removeGoodToHaveSkill,
  removeMustHaveSkill,
} from "@/app/store/techSlice";

// Debug log for mainSelection
const logMainSelection = (mainSelection) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Main Selection:", mainSelection);
  }
};

const ChatPage = () => {
  const { user } = useUser();
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const selectedTechnologies = useSelector(selectTechnologies);
  const mainSelection = useSelector(selectMainTechnology);
  const mustHaveSkills = useSelector(selectMustHaveSkills);
  const goodToHaveSkills = useSelector(selectGoodToHaveSkills);
  const explanation = useSelector(selectExplanation);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Main Selection:", mainSelection);
      console.log("Selected Technologies:", selectedTechnologies);
      console.log("API Payload:", {
        mainSelection,
        selectedTechnologies,
      });
    }
  }, [mainSelection, selectedTechnologies]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState("");
  const techLabels = selectedTechnologies.map((tech) => tech.label);
  const initialMessage = (() => {
    if (selectedTechnologies.length > 0) {
      return `Hi! I see you're looking for a developer with ${techLabels.join(
        ", "
      )} experience. Let's explore what other skills and experience would be important for this role.`;
    } else if (mainSelection?.label) {
      return `Hi! I see you're looking for a ${mainSelection.label} developer. Let's explore what skills and experience would be important for this role.`;
    } else {
      return "Hi! I'm here to help analyze job requirements. Let's start with the technology you're hiring for.";
    }
  })();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      content: initialMessage,
      avatar: "/orb.png",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (inputMessage === "") {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [inputMessage]);

  const updateRecord = async (
    updatedMessages,
    newMustHave = [],
    newGoodToHave = []
  ) => {
    const token = localStorage.getItem("recruitment_flow_token");
    if (!token) return;

    try {
      // Get current record data
      const getResponse = await fetch(`/api/lead-line-item?token=${token}`);
      const { data: currentData } = await getResponse.json();

      // Prepare update data
      const updateData = {
        temporary_token: token,
        chats: updatedMessages.map((msg) => ({
          role: msg.sender,
          content: msg.content,
        })),
        must_have: [
          ...(currentData?.must_have || []),
          ...mustHaveSkills,
          ...newMustHave,
        ],
        good_to_have: [
          ...(currentData?.good_to_have || []),
          ...goodToHaveSkills,
          ...newGoodToHave,
        ],
        jd_filename: currentData?.jd_filename,
        jd_fileurl: currentData?.jd_fileurl,
      };

      // Update record
      const updateResponse = await fetch("/api/lead-line-item", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update record");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage = {
      sender: "user",
      content: inputMessage,
      avatar: "/Group.png",
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const lastAssistantMessage =
        messages[messages.length - 1].content.toLowerCase();
      const userResponse = inputMessage.toLowerCase();

      // Check if this is a remove command
      const removeMatch = userResponse.match(/remove\s+(.+)/);
      if (removeMatch) {
        const skillToRemoveInput = removeMatch[1].trim();

        // Find exact skill match (case-insensitive)
        const mustHaveMatch = mustHaveSkills.find(
          (skill) => skill.toLowerCase() === skillToRemoveInput.toLowerCase()
        );
        const goodToHaveMatch = goodToHaveSkills.find(
          (skill) => skill.toLowerCase() === skillToRemoveInput.toLowerCase()
        );

        const skillToRemove =
          mustHaveMatch || goodToHaveMatch || skillToRemoveInput;

        // Try to remove from both must-have and good-to-have
        dispatch(removeMustHaveSkill(skillToRemove));
        dispatch(removeGoodToHaveSkill(skillToRemove));

        const botResponse = {
          sender: "bot",
          content: `I've removed "${skillToRemove}" from the skills list.`,
          avatar: "/orb.png",
        };
        const updatedMessages = [...newMessages, botResponse];
        setMessages(updatedMessages);
        await updateRecord(updatedMessages);
        setIsLoading(false);
        return;
      }

      const apiMessages = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          selectedTechnologies,
          mainSelection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedText += chunk;
        setStreamingMessage(accumulatedText);
      }

      // Extract skills from response
      let newMustHave = [];
      let newGoodToHave = [];
      try {
        const jsonMatch = accumulatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsed = JSON.parse(jsonStr);
          if (parsed.skills) {
            // Get current skills to preserve them
            const currentMustHave = [...mustHaveSkills];
            const currentGoodToHave = [...goodToHaveSkills];

            // Add new skills while preserving existing ones
            newMustHave = parsed.skills.mustHave.filter(
              (skill) => !currentMustHave.includes(skill)
            );
            newGoodToHave = parsed.skills.goodToHave.filter(
              (skill) => !currentGoodToHave.includes(skill)
            );

            // Add new skills to Redux store
            newMustHave.forEach((skill) => {
              dispatch(addMustHaveSkill(skill));
            });
            newGoodToHave.forEach((skill) => {
              dispatch(addGoodToHaveSkill(skill));
            });
          }
        }
      } catch (error) {
        console.error("Error parsing skills:", error);
      }

      // Remove JSON object from message before displaying
      const cleanMessage = accumulatedText.replace(/\{[\s\S]*\}/, "").trim();
      const botResponse = {
        sender: "bot",
        content: cleanMessage,
        avatar: "/orb.png",
      };

      const updatedMessages = [...newMessages, botResponse];
      setMessages(updatedMessages);
      setStreamingMessage("");

      // Update record with new messages and skills
      await updateRecord(updatedMessages, newMustHave, newGoodToHave);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        sender: "bot",
        content: "I apologize, but I encountered an error. Please try again.",
        avatar: "/orb.png",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PageLayout
      rightPanel={
        <div className="h-screen overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
            <div>
              <h2 className="text-[40px] font-bold text-white mb-2">
                Skills Analysis
              </h2>
              <p className="text-gray-400 italic text-[12px] font-inter">
                I'll help you identify the must-have and good-to-have skills for
                your team.
              </p>
            </div>
            {(mustHaveSkills.length > 0 || goodToHaveSkills.length > 0) && (
              <div className="mt-6 space-y-6 relative">
                <AnalysisResults
                  results={{
                    mustHave: mustHaveSkills,
                    goodToHave: goodToHaveSkills,
                    explanation: explanation,
                  }}
                />
                <button
                  onClick={() => router.push("/experience")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors relative z-10 cursor-pointer"
                >
                  Continue to Experience
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="relative flex flex-col h-screen">
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={36} />
            </button>
            <h1 className="text-[40px] font-bold text-white">
              AURA - The AI assistant
            </h1>
          </div>
          <p className="text-gray-400 italic text-[12px] font-inter ml-[52px]">
            Your AI assistant to help you build the perfect team.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-8 px-6 min-h-0 pb-[100px] scrollbar-hide">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "user" ? "ml-auto" : ""
              } max-w-[80%]`}
            >
              <div
                className={`flex items-center rounded-lg bg-[#3C3C3C] shadow-lg ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 flex-shrink-0 mx-4 my-3">
                  <Image
                    src={message.avatar}
                    alt={message.sender}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 font-inter text-[12px] flex-1 py-3 px-4">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && streamingMessage && (
            <div className="max-w-[80%]">
              <div className="flex items-center rounded-lg bg-[#3C3C3C] shadow-lg">
                <div className="w-8 h-8 flex-shrink-0 mx-4 my-3">
                  <Image
                    src="/orb.png"
                    alt="bot"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 font-inter text-[12px] flex-1 py-3 px-4">
                  {streamingMessage}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#0B0B0BBF] pt-4 pb-2 px-6 mx-6 mb-6 rounded-lg">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyPress}
              placeholder="Message AURA"
              rows={1}
              className="w-full bg-[#3A3A3A] border border-[#515050] rounded-lg py-3.5 pl-4 pr-12 text-gray-300 focus:outline-none focus:border-emerald-500 shadow-lg resize-none overflow-hidden"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#515050] rounded-lg transition-colors"
            >
              <Image
                src="/send.png"
                alt="Send"
                width={36}
                height={36}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
