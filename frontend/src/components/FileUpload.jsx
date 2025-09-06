import { useDropzone } from "react-dropzone";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export function FileUpload({ uploadedFile, setUploadedFile, clear }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file); // salva o arquivo
        clear(); 
      }
    },
    accept: { "text/plain": [".txt"], "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDropRejected: () => {
      toast.error("Formato não suportado. Use apenas .txt ou .pdf");
    },
  });

  return (
    <div>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <Upload size={48} className="upload-icon" />
          <div className="dropzone-text">
            {isDragActive ? "Solte o ficheiro aqui" : "Clique ou arraste um ficheiro"}
          </div>
          <div className="dropzone-subtext">Formatos suportados: .txt, .pdf</div>
        </div>
      </div>

      {uploadedFile && (
        <div className="file-info">
          <strong>Ficheiro selecionado:</strong> {uploadedFile.name} (
          {(uploadedFile.size / 1024).toFixed(1)} KB)
          <Trash2
            size={16}
            className="clear-file-icon"
            onClick={() => setUploadedFile(null)}
          />
        </div>
      )}
    </div>
  );
}
