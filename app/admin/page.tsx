import { Card, Button, Link } from "@/components/ui"
import { FileText } from "lucide-react" // Declare the FileText variable

const AdminPage = () => {
  return (
    <div>
      {/* ... existing code here ... */}

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <Link href="/admin/projects">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Files
          </h3>
          <p className="text-gray-600 text-sm mb-4">Manage downloadable project files with M-Pesa payments</p>
          <Button className="w-full">Manage Files</Button>
        </Link>
      </Card>

      {/* ... existing code here ... */}
    </div>
  )
}

export default AdminPage // Ensure there is a default export
