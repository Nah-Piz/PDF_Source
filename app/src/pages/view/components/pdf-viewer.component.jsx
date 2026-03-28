import { useState, useRef } from "react";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";

const PDFViewer = ({ pdfUrl, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* PDF Toolbar */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="hover:bg-gray-800 p-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">PDF Viewer</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScale((prev) => Math.min(prev + 0.25, 2))}
            className="hover:bg-gray-800 p-2 rounded-lg"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((prev) => Math.max(prev - 0.25, 0.5))}
            className="hover:bg-gray-800 p-2 rounded-lg"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="hover:bg-gray-800 p-2 rounded-lg"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto bg-gray-800">
        <div className="flex justify-center p-8">
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="bg-white shadow-2xl"
            style={{
              width: `${scale * 100}%`,
              height: "calc(100vh - 120px)",
              minHeight: "600px",
            }}
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
