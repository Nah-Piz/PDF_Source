import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BookOpen,
  User,
  Calendar,
  Tag,
  FileText,
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  File as FileIcon,
  Plus,
  X,
} from "lucide-react";
import UseAPICall from "../../services/api-hook.component";

const LibraryBookUploadForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedYear: "",
    coverImage: null,
    subjects: [],
    description: "",
    pdfFile: null,
  });
  const [subjectInput, setSubjectInput] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfFileName, setPdfFileName] = useState(null);
  const [errors, setErrors] = useState({});

  const coverInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const { uploadFile } = UseAPICall();

  const steps = [
    { title: "PDF Details", icon: BookOpen },
    { title: "PDF Cover", icon: ImageIcon },
    { title: "Subjects & Description", icon: Tag },
    { title: "Upload PDF", icon: FileIcon },
    { title: "Review & Submit", icon: CheckCircle },
  ];

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.title?.trim()) {
        newErrors.title = "Book title is required";
      }
      if (!formData.author?.trim()) {
        newErrors.author = "Author name is required";
      }
      if (!formData.publishedYear) {
        newErrors.publishedYear = "Published year is required";
      } else {
        const year = parseInt(formData.publishedYear);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1000 || year > currentYear) {
          newErrors.publishedYear = `Please enter a valid year (1000-${currentYear})`;
        }
      }
    }

    if (step === 1 && !formData.coverImage) {
      newErrors.coverImage = "Book cover is required";
    }

    if (step === 2) {
      if (formData.subjects.length === 0) {
        newErrors.subjects = "At least one subject is required";
      }
      if (!formData.description?.trim()) {
        newErrors.description = "Book description is required";
      } else if (formData.description.trim().length < 50) {
        newErrors.description = "Description should be at least 50 characters";
      }
    }

    if (step === 3 && !formData.pdfFile) {
      newErrors.pdfFile = "PDF file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, coverImage: file }));

    // Create preview URL
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);

    if (errors.coverImage) {
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("PDF file must be less than 50MB");
      return;
    }

    setFormData((prev) => ({ ...prev, pdfFile: file }));
    setPdfFileName(file.name);

    if (errors.pdfFile) {
      setErrors((prev) => ({ ...prev, pdfFile: "" }));
    }
  };

  const addSubject = () => {
    const trimmedSubject = subjectInput.trim();
    if (trimmedSubject) {
      if (!formData.subjects.includes(trimmedSubject)) {
        setFormData((prev) => ({
          ...prev,
          subjects: [...prev.subjects, trimmedSubject],
        }));
        setSubjectInput("");
        if (errors.subjects) {
          setErrors((prev) => ({ ...prev, subjects: "" }));
        }
      } else {
        toast.error("Subject already added");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  const removeSubject = (subjectToRemove) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subjectToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Please complete all steps");
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("author", formData.author);
    uploadData.append("publishedYear", formData.publishedYear);
    uploadData.append("description", formData.description);
    uploadData.append("subjects", JSON.stringify(formData.subjects));
    uploadData.append("coverImage", formData.coverImage);
    uploadData.append("pdfFile", formData.pdfFile);

    try {
      const response = await uploadFile("pdfs/", uploadData);

      if (response.success) {
        toast.success("Book uploaded successfully!", {
          duration: 4000,
          icon: "📚",
        });

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            title: "",
            author: "",
            publishedYear: "",
            coverImage: null,
            subjects: [],
            description: "",
            pdfFile: null,
          });
          if (coverPreview && coverPreview.startsWith("blob:")) {
            URL.revokeObjectURL(coverPreview);
          }
          setCoverPreview(null);
          setPdfFileName(null);
          setCurrentStep(0);
          setErrors({});
          setSubjectInput("");
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.code === "ECONNABORTED") {
        toast.error("Upload timeout. Please try again.");
      } else if (error.response) {
        toast.error(
          error.response.data?.message ||
            "Failed to upload book. Please try again.",
        );
      } else if (error.request) {
        toast.error(
          "Cannot connect to server. Please ensure the server is running on port 8080.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline w-4 h-4 mr-2 text-emerald-600" />
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2 text-blue-600" />
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none ${
                  errors.author ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
                Published Year *
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none ${
                  errors.publishedYear
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter published year"
                min="1000"
                max={new Date().getFullYear()}
              />
              {errors.publishedYear && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.publishedYear}
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="inline w-4 h-4 mr-2 text-emerald-600" />
                Book Cover *
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:border-emerald-500 ${
                  errors.coverImage
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleCoverFileChange}
                  className="hidden"
                />
                {coverPreview ? (
                  <div className="space-y-3">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md object-contain"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change cover image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload cover image
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-2 text-emerald-600" />
                Subjects *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Add subject (e.g., Fiction, Science, History)"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-10">
                {formData.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-2xl text-sm"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="hover:text-emerald-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.subjects && (
                <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2 text-blue-600" />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none resize-y ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter book description (minimum 50 characters)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              {!errors.description &&
                formData.description &&
                formData.description.length < 50 && (
                  <p className="mt-1 text-xs text-orange-600">
                    {formData.description.length}/50 characters minimum
                  </p>
                )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileIcon className="inline w-4 h-4 mr-2 text-emerald-600" />
                PDF File *
              </label>
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:border-emerald-500 ${
                  errors.pdfFile
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                  className="hidden"
                />
                {pdfFileName ? (
                  <div className="space-y-3">
                    <FileIcon className="w-12 h-12 mx-auto text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {pdfFileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to change PDF
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload PDF file
                      </p>
                      <p className="text-xs text-gray-500">PDF up to 50MB</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.pdfFile && (
                <p className="mt-1 text-sm text-red-600">{errors.pdfFile}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">
                Review Your Book
              </h3>
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Title:</span>{" "}
                  {formData.title || "Not provided"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Author:</span>{" "}
                  {formData.author || "Not provided"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Published Year:
                  </span>{" "}
                  {formData.publishedYear || "Not provided"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Subjects:</span>{" "}
                  {formData.subjects.length > 0
                    ? formData.subjects.join(", ")
                    : "Not provided"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Description:
                  </span>{" "}
                  {formData.description
                    ? formData.description.substring(0, 150) + "..."
                    : "Not provided"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Cover:</span>{" "}
                  {formData.coverImage?.name || "Not uploaded"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">PDF:</span>{" "}
                  {formData.pdfFile?.name || "Not uploaded"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* <Toaster position="top-right" /> */}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Upload New PDF
          </h1>
          <p className="text-gray-600 mt-2">
            Add new books to your digital library collection
          </p>
        </div>

        {/* Steps Progress */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div key={idx} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-emerald-600 text-white ring-4 ring-emerald-200"
                                    : isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : "bg-gray-300 text-gray-600"
                                }
                              `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <p
                      className={`not-sm:hidden text-xs mt-2 ${isActive ? "text-emerald-600 font-medium" : "text-gray-500"}`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${
                        idx < currentStep ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      style={{ transform: "translateY(-50%)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${
                    currentStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`
                    px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg font-medium 
                    hover:shadow-lg transition-all flex items-center gap-2
                    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Submit Book
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryBookUploadForm;
