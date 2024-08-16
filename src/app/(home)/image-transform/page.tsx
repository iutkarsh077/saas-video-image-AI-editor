"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@nextui-org/react";


const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  };


  type SocialFormat = keyof typeof socialFormats;

const SocialShare = () => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
      if(uploadedImage){
          setIsTransforming(true);
      }
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/image-upload", {
            method: "POST",
            body: formData
        })

        if(!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        setUploadedImage(data.publicId);


    } catch (error) {
        console.log(error)
        toast({
          title: "Failed to Upload Image.",
          description: "Please try after Sometime",
        })
    } finally{
        setIsUploading(false);
    }
};

const handleDownload = async () => {
  if (!imageRef.current) return;

  setIsDownloadClicked(true);

  try {
    const response = await fetch(imageRef.current.src);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
    toast({
      title: "Please try again after sometime",
      duration: 2000
    })
  } finally {
    setIsDownloadClicked(false);
  }
};

  return (
<div className="container mx-auto p-8 max-w-3xl">
  <h1 className="text-5xl font-bold mb-10 text-center text-gray-300">
    AI Image Formatter
  </h1>

  <div className="bg-gray-300 shadow-lg rounded-xl p-8">
    <h2 className="text-3xl font-medium mb-6 text-gray-700">Upload an Image</h2>
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-600 mb-2">
        Choose an image file
      </label>
      <input
        type="file"
        onChange={handleFileUpload}
        className="block w-full text-lg text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    {isUploading && (
      <div className="mb-8">
        <progress className="w-full h-3 rounded-full bg-gray-200">
          {/* Progress bar placeholder */}
        </progress>
      </div>
    )}

    {uploadedImage && (
      <div>
        <h2 className="text-3xl font-medium mb-6 text-gray-700">Select Social Media Format</h2>
        <div className="mb-8">
          <select
            className="block w-full p-3 text-lg text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
          >
            {Object.keys(socialFormats).map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-600">Preview:</h3>
          <div className="flex justify-center bg-white p-6 rounded-lg shadow-inner">
            {isTransforming && (
               <Progress
               size="sm"
               isIndeterminate
               aria-label="Loading..."
               className="w-full"
               color="secondary"
             />
            )}
            <CldImage
              width={socialFormats[selectedFormat].width}
              height={socialFormats[selectedFormat].height}
              src={uploadedImage}
              sizes="100vw"
              alt="transformed image"
              crop="fill"
              aspectRatio={socialFormats[selectedFormat].aspectRatio}
              gravity="auto"
              ref={imageRef}
              onLoad={() => setIsTransforming(false)}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        <button
              onClick={handleDownload}
              disabled={isDownloadClicked}
              className={`px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow focus:outline-none focus:ring-2 ${isDownloadClicked ? "bg-purple-500" : "hover:bg-purple-700"}`}
            >
              {isDownloadClicked ? "Please Wait" : `Download for ${selectedFormat}`}
            </button>
      </div>
    )}
  </div>
</div>

  )
}

export default SocialShare
