import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Quote, Star, ChevronLeft, ChevronRight, Plus, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const AUTO_ROTATE_MS = 5000;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const touchStartX = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    testimonial: "",
    rating: 5,
    relation: "Parent",
    photo: null
  });

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/testimonials?approved_only=true`);
      setTestimonials(res.data);
    } catch {
      // silently fail for public testimonials fetch
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, testimonials.length));
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % Math.max(1, testimonials.length));
  }, [testimonials.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("testimonial", formData.testimonial);
      form.append("rating", formData.rating.toString());
      form.append("relation", formData.relation);
      if (formData.photo) {
        form.append("photo", formData.photo);
      }

      await axios.post(`${API}/testimonials`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Thank you! Your testimonial has been submitted for review.");
      setIsDialogOpen(false);
      setFormData({ name: "", testimonial: "", rating: 5, relation: "Parent", photo: null });
    } catch {
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 bg-white"
      data-testid="testimonials-section"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-amber-600">
              What Parents Say
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-[1.2] mt-4">
              Student & Parent <span className="text-amber-600">Testimonials</span>
            </h2>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                data-testid="submit-testimonial-btn"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 py-3 transition-all rounded-lg shadow-md"
              >
                <Plus size={18} />
                Share Your Experience
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Share Your Experience</DialogTitle>
                <DialogDescription className="text-gray-500 text-sm">Tell us about your experience with ChessZen Classes</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5 mt-4 pb-2">
                <div>
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="testimonial-name"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium mb-2 block">You are a *</label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    data-testid="testimonial-relation"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 outline-none"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`rating-${star}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        data-testid={`rating-${star}`}
                        className="p-2 transition-colors"
                      >
                        <Star
                          size={24}
                          className={star <= formData.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Your Testimonial *</label>
                  <textarea
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    data-testid="testimonial-text"
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                    placeholder="Share your experience with ChessZen Classes..."
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium mb-2 block">Photo (Optional)</label>
                  <div className="relative">
                    {formData.photo ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-gray-700 text-sm flex-1 truncate">{formData.photo.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photo: null })}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
                        <Upload size={18} className="text-gray-400" />
                        <span className="text-gray-500 text-sm">Upload a photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                          data-testid="testimonial-photo"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="testimonial-submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Testimonials Carousel */}
        {testimonials.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={prevSlide}
              data-testid="testimonial-prev"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors hidden md:flex shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              data-testid="testimonial-next"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors hidden md:flex shadow-md"
            >
              <ChevronRight size={20} />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <div key={t.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-amber-50 to-white border border-gray-200 p-8 md:p-12 max-w-3xl mx-auto rounded-2xl shadow-sm">
                      <Quote className="text-amber-400 mb-6" size={40} />
                      <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-8">
                        "{t.testimonial}"
                      </p>
                      <div className="flex items-center gap-4">
                        {t.photo_url ? (
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}${t.photo_url}`}
                            alt={t.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-amber-300"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-serif text-xl">
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-gray-900 font-medium">{t.name}</h4>
                          <p className="text-gray-500 text-sm">{t.relation}</p>
                        </div>
                        <div className="ml-auto flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={`${t.id}-star-${star}`}
                              size={16}
                              className={star <= t.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => goTo(i)}
                    data-testid={`testimonial-dot-${i}`}
                    className="relative w-8 h-1.5 rounded-full overflow-hidden bg-gray-200 transition-all"
                  >
                    {i === currentIndex && (
                      <span
                        className="absolute inset-0 bg-amber-500 rounded-full"
                        style={{
                          animation: isPaused ? 'none' : `progress ${AUTO_ROTATE_MS}ms linear`,
                        }}
                      />
                    )}
                    {i !== currentIndex && <span className="absolute inset-0 bg-gray-300 rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Quote className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-gray-500">No testimonials yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
}
