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
  currentProduct?: Product // Track the product user is asking about
  lastProducts?: Product[] // Remember last shown products
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
    | "checking_availability" // New stage for availability checks
    | "showing_dates" // New stage for showing dates
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

  // Check availability for a specific product
  const checkProductAvailability = async (productCode: string) => {
    try {
      const response = await fetch(`/api/chatbot/availability?productCode=${productCode}`)
      const data = await response.json()
      
      if (data.success) {
        return {
          available: data.available,
          message: data.response,
          dates: data.dates,
          pricing: data.pricing
        }
      }
      return {
        available: false,
        message: 'Unable to check availability at this time. Please contact us for current availability.',
        dates: [],
        pricing: null
      }
    } catch (error) {
      console.error('Failed to check availability:', error)
      return {
        available: false,
        message: 'Error checking availability. Please try again or contact us directly.',
        dates: [],
        pricing: null
      }
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
        // Enhanced intent detection and smart routing
        // Handle contextual questions first
        if (isAskingAboutPrice && hasCurrentProduct) {
          const priceMessage: Message = {
            id: generateMessageId(),
            content: `${recommendationState.currentProduct!.name} is priced at ${recommendationState.currentProduct!.price}. This typically includes accommodation, meals, and activities as specified in the tour details. Would you like me to check current availability and exact pricing?`,
            sender: "bot",
            timestamp: new Date(),
            options: [`Check current pricing for ${recommendationState.currentProduct!.name}`, "Compare with other tours", "See what's included", "Book this tour"]
          }
          setMessages((prev) => prev.filter(m => !m.isLoading).concat([priceMessage]))
          return
        }

        if (isAskingAboutDuration && hasCurrentProduct) {
          const durationMessage: Message = {
            id: generateMessageId(),
            content: `${recommendationState.currentProduct!.name} is a ${recommendationState.currentProduct!.duration} experience. This includes all activities, transfers, and experiences outlined in the itinerary.`,
            sender: "bot",
            timestamp: new Date(),
            options: [`See detailed itinerary`, `Check availability`, `Compare duration with other tours`, `Book this tour`]
          }
          setMessages((prev) => prev.filter(m => !m.isLoading).concat([durationMessage]))
          return
        }

        if (isComparingOptions && hasRecentProducts) {
          const compareMessage: Message = {
            id: generateMessageId(),
            content: `I can help you compare the tours we've been looking at. Here are the key differences in duration, pricing, and experiences:`,
            sender: "bot",
            timestamp: new Date(),
            products: recommendationState.lastProducts?.slice(0, 3),
            options: ["Tell me more about differences", "Which is best value?", "Book the most popular", "See different options"]
          }
          setMessages((prev) => prev.filter(m => !m.isLoading).concat([compareMessage]))
          return
        }

        // Check if user is asking for dates regardless of stage
        if (lowerInput.includes("see dates for") || lowerInput.includes("check availability for") || lowerInput.includes("see available dates")) {
          await handleFollowUpQuestion(input)
        } else if (lowerInput.includes("continue with preferences")) {
          // User wants to continue with budget/traveler questions
          setRecommendationState({ ...recommendationState, stage: "asking_budget" })
          await handleBudgetSelection("Show me all options")
        } else {
          // Normal flow based on current stage
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
            case "checking_availability":
            case "showing_dates":
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

    // Store products in state for later reference
    setRecommendationState({
      ...recommendationState,
      destination: input,
      stage: "asking_budget",
      lastProducts: products.length > 0 ? products : undefined
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

    // Smart follow-up options based on products found
    const followUpOptions = products.length > 0
      ? [
          `Book ${products[0].name}`,
          `Check availability for ${products[0].name}`,
          products.length > 1 ? `Compare top ${Math.min(products.length, 3)} tours` : "See similar tours",
          "Continue with preferences",
          "Contact specialist"
        ]
      : ["$1,000-$3,000", "$3,000-$5,000", "$5,000-$10,000", "$10,000+", "Show me all options"]

    const followUpMessage: Message = {
      id: generateMessageId(),
      content: products.length > 0
        ? `These ${products.length} tours match your interests! You can book directly, check dates, or let me help refine your search further.`
        : "What's your approximate budget per person for this trip?",
      sender: "bot",
      timestamp: new Date(),
      options: followUpOptions,
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
      // Store products in state for later reference
      setRecommendationState({ 
        ...recommendationState, 
        stage: "follow_up",
        lastProducts: products 
      })

      const recommendationMessage: Message = {
        id: generateMessageId(),
        content: `Based on your preferences for ${destination} with a ${budget} budget for ${travelers}, here are my top live recommendations from our current inventory:`,
        sender: "bot",
        timestamp: new Date(),
        products: products
      }

      const followUpMessage: Message = {
        id: generateMessageId(),
        content: "What would you like to do next?",
        sender: "bot",
        timestamp: new Date(),
        options: products.map(p => `Check availability for ${p.name}`).concat(["See more options", "Speak with specialist"]),
      }

      setMessages((prev) => prev.filter(m => !m.isLoading).concat([recommendationMessage, followUpMessage]))
    } else {
      await showFallbackProducts()
      setRecommendationState({ ...recommendationState, stage: "follow_up" })
    }
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
    const lowerInput = input.toLowerCase()

    // Enhanced context awareness - remember what user just interacted with
    const hasRecentProducts = recommendationState.lastProducts && recommendationState.lastProducts.length > 0
    const hasCurrentProduct = recommendationState.currentProduct !== undefined

    // Enhanced intent detection for better conversation intelligence
    const isAskingAboutPrice = lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('expensive') || lowerInput.includes('cheap') || lowerInput.includes('budget')
    const isAskingAboutDuration = lowerInput.includes('long') || lowerInput.includes('days') || lowerInput.includes('duration') || lowerInput.includes('how many')
    const isAskingAboutInclusions = lowerInput.includes('include') || lowerInput.includes('what\'s included') || lowerInput.includes('meals') || lowerInput.includes('accommodation')
    const isComparingOptions = lowerInput.includes('compare') || lowerInput.includes('difference') || lowerInput.includes('which is better') || lowerInput.includes('vs')
    const wantsRecommendations = lowerInput.includes('recommend') || lowerInput.includes('suggest') || lowerInput.includes('best') || lowerInput.includes('top')
    
    // Check if user is asking about special deals/offers
    if (lowerInput.includes("special deal") || lowerInput.includes("special offer") || lowerInput.includes("deal") || lowerInput.includes("discount") || lowerInput.includes("promotion")) {
      // Fetch special offers
      const specialOffers = await fetchProducts('special offers', undefined, 'Special Offers')
      
      if (specialOffers.length > 0) {
        setRecommendationState({ 
          ...recommendationState, 
          lastProducts: specialOffers,
          stage: "follow_up"
        })
        
        const specialMessage: Message = {
          id: generateMessageId(),
          content: "Great news! Here are our current special offers and exclusive deals:",
          sender: "bot",
          timestamp: new Date(),
          products: specialOffers
        }
        
        const followUpMessage: Message = {
          id: generateMessageId(),
          content: "These special offers are limited time only. What would you like to do?",
          sender: "bot",
          timestamp: new Date(),
          options: specialOffers.map(p => `Check availability for ${p.name}`).concat(["View all tours", "Contact specialist"])
        }
        
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([specialMessage, followUpMessage]))
        return
      } else {
        const noOffersMessage: Message = {
          id: generateMessageId(),
          content: "Let me show you our best value tours and packages:",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([noOffersMessage]))
        await showFallbackProducts()
        return
      }
    }
    
    // Check if user is asking about availability for a specific product
    if (lowerInput.includes("check availability for") || lowerInput.includes("see available dates") || lowerInput.includes("see dates for")) {
      // Extract product name from the input
      let productToCheck: Product | undefined
      
      if (recommendationState.lastProducts) {
        // Try to match product from last shown products
        productToCheck = recommendationState.lastProducts.find(p => 
          lowerInput.includes(p.name.toLowerCase())
        )
        
        // If user just said "see available dates" without specifying, use the current product or first product
        if (!productToCheck && (lowerInput.includes("see available dates") || lowerInput === "see available dates")) {
          productToCheck = recommendationState.currentProduct || recommendationState.lastProducts[0]
        }
      }
      
      if (productToCheck) {
        // Update state to track current product
        setRecommendationState({
          ...recommendationState,
          currentProduct: productToCheck,
          stage: "checking_availability"
        })
        
        // Check availability for the specific product
        const availability = await checkProductAvailability(productToCheck.code)
        
        const availabilityMessage: Message = {
          id: generateMessageId(),
          content: availability.message,
          sender: "bot",
          timestamp: new Date(),
        }
        
        // Add follow-up options based on availability
        const followUpOptions = availability.available 
          ? ["Book this tour", "Customize this package", "View other packages", "Contact specialist"]
          : ["View similar tours", "Contact specialist for availability", "See other options"]
        
        const followUpMessage: Message = {
          id: generateMessageId(),
          content: "What would you like to do next?",
          sender: "bot",
          timestamp: new Date(),
          options: followUpOptions
        }
        
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([availabilityMessage, followUpMessage]))
        setRecommendationState({ ...recommendationState, stage: "showing_dates" })
        return
      }
    }
    
    // Handle booking request - Enhanced logic to catch all booking variations
    if (lowerInput.includes("book this") || lowerInput.includes("book the") || lowerInput.includes("book now") || lowerInput.startsWith("book ")) {
      let productToBook: Product | undefined

      // If user clicked "Book [product name]" button, extract the product
      if (lowerInput.startsWith("book ") && !lowerInput.includes("book this")) {
        const productName = lowerInput.replace(/^book /, '')
        if (recommendationState.lastProducts) {
          productToBook = recommendationState.lastProducts.find(p =>
            p.name.toLowerCase() === productName.toLowerCase()
          )
        }
      } else {
        // Use current product for "book this" or "book now"
        productToBook = recommendationState.currentProduct
      }

      if (productToBook) {
        // Direct redirect to booking page with window.open to ensure it works
        const bookingUrl = productToBook.url.startsWith('/')
          ? `${window.location.origin}${productToBook.url}`
          : productToBook.url

        const bookingMessage: Message = {
          id: generateMessageId(),
          content: `Perfect! Opening the booking page for ${productToBook.name}...`,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => prev.filter(m => !m.isLoading).concat([bookingMessage]))

        // Open booking page in new tab after short delay
        setTimeout(() => {
          window.open(bookingUrl, '_blank', 'noopener,noreferrer')

          // Add follow-up message
          const followUpMessage: Message = {
            id: generateMessageId(),
            content: "The booking page has opened in a new tab. If it didn't open, you can also click the 'View Details' button on any product card to access the booking page.",
            sender: "bot",
            timestamp: new Date(),
            options: ["Need booking help?", "View other tours", "Contact specialist", "Start new search"]
          }
          setMessages((prev) => [...prev, followUpMessage])
        }, 1000)

        return
      } else {
        // No product context - ask user to select
        const noProductMessage: Message = {
          id: generateMessageId(),
          content: "I'd be happy to help you book! Which tour would you like to book? Please click 'Check availability' on any product card first, or tell me the specific tour name.",
          sender: "bot",
          timestamp: new Date(),
          options: recommendationState.lastProducts ?
            recommendationState.lastProducts.map(p => `Book ${p.name}`).slice(0, 3).concat(["Show all tours"]) :
            ["Show available tours", "Browse destinations", "Contact specialist"]
        }
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([noProductMessage]))
        return
      }
    }
    
    // Handle customization request
    if (lowerInput.includes("customize") || lowerInput.includes("tailor")) {
      const customizeMessage: Message = {
        id: generateMessageId(),
        content: "I'd be happy to help customize this package for you! Our specialists can adjust the itinerary, accommodation, activities, and duration to match your preferences.",
        sender: "bot",
        timestamp: new Date(),
        options: ["Speak with specialist", "Send customization request", "View customization options", "Back to tours"]
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([customizeMessage]))
      return
    }
    
    // Handle when user selects specific action options
    if (lowerInput === "show special offers") {
      // Direct request for special offers from button click
      const specialOffers = await fetchProducts('special offers', undefined, 'Special Offers')
      
      if (specialOffers.length > 0) {
        setRecommendationState({ 
          ...recommendationState, 
          lastProducts: specialOffers,
          stage: "follow_up"
        })
        
        const specialMessage: Message = {
          id: generateMessageId(),
          content: "Here are our exclusive special offers with limited-time pricing:",
          sender: "bot",
          timestamp: new Date(),
          products: specialOffers
        }
        
        const followUpMessage: Message = {
          id: generateMessageId(),
          content: "These deals won't last long! What would you like to do?",
          sender: "bot",
          timestamp: new Date(),
          options: specialOffers.map(p => `Book ${p.name}`).concat(["Browse all tours", "Contact specialist"])
        }
        
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([specialMessage, followUpMessage]))
      } else {
        await showFallbackProducts()
      }
      return
    }
    
    if (lowerInput === "see different destinations" || lowerInput === "search by destination") {
      setRecommendationState({ ...recommendationState, stage: "asking_destination" })
      const destinationMessage: Message = {
        id: generateMessageId(),
        content: "Where in Africa would you like to explore?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Kenya Safari", "South Africa", "Tanzania", "Botswana", "Victoria Falls", "Egypt", "Morocco", "Show all destinations"]
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([destinationMessage]))
      return
    }
    
    if (lowerInput === "check availability for tours") {
      if (recommendationState.lastProducts && recommendationState.lastProducts.length > 0) {
        const availMessage: Message = {
          id: generateMessageId(),
          content: "Which tour would you like to check availability for?",
          sender: "bot",
          timestamp: new Date(),
          options: recommendationState.lastProducts.map(p => `Check availability for ${p.name}`)
        }
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([availMessage]))
      } else {
        await showFallbackProducts()
      }
      return
    }
    
    // Handle view other packages
    if (lowerInput.includes("other packages") || lowerInput.includes("other options") || lowerInput.includes("view other") || lowerInput.includes("different tour")) {
      const products = await fetchProducts()
      setRecommendationState({ 
        ...recommendationState, 
        lastProducts: products,
        stage: "follow_up"
      })
      
      const moreOptionsMessage: Message = {
        id: generateMessageId(),
        content: "Here are more amazing African adventures from our current inventory:",
        sender: "bot",
        timestamp: new Date(),
        products: products
      }
      
      const followUpMessage: Message = {
        id: generateMessageId(),
        content: "Select a tour to check availability or learn more:",
        sender: "bot",
        timestamp: new Date(),
        options: products.map(p => `Check availability for ${p.name}`).concat(["Contact specialist"])
      }
      
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([moreOptionsMessage, followUpMessage]))
      return
    }
    
    // Handle specialist contact
    if (lowerInput.includes("specialist") || lowerInput.includes("speak") || lowerInput.includes("contact")) {
      const specialistMessage: Message = {
        id: generateMessageId(),
        content: "I'll connect you with one of our Africa specialists who can provide personalized assistance and help with bookings.",
        sender: "bot",
        timestamp: new Date(),
        options: ["Call +61 2 9664 9187", "Email info@thisisafrica.com.au", "Schedule callback", "Continue browsing"]
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([specialistMessage]))
      return
    }
    
    // Handle browsing requests
    if (lowerInput.includes("browse") || lowerInput.includes("show me") || lowerInput.includes("all tours") || lowerInput.includes("what else")) {
      const products = await fetchProducts()
      setRecommendationState({ 
        ...recommendationState, 
        lastProducts: products,
        stage: "follow_up"
      })
      
      const browseMessage: Message = {
        id: generateMessageId(),
        content: "Here are some of our most popular African adventures:",
        sender: "bot",
        timestamp: new Date(),
        products: products
      }
      
      const followUpMessage: Message = {
        id: generateMessageId(),
        content: "Which of these interests you most?",
        sender: "bot",
        timestamp: new Date(),
        options: products.map(p => `Tell me more about ${p.name}`).concat(["Show special offers", "Contact specialist"])
      }
      
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([browseMessage, followUpMessage]))
      return
    }
    
    // Handle "tell me more" requests
    if (lowerInput.includes("tell me more") || lowerInput.includes("more about") || lowerInput.includes("details about")) {
      // Extract product name and provide details
      let productToDescribe: Product | undefined
      
      if (recommendationState.lastProducts) {
        productToDescribe = recommendationState.lastProducts.find(p => 
          lowerInput.includes(p.name.toLowerCase())
        )
      }
      
      if (productToDescribe) {
        const detailsMessage: Message = {
          id: generateMessageId(),
          content: `Here are the details for ${productToDescribe.name}:\n\n${productToDescribe.description}\n\nDuration: ${productToDescribe.duration}\nLocation: ${productToDescribe.location}\nPrice: ${productToDescribe.price}`,
          sender: "bot",
          timestamp: new Date(),
        }
        
        const actionMessage: Message = {
          id: generateMessageId(),
          content: "What would you like to do next?",
          sender: "bot",
          timestamp: new Date(),
          options: [`Check availability for ${productToDescribe.name}`, "See similar tours", "View special offers", "Contact specialist"]
        }
        
        setMessages((prev) => prev.filter(m => !m.isLoading).concat([detailsMessage, actionMessage]))
        setRecommendationState({
          ...recommendationState,
          currentProduct: productToDescribe
        })
        return
      }
    }
    
    // Handle compare tours functionality
    if (lowerInput.includes("compare") && hasRecentProducts) {
      const toursToCompare = recommendationState.lastProducts!.slice(0, 3)
      const compareDetails = toursToCompare.map(tour =>
        `**${tour.name}**\n• Duration: ${tour.duration}\n• Price: ${tour.price}\n• Location: ${tour.location}`
      ).join('\n\n')

      const compareMessage: Message = {
        id: generateMessageId(),
        content: `Here's a comparison of the tours we've been discussing:\n\n${compareDetails}\n\nEach tour offers unique experiences and value. Would you like me to explain the differences in more detail?`,
        sender: "bot",
        timestamp: new Date(),
        options: [
          "Explain main differences",
          "Which offers best value?",
          `Book ${toursToCompare[0].name}`,
          "See other options",
          "Contact specialist"
        ]
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([compareMessage]))
      return
    }

    // Handle value questions
    if ((lowerInput.includes("best value") || lowerInput.includes("which is better") || lowerInput.includes("recommend")) && hasRecentProducts) {
      const recommendedTour = recommendationState.lastProducts![0] // First tour as recommendation
      const valueMessage: Message = {
        id: generateMessageId(),
        content: `Based on duration, inclusions, and experiences, I'd recommend **${recommendedTour.name}** as the best value. It offers ${recommendedTour.duration} of comprehensive experiences at ${recommendedTour.price}, including all the highlights you'd expect from a premium African adventure.`,
        sender: "bot",
        timestamp: new Date(),
        options: [
          `Book ${recommendedTour.name}`,
          `Check availability for ${recommendedTour.name}`,
          "Why is this the best value?",
          "See other options",
          "Contact specialist"
        ]
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([valueMessage]))
      setRecommendationState({ ...recommendationState, currentProduct: recommendedTour })
      return
    }

    // Handle start over
    if (lowerInput.includes("start over") || lowerInput.includes("restart") || lowerInput.includes("start new")) {
      setRecommendationState({ stage: "asking_destination" })
      const restartMessage: Message = {
        id: generateMessageId(),
        content: "Let's start fresh! What type of African experience are you looking for?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Safari Adventures", "River Cruises", "Luxury Rail Journeys", "Beach Escapes", "Multi-Country Tours", "Show me popular options"],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([restartMessage]))
      return
    }
    
    // Enhanced default response with better context awareness
    if (hasCurrentProduct) {
      // User has a specific product in context - offer product-specific actions
      const currentProductMessage: Message = {
        id: generateMessageId(),
        content: `I can help you with ${recommendationState.currentProduct!.name} or show you other options:`,
        sender: "bot",
        timestamp: new Date(),
        options: [
          `Book ${recommendationState.currentProduct!.name}`,
          `Check availability for ${recommendationState.currentProduct!.name}`,
          "See similar tours",
          "View special offers",
          "Speak with specialist"
        ],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([currentProductMessage]))
    } else if (hasRecentProducts) {
      // User has seen products but no specific one selected
      const contextualMessage: Message = {
        id: generateMessageId(),
        content: "I can help you with the tours we've been discussing or explore new options:",
        sender: "bot",
        timestamp: new Date(),
        options: [
          "Check availability for tours",
          "Show special offers",
          "See different destinations",
          "Compare these tours",
          "Speak with specialist"
        ],
      }
      setMessages((prev) => prev.filter(m => !m.isLoading).concat([contextualMessage]))
    } else {
      // No context, offer fresh start
      const helpMessage: Message = {
        id: generateMessageId(),
        content: "I'm here to help you find the perfect African adventure. What interests you most?",
        sender: "bot",
        timestamp: new Date(),
        options: ["Safari adventures", "River cruises", "Luxury rail", "Show special offers", "Browse all tours"],
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
        className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center p-4 rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all ${isOpen ? "scale-0" : "scale-100"}`}
        aria-label="Open enhanced chat assistant"
        style={{ zIndex: 9999 }}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-0 right-0 z-[9999] w-full sm:w-96 transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
        style={{ zIndex: 9999 }}
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
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <span>{product.duration} • {product.location}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setRecommendationState({
                                ...recommendationState,
                                currentProduct: product,
                                lastProducts: message.products
                              })
                              handleOptionClick(`Check availability for ${product.name}`)
                            }}
                            className="flex-1 min-w-[90px] px-2 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors"
                          >
                            Check Dates
                          </button>
                          <button
                            onClick={() => {
                              setRecommendationState({
                                ...recommendationState,
                                currentProduct: product,
                                lastProducts: message.products
                              })
                              // Direct booking action
                              const bookingUrl = product.url.startsWith('/')
                                ? `${window.location.origin}${product.url}`
                                : product.url
                              window.open(bookingUrl, '_blank', 'noopener,noreferrer')

                              // Add confirmation message
                              const confirmMessage: Message = {
                                id: generateMessageId(),
                                content: `Opening booking page for ${product.name}...`,
                                sender: "bot",
                                timestamp: new Date(),
                              }
                              setMessages((prev) => [...prev, confirmMessage])
                            }}
                            className="flex-1 min-w-[80px] px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Book Now
                          </button>
                          <Link
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[80px] px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors text-center"
                          >
                            Details
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