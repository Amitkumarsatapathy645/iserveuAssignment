import React, { useState } from 'react';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/Alert';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [students, setStudents] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setStatus(null);
    } else {
      setStatus({ 
        type: 'error', 
        message: 'Please select a valid Excel (.xlsx) file' 
      });
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        console.log('Attempting to upload file to backend...');
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        console.log('Backend response status:', response.status);
        
        if (response.ok) {
            console.log('File upload successful');
            setStatus({ 
                type: 'success', 
                message: 'File uploaded successfully!' 
            });
            fetchStudents();
        } else {
            console.error('Upload failed with status:', response.status);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        setStatus({ 
            type: 'error', 
            message: 'Error uploading file. Please try again.' 
        });
    } finally {
        setUploading(false);
    }
};

  // Fetch student data
  const fetchStudents = async () => {
    try {
        console.log('Fetching students from backend...');
        const response = await fetch('http://localhost:3000/api/students');
        console.log('Students fetch response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Received students data:', data);
            setStudents(data);
        } else {
            console.error('Failed to fetch students');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            iServeU Assignment
          </h1>
          <p className="text-lg text-gray-600">
            Upload your student data Excel file
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <label className={`
                flex flex-col items-center justify-center w-full h-64
                border-2 border-dashed rounded-lg cursor-pointer
                transition-colors duration-300
                ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!file ? (
                    <>
                      <Upload className="w-12 h-12 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">Excel files only (.xlsx)</p>
                    </>
                  ) : (
                    <>
                      <FileUp className="w-12 h-12 mb-4 text-green-500" />
                      <p className="text-sm text-green-600 font-medium">{file.name}</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
              </label>

              {status && (
                <Alert variant={status.type === 'success' ? 'success' : 'destructive'}>
                  {status.type === 'success' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{status.message}</AlertDescription>
                </Alert>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`
                  w-full mt-4 px-4 py-3 rounded-md text-white font-medium
                  transition-colors duration-300
                  ${!file || uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {students.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Uploaded Students</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mark</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{student.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{student.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{student.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{student.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;