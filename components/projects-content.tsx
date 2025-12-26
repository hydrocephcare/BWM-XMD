"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Database, Download, Loader2, CheckCircle2, ShoppingCart, X, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface ProjectImage {
  id: string
  image_url: string
  image_order: number
}

interface Project {
  id: string
  batch_name: string
  file_name: string
  file_type: "Word" | "Access"
  file_url: string
  price: number
  is_external_link: boolean
  images?: ProjectImage[]
}

interface BatchFiles {
  documentation?: Project
  database?: Project
}

interface PaymentInfo {
  files: Project[]
  totalAmount: number
  packageType: string
}

export function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; paymentInfo: PaymentInfo | null }>({
    show: false,
    paymentInfo: null,
  })
  const [previewModal, setPreviewModal] = useState<{ show: boolean; project: Project | null; currentIndex: number }>({
    show: false,
    project: null,
    currentIndex: 0,
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      
      // Load projects with their images
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("batch_name", { ascending: true })

      if (projectsError) throw projectsError

      // Load images for all projects
      const { data: imagesData, error: imagesError } = await supabase
        .from("project_images")
        .select("*")
        .order("image_order", { ascending: true })

      if (imagesError) throw imagesError

      // Combine projects with their images
      const projectsWithImages = (projectsData || []).map(project => ({
        ...project,
        images: (imagesData || []).filter(img => img.project_id === project.id)
      }))

      setProjects(projectsWithImages)
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getBatchedProjects = (): { [key: string]: BatchFiles } => {
    const batched: { [key: string]: BatchFiles } = {}

    projects.forEach((project) => {
      if (!batched[project.batch_name]) {
        batched[project.batch_name] = {}
      }

      if (project.file_type === "Word") {
        batched[project.batch_name].documentation = project
      } else if (project.file_type === "Access") {
        batched[project.batch_name].database = project
      }
    })

    return batched
  }

  const handleDownload = (type: "documentation" | "database" | "both", batchFiles: BatchFiles) => {
    if (type === "documentation" && batchFiles.documentation) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.documentation],
          totalAmount: batchFiles.documentation.price,
          packageType: "Documentation Only",
        },
      })
    } else if (type === "database" && batchFiles.database) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.database],
          totalAmount: batchFiles.database.price,
          packageType: "Database Only",
        },
      })
    } else if (type === "both" && batchFiles.documentation && batchFiles.database) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.documentation, batchFiles.database],
          totalAmount: batchFiles.documentation.price + batchFiles.database.price,
          packageType: "Complete Package",
        },
      })
    }
  }

  const openPreview = (project: Project) => {
    if (project.images && project.images.length > 0) {
      setPreviewModal({ show: true, project, currentIndex: 0 })
    }
  }

  const closePreview = () => {
    setPreviewModal({ show: false, project: null, currentIndex: 0 })
  }

  const nextImage = () => {
    if (previewModal.project && previewModal.project.images) {
      const maxIndex = previewModal.project.images.length - 1
      setPreviewModal(prev => ({
        ...prev,
        currentIndex: prev.currentIndex < maxIndex ? prev.currentIndex + 1 : 0
      }))
    }
  }

  const prevImage = () => {
    if (previewModal.project && previewModal.project.images) {
      const maxIndex = previewModal.project.images.length - 1
      setPreviewModal(prev => ({
        ...prev,
        currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : maxIndex
      }))
    }
  }

  const batchedProjects = getBatchedProjects()
  const batches = ["all", ...Object.keys(batchedProjects)].sort()
  const filteredBatches = selectedBatch === "all" ? Object.keys(batchedProjects).sort() : [selectedBatch]
  const isAllBatches = selectedBatch === "all"

  if (loading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
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
    <>
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              KCSE Computer Studies Projects
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              {isAllBatches ? "Browse all available projects" : `Viewing ${selectedBatch} projects`}
            </p>
          </div>

          {/* Batch Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-slide-up">
            {batches.map((batch) => (
              <Button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                variant={selectedBatch === batch ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-300 ${
                  selectedBatch === batch 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg scale-105" 
                    : "hover:bg-gray-100 hover:scale-105"
                }`}
              >
                {batch === "all" ? "All Batches" : batch}
              </Button>
            ))}
          </div>

          {/* ALL BATCHES VIEW - Compact Cards */}
          {isAllBatches && (
            <div className="space-y-4 mb-8">
              {filteredBatches.map((batchName, idx) => {
                const batchFiles = batchedProjects[batchName]
                const hasDoc = !!batchFiles.documentation
                const hasDb = !!batchFiles.database
                const hasBoth = hasDoc && hasDb

                return (
                  <Card 
                    key={batchName} 
                    className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-4 border-blue-500 animate-slide-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Side - Batch Info */}
                        <div className="lg:w-1/3">
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold mb-3 shadow-md">
                            {batchName}
                          </span>
                          <h3 className="font-bold text-gray-900 text-xl mb-2">
                            {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                          </h3>
                          
                          {/* Preview Thumbnails */}
                          {(batchFiles.documentation?.images || batchFiles.database?.images) && (
                            <div className="flex gap-2 mt-4">
                              {(batchFiles.documentation?.images || batchFiles.database?.images)?.slice(0, 3).map((img, i) => (
                                <div 
                                  key={i}
                                  className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
                                  onClick={() => openPreview(batchFiles.documentation || batchFiles.database!)}
                                >
                                  <img src={img.image_url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right Side - Purchase Options */}
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {hasDoc && (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-md">
                              <FileText className="w-6 h-6 text-blue-600 mb-2" />
                              <p className="text-xs font-medium text-gray-700 mb-1">Documentation</p>
                              <p className="text-xl font-bold text-blue-600 mb-3">KES {batchFiles.documentation?.price}</p>
                              <div className="space-y-2">
                                {batchFiles.documentation?.images && batchFiles.documentation.images.length > 0 && (
                                  <Button
                                    onClick={() => openPreview(batchFiles.documentation!)}
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleDownload("documentation", batchFiles)}
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs shadow-sm"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Get Now
                                </Button>
                              </div>
                            </div>
                          )}

                          {hasDb && (
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-md">
                              <Database className="w-6 h-6 text-purple-600 mb-2" />
                              <p className="text-xs font-medium text-gray-700 mb-1">Database</p>
                              <p className="text-xl font-bold text-purple-600 mb-3">KES {batchFiles.database?.price}</p>
                              <div className="space-y-2">
                                {batchFiles.database?.images && batchFiles.database.images.length > 0 && (
                                  <Button
                                    onClick={() => openPreview(batchFiles.database!)}
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleDownload("database", batchFiles)}
                                  size="sm"
                                  className="w-full bg-purple-600 hover:bg-purple-700 text-xs shadow-sm"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Get Now
                                </Button>
                              </div>
                            </div>
                          )}

                          {hasBoth && (
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-400 hover:border-green-500 transition-all duration-300 hover:shadow-md relative">
                              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                SAVE
                              </div>
                              <div className="flex gap-1 mb-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                <Database className="w-5 h-5 text-green-600" />
                              </div>
                              <p className="text-xs font-semibold text-green-700 uppercase mb-1">Complete Package</p>
                              <p className="text-xl font-bold text-green-600 mb-3">
                                KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                              </p>
                              <Button
                                onClick={() => handleDownload("both", batchFiles)}
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700 text-xs shadow-sm"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Buy Both
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* SINGLE BATCH VIEW - Large Cards Format */}
          {!isAllBatches && (
            <div className="space-y-8">
              {filteredBatches.map((batchName) => {
                const batchFiles = batchedProjects[batchName]
                const hasDoc = !!batchFiles.documentation
                const hasDb = !!batchFiles.database
                const hasBoth = hasDoc && hasDb

                return (
                  <div key={batchName} className="animate-fade-in">
                    {/* Batch Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{batchName}</h2>
                      <div className="h-1 flex-1 bg-gray-300 rounded"></div>
                    </div>

                    {/* Large Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Documentation Card */}
                      {hasDoc && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:scale-105">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Documentation</span>
                              <FileText className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Image Gallery */}
                          {batchFiles.documentation.images && batchFiles.documentation.images.length > 0 && (
                            <div className="relative h-48 bg-gray-100 cursor-pointer group" onClick={() => openPreview(batchFiles.documentation!)}>
                              <img 
                                src={batchFiles.documentation.images[0].image_url} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {batchFiles.documentation.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                  +{batchFiles.documentation.images.length - 1} more
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-blue-600 mb-2">
                                KES {batchFiles.documentation?.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              {batchFiles.documentation?.file_name}
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Complete system analysis & design</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Professional flowcharts & diagrams</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>KCSE standard format</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Ready to submit</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("documentation", batchFiles)}
                              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Documentation
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Database Card */}
                      {hasDb && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-purple-200 hover:border-purple-400 hover:scale-105">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Database</span>
                              <Database className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Image Gallery */}
                          {batchFiles.database.images && batchFiles.database.images.length > 0 && (
                            <div className="relative h-48 bg-gray-100 cursor-pointer group" onClick={() => openPreview(batchFiles.database!)}>
                              <img 
                                src={batchFiles.database.images[0].image_url} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {batchFiles.database.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                  +{batchFiles.database.images.length - 1} more
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-purple-600 mb-2">
                                KES {batchFiles.database?.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              {batchFiles.database?.file_name}
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Fully functional Access database</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Custom forms & reports</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Query processing included</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Professional data modeling</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("database", batchFiles)}
                              className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base font-semibold shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Database
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Complete Package Card */}
                      {hasBoth && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-green-400 hover:border-green-500 relative hover:scale-105">
                          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 animate-bounce">
                            SAVE MORE
                          </div>
                          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Complete Package</span>
                              <div className="flex">
                                <FileText className="w-4 h-4" />
                                <Database className="w-4 h-4 -ml-1" />
                              </div>
                            </div>
                          </div>

                          {/* Combined Image Preview */}
                          {((batchFiles.documentation?.images && batchFiles.documentation.images.length > 0) || 
                            (batchFiles.database?.images && batchFiles.database.images.length > 0)) && (
                            <div className="grid grid-cols-2 h-48 gap-1 bg-gray-100">
                              {batchFiles.documentation?.images && batchFiles.documentation.images[0] && (
                                <div className="relative cursor-pointer group" onClick={() => openPreview(batchFiles.documentation!)}>
                                  <img 
                                    src={batchFiles.documentation.images[0].image_url} 
                                    alt="Doc Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                                </div>
                              )}
                              {batchFiles.database?.images && batchFiles.database.images[0] && (
                                <div className="relative cursor-pointer group" onClick={() => openPreview(batchFiles.database!)}>
                                  <img 
                                    src={batchFiles.database.images[0].image_url} 
                                    alt="DB Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-green-600 mb-2">
                                KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                              </p>
                              <p className="text-sm text-gray-600">Everything you need</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              Full Project Bundle
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Complete documentation file</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Full database system</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>WhatsApp support included</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Best value for money</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("both", batchFiles)}
                              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Get Complete Package
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Info Section */}
          <div className="max-w-4xl mx-auto mt-12 animate-fade-in">
            <Card className="bg-white shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid md:grid-cols-2
