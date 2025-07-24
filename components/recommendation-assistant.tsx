"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Plane, Calendar, Users, DollarSign, Sparkles } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  options?: string[]
}

type RecommendationState = {
  destination?: string
  budget?: string
  travelers?: string
  duration?: string
  interests?: string[]
  stage:
    | "greeting"
    | "asking_destination"
    | "asking_budget"
    | "asking_travelers"
    | "asking_duration"
    | "asking_interests"
    | "recommending"
    | "follow_up"
}

export function RecommendationAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [recommendationState, setRecommendationState] = useState<RecommendationState>({
    stage: "greeting",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()

      // If no messages, send initial greeting
      if (messages.length === 0) {
        const initialMessages: Message[] = [
          {
            id: "1",
            content:
              "👋 Hello! I'm your Africa Travel Assistant. I can help you find the perfect safari, beach getaway, or adventure in Africa.",
            sender: "bot",
            timestamp: new Date(),
          },
          {
            id: "2",
            content: "What type of destination in Africa are you interested in visiting?",
            sender: "bot",
            timestamp: new Date(),
            options: ["Safari", "Beach", "City", "Mountains", "Multiple destinations", "Not sure yet"],
          },
        ]
        setMessages(initialMessages)
        setRecommendationState({ ...recommendationState, stage: "asking_destination" })
      }
    }
  }, [isOpen, messages.length, recommendationState])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Process user input based on current stage
    processUserInput(inputValue)
  }

  const handleOptionClick = (option: string) => {
    // Add user message with the selected option
    const userMessage: Message = {
      id: Date.now().toString(),
      content: option,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Process the selected option
    processUserInput(option)
  }

  const processUserInput = (input: string) => {
    // Wait a moment before responding (simulates thinking)
    setTimeout(() => {
      switch (recommendationState.stage) {
        case "asking_destination":
          setRecommendationState({
            ...recommendationState,
            destination: input,
            stage: "asking_budget",
          })

          const budgetMessage: Message = {
            id: Date.now().toString(),
            content: `Great! ${input} is a wonderful choice. What's your approximate budget per person for this trip?`,
            sender: "bot",
            timestamp: new Date(),
            options: ["$1,000-$3,000", "$3,000-$5,000", "$5,000-$10,000", "$10,000+", "Flexible"],
          }
          setMessages((prev) => [...prev, budgetMessage])
          break

        case "asking_budget":
          setRecommendationState({
            ...recommendationState,
            budget: input,
            stage: "asking_travelers",
          })

          const travelersMessage: Message = {
            id: Date.now().toString(),
            content: "How many travelers will be joining this adventure?",
            sender: "bot",
            timestamp: new Date(),
            options: ["Solo traveler", "Couple", "Family (3-5)", "Group (6+)"],
          }
          setMessages((prev) => [...prev, travelersMessage])
          break

        case "asking_travelers":
          setRecommendationState({
            ...recommendationState,
            travelers: input,
            stage: "asking_duration",
          })

          const durationMessage: Message = {
            id: Date.now().toString(),
            content: "How long are you planning to travel?",
            sender: "bot",
            timestamp: new Date(),
            options: ["1 week or less", "1-2 weeks", "2-3 weeks", "More than 3 weeks", "Not decided yet"],
          }
          setMessages((prev) => [...prev, durationMessage])
          break

        case "asking_duration":
          setRecommendationState({
            ...recommendationState,
            duration: input,
            stage: "asking_interests",
          })

          const interestsMessage: Message = {
            id: Date.now().toString(),
            content: "What experiences are you most interested in? (You can select multiple in your reply)",
            sender: "bot",
            timestamp: new Date(),
            options: [
              "Wildlife viewing",
              "Cultural experiences",
              "Adventure activities",
              "Relaxation",
              "Photography",
              "Luxury accommodations",
            ],
          }
          setMessages((prev) => [...prev, interestsMessage])
          break

        case "asking_interests":
          setRecommendationState({
            ...recommendationState,
            interests: input.split(",").map((i) => i.trim()),
            stage: "recommending",
          })

          // Thinking message
          const thinkingMessage: Message = {
            id: Date.now().toString(),
            content: "Thanks for sharing your preferences! Let me find some perfect options for you...",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, thinkingMessage])

          // Wait a moment before showing recommendations
          setTimeout(() => {
            generateRecommendations()
          }, 1500)
          break

        case "recommending":
        case "follow_up":
          handleFollowUpQuestion(input)
          break

        default:
          const fallbackMessage: Message = {
            id: Date.now().toString(),
            content: "I'm not sure I understand. Could you please rephrase that?",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, fallbackMessage])
      }
    }, 500)
  }

  const generateRecommendations = () => {
    const { destination, budget, travelers, duration } = recommendationState

    // Generate personalized recommendations based on user preferences
    const recommendations: Message[] = []

    // Safari recommendation
    if (destination?.toLowerCase().includes("safari") || destination?.toLowerCase().includes("multiple")) {
      recommendations.push({
        id: Date.now().toString() + "-1",
        content: `Based on your preferences, I recommend our **Luxury Safari Experience**. This 10-day journey through Kenya & Tanzania includes premium lodges, private game drives, and incredible wildlife viewing opportunities. Perfect for ${travelers} with a ${duration} timeframe.`,
        sender: "bot",
        timestamp: new Date(),
      })
    }

    // Beach recommendation
    if (destination?.toLowerCase().includes("beach") || destination?.toLowerCase().includes("multiple")) {
      recommendations.push({
        id: Date.now().toString() + "-2",
        content: `You might also enjoy our **Zanzibar Beach Escape**. This package includes 7 nights at a luxury beachfront resort with stunning ocean views, water activities, and optional cultural tours to Stone Town. Ideal for relaxation after a safari adventure.`,
        sender: "bot",
        timestamp: new Date(),
      })
    }

    // Victoria Falls recommendation
    if (destination?.toLowerCase().includes("multiple") || !destination?.toLowerCase().includes("beach")) {
      recommendations.push({
        id: Date.now().toString() + "-3",
        content: `Another excellent option is our **Victoria Falls Explorer** package. Experience one of the Seven Natural Wonders of the World with guided tours, river cruises, and luxury accommodations overlooking the Zambezi River.`,
        sender: "bot",
        timestamp: new Date(),
      })
    }

    // If no specific recommendations match
    if (recommendations.length === 0) {
      recommendations.push({
        id: Date.now().toString() + "-fallback",
        content: `Based on your interest in ${destination} with a ${budget} budget for ${travelers} traveling for ${duration}, I'd recommend speaking with one of our travel specialists who can create a custom itinerary for you.`,
        sender: "bot",
        timestamp: new Date(),
      })
    }

    // Add all recommendations to messages
    setMessages((prev) => [...prev, ...recommendations])

    // Follow-up message
    const followUpMessage: Message = {
      id: Date.now().toString() + "-followup",
      content:
        "Would you like more details about any of these packages, or would you prefer to speak with a travel specialist for a custom itinerary?",
      sender: "bot",
      timestamp: new Date(),
      options: ["More details", "Speak with a specialist", "Show more options", "Email these recommendations"],
    }

    setMessages((prev) => [...prev, followUpMessage])
    setRecommendationState({ ...recommendationState, stage: "follow_up" })
  }

  const handleFollowUpQuestion = (input: string) => {
    if (input.toLowerCase().includes("more detail") || input.toLowerCase().includes("details")) {
      const detailsMessage: Message = {
        id: Date.now().toString(),
        content: "I'd be happy to provide more details! Which package are you most interested in learning more about?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Luxury Safari Experience", "Zanzibar Beach Escape", "Victoria Falls Explorer"],
      }
      setMessages((prev) => [...prev, detailsMessage])
    } else if (input.toLowerCase().includes("specialist") || input.toLowerCase().includes("speak")) {
      const specialistMessage: Message = {
        id: Date.now().toString(),
        content:
          "I'll connect you with one of our Africa specialists who can help create your perfect itinerary. Would you like to schedule a call, or would you prefer they email you?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Schedule a call", "Email me"],
      }
      setMessages((prev) => [...prev, specialistMessage])
    } else if (input.toLowerCase().includes("more options") || input.toLowerCase().includes("show more")) {
      const moreOptionsMessage: Message = {
        id: Date.now().toString(),
        content:
          "Here are some additional options that might interest you:\n\n**Cape Town & Winelands** - Explore South Africa's most beautiful city and nearby wine regions.\n\n**Botswana Delta Safari** - Experience the unique Okavango Delta ecosystem with luxury camps.\n\n**Rwanda Gorilla Trekking** - An unforgettable encounter with mountain gorillas in their natural habitat.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, moreOptionsMessage])

      const followUpMessage: Message = {
        id: Date.now().toString(),
        content: "Would you like more information about any of these options?",
        sender: "bot",
        timestamp: new Date(),
        options: [
          "Cape Town & Winelands",
          "Botswana Delta Safari",
          "Rwanda Gorilla Trekking",
          "Speak with a specialist",
        ],
      }
      setMessages((prev) => [...prev, followUpMessage])
    } else if (input.toLowerCase().includes("email") || input.toLowerCase().includes("send")) {
      const emailMessage: Message = {
        id: Date.now().toString(),
        content: "I'd be happy to email these recommendations to you. Could you please provide your email address?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, emailMessage])
    } else if (input.toLowerCase().includes("luxury safari")) {
      const safariDetailsMessage: Message = {
        id: Date.now().toString(),
        content:
          "**Luxury Safari Experience** (10 days / 9 nights)\n\n**Highlights:**\n• 3 nights in Masai Mara, Kenya\n• 3 nights in Serengeti, Tanzania\n• 2 nights at Ngorongoro Crater\n• 1 night in Nairobi\n\n**Includes:**\n• Luxury accommodations\n• All meals and drinks\n• Private game drives\n• Expert guides\n• Internal flights\n• Airport transfers\n\n**Price:** From $3,499 per person\n**Best time to visit:** June to October",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, safariDetailsMessage])

      const nextStepsMessage: Message = {
        id: Date.now().toString(),
        content:
          "Would you like to see available dates for this package or speak with a specialist about customizing it?",
        sender: "bot",
        timestamp: new Date(),
        options: ["See available dates", "Customize this package", "View other packages"],
      }
      setMessages((prev) => [...prev, nextStepsMessage])
    } else {
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I'm here to help with any questions about our Africa travel packages. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Recommended packages", "Speak with a specialist", "Best time to visit Africa", "Start over"],
      }
      setMessages((prev) => [...prev, fallbackMessage])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all ${isOpen ? "scale-0" : "scale-100"}`}
        aria-label="Open chat assistant"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-96 transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col h-[600px] max-h-[80vh] m-4 rounded-xl overflow-hidden shadow-2xl bg-white border border-gray-200">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 bg-amber-500 text-white">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3 rounded-full overflow-hidden bg-white">
                <Image
                  src="/images/this-is-africa-logo.png"
                  alt="This is Africa Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-bold">Africa Travel Assistant</h3>
                <p className="text-xs text-white/80">Online | Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-amber-600 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-amber-500 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(message.timestamp)}
                </div>

                {/* Option buttons */}
                {message.options && (
                  <div
                    className={`mt-2 flex flex-wrap gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 focus-visible:ring-amber-500"
              />
              <Button
                onClick={handleSendMessage}
                className="ml-2 bg-amber-500 hover:bg-amber-600"
                size="icon"
                disabled={inputValue.trim() === ""}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>AI-powered recommendations</span>
              </div>
              <div className="flex space-x-2">
                <button className="hover:text-amber-500" aria-label="Travel preferences">
                  <Plane className="h-4 w-4" />
                </button>
                <button className="hover:text-amber-500" aria-label="Calendar">
                  <Calendar className="h-4 w-4" />
                </button>
                <button className="hover:text-amber-500" aria-label="Travelers">
                  <Users className="h-4 w-4" />
                </button>
                <button className="hover:text-amber-500" aria-label="Budget">
                  <DollarSign className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
