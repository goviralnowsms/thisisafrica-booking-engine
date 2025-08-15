"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Plane, Calendar, Users, DollarSign, Sparkles, ExternalLink } from "lucide-react"

// Generate unique IDs for messages to avoid React key warnings
let messageIdCounter = 0;
function generateMessageId(): string {
  messageIdCounter++;
  return `${Date.now()}-${messageIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  options?: string[]
  products?: Product[]
  isLoading?: boolean
}

type Product = {
  code: string
  name: string
  description: string
  price: string
  duration: string
  supplier: string
  location: string
  url: string
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
    | "product_details"
}

export function EnhancedRecommendationAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [recommendationState, setRecommendationState] = useState<RecommendationState>({
    stage: "greeting",
  })
  const [isLoading, setIsLoading] = useState(false)
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
              "👋 Hello! I'm your enhanced Africa Travel Assistant. I have access to live product data, pricing, and detailed brochures to help you find the perfect African adventure.",
            sender: "bot",
            timestamp: new Date(),
          },
          {
            id: "2",
            content: "What type of African experience are you looking for?",
            sender: "bot",
            timestamp: new Date(),
            options: ["Safari Adventures", "River Cruises", "Luxury Rail Journeys", "Beach Escapes", "Multi-Country Tours", "Show me popular options"],
          },
        ]
        setMessages(initialMessages)
        setRecommendationState({ ...recommendationState, stage: "asking_destination" })
      }
    }
  }, [isOpen, messages.length, recommendationState])

  // Fetch products from our enhanced API
  const fetchProducts = async (query?: string, destination?: string, productType?: string) => {
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (destination) params.set('destination', destination)
      if (productType) params.set('type', productType)
      params.set('limit', '3')

      const response = await fetch(`/api/chatbot/products?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        return data.products
      }
      return []
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return []
    }
  }

  // Fetch PDF content for a product
  const fetchPDFContent = async (productCode: string) => {
    try {
      const response = await fetch(`/api/chatbot/pdf-content?productCode=${productCode}`)
      const data = await response.json()
      return data.content || 'No additional brochure information available.'
    } catch (error) {
      console.error('Failed to fetch PDF content:', error)
      return 'Brochure information temporarily unavailable.'
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
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
      id: generateMessageId(),
      content: option,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Process the selected option
    processUserInput(option)
  }

  const processUserInput = async (input: string) => {
    setIsLoading(true)

    // Add loading message
    const loadingMessage: Message = {
      id: generateMessageId(),
      content: "Let me search our live product database for the best options...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true
    }
    setMessages((prev) => [...prev, loadingMessage])

    // Wait a moment before responding (simulates API processing)
    setTimeout(async () => {
      try {
        switch (recommendationState.stage) {
          case "asking_destination":
            await handleDestinationSelection(input)
            break

          case "asking_budget":
            await handleBudgetSelection(input)
            break

          case "asking_travelers":
            await handleTravelersSelection(input)
            break

          case "asking_duration":
            await handleDurationSelection(input)
            break

          case "asking_interests":
            await handleInterestsSelection(input)
            break

          case "recommending":
          case "follow_up":
          case "product_details":
            await handleFollowUpQuestion(input)
            break

          default:
            const fallbackMessage: Message = {
              id: generateMessageId(),
              content: "I'm not sure I understand. Could you please rephrase that or choose from the available options?",
              sender: "bot",
              timestamp: new Date(),
            }
            setMessages((prev) => prev.filter(m => !m.isLoading).concat([fallbackMessage]))
        }
      } catch (error) {
        console.error('Error processing user input:', error)
        const errorMessage: Message = {
          id: generateMessageId(),
          content: "I encountered an issue while searching. Let me show you some popular options instead.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([errorMessage]))
        
        // Show fallback products
        await showFallbackProducts()
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const handleDestinationSelection = async (input: string) => {
    const destination = input.toLowerCase()
    let productType = ""
    
    // Map user input to product types
    if (destination.includes("safari")) {
      productType = "Group Tours"
    } else if (destination.includes("cruise")) {
      productType = "Cruises"
    } else if (destination.includes("rail") || destination.includes("train")) {
      productType = "Rail"
    } else if (destination.includes("beach")) {
      productType = "Packages"
    } else if (destination.includes("popular") || destination.includes("show me")) {
      productType = "Group Tours" // Default to popular safaris
    }

    // Fetch relevant products
    const products = await fetchProducts(input, undefined, productType)

    setRecommendationState({
      ...recommendationState,
      destination: input,
      stage: "asking_budget",
    })

    const responseContent = products.length > 0 
      ? `Great choice! I found ${products.length} excellent ${input.toLowerCase()} options in our live inventory. Here are the top recommendations:`
      : `${input} is a wonderful choice! Let me show you some featured options while I gather more specific details.`

    const budgetMessage: Message = {
      id: generateMessageId(),
      content: responseContent,
      sender: "bot",
      timestamp: new Date(),
      products: products.length > 0 ? products : undefined
    }

    const followUpMessage: Message = {
      id: generateMessageId(),
      content: "What's your approximate budget per person for this trip?",
      sender: "bot",
      timestamp: new Date(),
      options: ["$1,000-$3,000", "$3,000-$5,000", "$5,000-$10,000", "$10,000+", "Show me all options"],
    }

    setMessages((prev) => prev.filter(m => !m.isLoading).concat([budgetMessage, followUpMessage]))
  }

  const handleBudgetSelection = async (input: string) => {
    setRecommendationState({
      ...recommendationState,
      budget: input,
      stage: "asking_travelers",
    })

    const travelersMessage: Message = {
      id: generateMessageId(),
      content: `Perfect! With a ${input} budget, you'll have some excellent options. How many travelers will be joining this adventure?`,
      sender: "bot",
      timestamp: new Date(),
      options: ["Solo traveler", "Couple", "Family (3-5)", "Group (6+)", "Skip - show recommendations"],
    }
    setMessages((prev) => prev.filter(m => !m.isLoading).concat([travelersMessage]))
  }

  const handleTravelersSelection = async (input: string) => {
    setRecommendationState({
      ...recommendationState,
      travelers: input,
      stage: "recommending",
    })

    // Generate final recommendations with live data
    await generateLiveRecommendations()
  }

  const handleDurationSelection = async (input: string) => {
    setRecommendationState({
      ...recommendationState,
      duration: input,
      stage: "asking_interests",
    })

    const interestsMessage: Message = {
      id: generateMessageId(),
      content: "What experiences are you most interested in? (You can select multiple)",
      sender: "bot",
      timestamp: new Date(),
      options: [
        "Wildlife viewing",
        "Cultural experiences", 
        "Adventure activities",
        "Luxury accommodations",
        "Photography",
        "Skip - show recommendations",
      ],
    }
    setMessages((prev) => prev.filter(m => !m.isLoading).concat([interestsMessage]))
  }

  const handleInterestsSelection = async (input: string) => {
    setRecommendationState({
      ...recommendationState,
      interests: input.split(",").map((i) => i.trim()),
      stage: "recommending",
    })

    await generateLiveRecommendations()
  }

  const generateLiveRecommendations = async () => {
    const { destination, budget, travelers } = recommendationState

    // Fetch products based on collected preferences
    const products = await fetchProducts(destination, undefined, undefined)

    if (products.length > 0) {
      const recommendationMessage: Message = {
        id: generateMessageId(),
        content: `Based on your preferences for ${destination} with a ${budget} budget for ${travelers}, here are my top live recommendations from our current inventory:`,
        sender: "bot",
        timestamp: new Date(),
        products: products
      }

      const followUpMessage: Message = {
        id: generateMessageId(),
        content: "Would you like more details about any of these options, see different alternatives, or speak with a travel specialist?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Get product details", "See more options", "Speak with specialist", "Check availability", "Download brochures"],
      }

      setMessages((prev) => prev.filter(m => !m.isLoading).concat([recommendationMessage, followUpMessage]))
    } else {
      await showFallbackProducts()
    }

    setRecommendationState({ ...recommendationState, stage: "follow_up" })
  }

  const showFallbackProducts = async () => {
    const fallbackProducts = await fetchProducts()
    
    const fallbackMessage: Message = {
      id: generateMessageId(),
      content: "Here are some of our most popular African adventures currently available:",
      sender: "bot",
      timestamp: new Date(),
      products: fallbackProducts
    }

    setMessages((prev) => prev.filter(m => !m.isLoading).concat([fallbackMessage]))
  }

  const handleFollowUpQuestion = async (input: string) => {
    if (input.toLowerCase().includes("details") || input.toLowerCase().includes("more about")) {
      const detailsMessage: Message = {
        id: generateMessageId(),
        content: "I can provide detailed information about any of our products. Which specific tour or experience would you like to know more about? I can access live pricing, availability, and detailed brochure content.",
        sender: "bot",
        timestamp: new Date(),
        options: ["Classic Kenya Safari", "Zambezi River Cruise", "Victoria Falls Experience", "Show all current options"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([detailsMessage]))
    } else if (input.toLowerCase().includes("specialist") || input.toLowerCase().includes("speak")) {
      const specialistMessage: Message = {
        id: generateMessageId(),
        content: "I'll connect you with one of our Africa specialists who can provide personalized assistance. They have access to the same live data I do, plus they can customize any itinerary.",
        sender: "bot",
        timestamp: new Date(),
        options: ["Schedule a call", "Email me", "Contact form", "Live chat"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([specialistMessage]))
    } else if (input.toLowerCase().includes("more options") || input.toLowerCase().includes("alternatives")) {
      const products = await fetchProducts()
      const moreOptionsMessage: Message = {
        id: generateMessageId(),
        content: "Here are additional options from our current inventory:",
        sender: "bot",
        timestamp: new Date(),
        products: products
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([moreOptionsMessage]))
    } else if (input.toLowerCase().includes("availability") || input.toLowerCase().includes("dates")) {
      const availabilityMessage: Message = {
        id: generateMessageId(),
        content: "I can check real-time availability for any of our tours. Which specific product would you like me to check dates for?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Classic Kenya Tours", "River Cruises", "Rail Journeys", "Victoria Falls Tours", "All products"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([availabilityMessage]))
    } else if (input.toLowerCase().includes("brochure") || input.toLowerCase().includes("pdf")) {
      const brochureMessage: Message = {
        id: generateMessageId(),
        content: "I have access to detailed PDF brochures for all our products. Which tour would you like the brochure information for?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Kenya Safaris", "Botswana Cruises", "Rail Journeys", "Multi-country Tours", "All brochures"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([brochureMessage]))
    } else {
      const helpMessage: Message = {
        id: generateMessageId(),
        content: "I'm here to help with live product information, pricing, and availability. What would you like to explore?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Browse products", "Check pricing", "View availability", "Speak with specialist", "Start over"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([helpMessage]))
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
        aria-label="Open enhanced chat assistant"
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
                  src="/images/products/this-is-africa-logo.png"
                  alt="This is Africa Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-bold">Enhanced AI Assistant</h3>
                <p className="text-xs text-white/80">Live Data • PDF Content • Real Pricing</p>
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
                  {message.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent mr-2"></div>
                      <p>{message.content}</p>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(message.timestamp)}
                </div>

                {/* Product cards */}
                {message.products && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{product.price}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{product.duration} • {product.location}</span>
                          <Link 
                            href={product.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-amber-600 hover:text-amber-700"
                          >
                            View Details <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Option buttons */}
                {message.options && (
                  <div className={`mt-2 flex flex-wrap gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {message.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isLoading}
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
                placeholder="Ask about products, pricing, availability..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 focus-visible:ring-amber-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="ml-2 bg-amber-500 hover:bg-amber-600"
                size="icon"
                disabled={inputValue.trim() === "" || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Live data • Real pricing • PDF content</span>
              </div>
              <div className="flex space-x-2">
                <button className="hover:text-amber-500" aria-label="Live products">
                  <Plane className="h-4 w-4" />
                </button>
                <button className="hover:text-amber-500" aria-label="Real-time pricing">
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