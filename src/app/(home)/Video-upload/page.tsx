"use client";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Overflow",
        description: "File size is much bigger than expected, 70 MB is limit",
        duration: 2000,
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      //Handle error if somethin went wrong
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Slow internet issue",
        description: "Please try agian after some time",
        duration: 2000,
      });
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 lg:ml-52 lg:mr-52">
  <h1 className="text-2xl font-bold mb-6 text-center">
    AI Video Compresser
  </h1>
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-white font-medium">
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>
    <div>
      <label className="block text-white font-medium">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        rows={4}
      ></textarea>
    </div>
    <div>
      <label className="block text-white font-medium">
        Video File
      </label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>
    <div className="text-center sm:text-left">
      <button
        type="submit"
        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  </form>
</div>

  );
};

export default VideoUpload;
