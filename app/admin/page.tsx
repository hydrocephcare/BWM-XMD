"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, FileText, Database, Link as LinkIcon, X, Loader2, Plus, Edit, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

interface ProjectImage {
  id: string
  image_url: string
  image_order: number
}

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: "Word" | "Access"
  file_url: string
  price: number
  is_external_link: boolean
  images?: ProjectImage[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [showNewBatchInput, setShowNewBatchInput] = useState(false)
  const [newBatchName, setNewBatchName] = useState("")
  
  const [uploadForm, setUploadForm] = useState({
    projectName: "",
    docPrice: 500,
    docUploadMethod: "link" as "file" | "link",
    docFile: null as File | null,
    docExternalLink: "",
    docImages: [] as File[],
    dbName: "",
    dbPrice: 500,
    dbUploadMethod: "link" as "file" | "link",
    dbFile: null as File | null,
    dbExternalLink: "",
    dbImages: [] as File[],
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      
      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("batch_name", { ascending: true })

      if (projectsError) throw projectsError

      // Load images
      const { data: imagesData, error: imagesError } = await supabase
        .from("project_images")
        .select("*")
        .order("image_order", { ascending: true })

      if (imagesError) throw imagesError

      // Combine
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

  const handleAddNewBatch = () => {
    if (!newBatchName.trim()) {
      alert("Please enter a batch name")
      return
    }
    
    const batchExists = batches.includes(newBatchName.trim())
    if (batchExists) {
      alert("This batch already exists!")
      return
    }
    
    setSelectedBatch(newBatchName.trim())
    setShowNewBatchInput(false)
    setNewBatchName("")
  }

  const handleDocImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 3) {
      alert("Maximum 3 images allowed")
      return
    }
    setUploadForm({ ...uploadForm, docImages: files })
  }

  const handleDbImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 3) {
      alert("Maximum 3 images allowed")
      return
    }
    setUploadForm({ ...uploadForm, dbImages: files })
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    
    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", { method: "POST", body: formData })
      if (!response.ok) throw new Error("Image upload failed")
      const data = await response.json()
      urls.push(data.url)
    }
    
    return urls
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError("")

    if (!uploadForm.projectName || !selectedBatch) {
      setUploadError("Please fill in project name and select a batch")
      return
    }

    const hasDoc = uploadForm.docUploadMethod === "file" ? !!uploadForm.docFile : !!uploadForm.docExternalLink
    const hasDb = uploadForm.dbUploadMethod === "file" ? !!uploadForm.dbFile : !!uploadForm.dbExternalLink

    if (!hasDoc && !hasDb) {
      setUploadError("Please provide at least one file (Documentation or Database)")
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const filesToInsert: any[] = []

      // Handle Documentation
      if (hasDoc) {
        let docUrl = ""
        if (uploadForm.docUploadMethod === "file" && uploadForm.docFile) {
          const formData = new FormData()
          formData.append("file", uploadForm.docFile)
          const response = await fetch("/api/upload", { method: "POST", body: formData })
          if (!response.ok) throw new Error("Documentation upload failed")
          const data = await response.json()
          docUrl = data.url
        } else {
          docUrl = uploadForm.docExternalLink
        }

        const docData = {
          batch_name: selectedBatch,
          file_name: uploadForm.projectName,
          file_type: "Word",
          price: uploadForm.docPrice,
          file_url: docUrl,
          is_external_link: uploadForm.docUploadMethod === "link",
        }

        // Insert project file
        const { data: insertedDoc, error: docError } = await supabase
          .from("projects")
          .insert([docData])
          .select()
          .single()

        if (docError) throw docError

        // Upload and insert images if any
        if (uploadForm.docImages.length > 0) {
          const imageUrls = await uploadImages(uploadForm.docImages)
          const imageRecords = imageUrls.map((url, index) => ({
            project_id: insertedDoc.id,
            image_url: url,
            image_order: index + 1
          }))

          const { error: imgError } = await supabase
            .from("project_images")
            .insert(imageRecords)

          if (imgError) throw imgError
        }
      }

      // Handle Database
      if (hasDb) {
        let dbUrl = ""
        if (uploadForm.dbUploadMethod === "file" && uploadForm.dbFile) {
          const formData = new FormData()
          formData.append("file", uploadForm.dbFile)
          const response = await fetch("/api/upload", { method: "POST", body: formData })
          if (!response.ok) throw new Error("Database upload failed")
          const data = await response.json()
          dbUrl = data.url
        } else {
          dbUrl = uploadForm.dbExternalLink
        }

        const dbFileName = uploadForm.dbName.trim() || uploadForm.projectName

        const dbData = {
          batch_name: selectedBatch,
          file_name: dbFileName,
          file_type: "Access",
          price: uploadForm.dbPrice,
          file_url: dbUrl,
          is_external_link: uploadForm.dbUploadMethod === "link",
        }

        // Insert project file
        const { data: insertedDb, error: dbError } = await supabase
          .from("projects")
          .insert([dbData])
          .select()
          .single()

        if (dbError) throw dbError

        // Upload and insert images if any
        if (uploadForm.dbImages.length > 0) {
          const imageUrls = await uploadImages(uploadForm.dbImages)
          const imageRecords = imageUrls.map((url, index) => ({
            project_id: insertedDb.id,
            image_url: url,
            image_order: index + 1
          }))

          const { error: imgError } = await supabase
            .from("project_images")
            .insert(imageRecords)

          if (imgError) throw imgError
        }
      }

      await loadProjects()
      setUploadForm({
        projectName: "",
        docPrice: 500,
        docUploadMethod: "link",
        docFile: null,
        docExternalLink: "",
        docImages: [],
        dbName: "",
        dbPrice: 500,
        dbUploadMethod: "link",
        dbFile: null,
        dbExternalLink: "",
        dbImages: [],
      })
      alert("Project files added successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setUploadError(`Upload failed: ${errorMessage}`)
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const supabase = createClient()
      // Images will be deleted automatically due to CASCADE
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error
      await loadProjects()
      alert("File deleted successfully")
    } catch (error) {
      alert("Failed to delete file")
      console.error("Delete error:", error)
    }
  }

  const deleteImage = async (imageId: string, projectId: string) => {
    if (!confirm("Delete this image?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("project_images").delete().eq("id", imageId)
      if (error) throw error
      await loadProjects()
    } catch (error) {
      alert("Failed to delete image")
      console.error("Delete error:", error)
    }
  }

  const batches = [...new Set(projects.map((p) => p.batch_name))].sort()
  const selectedBatchProjects = selectedBatch ? projects.filter((p) => p.batch_name === selectedBatch) : []
  const docFiles = selectedBatchProjects.filter((p) => p.file_type === "Word")
  const dbFiles = selectedBatchProjects.filter((p) => p.file_type === "Access")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Project Management</h1>
              <p className="text-gray-600">Manage KCSE Computer Studies Projects with Images</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="shadow-sm">
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-white shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Batch</h2>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {batches.map((batch) => (
              <Button
                key={batch}
                onClick={() => {
                  setSelectedBatch(batch)
                  setShowNewBatchInput(false)
                }}
                variant={selectedBatch === batch ? "default" : "outline"}
                className={selectedBatch === batch ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Edit className="w-4 h-4 mr-2" />
                {batch}
              </Button>
            ))}
            
            <Button
              onClick={() => {
                setShowNewBatchInput(true)
                setSelectedBatch(null)
              }}
              variant="outline"
              className="border-dashed border-2 border-blue-400 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Batch
            </Button>
          </div>

          {showNewBatchInput && (
            <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
              <Input
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                placeholder="Enter new batch name (e.g., Batch 2)"
                className="bg-white"
              />
              <Button onClick={handleAddNewBatch} className="bg-blue-600 hover:bg-blue-700">
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowNewBatchInput(false)}>
                Cancel
              </Button>
            </div>
          )}
        </Card>

        {selectedBatch && (
          <Card className="p-6 md:p-8 mb-8 shadow-lg bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Files to {selectedBatch}</h2>
            </div>

            {uploadError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{uploadError}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <Input
                  value={uploadForm.projectName}
                  onChange={(e) => setUploadForm({ ...uploadForm, projectName: e.target.value })}
                  placeholder="e.g., School Management System 2025"
                  className="bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Main project name (used for documentation)</p>
              </div>

              {/* DOCUMENTATION SECTION */}
              <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg text-gray-900">Documentation (Word)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Price (KES):</label>
                    <Input
                      type="number"
                      value={uploadForm.docPrice}
                      onChange={(e) => setUploadForm({ ...uploadForm, docPrice: Number(e.target.value) })}
                      min="1"
                      className="w-32 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, docUploadMethod: "file", docExternalLink: "" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.docUploadMethod === "file" ? "border-blue-600 bg-white shadow-md" : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Upload File</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, docUploadMethod: "link", docFile: null })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.docUploadMethod === "link" ? "border-blue-600 bg-white shadow-md" : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <LinkIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">External Link</p>
                  </button>
                </div>

                {uploadForm.docUploadMethod === "file" ? (
                  <input
                    type="file"
                    accept=".docx,.doc"
                    onChange={(e) => setUploadForm({ ...uploadForm, docFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                ) : (
                  <Input
                    type="url"
                    value={uploadForm.docExternalLink}
                    onChange={(e) => setUploadForm({ ...uploadForm, docExternalLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="bg-white"
                  />
                )}

                {/* Documentation Images */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Preview Images (Max 3)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDocImageChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                  {uploadForm.docImages.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">{uploadForm.docImages.length} image(s) selected</p>
                  )}
                </div>
              </div>

              {/* DATABASE SECTION */}
              <div className="bg-purple-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-lg text-gray-900">Database (Access)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Price (KES):</label>
                    <Input
                      type="number"
                      value={uploadForm.dbPrice}
                      onChange={(e) => setUploadForm({ ...uploadForm, dbPrice: Number(e.target.value) })}
                      min="1"
                      className="w-32 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Database Name (Optional)</label>
                  <Input
                    value={uploadForm.dbName}
                    onChange={(e) => setUploadForm({ ...uploadForm, dbName: e.target.value })}
                    placeholder="Leave empty to use project name"
                    className="bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">If empty, will use main project name</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, dbUploadMethod: "file", dbExternalLink: "" })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.dbUploadMethod === "file" ? "border-purple-600 bg-white shadow-md" : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium">Upload File</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm({ ...uploadForm, dbUploadMethod: "link", dbFile: null })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      uploadForm.dbUploadMethod === "link" ? "border-purple-600 bg-white shadow-md" : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <LinkIcon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium">External Link</p>
                  </button>
                </div>

                {uploadForm.dbUploadMethod === "file" ? (
                  <input
                    type="file"
                    accept=".accdb,.mdb"
                    onChange={(e) => setUploadForm({ ...uploadForm, dbFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                ) : (
                  <Input
                    type="url"
                    value={uploadForm.dbExternalLink}
                    onChange={(e) => setUploadForm({ ...uploadForm, dbExternalLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="bg-white"
                  />
                )}

                {/* Database Images */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Preview Images (Max 3)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDbImageChange}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  />
                  {uploadForm.dbImages.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">{uploadForm.dbImages.length} image(s) selected</p>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleFileUpload}
                disabled={uploading} 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Add Files"
                )}
              </Button>
            </div>
          </Card>
        )}

        {selectedBatch && selectedBatchProjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Files in {selectedBatch}</h2>

            {docFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentation Files
                </h3>
                <div className="grid gap-4">
                  {docFiles.map((file) => (
                    <Card key={file.id} className="p-4 border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900">{file.file_name}</h4>
                          <p className="text-sm text-gray-600">Type: Documentation (Word)</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">KES {file.price}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {file.images && file.images.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview Images:</p>
                          <div className="flex gap-2">
                            {file.images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img src={img.image_url} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                                <button
                                  onClick={() => deleteImage(img.id, file.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {dbFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Files
                </h3>
                <div className="grid gap-4">
                  {dbFiles.map((file) => (
                    <Card key={file.id} className="p-4 border-l-4 border-purple-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900">{file.file_name}</h4>
                          <p className="text-sm text-gray-600">Type: Database (Access)</p>
                          <p className="text-lg font-bold text-purple-600 mt-1">KES {file.price}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {file.images && file.images.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview Images:</p>
                          <div className="flex gap-2">
                            {file.images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img src={img.image_url} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                                <button
                                  onClick={() => deleteImage(img.id, file.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
