import { Phone, Mail, MapPin } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-navy-800 mb-6">Contact Information</h2>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="bg-navy-100 rounded-full p-3 mr-4">
            <Phone className="h-6 w-6 text-navy-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-700">Phone</h3>
            <p className="text-gray-600 mt-1">(254) 115-475-543</p>
            <p className="text-sm text-gray-500 mt-1">Monday to Friday, 8am to 5pm</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-navy-100 rounded-full p-3 mr-4">
            <Mail className="h-6 w-6 text-navy-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-700">Email</h3>
            <p className="text-gray-600 mt-1">info@victoryschoolclub.co.ke</p>
            <p className="text-sm text-gray-500 mt-1">We'll respond as soon as possible</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-navy-100 rounded-full p-3 mr-4">
            <MapPin className="h-6 w-6 text-navy-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-700">Address</h3>
            <p className="text-gray-600 mt-1">Nairobi, Kenya</p>
            <p className="text-sm text-gray-500 mt-1">Serving schools nationwide</p>
          </div>
        </div>
      </div>
    </div>
  )
}
