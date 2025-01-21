"use client";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.anki.package": [".apkg"],
    },
  });

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function handleFileRemove() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setStatus("idle");
    setUploadProgress(0);
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    abortControllerRef.current = new AbortController();

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      setStatus("success");
      setUploadProgress(100);
    } catch (error) {
      if (axios.isCancel(error)) {
        setStatus("idle");
      } else {
        setStatus("error");
      }
      setUploadProgress(0);
    } finally {
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10 h-full">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold text-fourth">UPLOAD FILES</h1>
        <p className="text-sm text-fourth">
          Upload anki flashcards (.apkg files)
        </p>
      </div>
      <div
        className="bg-slate-100 h-48 w-[80%] text-third flex flex-col items-center justify-center border-dashed border-2 border-slate-400 rounded-lg"
        {...getRootProps()}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".apkg"
          {...getInputProps()}
        />
        <img src="/upload.svg" alt="Upload Icon" className="h-14 fill-second" />
        <div className="text-center text-wrap">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop your anki deck</p>
          )}
        </div>
        <p>or</p>
        <button className="bg-third text-first p-2 rounded-lg">
          Browse Files
        </button>
      </div>
      <div className="flex flex-col w-[80%] gap-4 text-sm text-fourth">
        <p className="text-left">Uploaded File</p>
        {file && (
          <div className="flex justify-evenly items-center w-full">
            <img src="/anki.svg" alt="Anki Logo" />
            <div className="flex flex-col gap-1 justify-between">
              <p className="line-clamp-1 overflow-hidden">
                {file.name.length > 20
                  ? file.name.slice(0, 20) + ".apkg"
                  : file.name}
              </p>
              <div className="w-full bg-fourth rounded-full h-2.5">
                <div
                  className="bg-third h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            {file && <p>{uploadProgress}%</p>}
            {status !== "success" ? (
              <button onClick={handleFileRemove}>
                <XMarkIcon
                  className={`h-5 ${
                    status === "error" ? "bg-red-500 rounded-full m-1" : ""
                  }`}
                />
              </button>
            ) : (
              <button>
                <CheckBadgeIcon className="h-5 bg-green-500 rounded-full m-1" />
              </button>
            )}
          </div>
        )}
        <button
          className="p-4 bg-third rounded-lg text-first"
          onClick={handleFileUpload}
        >
          Submit
        </button>
        <div className="flex justify-center">
          {status === "uploading" && (
            <p className="text-sm text-fourth">Uploading...</p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-500">Success!</p>
          )}
          {status === "error" && <p className="text-sm text-red-500">Error!</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
