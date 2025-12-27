"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Database, Download, Loader2, CheckCircle2, ShoppingCart, X, Image as ImageIcon, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Project {
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
  const [previewModal, setPreviewModal] = useState<{ show: boolean; images: string[]; title: string }>({
    show: false,
    images: [],
    title: "",
  })

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

  const handlePreview = (project: Project) => {
    const images = [project.image_url_1, project.image_url_2, project.image_url_3].filter(Boolean) as string[]
    if (images.length > 0) {
      setPreviewModal({
        show: true,
        images,
        title: project.file_name,
      })
    }
  }

  const batchedProjects = getBatchedProjects()
  const batches = ["all", ...Object.keys(batchedProjects)].sort()
  const filteredBatches = selectedBatch === "all" ? Object.keys(batchedProjects).sort() : [selectedBatch]
  const isAllBatches = selectedBatch === "all"

  if (loading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
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
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KCSE Computer Studies Projects
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              {isAllBatches ? "Browse all available projects" : `Viewing ${selectedBatch} projects`}
            </p>
          </div>

          {/* Batch Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
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

          {/* ALL BATCHES VIEW - Table/Compact Format */}
          {isAllBatches && (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl shadow-xl overflow-hidden mb-8 animate-slide-up">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Batch</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Project Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Preview</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            Documentation
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <Database className="w-4 h-4" />
                            Database
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Complete
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBatches.map((batchName, idx) => {
                        const batchFiles = batchedProjects[batchName]
                        const hasDoc = !!batchFiles.documentation
                        const hasDb = !!batchFiles.database
                        const hasBoth = hasDoc && hasDb
                        const previewProject = batchFiles.documentation || batchFiles.database
                        const hasImages = previewProject && (previewProject.image_url_1 || previewProject.image_url_2 || previewProject.image_url_3)

                        return (
                          <tr key={batchName} className={`hover:bg-blue-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-sm">
                                {batchName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900 text-sm">
                                {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasImages && previewProject ? (
                                <Button
                                  onClick={() => handlePreview(previewProject)}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-3 py-1.5 h-8 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasDoc ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-base font-bold text-blue-600">KES {batchFiles.documentation?.price}</span>
                                  <Button
                                    onClick={() => handleDownload("documentation", batchFiles)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-xs px-4 py-1.5 h-8 shadow-sm transition-all duration-200 hover:scale-105"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Get
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasDb ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-base font-bold text-purple-600">KES {batchFiles.database?.price}</span>
                                  <Button
                                    onClick={() => handleDownload("database", batchFiles)}
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-xs px-4 py-1.5 h-8 shadow-sm transition-all duration-200 hover:scale-105"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Get
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasBoth ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex flex-col items-center">
                                    <span className="text-base font-bold text-green-600">
                                      KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                                    </span>
                                    <span className="text-[10px] text-green-600 font-semibold">BEST</span>
                                  </div>
                                  <Button
                                    onClick={() => handleDownload("both", batchFiles)}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-xs px-4 py-1.5 h-8 shadow-sm transition-all duration-200 hover:scale-105"
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    Buy
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile/Tablet Cards for All Batches */}
              <div className="lg:hidden space-y-3 mb-8">
                {filteredBatches.map((batchName, idx) => {
                  const batchFiles = batchedProjects[batchName]
                  const hasDoc = !!batchFiles.documentation
                  const hasDb = !!batchFiles.database
                  const hasBoth = hasDoc && hasDb
                  const previewProject = batchFiles.documentation || batchFiles.database
                  const hasImages = previewProject && (previewProject.image_url_1 || previewProject.image_url_2 || previewProject.image_url_3)

                  return (
                    <Card key={batchName} className="bg-white shadow-lg overflow-hidden border-l-4 border-blue-500 animate-slide-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-sm">
                            {batchName}
                          </span>
                          {hasImages && previewProject && (
                            <Button
                              onClick={() => handlePreview(previewProject)}
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 h-7 hover:bg-purple-50"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-base mb-4">
                          {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                        </h3>

                        <div className="space-y-2">
                          {hasDoc && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-xs font-medium text-gray-700">Documentation</p>
                                  <p className="text-sm font-bold text-blue-600">KES {batchFiles.documentation?.price}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("documentation", batchFiles)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 h-8 transition-transform hover:scale-105"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Get
                              </Button>
                            </div>
                          )}

                          {hasDb && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-purple-600" />
                                <div>
                                  <p className="text-xs font-medium text-gray-700">Database</p>
                                  <p className="text-sm font-bold text-purple-600">KES {batchFiles.database?.price}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("database", batchFiles)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-xs px-3 h-8 transition-transform hover:scale-105"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Get
                              </Button>
                            </div>
                          )}

                          {hasBoth && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-400 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  <FileText className="w-3.5 h-3.5 text-green-600" />
                                  <Database className="w-3.5 h-3.5 text-green-600 -ml-1" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-green-700 uppercase">Best Value</p>
                                  <p className="text-sm font-bold text-green-600">
                                    KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("both", batchFiles)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs px-3 h-8 transition-transform hover:scale-105"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Buy
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
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
                  <div key={batchName} className="animate-slide-up">
                    {/* Batch Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {batchName}
                      </h2>
                      <div className="h-1.5 flex-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-30"></div>
                    </div>

                    {/* Large Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Documentation Card */}
                      {hasDoc && batchFiles.documentation && (
                        <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2 group">
                          {/* Image Preview */}
                          {(batchFiles.documentation.image_url_1 || batchFiles.documentation.image_url_2 || batchFiles.documentation.image_url_3) && (
                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                              <img
                                src={batchFiles.documentation.image_url_1 || batchFiles.documentation.image_url_2 || batchFiles.documentation.image_url_3 || ''}
                                alt="Documentation preview"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <Button
                                onClick={() => handlePreview(batchFiles.documentation!)}
                                size="sm"
                                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-blue-600 backdrop-blur-sm"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Samples
                              </Button>
                            </div>
                          )}
                          
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Documentation</span>
                              <FileText className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                                KES {batchFiles.documentation.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center line-clamp-2">
                              {batchFiles.documentation.file_name}
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
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Documentation
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Database Card */}
                      {hasDb && batchFiles.database && (
                        <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-purple-200 hover:border-purple-400 hover:-translate-y-2 group">
                          {/* Image Preview */}
                          {(batchFiles.database.image_url_1 || batchFiles.database.image_url_2 || batchFiles.database.image_url_3) && (
                            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden">
                              <img
                                src={batchFiles.database.image_url_1 || batchFiles.database.image_url_2 || batchFiles.database.image_url_3 || ''}
                                alt="Database preview"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <Button
                                onClick={() => handlePreview(batchFiles.database!)}
                                size="sm"
                                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-purple-600 backdrop-blur-sm"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Samples
                              </Button>
                            </div>
                          )}
                          
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Database</span>
                              <Database className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
                                KES {batchFiles.database.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center line-clamp-2">
                              {batchFiles.database.file_name}
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
                              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Database
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Complete Package Card */}
                      {hasBoth && (
                        <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-green-400 hover:border-green-500 relative hover:-translate-y-2 group">
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bol
