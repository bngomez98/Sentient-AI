"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Brain,
  Cpu,
  Database,
  Sparkles,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import NavBar from "@/components/nav-bar"

export default function LandingPage() {
  const [isHoveringDemo, setIsHoveringDemo] = useState(false)
  const [isHoveringAbout, setIsHoveringAbout] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      <NavBar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] bg-cyan-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-medium text-blue-300 border-blue-700/50 bg-blue-900/20"
              >
                Advanced AI Assistant
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Sentient-1
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl text-xl text-slate-300 mb-10"
            >
              Advanced AI assistant with enhanced reasoning capabilities, sentiment analysis, and sophisticated
              knowledge retrieval — delivering exceptional intelligence and performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/chat" passHref>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 rounded-full"
                  onMouseEnter={() => setIsHoveringDemo(true)}
                  onMouseLeave={() => setIsHoveringDemo(false)}
                >
                  <span>Try Sentient-1</span>
                  <motion.div animate={{ x: isHoveringDemo ? 5 : 0 }} transition={{ duration: 0.2 }}>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </Link>

              <Link href="/about" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-slate-300 border-slate-700 hover:bg-slate-800 rounded-full"
                  onMouseEnter={() => setIsHoveringAbout(true)}
                  onMouseLeave={() => setIsHoveringAbout(false)}
                >
                  <Info className="mr-2 h-5 w-5" />
                  <span>About Sentient-1</span>
                  <motion.div animate={{ x: isHoveringAbout ? 5 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="ml-2 h-5 w-5 opacity-70" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-sm z-10" />

              <div className="relative z-20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="px-4 py-1 rounded-full bg-slate-800/50 text-xs text-slate-400 border border-slate-700/50">
                    sentient-1.ai/chat
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-800 rounded-lg p-4 text-slate-300">
                        <p>
                          Welcome to Sentient-1! I'm an advanced AI assistant with enhanced reasoning capabilities. How
                          can I help you today?
                        </p>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Sentient-1 • Just now</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-indigo-600/20 border border-indigo-600/30 rounded-lg p-4 text-slate-200">
                        <p>Explain how neural networks learn and adapt over time.</p>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">You • Just now</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-800 rounded-lg p-4 text-slate-300">
                        <p className="mb-2">
                          Neural networks learn through a process called training, which involves adjusting the weights
                          and biases of connections between neurons.
                        </p>
                        <p className="mb-2">The training process typically follows these steps:</p>
                        <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                          <li>Forward propagation: Input data is passed through the network, generating an output.</li>
                          <li>
                            Loss calculation: The difference between the predicted output and the actual target is
                            measured.
                          </li>
                          <li>
                            Backpropagation: The gradient of the loss function is calculated, showing how each weight
                            contributes to the error.
                          </li>
                          <li>
                            Weight update: The weights are adjusted to reduce the error using optimization algorithms
                            like gradient descent.
                          </li>
                        </ol>
                        <p className="mt-2">
                          This process is repeated with many examples until the network learns to make accurate
                          predictions and can generalize to new, unseen data.
                        </p>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Sentient-1 • Just now</div>

                      <div className="mt-3 flex space-x-2">
                        <Badge variant="outline" className="text-xs bg-blue-950/30 text-blue-400 border-blue-800/50">
                          <Brain className="h-3 w-3 mr-1" />
                          Advanced Reasoning
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-950/30 text-purple-400 border-purple-800/50"
                        >
                          <Database className="h-3 w-3 mr-1" />
                          Knowledge Retrieval
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 relative">
                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 px-4 py-3">
                      <input
                        type="text"
                        placeholder="Ask Sentient-1 anything..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-300 placeholder-slate-500"
                      />
                      <Button
                        size="sm"
                        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Particles */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-blue-400/30"
                      initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 0.5 + 0.5,
                      }}
                      animate={{
                        x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                      }}
                      transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Advanced Capabilities</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300">
              Sentient-1 combines multiple AI technologies to deliver a powerful, intelligent experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Advanced Reasoning</CardTitle>
                  <CardDescription className="text-slate-400">
                    Multi-step reasoning for complex problem solving
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Sentient-1 employs a sophisticated multi-step reasoning process to break down complex queries,
                    integrate knowledge from various domains, and generate comprehensive responses with nuanced
                    understanding.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800/50">
                    Core Technology
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Knowledge Retrieval</CardTitle>
                  <CardDescription className="text-slate-400">
                    Semantic search and retrieval of relevant information
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Using Retrieval-Augmented Generation (RAG) technology, Sentient-1 enhances responses with relevant
                    information from a vast knowledge base, reducing hallucinations and improving accuracy.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-800/50">
                    Enhanced Intelligence
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Sentiment Analysis</CardTitle>
                  <CardDescription className="text-slate-400">
                    Emotional intelligence for contextual understanding
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Sentient-1 features sophisticated emotional intelligence that detects sentiment, tone, and intent in
                    user queries, enabling more appropriate and contextually relevant responses.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-purple-950/30 text-purple-400 border-purple-800/50">
                    Contextual Understanding
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
                    <Cpu className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Continuous Learning</CardTitle>
                  <CardDescription className="text-slate-400">
                    Knowledge enhancement through pretraining
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Sentient-1's pretraining system continuously enhances its knowledge and capabilities through
                    exposure to diverse examples and domains, improving performance over time.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-cyan-950/30 text-cyan-400 border-cyan-800/50">
                    Adaptive Intelligence
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-amber-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Adaptive Responses</CardTitle>
                  <CardDescription className="text-slate-400">
                    Dynamic adjustment based on query complexity
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Sentient-1 dynamically adjusts response complexity and depth based on query analysis, providing
                    appropriately detailed information for both simple and complex questions.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800/50">
                    User Experience
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4">
                    <ExternalLink className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Concept Mapping</CardTitle>
                  <CardDescription className="text-slate-400">
                    Dynamic mapping of concepts and relationships
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative text-slate-300">
                  <p>
                    Sentient-1 creates dynamic maps of concepts and their relationships, enabling deeper understanding
                    of complex topics and more coherent explanations across domains.
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-800/50">
                    Knowledge Organization
                  </Badge>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:max-w-xl">
                  <h2 className="text-3xl font-bold text-white mb-4">Experience Sentient-1 Today</h2>
                  <p className="text-lg text-slate-300 mb-6">
                    Discover the power of advanced AI with enhanced reasoning capabilities. Experience the next level of
                    artificial intelligence at your fingertips.
                  </p>
                  <Link href="/chat" passHref>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 rounded-full"
                    >
                      <span>Start Chatting</span>
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="w-full md:w-auto flex-shrink-0">
                  <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 blur-xl" />
                    <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
                      <Brain className="h-24 w-24 text-blue-400" />
                    </div>

                    {/* Orbiting Elements */}
                    <motion.div
                      className="absolute w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        top: "50%",
                        left: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                        transformOrigin: "50% 140px",
                      }}
                    >
                      <Cpu className="h-4 w-4 text-blue-400" />
                    </motion.div>

                    <motion.div
                      className="absolute w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        top: "50%",
                        left: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                        transformOrigin: "50% 140px",
                        rotate: 120,
                      }}
                    >
                      <Database className="h-4 w-4 text-indigo-400" />
                    </motion.div>

                    <motion.div
                      className="absolute w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        top: "50%",
                        left: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                        transformOrigin: "50% 140px",
                        rotate: 240,
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">Sentient-1</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">Advanced AI assistant with enhanced reasoning capabilities</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
              <Link href="/chat" className="text-slate-300 hover:text-white transition-colors">
                Chat
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/status" className="text-slate-300 hover:text-white transition-colors">
                Status
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} Sentient-1. All rights reserved.</p>

            <div className="mt-4 md:mt-0 flex gap-4">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
