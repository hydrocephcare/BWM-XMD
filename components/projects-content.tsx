"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Database, Download, Loader2, CheckCircle2, ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Project {
  id: string
  batch_name: string
  file_name: string
  file_type: string
  file_url: string
  documentation_url?: string
  price: number
  is_external_link: boolean
  has_documentation?: boolean
  has_database?: boolean
}

export function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string>("all")

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("batch_name", { ascending: true })

      if (error) {
        console.error("Error loading projects:", error)
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (project: Project) => {
    // TODO: Implement M-Pesa payment integration
    alert(`Purchase ${project.file_name} for KES ${project.price}`)
  }

  const batches = ["all", ...new Set(projects.map((p) => p.batch_name))].sort()
  const filteredProjects = selectedBatch === "all" 
    ? projects 
    : projects.filter((p) => p.batch_name === selectedBatch)

  if (loading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            KCSE Computer Studies Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete project packages with documentation and database files ready for your KCSE examination
          </p>
        </div>

        {/* Batch Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {batches.map((batch) => (
            <Button
              key={batch}
              onClick={() => setSelectedBatch(batch)}
              variant={selectedBatch === batch ? "default" : "outline"}
              className={
                selectedBatch === batch
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : ""
              }
            >
              {batch === "all" ? "All Projects" : batch}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center bg-white shadow-lg max-w-2xl mx-auto">
            <div className="text-gray-400 mb-4">
              <Database className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-500">No projects available</p>
              <p className="text-sm mt-2">Check back soon for new projects!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-blue-500"
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {project.batch_name}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        KES {project.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.file_name}
                    </h3>
                  </div>

                  {/* Project Components */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Documentation</p>
                          <p className="text-xs text-gray-600">Complete Word document</p>
                        </div>
                        {project.documentation_url && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Database System</p>
                          <p className="text-xs text-gray-600">Access database file</p>
                        </div>
                        {project.file_url && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Complete project package</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>KCSE examination ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Instant download access</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={() => handlePurchase(project)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Get</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Documentation</h3>
                  <p className="text-sm text-gray-600">
                    Professional Word documents with all project details, system analysis, design, and implementation
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Working Database</h3>
                  <p className="text-sm text-gray-600">
                    Fully functional Microsoft Access database with tables, forms, queries, and reports
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">KCSE Ready</h3>
                  <p className="text-sm text-gray-600">
                    All projects meet KCSE Computer Studies examination requirements and standards
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Download className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Access</h3>
                  <p className="text-sm text-gray-600">
                    Download immediately after payment via M-Pesa. No waiting required
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
