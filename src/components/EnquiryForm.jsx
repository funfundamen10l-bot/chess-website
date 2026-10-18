import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Not Sure"];
const batches = ["Weekday Morning", "Weekday Evening", "Weekend Morning", "Weekend Evening", "Flexible"];

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parent_name: "",
    student_age: "",
    phone: "",
    email: "",
    preferred_batch: "",
    skill_level: "",
    demo_interest: true,
    message: "",
    consent: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error("Please agree to the terms before submitting");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API}/enquiries`, {
        ...formData,
        student_age: parseInt(formData.student_age)
      });
      setSubmitted(true);
      toast.success("Enquiry submitted successfully!");
    } catch (e) {
      const detail = e.response?.data?.detail;
      let errorMsg = "Failed to submit enquiry";
      if (typeof detail === "string") {
        errorMsg = detail;
      } else if (Array.isArray(detail)) {
        errorMsg = detail.map(d => d.msg || JSON.stringify(d)).join(" ");
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="enquiry" className="py-24 md:py-32 bg-gradient-to-b from-white to-amber-50" data-testid="enquiry-section">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="bg-white border-2 border-amber-300 p-12 rounded-2xl shadow-lg">
            <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-8">
              We've received your enquiry and will get back to you within 24 hours.
              We're excited to help your child begin their chess journey!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  parent_name: "",
                  student_age: "",
                  phone: "",
                  email: "",
                  preferred_batch: "",
                  skill_level: "",
                  demo_interest: true,
                  message: "",
                  consent: false
                });
              }}
              className="text-amber-600 hover:underline font-medium"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="enquiry"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-amber-50"
      data-testid="enquiry-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
              Get Started
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4 mb-6">
              Enquire for <span className="text-amber-600">Admission</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Fill out the form to enquire about our chess coaching programs. Whether you're looking for a demo class
              or ready to enroll, we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>No obligation demo class available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Personalized attention for every student</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Flexible batch timings</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-medium mb-2 block">Parent/Student Name *</label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  data-testid="enquiry-name"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Student Age *</label>
                <input
                  type="number"
                  min="4"
                  max="80"
                  value={formData.student_age}
                  onChange={(e) => setFormData({ ...formData, student_age: e.target.value })}
                  data-testid="enquiry-age"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="Age in years"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="enquiry-phone"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="+91-XXXXXXXXXX"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-medium mb-2 block">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="enquiry-email"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Preferred Batch *</label>
                <select
                  value={formData.preferred_batch}
                  onChange={(e) => setFormData({ ...formData, preferred_batch: e.target.value })}
                  data-testid="enquiry-batch"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Skill Level *</label>
                <select
                  value={formData.skill_level}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                  data-testid="enquiry-level"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                >
                  <option value="">Select level</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-medium mb-2 block">Demo Class Interest</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="demo"
                      checked={formData.demo_interest}
                      onChange={() => setFormData({ ...formData, demo_interest: true })}
                      data-testid="enquiry-demo-yes"
                      className="accent-amber-500"
                    />
                    <span className="text-gray-700">Yes, I want a demo class</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="demo"
                      checked={!formData.demo_interest}
                      onChange={() => setFormData({ ...formData, demo_interest: false })}
                      data-testid="enquiry-demo-no"
                      className="accent-amber-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 font-medium mb-2 block">Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  data-testid="enquiry-message"
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  placeholder="Any specific questions or requirements..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked === true })}
                    data-testid="enquiry-consent"
                    className="mt-1 border-gray-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <span className="text-gray-500 text-sm leading-relaxed">
                    I agree to be contacted regarding my enquiry and understand that my data will be handled
                    in accordance with the privacy policy.
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              data-testid="enquiry-submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 mt-8 flex items-center justify-center gap-2 transition-all disabled:opacity-50 rounded-lg shadow-md"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
