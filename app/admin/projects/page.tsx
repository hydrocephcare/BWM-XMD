"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Trash2, FileText, Database, Link as LinkIcon, X, Loader2, CheckCircle2, Plus, Edit, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
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
    docImage1: null as File | null,
    docImage2: null as File | null,
    docImage3: null as File | null,
    dbName: "",
    dbPrice: 500,
    dbUploadMethod: "link" as "file" | "link",
    dbFile: null as File | null,
    dbExternalLink: "",
    dbImage1: null as File | null,
    dbImage2: null as File | null,
    dbImage3: null as File | null,
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

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

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      
      if (bucketError) {
        console.error('Bucket check error:', bucketError)
        throw new Error('Cannot access storage buckets. Please check Supabase setup.')
      }

      const bucketExists = buckets?.some(b => b.name === 'project-images')
      
      if (!bucketExists) {
        throw new Error('Storage bucket "project-images" does not exist. Please create it in Supabase Dashboard → Storage → Create bucket → Name: "project-images" → Make it PUBLIC')
      }

      // Upload the file
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        throw new Error(`Image upload failed: ${error.message}. Make sure the bucket is PUBLIC and has proper policies.`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      return urlData.publicUrl
    } catch (err) {
      console.error('Image upload error:', err)
      throw err
    }
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
      const filesToInsert: any[] = []

      // Documentation
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

        // Upload documentation images
        let docImage1Url = ""
        let docImage2Url = ""
        let docImage3Url = ""

        console.log("Starting documentation image uploads...")

        if (uploadForm.docImage1) {
          console.log("Uploading doc image 1:", uploadForm.docImage1.name)
          try {
            docImage1Url = await uploadImageToSupabase(uploadForm.docImage1)
            console.log("Doc image 1 uploaded:", docImage1Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("Doc image 1 upload failed:", errorMsg)
            throw new Error(`Documentation Image 1 upload failed: ${errorMsg}`)
          }
        }
        if (uploadForm.docImage2) {
          console.log("Uploading doc image 2:", uploadForm.docImage2.name)
          try {
            docImage2Url = await uploadImageToSupabase(uploadForm.docImage2)
            console.log("Doc image 2 uploaded:", docImage2Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("Doc image 2 upload failed:", errorMsg)
            throw new Error(`Documentation Image 2 upload failed: ${errorMsg}`)
          }
        }
        if (uploadForm.docImage3) {
          console.log("Uploading doc image 3:", uploadForm.docImage3.name)
          try {
            docImage3Url = await uploadImageToSupabase(uploadForm.docImage3)
            console.log("Doc image 3 uploaded:", docImage3Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("Doc image 3 upload failed:", errorMsg)
            throw new Error(`Documentation Image 3 upload failed: ${errorMsg}`)
          }
        }

        filesToInsert.push({
          batch_name: selectedBatch,
          file_name: uploadForm.projectName,
          file_type: "Word",
          price: uploadForm.docPrice,
          file_url: docUrl,
          is_external_link: uploadForm.docUploadMethod === "link",
          image_url_1: docImage1Url || null,
          image_url_2: docImage2Url || null,
          image_url_3: docImage3Url || null,
        })
      }

      // Database
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

        // Upload database images
        let dbImage1Url = ""
        let dbImage2Url = ""
        let dbImage3Url = ""

        console.log("Starting database image uploads...")

        if (uploadForm.dbImage1) {
          console.log("Uploading db image 1:", uploadForm.dbImage1.name)
          try {
            dbImage1Url = await uploadImageToSupabase(uploadForm.dbImage1)
            console.log("DB image 1 uploaded:", dbImage1Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("DB image 1 upload failed:", errorMsg)
            throw new Error(`Database Image 1 upload failed: ${errorMsg}`)
          }
        }
        if (uploadForm.dbImage2) {
          console.log("Uploading db image 2:", uploadForm.dbImage2.name)
          try {
            dbImage2Url = await uploadImageToSupabase(uploadForm.dbImage2)
            console.log("DB image 2 uploaded:", dbImage2Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("DB image 2 upload failed:", errorMsg)
            throw new Error(`Database Image 2 upload failed: ${errorMsg}`)
          }
        }
        if (uploadForm.dbImage3) {
          console.log("Uploading db image 3:", uploadForm.dbImage3.name)
          try {
            dbImage3Url = await uploadImageToSupabase(uploadForm.dbImage3)
            console.log("DB image 3 uploaded:", dbImage3Url)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            console.error("DB image 3 upload failed:", errorMsg)
            throw new Error(`Database Image 3 upload failed: ${errorMsg}`)
          }
        }

        filesToInsert.push({
          batch_name: selectedBatch,
          file_name: dbFileName,
          file_type: "Access",
          price: uploadForm.dbPrice,
          file_url: dbUrl,
          is_external_link: uploadForm.dbUploadMethod === "link",
          image_url_1: dbImage1Url || null,
          image_url_2: dbImage2Url || null,
          image_url_3: dbImage3Url || null,
        })
      }

      console.log("Inserting to database:", filesToInsert)

      const supabase = createClient()
      const { error: insertError } = await supabase.from("projects").insert(filesToInsert)

      if (insertError) throw new Error(`Database error: ${insertError.message}`)

      await loadProjects()
      setUploadForm({
        projectName: "",
        docPrice: 500,
        docUploadMethod: "link",
        docFile: null,
        docExternalLink: "",
        docImage1: null,
        docImage2: null,
        docImage3: null,
        dbName: "",
        dbPrice: 500,
        dbUploadMethod: "link",
        dbFile: null,
        dbExternalLink: "",
        dbImage1: null,
        dbImage2: null,
        dbImage3: null,
      })
      alert("Project files added successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setUploadError(`Upload failed: ${errorMessage}`)
      console.error("Upload error details:", error)
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error
      await loadProjects()
      alert("File deleted successfully")
    } catch (error) {
      alert("Failed to delete file")
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
              <p className="text-gray-600">Manage KCSE Computer Studies Projects</p>
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
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">Sample Images (Optional)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 1</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, docImage1: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.docImage1 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 2</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, docImage2: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.docImage2 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 3</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, docImage3: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.docImage3 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                  </div>
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
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">Sample Images (Optional)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 1</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, dbImage1: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.dbImage1 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 2</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, dbImage2: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.dbImage2 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Image 3</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadForm({ ...uploadForm, dbImage3: e.target.files?.[0] || null })}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white"
                      />
                      {uploadForm.dbImage3 && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleFileUpload}
                disabled={uploading} 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading Files & Images...
                  </>
                ) : (
                  "Add Project Files"
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{file.file_name}</h4>
                          <p className="text-sm text-gray-600">Type: Documentation (Word)</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">KES {file.price}</p>
                          {(file.image_url_1 || file.image_url_2 || file.image_url_3) && (
                            <div className="flex gap-2 mt-2">
                              {file.image_url_1 && <img src={file.image_url_1} alt="Preview 1" className="w-16 h-16 object-cover rounded border" />}
                              {file.image_url_2 && <img src={file.image_url_2} alt="Preview 2" className="w-16 h-16 object-cover rounded border" />}
                              {file.image_url_3 && <img src={file.image_url_3} alt="Preview 3" className="w-16 h-16 object-cover rounded border" />}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{file.file_name}</h4>
                          <p className="text-sm text-gray-600">Type: Database (Access)</p>
                          <p className="text-lg font-bold text-purple-600 mt-1">KES {file.price}</p>
                          {(file.image_url_1 || file.image_url_2 || file.image_url_3) && (
                            <div className="flex gap-2 mt-2">
                              {file.image_url_1 && <img src={file.image_url_1} alt="Preview 1" className="w-16 h-16 object-cover rounded border" />}
                              {file.image_url_2 && <img src={file.image_url_2} alt="Preview 2" className="w-16 h-16 object-cover rounded border" />}
                              {file.image_url_3 && <img src={file.image_url_3} alt="Preview 3" className="w-16 h-16 object-cover rounded border" />}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedBatch && selectedBatchProjects.length === 0 && (
          <Card className="p-12 text-center bg-white shadow-md">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No files in {selectedBatch} yet</p>
            <p className="text-gray-400 text-sm mt-2">Use the form above to add files</p>
          </Card>
        )}
      </div>
    </div>
  )
}
