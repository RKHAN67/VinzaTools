import React, { useMemo, useState } from 'react';
import {
  Download,
  Film,
  Music4,
  Scissors,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import { apiFetch } from '../api';

export type MediaTranscoderMode =
  | 'crop-video'
  | 'trim-video'
  | 'video-converter'
  | 'audio-converter'
  | 'mp3-converter'
  | 'mp4-converter'
  | 'mp4-to-mp3'
  | 'video-to-mp3'
  | 'mov-to-mp4'
  | 'mp3-to-ogg'
  | 'video-to-gif'
  | 'mp4-to-gif'
  | 'webm-to-gif'
  | 'mov-to-gif'
  | 'avi-to-gif'
  | 'gif-to-mp4'
  | 'gif-to-apng'
  | 'apng-to-gif'
  | 'gif-maker'
  | 'image-to-gif';

interface MediaTranscoderProps {
  mode: MediaTranscoderMode;
  title?: string;
  description?: string;
}

const MODE_META: Record<
  MediaTranscoderMode,
  { title: string; description: string; accepts: string; output?: string }
> = {
  'crop-video': {
    title: 'Crop Video',
    description: 'Crop a selected video area and export a clean new video.',
    accepts: 'video/*',
    output: 'mp4',
  },
  'trim-video': {
    title: 'Trim Video',
    description: 'Cut a video by start and end time.',
    accepts: 'video/*',
    output: 'mp4',
  },
  'video-converter': {
    title: 'Video Converter',
    description: 'Convert videos to MP4, MOV, WEBM, or GIF.',
    accepts: 'video/*',
  },
  'audio-converter': {
    title: 'Audio Converter',
    description: 'Convert audio files into MP3, WAV, AAC, or OGG.',
    accepts: 'audio/*',
  },
  'mp3-converter': {
    title: 'MP3 Converter',
    description: 'Convert audio files into MP3 for easy playback.',
    accepts: 'audio/*,video/*',
    output: 'mp3',
  },
  'mp4-converter': {
    title: 'MP4 Converter',
    description: 'Convert supported videos into MP4.',
    accepts: 'video/*',
    output: 'mp4',
  },
  'mp4-to-mp3': {
    title: 'MP4 to MP3',
    description: 'Extract audio from MP4 into MP3.',
    accepts: 'video/mp4,video/*',
    output: 'mp3',
  },
  'video-to-mp3': {
    title: 'Video to MP3',
    description: 'Turn a video file into MP3 audio.',
    accepts: 'video/*',
    output: 'mp3',
  },
  'mov-to-mp4': {
    title: 'MOV to MP4',
    description: 'Convert MOV clips into MP4.',
    accepts: '.mov,video/quicktime,video/*',
    output: 'mp4',
  },
  'mp3-to-ogg': {
    title: 'MP3 to OGG',
    description: 'Convert MP3 audio into OGG.',
    accepts: 'audio/mpeg,audio/*',
    output: 'ogg',
  },
  'video-to-gif': {
    title: 'Video to GIF',
    description: 'Turn a video clip into an animated GIF.',
    accepts: 'video/*',
    output: 'gif',
  },
  'mp4-to-gif': {
    title: 'MP4 to GIF',
    description: 'Convert MP4 to an animated GIF.',
    accepts: 'video/mp4,video/*',
    output: 'gif',
  },
  'webm-to-gif': {
    title: 'WEBM to GIF',
    description: 'Convert WEBM clips into GIF.',
    accepts: 'video/webm,video/*',
    output: 'gif',
  },
  'mov-to-gif': {
    title: 'MOV to GIF',
    description: 'Convert MOV clips into GIF.',
    accepts: '.mov,video/quicktime,video/*',
    output: 'gif',
  },
  'avi-to-gif': {
    title: 'AVI to GIF',
    description: 'Convert AVI clips into GIF.',
    accepts: '.avi,video/*',
    output: 'gif',
  },
  'gif-to-mp4': {
    title: 'GIF to MP4',
    description: 'Convert GIF animations into MP4 video.',
    accepts: 'image/gif,image/*',
    output: 'mp4',
  },
  'gif-to-apng': {
    title: 'GIF to APNG',
    description: 'Convert GIF animations into APNG.',
    accepts: 'image/gif,image/*',
    output: 'apng',
  },
  'apng-to-gif': {
    title: 'APNG to GIF',
    description: 'Convert APNG into a GIF animation.',
    accepts: '.png,image/png,image/*',
    output: 'gif',
  },
  'gif-maker': {
    title: 'GIF Maker',
    description: 'Make a GIF from multiple uploaded images.',
    accepts: 'image/*',
    output: 'gif',
  },
  'image-to-gif': {
    title: 'Image to GIF',
    description: 'Turn multiple still images into a GIF.',
    accepts: 'image/*',
    output: 'gif',
  },
};

export const MediaTranscoder = ({
  mode,
  title,
  description,
}: MediaTranscoderProps) => {
  const meta = MODE_META[mode];
  const resolvedTitle = title || meta.title;
  const resolvedDescription = description || meta.description;
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [startTime, setStartTime] = useState('0');
  const [endTime, setEndTime] = useState('10');
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [cropWidth, setCropWidth] = useState('720');
  const [cropHeight, setCropHeight] = useState('720');
  const [fps, setFps] = useState('12');
  const [imageDelay, setImageDelay] = useState('2');
  const [outputFormat, setOutputFormat] = useState(meta.output || 'mp4');

  const acceptsMultiple = mode === 'gif-maker' || mode === 'image-to-gif';

  const outputChoices = useMemo(() => {
    if (mode === 'video-converter') return ['mp4', 'mov', 'webm', 'gif'];
    if (mode === 'audio-converter' || mode === 'mp3-converter')
      return ['mp3', 'wav', 'ogg', 'aac'];
    if (mode === 'gif-to-mp4') return ['mp4'];
    if (mode === 'gif-to-apng') return ['apng'];
    if (mode === 'apng-to-gif') return ['gif'];
    return meta.output ? [meta.output] : ['mp4'];
  }, [meta.output, mode]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files || []);
    setFiles(nextFiles);
    setResultUrl('');
    setResultName('');
    setError('');
  };

  const runConversion = async () => {
    if (!files.length) {
      setError('Upload at least one file first.');
      return;
    }

    setProcessing(true);
    setError('');
    setStatus('Preparing conversion...');
    setResultUrl('');
    setResultName('');

    try {
      const form = new FormData();
      files.forEach((file) => form.append('files', file));
      form.append('preset', mode);
      form.append('outputFormat', outputFormat);
      form.append('startTime', startTime);
      form.append('endTime', endTime);
      form.append('cropX', cropX);
      form.append('cropY', cropY);
      form.append('cropWidth', cropWidth);
      form.append('cropHeight', cropHeight);
      form.append('fps', fps);
      form.append('imageDelay', imageDelay);

      const response = await apiFetch('/api/media/transcode', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Media conversion failed');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const filename =
        response.headers
          .get('content-disposition')
          ?.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i)?.[1]
          ?.replace(/['"]/g, '') || `${mode}.${outputFormat}`;

      setResultUrl(objectUrl);
      setResultName(decodeURIComponent(filename));
      setStatus('Conversion finished successfully.');
    } catch (err: any) {
      setError(err.message || 'Conversion failed.');
      setStatus('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[#130d0d] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-rose-400">
            <Sparkles size={14} />
            Media Workflow
          </div>
          <h2 className="text-3xl font-black text-white">{resolvedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            {resolvedDescription}
          </p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white">
          <Upload size={16} />
          {acceptsMultiple ? 'Upload Files' : 'Upload File'}
          <input
            type="file"
            accept={meta.accepts}
            multiple={acceptsMultiple}
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">Controls</div>

          {(mode === 'trim-video' || mode.includes('gif')) && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Start Time (sec)</span>
                <input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>End Time (sec)</span>
                <input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
                />
              </label>
            </div>
          )}

          {mode === 'crop-video' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Crop X', cropX, setCropX],
                ['Crop Y', cropY, setCropY],
                ['Crop Width', cropWidth, setCropWidth],
                ['Crop Height', cropHeight, setCropHeight],
              ].map(([label, value, setter]) => (
                <label key={label as string} className="space-y-2 text-sm text-slate-300">
                  <span>{label as string}</span>
                  <input
                    value={value as string}
                    onChange={(e) =>
                      (setter as React.Dispatch<React.SetStateAction<string>>)(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
                  />
                </label>
              ))}
            </div>
          )}

          {(mode === 'video-converter' ||
            mode === 'audio-converter' ||
            mode === 'mp3-converter' ||
            mode === 'mp4-converter') && (
            <label className="space-y-2 text-sm text-slate-300">
              <span>Output Format</span>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
              >
                {outputChoices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(mode.includes('gif') || mode === 'image-to-gif') && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>GIF FPS</span>
                <input
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Image Delay (for image GIF)</span>
                <input
                  value={imageDelay}
                  onChange={(e) => setImageDelay(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-rose-500/50"
                />
              </label>
            </div>
          )}

          <button
            onClick={runConversion}
            disabled={processing || !files.length}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === 'crop-video' || mode === 'trim-video' ? (
              <Scissors size={16} />
            ) : mode.includes('audio') || mode.includes('mp3') ? (
              <Music4 size={16} />
            ) : (
              <Wand2 size={16} />
            )}
            {processing ? 'Processing...' : `Run ${resolvedTitle}`}
          </button>

          {status && <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">{status}</div>}
          {error && <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
        </div>

        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">Files & Result</div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0f0a0a] p-4">
            {files.length ? (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('audio') ? (
                        <Music4 className="text-rose-300" size={17} />
                      ) : (
                        <Film className="text-rose-300" size={17} />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-white">{file.name}</div>
                        <div className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-slate-500">
                Upload your source file to begin.
              </div>
            )}
          </div>

          {resultUrl && (
            <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="mb-2 text-sm font-semibold text-white">Ready to download</div>
              <div className="text-sm text-emerald-200">{resultName}</div>
              <a
                href={resultUrl}
                download={resultName}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white"
              >
                <Download size={16} />
                Download Converted File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
