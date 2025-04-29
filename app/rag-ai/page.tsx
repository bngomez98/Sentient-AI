import RagAIInterface from "@/components/rag-ai-interface"
import { ENV } from "@/lib/env-variables"

export const metadata = {
  title: "RAG-Based AI with Physics Simulation",
  description: "Explore rag doll physics with AI-powered simulations",
}

export default function RagAIPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">RAG-Based AI with Physics Simulation</h1>
        <p className="text-gray-600 text-center mb-8">
          Explore rag doll physics with AI-powered simulations and knowledge retrieval
        </p>

        <RagAIInterface />

        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">About RAG-Based AI with Physics</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="mb-4">
              RAG-Based Artificial Intelligence combines Retrieval Augmented Generation (RAG) with rag doll physics to
              create realistic and human-like simulations. This technology enables more natural and realistic
              interactions in virtual environments.
            </p>
            <p className="mb-4">
              The system works by retrieving relevant information about physics and animation techniques, then using
              this knowledge to inform physics simulations that model how characters or objects should move in response
              to forces, collisions, and other interactions.
            </p>
            <p>
              This technology has applications in video games, animation, virtual reality, and other fields where
              realistic character movement is important for creating immersive experiences.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">Environment Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Physics Settings</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>RAG Physics: {ENV.ENABLE_RAG_PHYSICS ? "Enabled" : "Disabled"}</li>
                    <li>Simulation Quality: {ENV.PHYSICS_SIMULATION_QUALITY}</li>
                    <li>Gravity: {ENV.PHYSICS_GRAVITY}</li>
                    <li>Timestep: {ENV.PHYSICS_TIMESTEP}</li>
                    <li>Iterations: {ENV.PHYSICS_ITERATIONS}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Vector Database</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Index Name: {ENV.VECTOR_INDEX_NAME}</li>
                    <li>Dimensions: {ENV.VECTOR_DIMENSIONS}</li>
                    <li>API Key: {ENV.VECTOR_DB_API_KEY ? "✓ Configured" : "✗ Not configured"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
