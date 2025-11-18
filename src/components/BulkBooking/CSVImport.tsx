"use client";

import { useState } from "react";

interface Entry {
  id: string;
  doctor: string;
  specialization: string;
  dateTime: string;
  patientName: string;
  patientNIC: string;
  patientPhone: string;
  patientEmail: string;
  paymentMethod: string;
  sltPhone: string;
  date: string;
  time: string;
}

interface CSVImportProps {
  onImport: (entries: Entry[]) => void;
}

export default function CSVImport({ onImport }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Entry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const parseCSV = (text: string): Entry[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setErrors(['CSV file is empty or invalid']);
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const entries: Entry[] = [];
    const newErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        newErrors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const entry: any = { id: Date.now().toString() + i };
      
      headers.forEach((header, index) => {
        const key = header.replace(/\s+/g, '');
        entry[key] = values[index] || '';
      });

      if (!entry.doctor || !entry.specialization || !entry.datetime) {
        newErrors.push(`Row ${i + 1}: Missing required fields (Doctor, Specialization, or DateTime)`);
        continue;
      }

      entries.push({
        id: entry.id,
        doctor: entry.doctor || '',
        specialization: entry.specialization || '',
        dateTime: entry.datetime || '',
        patientName: entry.patientname || '',
        patientNIC: entry.patientnic || '',
        patientPhone: entry.patientphone || '',
        patientEmail: entry.patientemail || '',
        paymentMethod: entry.paymentmethod || 'Add to Bill',
        sltPhone: entry.sltphone || '',
        date: entry.date || '',
        time: entry.time || '',
      });
    }

    setErrors(newErrors);
    return entries;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please upload a valid CSV file']);
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setParsedData(parsed);
    };
    
    reader.onerror = () => {
      setErrors(['Error reading file']);
    };
    
    reader.readAsText(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'Doctor',
      'Specialization',
      'DateTime',
      'PatientName',
      'PatientNIC',
      'PatientPhone',
      'PatientEmail',
      'PaymentMethod',
      'SLTPhone',
      'Date',
      'Time'
    ];
    
    const sampleData = [
      'Dr. Saman Perera',
      'Cardiologist',
      '18/11/25 10:00 AM',
      'John Doe',
      '912345678V',
      '+94 77 123 4567',
      'john@example.com',
      'Cash',
      '0342222255',
      '18/11/25',
      '10:00 AM'
    ];

    const csv = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointment_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      setFile(null);
      setParsedData([]);
      setErrors([]);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      {!file && (
        <div className="grid grid-cols-2 gap-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-green-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">Upload CSV File</h3>
            <p className="text-sm text-gray-500 mb-6">
              Import multiple appointments from CSV
            </p>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all">
                Choose File
              </span>
            </label>
            
            <p className="text-xs text-gray-400 mt-4">or drag and drop your CSV file here</p>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-8 text-center bg-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">Download Template</h3>
            <p className="text-sm text-gray-500 mb-6">
              Get CSV template with sample data
            </p>

            <button
              onClick={downloadTemplate}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-all border border-gray-300"
            >
              Download CSV
            </button>
          </div>
        </div>
      )}

      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {parsedData.length} appointments found
                  {errors.length > 0 && ` • ${errors.length} errors`}
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-red-800 mb-2">Validation Errors</p>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {parsedData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Preview ({parsedData.length} appointments)</h3>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Doctor</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Specialization</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Patient Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{entry.doctor}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.specialization}</td>
                    <td className="px-4 py-3 text-gray-800">{entry.patientName || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.dateTime}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.patientPhone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {parsedData.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-800">Ready to Import</p>
              <p className="text-sm text-gray-600">
                {parsedData.length} appointment{parsedData.length > 1 ? 's' : ''} validated
              </p>
            </div>
          </div>

          <button
            onClick={handleImport}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all"
          >
            Import All Appointments
          </button>
        </div>
      )}
    </div>
  );
}