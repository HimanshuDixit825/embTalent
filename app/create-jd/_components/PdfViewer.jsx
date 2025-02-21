"use client";
export default function PdfViewer({ url, onBack }) {
  return (
    <div className="w-full h-[calc(100vh-6rem)] bg-[#3C3C3C] rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center bg-[#646464] px-4 py-2">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>
        {/* <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="text-white text-sm">Job Description PDF</h3>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        Open in new tab
                    </a>
                </div> */}
        <div className="flex-1 w-full">
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&embedded=true`}
            className="w-full h-full hide-scrollbar"
            style={{
              border: "none",
              overflow: "hidden",
            }}
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
}
