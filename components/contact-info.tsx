import Link from "next/link"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactInfo() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm h-full">
      <h2 className="text-2xl font-bold text-navy-800 mb-6">Contact Information</h2>

      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center mr-4">
            <Phone className="h-5 w-5 text-navy-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-700">Phone</h3>
            <p className="text-gray-600">(254) 115-475-543</p>
            <p className="text-xs text-gray-500 mt-1">Available 24/7 for support</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center mr-4">
            <Mail className="h-5 w-5 text-navy-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-700">Email</h3>
            <p className="text-gray-600">admin@victoryschoolclub.co.ke</p>
            <p className="text-xs text-gray-500 mt-1">We'll respond as soon as possible</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center mr-4">
            <MapPin className="h-5 w-5 text-navy-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-700">Location</h3>
            <p className="text-gray-600">Nairobi, Kenya</p>
            <p className="text-xs text-gray-500 mt-1">Serving students nationwide</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center mr-4">
            <MessageSquare className="h-5 w-5 text-navy-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-700">WhatsApp</h3>
            <p className="text-gray-600">+254 712 345 678</p>
            <p className="text-xs text-gray-500 mt-1">Quick responses via WhatsApp</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link href="https://wa.link/jox26j" target="_blank">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat on WhatsApp
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800"
        >
          <Link href="https://chat.whatsapp.com/IO7QQrf6GH3IRHDMDAbNwm" target="_blank">
            <MessageSquare className="mr-2 h-4 w-4" />
            Join WhatsApp Group
          </Link>
        </Button>
      </div>
    </div>
  )
}
