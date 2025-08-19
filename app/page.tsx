"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CheckCircle, ChevronRight, User, CreditCard, Shield, ArrowLeft, Loader2, Check } from "lucide-react"

interface FormData {
  // Personal Details
  fullName: string
  phoneNumber: string
  email: string
  city: string
  pinCode: string
  
  // Financial Details
  aadhaarNumber: string
  panNumber: string
  bankAccountNumber: string
  ifscCode: string
  
  // Nominee Details
  addNominee: boolean
  nomineeName: string
  nomineeAadhaar: string
}

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    city: "",
    pinCode: "",
    aadhaarNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
    addNominee: false,
    nomineeName: "",
    nomineeAadhaar: ""
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const steps = [
    { id: 1, title: "Personal Details", icon: User, description: "Basic information" },
    { id: 2, title: "Financial Details", icon: CreditCard, description: "Identity & banking" }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
      else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
      
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.pinCode.trim()) newErrors.pinCode = "Pin code is required"
      else if (!/^[0-9]{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit pin code"
    }

    if (step === 2) {
      if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = "Aadhaar number is required"
      else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number"
      
      if (!formData.panNumber.trim()) newErrors.panNumber = "PAN number is required"
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) newErrors.panNumber = "Please enter a valid PAN number"
      
      if (!formData.bankAccountNumber.trim()) newErrors.bankAccountNumber = "Bank account number is required"
      if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required"
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) newErrors.ifscCode = "Please enter a valid IFSC code"

      if (formData.addNominee) {
        if (!formData.nomineeName.trim()) newErrors.nomineeName = "Nominee name is required"
        if (!formData.nomineeAadhaar.trim()) newErrors.nomineeAadhaar = "Nominee Aadhaar is required"
        else if (!/^[0-9]{12}$/.test(formData.nomineeAadhaar)) newErrors.nomineeAadhaar = "Please enter a valid 12-digit Aadhaar number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitting(false)
      setIsSuccess(true)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatInput = (field: keyof FormData, value: string) => {
    switch (field) {
      case 'phoneNumber':
        return value.replace(/\D/g, '').slice(0, 10)
      case 'pinCode':
        return value.replace(/\D/g, '').slice(0, 6)
      case 'aadhaarNumber':
      case 'nomineeAadhaar':
        return value.replace(/\D/g, '').slice(0, 12)
      case 'panNumber':
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
      case 'ifscCode':
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
      default:
        return value
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="text-center p-6 max-w-md w-full">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 text-sm md:text-base">Thank you for your application. We'll review it and get back to you soon.</p>
          </div>
          <button
            onClick={() => {
              setIsSuccess(false)
              setCurrentStep(1)
              setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                city: "",
                pinCode: "",
                aadhaarNumber: "",
                panNumber: "",
                bankAccountNumber: "",
                ifscCode: "",
                addNominee: false,
                nomineeName: "",
                nomineeAadhaar: ""
              })
              setErrors({})
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Purple Background with Illustration (Desktop Only) */}
      <div
        className="relative overflow-hidden lg:flex-1 order-2 lg:order-1 hidden lg:block"
        style={{ background: "linear-gradient(135deg, #b76cb8 0%, #82498c 100%)" }}
      >
        {/* White Curved Overlay - Hidden on mobile, visible on desktop */}
        <div className="absolute bottom-0 left-0 right-0 h-4/5">
          <svg viewBox="0 0 400 320" className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,160 Q200,40 400,160 L400,320 L0,320 Z" fill="#ffffff" opacity="0.95" />
          </svg>
        </div>

        {/* Title */}
        <div className="relative z-10 p-6 lg:p-12">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
            Application
            <br />
            Form
          </h1>
          
          {/* Descriptive Text with Icons */}
          <div className="space-y-4">
            <p className="text-white/90 text-base lg:text-lg leading-relaxed">
              Complete your application in just a few simple steps. We'll guide you through the process.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Personal Details</h3>
                  <p className="text-white/80 text-xs">Basic information</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Financial Details</h3>
                  <p className="text-white/80 text-xs">Banking & identity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Illustrations - Responsive sizing */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center pb-4 lg:pb-8">
          <div className="relative w-full flex items-end justify-center">
            {/* Decorative plant - hidden on mobile, visible on desktop */}
            <div className="absolute -left-8 bottom-0 z-10">
              <img src="/decorative-plant.png" alt="Decorative plant" className="h-80 w-auto opacity-40" />
            </div>

            {/* Main illustration - responsive sizing */}
            <div className="flex items-end justify-center relative z-20">
              <img
                src="/main-illustration.png"
                alt="Professional with application interface"
                className="h-48 md:h-64 lg:h-[28rem] w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header (Mobile Only) */}
      <div className="lg:hidden min-h-screen bg-[#b76cb8] relative overflow-hidden">
        {/* Floating Header - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#b76cb8] px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-lg font-bold">Application Form</h1>
            <div className="w-8 h-8"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Background Ellipses */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-32 bg-[#82498c] opacity-70 rounded-full blur-[153px]"></div>
          <div className="absolute -top-40 -left-20 w-60 h-32 bg-[#82498c] opacity-70 rounded-full blur-[153px]"></div>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-36 h-20 bg-gray-300 opacity-70 rounded-full blur-[153px]"></div>
        </div>

        {/* Main Content with top padding for floating header */}
        <div className="relative z-10 pt-20 pb-8 px-6">
          {/* Illustration - Made larger */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="/main-illustration.png"
                alt="Application form illustration"
                className="w-80 h-80 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile Form Container */}
        <div className="relative z-10 bg-white rounded-t-[30px] min-h-[calc(100vh-400px)] px-6 py-8">
          {currentStep === 1 ? (
            <>
              <h2 className="text-[#232323] text-xl font-bold mb-6">Personal Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name and Phone Number Row */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      autoComplete="name"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.fullName ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', formatInput('phoneNumber', e.target.value))}
                      autoComplete="tel"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.phoneNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#5a5555] text-xs font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    autoComplete="email"
                    className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* City and Pin Code Row */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      autoComplete="address-level2"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.city ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your city"
                      required
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Pin Code *</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', formatInput('pinCode', e.target.value))}
                      autoComplete="postal-code"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.pinCode ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 6-digit pin code"
                      required
                    />
                    {errors.pinCode && (
                      <p className="text-xs text-red-600 mt-1">{errors.pinCode}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-white text-sm font-bold rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "#b76cb8" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Continue to Next Step</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-[#232323] text-xl font-bold mb-6">Financial Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Adhaar Number and Pan Number Row */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Adhaar Number *</label>
                    <input
                      type="text"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', formatInput('aadhaarNumber', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.aadhaarNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 12-digit Aadhaar number"
                      required
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.aadhaarNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Pan Number *</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', formatInput('panNumber', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.panNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter PAN number (e.g., ABCDE1234F)"
                      required
                    />
                    {errors.panNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.panNumber}</p>
                    )}
                  </div>
                </div>

                {/* Bank Account Number and IFSC Code Row */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">Bank Account No *</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                      autoComplete="off"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.bankAccountNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter bank account number"
                      required
                    />
                    {errors.bankAccountNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.bankAccountNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-xs font-medium mb-2">IFSC Code*</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', formatInput('ifscCode', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                        errors.ifscCode ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter IFSC code (e.g., SBIN0001234)"
                      required
                    />
                    {errors.ifscCode && (
                      <p className="text-xs text-red-600 mt-1">{errors.ifscCode}</p>
                    )}
                  </div>
                </div>

                {/* Nominee Details Section */}
                <div className="pt-4">
                  <h3 className="text-[#232323] text-xl font-bold mb-4">Nominee Details:</h3>

                  {/* Checkbox */}
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.addNominee}
                        onChange={(e) => handleInputChange('addNominee', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                          formData.addNominee 
                            ? 'bg-[#b76cb8] border-[#b76cb8]' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {formData.addNominee && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-black text-xs">I want to add a nominee.</span>
                    </label>
                  </div>

                  {/* Conditional Nominee Fields */}
                  {formData.addNominee && (
                    <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-[#5a5555] text-xs font-medium mb-2">Nominee Name *</label>
                        <input
                          type="text"
                          value={formData.nomineeName}
                          onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                          autoComplete="off"
                          className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                            errors.nomineeName ? 'border-red-300 focus:ring-red-500' : ''
                          }`}
                          placeholder="Enter nominee's full name"
                          required={formData.addNominee}
                        />
                        {errors.nomineeName && (
                          <p className="text-xs text-red-600 mt-1">{errors.nomineeName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[#5a5555] text-xs font-medium mb-2">Nominee Adhaar no *</label>
                        <input
                          type="text"
                          value={formData.nomineeAadhaar}
                          onChange={(e) => handleInputChange('nomineeAadhaar', formatInput('nomineeAadhaar', e.target.value))}
                          autoComplete="off"
                          className={`w-full px-2 py-2 border border-[#609968] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#609968] text-xs transition-all duration-200 ${
                            errors.nomineeAadhaar ? 'border-red-300 focus:ring-red-500' : ''
                          }`}
                          placeholder="Enter nominee's Aadhaar number"
                          required={formData.addNominee}
                        />
                        {errors.nomineeAadhaar && (
                          <p className="text-xs text-red-600 mt-1">{errors.nomineeAadhaar}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-white text-sm font-bold rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "#b76cb8" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Complete</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Form (Desktop Only) */}
      <div className="flex-1 bg-white p-4 md:p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2 hidden lg:flex">
        <div className="max-w-lg mx-auto w-full">
          {/* Progress Indicator */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
              <span className="text-xs md:text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 1 ? (
            <>
              <h2 className="text-[#232323] text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-10">Personal Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Full Name and Phone Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      autoComplete="name"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.fullName ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', formatInput('phoneNumber', e.target.value))}
                      autoComplete="tel"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.phoneNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    autoComplete="email"
                    className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* City and Pin Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      autoComplete="address-level2"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.city ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter your city"
                      required
                    />
                    {errors.city && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Pin Code *</label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', formatInput('pinCode', e.target.value))}
                      autoComplete="postal-code"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.pinCode ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 6-digit pin code"
                      required
                    />
                    {errors.pinCode && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.pinCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 md:pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 md:py-5 text-white text-lg md:text-xl font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "#b76cb8" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Continue to Next Step</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
                <h2 className="text-[#232323] text-2xl md:text-3xl lg:text-4xl font-bold">Financial Details</h2>
                <button
                  onClick={goBack}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors self-start md:self-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Adhaar Number and Pan Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Aadhaar Number *</label>
                    <input
                      type="text"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', formatInput('aadhaarNumber', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.aadhaarNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter 12-digit Aadhaar number"
                      required
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.aadhaarNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">PAN Number *</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', formatInput('panNumber', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.panNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter PAN number (e.g., ABCDE1234F)"
                      required
                    />
                    {errors.panNumber && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.panNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bank Account Number and IFSC Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Bank Account Number *</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                      autoComplete="off"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.bankAccountNumber ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter bank account number"
                      required
                    />
                    {errors.bankAccountNumber && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.bankAccountNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">IFSC Code *</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', formatInput('ifscCode', e.target.value))}
                      autoComplete="off"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                        errors.ifscCode ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter IFSC code (e.g., SBIN0001234)"
                      required
                    />
                    {errors.ifscCode && (
                      <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Nominee Details Section */}
                <div className="pt-4 md:pt-6">
                  <h3 className="text-[#232323] text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">Nominee Details:</h3>

                  {/* Checkbox */}
                  <div className="mb-4 md:mb-6">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.addNominee}
                        onChange={(e) => handleInputChange('addNominee', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 md:w-6 md:h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors group-hover:border-purple-400 ${
                          formData.addNominee 
                            ? 'bg-[#609968] border-[#609968]' 
                            : 'border-[#e0e0e0] bg-white'
                        }`}
                      >
                        {formData.addNominee && (
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        )}
                      </div>
                      <span className="text-[#5a5555] text-sm md:text-base font-medium">I want to add a nominee.</span>
                    </label>
                  </div>

                  {/* Conditional Nominee Fields */}
                  {formData.addNominee && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Nominee Name *</label>
                        <input
                          type="text"
                          value={formData.nomineeName}
                          onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                          autoComplete="off"
                          className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                            errors.nomineeName ? 'border-red-300 focus:ring-red-500' : ''
                          }`}
                          placeholder="Enter nominee's full name"
                          required={formData.addNominee}
                        />
                        {errors.nomineeName && (
                          <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                            <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                            {errors.nomineeName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[#5a5555] text-sm md:text-base font-medium mb-2 md:mb-3">Nominee Aadhaar No *</label>
                        <input
                          type="text"
                          value={formData.nomineeAadhaar}
                          onChange={(e) => handleInputChange('nomineeAadhaar', formatInput('nomineeAadhaar', e.target.value))}
                          autoComplete="off"
                          className={`w-full px-4 md:px-5 py-3 md:py-4 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b76cb8] focus:border-transparent text-sm md:text-base transition-all duration-200 ${
                            errors.nomineeAadhaar ? 'border-red-300 focus:ring-red-500' : ''
                          }`}
                          placeholder="Enter nominee's Aadhaar number"
                          required={formData.addNominee}
                        />
                        {errors.nomineeAadhaar && (
                          <p className="text-xs md:text-sm text-red-600 flex items-center mt-1">
                            <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                            {errors.nomineeAadhaar}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 md:pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 md:py-5 text-white text-lg md:text-xl font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "#b76cb8" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
