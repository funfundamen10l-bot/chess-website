import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Mail, GraduationCap, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Not Sure"];

const STEP_LABELS = {
  1: "Select Date & Time",
  2: "Your Details",
  3: "Review & Confirm"
};

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    parent_name: "",
    student_name: "",
    student_age: "",
    phone: "",
    email: "",
    preferred_date: "",
    preferred_time: "",
    skill_level: "",
    message: ""
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Empty cells for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      days.push({
        day,
        date,
        dateStr: date.toISOString().split('T')[0],
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const res = await axios.get(`${API}/available-slots?date=${date}`);
      setAvailableSlots(res.data.available_slots);
    } catch (e) {
      setAvailableSlots(timeSlots);
    }
  };

  const handleDateSelect = (dateStr) => {
    setFormData({ ...formData, preferred_date: dateStr, preferred_time: "" });
    fetchAvailableSlots(dateStr);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, {
        ...formData,
        student_age: parseInt(formData.student_age)
      });
      setSuccess(true);
      toast.success("Demo class booked successfully!");
    } catch (e) {
      const detail = e.response?.data?.detail;
      let errorMsg = "Failed to book demo class";
      if (typeof detail === "string") errorMsg = detail;
      else if (Array.isArray(detail)) errorMsg = detail.map(d => d.msg || JSON.stringify(d)).join(" ");
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(false);
    setFormData({
      parent_name: "",
      student_name: "",
      student_age: "",
      phone: "",
      email: "",
      preferred_date: "",
      preferred_time: "",
      skill_level: "",
      message: ""
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendarDays();

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Booking Confirmed</DialogTitle>
            <DialogDescription>Your demo class has been booked successfully</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
            <h2 className="font-serif text-2xl text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your demo class has been scheduled for<br />
              <span className="text-amber-600 font-semibold">{formData.preferred_date}</span> at{" "}
              <span className="text-amber-600 font-semibold">{formData.preferred_time}</span>
            </p>
            <p className="text-gray-500 text-sm mb-8">
              We'll contact you shortly to confirm the booking details.
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-lg"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-gray-900">Book a Demo Class</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Step {step} of 3 - {STEP_LABELS[step]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded ${s <= step ? 'bg-amber-500' : 'bg-gray-200'} transition-colors`}
            />
          ))}
        </div>

        {/* Step 1: Date & Time Selection */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h3 className="font-medium text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-gray-500 py-2">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <button
                    key={day ? `day-${day.dateStr}` : `empty-${i}`}
                    disabled={!day || day.isPast}
                    onClick={() => day && !day.isPast && handleDateSelect(day.dateStr)}
                    data-testid={day ? `calendar-day-${day.day}` : undefined}
                    className={`
                      h-10 text-sm transition-all rounded-lg
                      ${!day ? 'invisible' : ''}
                      ${day?.isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-amber-100 text-gray-700'}
                      ${day?.isToday ? 'border border-amber-400' : ''}
                      ${formData.preferred_date === day?.dateStr ? 'bg-amber-500 text-white font-semibold' : ''}
                    `}
                  >
                    {day?.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {formData.preferred_date && (
              <div>
                <label className="text-sm text-gray-700 font-medium mb-3 block flex items-center gap-2">
                  <Clock size={16} className="text-amber-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const isAvailable = availableSlots.includes(time);
                    return (
                      <button
                        key={time}
                        disabled={!isAvailable}
                        onClick={() => setFormData({ ...formData, preferred_time: time })}
                        data-testid={`time-slot-${time.replace(/\s/g, '-')}`}
                        className={`
                          py-3 text-sm transition-all border rounded-lg
                          ${!isAvailable ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-gray-200 hover:border-amber-400 text-gray-700'}
                          ${formData.preferred_time === time ? 'bg-amber-500 text-white border-amber-500 font-semibold' : ''}
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {availableSlots.length === 0 && (
                  <p className="text-yellow-600 text-sm mt-2">No slots available for this date. Please select another date.</p>
                )}
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!formData.preferred_date || !formData.preferred_time}
              data-testid="booking-next-step1"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Parent Name *</label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  data-testid="booking-parent-name"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Student Name *</label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  data-testid="booking-student-name"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Student Age *</label>
                <input
                  type="number"
                  min="4"
                  max="80"
                  value={formData.student_age}
                  onChange={(e) => setFormData({ ...formData, student_age: e.target.value })}
                  data-testid="booking-student-age"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 font-medium mb-2 block">Skill Level *</label>
                <select
                  value={formData.skill_level}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                  data-testid="booking-skill-level"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  required
                >
                  <option value="">Select level</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-testid="booking-phone"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                placeholder="+91-XXXXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="booking-email"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Message (Optional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                data-testid="booking-message"
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none resize-none"
                placeholder="Any specific questions..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-4 hover:bg-gray-50 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.parent_name || !formData.student_name || !formData.student_age || !formData.phone || !formData.email || !formData.skill_level}
                data-testid="booking-next-step2"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 disabled:opacity-50 rounded-lg"
              >
                Review Booking
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
              <h3 className="text-amber-700 font-medium mb-4 flex items-center gap-2">
                <Calendar size={18} />
                Booking Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-900 font-medium">{formData.preferred_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-gray-900 font-medium">{formData.preferred_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Student:</span>
                  <span className="text-gray-900">{formData.student_name} ({formData.student_age} years)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Skill Level:</span>
                  <span className="text-gray-900">{formData.skill_level}</span>
                </div>
                <hr className="border-amber-200" />
                <div className="flex justify-between">
                  <span className="text-gray-500">Parent:</span>
                  <span className="text-gray-900">{formData.parent_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900">{formData.email}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              By confirming this booking, you agree to attend the demo class at the scheduled time. 
              We'll send you a confirmation email with the class details.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 py-4 hover:bg-gray-50 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                data-testid="booking-confirm"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 disabled:opacity-50 rounded-lg"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
