/**
 * Uploads a blog image to Vercel Blob storage
 * @param file The image file to upload
 * @returns The URL of the uploaded image
 */
export async function uploadBlogImage(file: File): Promise<string> {
  try {
    // Create a new FormData instance
    const formData = new FormData()
    formData.append("file", file)

    // Upload to Vercel Blob using the Blob API
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`)
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

/**
 * Formats a date for display
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
