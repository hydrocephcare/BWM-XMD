"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Database, Download, Loader2, CheckCircle2, ShoppingCart, Eye, X } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: "Word" | "Access"
  file_url: string
  price: number
  is_external_link: boolean
  image_url_1?: string
  image_url_2?: string
  image_url_3?: string
}

interface GroupedProject {
  projectName: string
  batchName: string
  documentation?: ProjectFile
  database?: ProjectFile
  totalPrice: number
  allImages: string[]
}

export function ProjectsContent() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [viewingImages, setViewingImages] = useState<string[] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const handlePurchase = (project: GroupedProject) => {
    // TODO: Implement M-Pesa payment integration
    alert(`Purchase ${project.projectName} for KES ${project.totalPrice}
    
Includes:
${project.documentation ? `- Documentation (Word): KES ${project.documentation.price}` : ''}
${project.database ? `- Database (Access): KES ${project.database.price}` : ''}`)
  }

  const handleViewImages = (images: string[]) => {
    setViewingImages(images)
    setCurrentImageIndex(0)
  }

  const closeImageViewer = () => {
    setViewingImages(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (viewingImages) {
      setCurrentImageIndex((prev) => (prev + 1) % viewingImages.length)
    }
  }

  const prevImage = () => {
    if (viewingImages) {
      setCurrentImageIndex((prev) => (prev - 1 + viewingImages.length) % viewingImages.length)
    }
  }

  // Group projects by name and batch
  const groupedProjects: GroupedProject[] = []
  const processedProjects = new Set<string>()

  projects.forEach((project) => {
    const key = `${project.batch_name}-${project.file_name}`
    
    if (!processedProjects.has(key)) {
      processedProjects.add(key)
      
      const relatedProjects = projects.filter(
        (p) => p.batch_name === project.batch_name && p.file_name === project.file_name
      )
      
      const doc = relatedProjects.find((p) => p.file_type === "Word")
      const db = relatedProjects.find((p) => p.file_type === "Access")
      
      const allImages: string[] = []
      if (doc) {
        if (doc.image_url_1) allImages.push(doc.image_url_1)
        if (doc.image_url_2) allImages.push(doc.image_url_2)
        if (doc.image_url_3) allImages.push(doc.image_url_3)
      }
      if (db) {
        if (db.image_url_1) allImages.push(db.image_url_1)
        if (db.image_url_2) allImages.push(db.image_url_2)
        if (db.image_url_3) allImages.push(db.image_url_3)
      }
      
      groupedProjects.push({
        projectName: project.file_name,
        batchName: project.batch_name,
        documentation: doc,
        database: db,
        totalPrice: (doc?.price || 0) + (db?.price || 0),
        allImages,
      })
    }
  })

  const batches = ["all", ...new Set(projects.map((p) => p.batch_name))].sort()
  const filteredProjects = selectedBatch === "all" 
    ? groupedProjects 
    : groupedProjects.filter((p) => p.batchName === selectedBatch)

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
            {filteredProjects.map((project, index) => (
              <Card
                key={`${project.batchName}-${project.projectName}-${index}`}
                className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-blue-500"
              >
                {/* Project Images */}
                {project.allImages.length > 0 && (
                  <div className="relative h-48 bg-gray-100 overflow-hidden group">
                    <img 
                      src={project.allImages[0]} 
                      alt={project.projectName}
                      className="w-full h-full object-cover"
                    />
                    {project.allImages.length > 1 && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <Button
                          onClick={() => handleViewImages(project.allImages)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 hover:bg-gray-100"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View {project.allImages.length} Images
                        </Button>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-md">
                      {project.allImages.length} {project.allImages.length === 1 ? 'Image' : 'Images'}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Project Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {project.batchName}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        KES {project.totalPrice}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.projectName}
                    </h3>
                  </div>

                  {/* Project Components */}
                  <div className="space-y-3 mb-6">
                    {project.documentation && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Documentation</p>
                            <p className="text-xs text-gray-600">Word document</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-600">KES {project.documentation.price}</p>
                            <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                          </div>
                        </div>
                      </div>
                    )}

                    {project.database && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Database className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Database System</p>
                            <p className="text-xs text-gray-600">Access database</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-600">KES {project.database.price}</p>
                            <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                          </div>
                        </div>
                      </div>
                    )}
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

        {/* Image Viewer Modal */}
        {viewingImages && viewingImages.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <Button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 z-10 bg-white text-gray-900 hover:bg-gray-100"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>

              <img
                src={viewingImages[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {viewingImages.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 hover:bg-gray-100"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 hover:bg-gray-100"
                  >
                    →
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {viewingImages.length}
                  </div>
                </>
              )}
            </div>
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
