import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Camera, CameraOff, RefreshCw, CheckCircle, AlertCircle, Upload } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PatientResult {
    id: string;
    name: string;
    display_id: string;
    age: number | null;
    sex: string | null;
    blood_type: string | null;
    barangay: string | null;
    allergies: string | null;
    emergency_contact_name: string | null;
    emergency_contact_number: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const extractDisplayId = (raw: string): string | null => {
    // Look for 4 digits, a dash, and 3 digits (e.g., 2026-007)
    // Works for both raw IDs and IDs embedded in URLs (like /2026-007:)
    const match = raw.match(/(\d{4}-\d{3})/);
    return match ? match[1] : null;
};

// ─── QR Scanner Component ─────────────────────────────────────────────────────
interface QRScannerProps {
    onPatientFound?: (patient: PatientResult) => void;
    onClose?: () => void;
    mode?: 'page' | 'modal';
}

const QRScanner: React.FC<QRScannerProps> = ({
    onPatientFound,
    onClose,
    mode = 'modal',
}) => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number>(0);
    const barcodeDetectorRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [camError, setCamError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [scannedRaw, setScannedRaw] = useState<string | null>(null);
    const [extractedId, setExtractedId] = useState<string | null>(null);
    const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle');
    const [patient, setPatient] = useState<PatientResult | null>(null);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [torchOn, setTorchOn] = useState(false);
    // For gallery upload
    const [_uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera');

    const getAuthHeader = () => {
        const session = localStorage.getItem('kka_admin_session');
        if (session) {
            const { token } = JSON.parse(session);
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    };

    // ── Camera setup ───────────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCamError(null);
        setScanning(false);
        setScannedRaw(null);
        setExtractedId(null);
        setLookupState('idle');
        setPatient(null);
        setUploadPreview(null);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            if ('BarcodeDetector' in window) {
                barcodeDetectorRef.current = new (window as any).BarcodeDetector({
                    formats: ['qr_code'],
                });
                setScanning(true);
                startDetectionLoop();
            } else {
                setCamError('QR detection not supported on this browser. Use the "Upload Image" tab instead, or use Chrome on Android/Desktop.');
                setScanning(false);
            }
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setCamError('Camera access denied. Please allow camera permission and try again.');
            } else if (err.name === 'NotFoundError') {
                setCamError('No camera found on this device.');
            } else {
                setCamError('Could not start camera: ' + err.message);
            }
        }
    }, [facingMode]);

    const stopCamera = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setScanning(false);
    }, []);

    // ── Detection loop ─────────────────────────────────────────────────────────
    const startDetectionLoop = () => {
        const detect = async () => {
            if (!videoRef.current || !barcodeDetectorRef.current) return;
            if (videoRef.current.readyState < 2) {
                animFrameRef.current = requestAnimationFrame(detect);
                return;
            }
            try {
                const codes = await barcodeDetectorRef.current.detect(videoRef.current);
                if (codes.length > 0) {
                    const raw = codes[0].rawValue as string;
                    const id = extractDisplayId(raw);
                    
                    // ONLY stop scanning and process if a valid Patient ID is found
                    if (id) {
                        handleDetected(raw, id);
                        return;
                    }
                    
                    // If QR is detected but has no valid ID, we just let the loop continue
                    console.log("QR detected but no valid ID found:", raw);
                }
            } catch (_) {}
            animFrameRef.current = requestAnimationFrame(detect);
        };
        animFrameRef.current = requestAnimationFrame(detect);
    };

    const handleDetected = (raw: string, id: string) => {
        cancelAnimationFrame(animFrameRef.current);
        setScanning(false);
        setScannedRaw(raw);
        setExtractedId(id);
        lookupPatient(id);
    };

    // ── Gallery / Image Upload QR Scan ─────────────────────────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setUploadPreview(objectUrl);
        setLookupState('loading');
        setScannedRaw(null);
        setExtractedId(null);
        setPatient(null);

        if (!('BarcodeDetector' in window)) {
            // Fallback: draw image to canvas and try to read via BarcodeDetector
            setLookupState('error');
            setCamError('QR image scanning not supported in this browser. Try Chrome on Android or desktop.');
            return;
        }

        try {
            const img = new Image();
            img.src = objectUrl;
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Image load failed'));
            });

            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const codes = await detector.detect(img);

            if (codes.length > 0) {
                const raw = codes[0].rawValue as string;
                setScannedRaw(raw);
                const id = extractDisplayId(raw);
                if (id) {
                    setExtractedId(id);
                    lookupPatient(id);
                } else {
                    setLookupState('not_found');
                }
            } else {
                setLookupState('not_found');
                setScannedRaw('No QR code detected in this image.');
            }
        } catch (err: any) {
            console.error('Image QR error:', err);
            setLookupState('error');
        } finally {
            URL.revokeObjectURL(objectUrl);
            // Reset file input so the same file can be re-uploaded
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ── Patient lookup ─────────────────────────────────────────────────────────
    const lookupPatient = async (displayId: string) => {
        setLookupState('loading');
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/mp/manual-lookup/?query=${displayId}`,
                { headers: getAuthHeader() }
            );
            const results: PatientResult[] = res.data;
            if (results && results.length > 0) {
                setPatient(results[0]);
                setLookupState('found');
                stopCamera();
            } else {
                setLookupState('not_found');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setLookupState('not_found');
            } else {
                setLookupState('error');
            }
        }
    };

    const handleConfirm = () => {
        if (!patient) return;
        if (onPatientFound) onPatientFound(patient);
        if (onClose) onClose();
        else navigate('/');
    };

    const handleRescan = () => {
        setUploadPreview(null);
        setScannedRaw(null);
        setExtractedId(null);
        setLookupState('idle');
        setPatient(null);
        if (activeMode === 'camera') startCamera();
    };

    // ── Torch toggle ───────────────────────────────────────────────────────────
    const toggleTorch = async () => {
        if (!streamRef.current) return;
        const track = streamRef.current.getVideoTracks()[0];
        if (!track) return;
        try {
            await track.applyConstraints({ advanced: [{ torch: !torchOn } as any] });
            setTorchOn(t => !t);
        } catch (_) {}
    };

    // ── Flip camera ────────────────────────────────────────────────────────────
    const flipCamera = () => {
        setFacingMode(m => m === 'environment' ? 'user' : 'environment');
    };

    useEffect(() => {
        if (activeMode === 'camera') {
            startCamera();
        } else {
            stopCamera();
            setLookupState('idle');
            setPatient(null);
            setUploadPreview(null);
        }
        return () => {
            cancelAnimationFrame(animFrameRef.current);
            stopCamera();
        };
    }, [facingMode, activeMode]);

    const Wrapper = mode === 'modal'
        ? ({ children }: { children: React.ReactNode }) => (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
                    {children}
                </div>
            </div>
        )
        : ({ children }: { children: React.ReactNode }) => (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
                    {children}
                </div>
            </div>
        );

    return (
        <Wrapper>
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E32636]/10 rounded-xl flex items-center justify-center">
                        <Camera size={16} className="text-[#E32636]" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800 leading-tight">Scan Patient QR</p>
                        <p className="text-[10px] text-slate-400 font-medium">Camera or upload an image</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={() => { stopCamera(); onClose(); }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* ── Mode Toggle ── */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setActiveMode('camera')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${
                        activeMode === 'camera'
                            ? 'text-[#E32636] border-b-2 border-[#E32636]'
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Camera size={14} /> Camera
                </button>
                <button
                    onClick={() => setActiveMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${
                        activeMode === 'upload'
                            ? 'text-[#E32636] border-b-2 border-[#E32636]'
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Upload size={14} /> Upload Image
                </button>
            </div>

            {/* ── Camera viewport (only in camera mode) ── */}
            {activeMode === 'camera' && (
                <div className="relative bg-black aspect-square overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />

                    {scanning && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-52 h-52">
                                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#E32636]/70"
                                    style={{ animation: 'scanline 2s ease-in-out infinite' }}
                                />
                                <style>{`
                                    @keyframes scanline {
                                        0%   { top: 10%; }
                                        50%  { top: 90%; }
                                        100% { top: 10%; }
                                    }
                                `}</style>
                                {(['tl','tr','bl','br'] as const).map(corner => (
                                    <div key={corner} className={`absolute w-8 h-8 border-[#E32636] border-4
                                        ${corner === 'tl' ? 'top-0 left-0 border-r-0 border-b-0 rounded-tl-lg' : ''}
                                        ${corner === 'tr' ? 'top-0 right-0 border-l-0 border-b-0 rounded-tr-lg' : ''}
                                        ${corner === 'bl' ? 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg' : ''}
                                        ${corner === 'br' ? 'bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg' : ''}
                                    `} />
                                ))}
                            </div>
                        </div>
                    )}

                    {scanning && (
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <button onClick={flipCamera}
                                className="w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                title="Flip camera"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button onClick={toggleTorch}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${torchOn ? 'bg-yellow-400 text-black' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'}`}
                                title="Toggle flashlight"
                            >
                                <span className="text-sm">💡</span>
                            </button>
                        </div>
                    )}

                    {camError && (
                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center gap-3">
                            <CameraOff size={32} className="text-slate-500" />
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">{camError}</p>
                            <button onClick={startCamera}
                                className="mt-2 bg-[#E32636] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#C52230] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {lookupState === 'loading' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <p className="text-white text-sm font-bold">Looking up patient…</p>
                            <p className="text-white/60 text-xs font-mono">{extractedId}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Upload Mode Viewport ── */}
            {activeMode === 'upload' && lookupState !== 'found' && (
                <div className="bg-slate-50 aspect-square flex flex-col items-center justify-center gap-4 p-6">
                    {lookupState === 'loading' ? (
                        <>
                            <div className="w-10 h-10 border-2 border-[#E32636] border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm font-bold">Reading QR code…</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-700 text-sm font-bold mb-1">Upload a QR code image</p>
                                <p className="text-slate-400 text-xs">Select a photo or screenshot from your gallery</p>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#E32636] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#C52230] transition-all shadow-lg shadow-red-100"
                            >
                                Choose Image
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            {lookupState === 'not_found' && scannedRaw && (
                                <p className="text-slate-400 text-xs font-mono bg-white border border-slate-200 p-2 rounded-lg break-all text-center">
                                    {scannedRaw}
                                </p>
                            )}
                            {lookupState === 'error' && (
                                <p className="text-red-400 text-xs text-center">Could not scan image. Try a clearer photo.</p>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ── Result panel ── */}
            <div className="px-5 py-4">

                {lookupState === 'idle' && !camError && activeMode === 'camera' && (
                    <p className="text-center text-slate-400 text-xs font-medium py-1">
                        {scanning ? 'Scanning… hold the QR code steady inside the frame.' : 'Starting camera…'}
                    </p>
                )}

                {lookupState === 'idle' && activeMode === 'upload' && (
                    <p className="text-center text-slate-400 text-xs font-medium py-1">
                        Choose a QR image from your device gallery above.
                    </p>
                )}

                {/* Patient found */}
                {lookupState === 'found' && patient && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <p className="text-xs font-black uppercase tracking-wider">Patient Found</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Patient Record</p>
                            <h2 className="text-lg font-black mb-3 text-slate-800">{patient.name}</h2>
                            <div className="grid grid-cols-2 gap-y-2 border-t border-slate-100 pt-3 text-xs">
                                {[
                                    { label: 'Patient ID', value: patient.display_id },
                                    { label: 'Age', value: patient.age ? `${patient.age} yrs` : 'N/A' },
                                    { label: 'Sex', value: patient.sex ? patient.sex.charAt(0).toUpperCase() + patient.sex.slice(1) : 'N/A' },
                                    { label: 'Blood Type', value: patient.blood_type?.toUpperCase() || 'N/A' },
                                    { label: 'Barangay', value: patient.barangay || 'N/A' },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">{label}</span>
                                        <span className="font-bold text-slate-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                            {patient.allergies && patient.allergies !== 'None' && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">⚠ Allergies: </span>
                                    <span className="text-xs text-red-600">{patient.allergies}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleRescan}
                                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Rescan
                            </button>
                            <button onClick={handleConfirm}
                                className="flex-1 bg-[#E32636] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#C52230] transition-all shadow-lg shadow-red-100"
                            >
                                Open Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Not found */}
                {lookupState === 'not_found' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertCircle size={16} />
                            <p className="text-xs font-black uppercase tracking-wider">Patient Not Found</p>
                        </div>
                        {!extractedId && (
                            <p className="text-slate-500 text-xs">
                                Could not find a valid Patient ID. Expected format: <span className="font-mono font-bold">2026-007</span>
                            </p>
                        )}
                        <button onClick={handleRescan}
                            className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Error */}
                {lookupState === 'error' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle size={16} />
                            <p className="text-xs font-black uppercase tracking-wider">Server Error</p>
                        </div>
                        <p className="text-slate-500 text-xs">Could not reach the server. Check your connection and try again.</p>
                        <button onClick={handleRescan}
                            className="w-full bg-[#E32636] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#C52230] transition-all"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default QRScanner;