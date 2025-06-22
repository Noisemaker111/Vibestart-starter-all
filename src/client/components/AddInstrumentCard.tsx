import { useState } from "react";
import { UploadButton } from "@client/utils/uploadthing";
import { CreateInstrumentSchema, type UploadedFile } from "@shared/schema";

interface AddInstrumentCardProps {
  onSubmit: (name: string, imageUrl: string) => Promise<void>;
  error?: string | null;
}

export function AddInstrumentCard({ onSubmit, error }: AddInstrumentCardProps) {
  const [newInstrumentName, setNewInstrumentName] = useState("");
  const [newInstrumentImage, setNewInstrumentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setValidationError(null);
      setIsSubmitting(true);
      
      // Validate form data using Zod schema
      const formData = CreateInstrumentSchema.parse({
        name: newInstrumentName.trim(),
        image_url: newInstrumentImage,
      });

      await onSubmit(formData.name, formData.image_url);
      
      // Reset form on success
      setNewInstrumentName("");
      setNewInstrumentImage(null);
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError("Invalid form data");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayError = validationError || error;

  return (
    <div className="mb-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header with gradient accent */}
      <div className="relative px-8 pt-8 pb-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Add New Instrument
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload an image and give your instrument a name</p>
      </div>
      
      <div className="px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Upload Section */}
          <div className="lg:w-2/5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-3">
              Instrument Photo
            </label>
            
            {newInstrumentImage ? (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 p-2">
                  <img
                    src={newInstrumentImage}
                    alt="Instrument preview"
                    className="w-full h-48 object-cover rounded-lg shadow-inner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg m-2">
                    <button
                      onClick={() => setNewInstrumentImage(null)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group/btn"
                      type="button"
                    >
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover/btn:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Click the trash icon to remove</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-10 blur-xl"></div>
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button: "relative w-full h-48 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer group overflow-hidden",
                    allowedContent: "hidden",
                    container: "w-full"
                  }}
                  content={{
                    button: (
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drop your image here</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">or click to browse</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">PNG, JPG up to 4MB</p>
                      </div>
                    ),
                  }}
                  onClientUploadComplete={(res: UploadedFile[] | undefined) => {
                    if (res && res.length > 0) {
                      setNewInstrumentImage(res[0].url);
                      setValidationError(null);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setValidationError(`Upload error: ${error.message}`);
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Name Input Section */}
          <div className="flex-1">
            <label htmlFor="instrument-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-3">
              Instrument Name
            </label>
            <div className="relative">
              <input
                id="instrument-name"
                type="text"
                value={newInstrumentName}
                onChange={(e) => setNewInstrumentName(e.target.value)}
                placeholder="e.g., Fender Stratocaster, Yamaha Grand Piano..."
                className="w-full px-5 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSubmit()}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className={`w-5 h-5 transition-colors duration-200 ${newInstrumentName ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!newInstrumentName.trim() || !newInstrumentImage || isSubmitting}
              className="mt-6 w-full relative group overflow-hidden rounded-xl px-6 py-4 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
            >
              <div className={`absolute inset-0 transition-all duration-300 ${
                !newInstrumentName.trim() || !newInstrumentImage || isSubmitting
                  ? 'bg-gray-400 dark:bg-gray-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700'
              }`}></div>
              
              <div className="relative flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding Instrument...</span>
                  </>
                ) : (
                  <>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${
                      !newInstrumentName.trim() || !newInstrumentImage ? '' : 'group-hover:rotate-90'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Add Instrument</span>
                  </>
                )}
              </div>
              
              {/* Shimmer effect */}
              {!isSubmitting && newInstrumentName.trim() && newInstrumentImage && (
                <div className="absolute inset-0 -top-2 h-[102%] w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              )}
            </button>
          </div>
        </div>

        {/* Error display */}
        {displayError && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-400">{displayError}</p>
          </div>
        )}
      </div>
    </div>
  );
} 