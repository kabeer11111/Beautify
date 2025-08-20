"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search } from "lucide-react"

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) and overnight shipping are also available. International shipping times vary by location, typically 7-14 business days.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes! We offer free standard shipping on all orders over $50 within the United States. For orders under $50, standard shipping is $5.99.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination. Customs fees and import duties may apply and are the responsibility of the customer.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for unopened products in their original packaging. Opened products can be returned within 14 days if you're not completely satisfied. Items must be in resaleable condition.",
      },
      {
        question: "How do I return an item?",
        answer:
          "To return an item, log into your account and select 'Return Items' from your order history. Print the prepaid return label and drop off your package at any authorized shipping location.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 3-5 business days after we receive your returned items. The refund will be credited to your original payment method.",
      },
      {
        question: "Can I exchange an item?",
        answer:
          "Yes! You can exchange items for a different size, color, or product of equal or lesser value. If the new item costs more, you'll pay the difference. If it costs less, we'll refund the difference.",
      },
    ],
  },
  {
    category: "Products & Ingredients",
    questions: [
      {
        question: "Are your products cruelty-free?",
        answer:
          "Yes, all Beautify products are 100% cruelty-free. We never test on animals and only work with suppliers who share our commitment to cruelty-free practices.",
      },
      {
        question: "Are your products vegan?",
        answer:
          "Most of our products are vegan, and we clearly label which ones contain animal-derived ingredients. Look for the 'Vegan' badge on product pages.",
      },
      {
        question: "Do you use natural ingredients?",
        answer:
          "We prioritize natural and organic ingredients whenever possible. Each product page lists all ingredients, and we highlight key natural components and their benefits.",
      },
      {
        question: "Are your products safe for sensitive skin?",
        answer:
          "Many of our products are formulated for sensitive skin. Look for products labeled 'Sensitive Skin Friendly' or check the ingredient list. We recommend patch testing new products before full use.",
      },
    ],
  },
  {
    category: "Account & Orders",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' in the top right corner of our website. You can create an account using your email address or sign up with Google for faster checkout.",
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. We'll send you a link to reset your password. Check your spam folder if you don't see the email.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it. After that, orders enter our fulfillment process and cannot be changed. Contact customer service immediately if you need to make changes.",
      },
      {
        question: "How do I update my account information?",
        answer:
          "Log into your account and go to 'My Profile' to update your personal information, shipping addresses, and payment methods.",
      },
    ],
  },
  {
    category: "Payment & Security",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard SSL encryption to protect your payment information. We're PCI DSS compliant and never store your full credit card details on our servers.",
      },
      {
        question: "Can I save my payment information?",
        answer:
          "Yes, you can securely save your payment methods in your account for faster checkout. Your information is encrypted and stored securely.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "We partner with Klarna and Afterpay to offer buy-now-pay-later options. You can split your purchase into 4 interest-free payments.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products, shipping, returns, and more. Can't find what you're
            looking for?{" "}
            <a href="/contact" className="text-pink-600 hover:underline">
              Contact us
            </a>
            .
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{category.category}</CardTitle>
                <CardDescription>
                  {category.questions.length} question{category.questions.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const itemId = `${categoryIndex}-${questionIndex}`
                    const isOpen = openItems.includes(itemId)

                    return (
                      <Collapsible key={questionIndex}>
                        <CollapsibleTrigger
                          onClick={() => toggleItem(itemId)}
                          className="flex items-center justify-between w-full p-4 text-left bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 py-3 text-muted-foreground">
                          {faq.answer}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No FAQs found matching "{searchTerm}". Try a different search term or{" "}
              <a href="/contact" className="text-pink-600 hover:underline">
                contact us
              </a>{" "}
              for help.
            </p>
          </div>
        )}

        {/* Still need help section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? Our customer support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="flex-1 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
              <h4 className="font-semibold mb-2">Contact Support</h4>
              <p className="text-sm text-muted-foreground">Get personalized help from our team</p>
            </a>
            <a
              href="mailto:support@beautify.com"
              className="flex-1 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <h4 className="font-semibold mb-2">Email Us</h4>
              <p className="text-sm text-muted-foreground">support@beautify.com</p>
            </a>
            <a
              href="tel:+15551234567"
              className="flex-1 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <h4 className="font-semibold mb-2">Call Us</h4>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
