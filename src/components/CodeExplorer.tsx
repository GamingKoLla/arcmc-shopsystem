import React, { useState } from 'react';
import { PLUGIN_CODEBASE } from '../data/pluginCodebase';
import { PluginFile } from '../types';
import { FileCode, Copy, Check, Download, Folder, FileText, ChevronRight, Package, CheckCircle2 } from 'lucide-react';
import { generatePluginZip, generatePluginJar, downloadBlob } from '../utils/zipExporter';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PluginFile>(PLUGIN_CODEBASE[5]); // ArcEdgeShopSystem.java by default
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingJar, setDownloadingJar] = useState(false);
  const [downloadedJar, setDownloadedJar] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJar = async () => {
    try {
      setDownloadingJar(true);
      const blob = await generatePluginJar();
      downloadBlob(blob, 'ArcEdgeShopSystem-2.6.0.jar');
      setDownloadedJar(true);
      setTimeout(() => setDownloadedJar(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingJar(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const blob = await generatePluginZip();
      downloadBlob(blob, 'ArcEdgeShopSystem-v2.6.0-src.zip');
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#10141e] border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              PRODUCTION JAVA 21 & PAPER 26.X
            </span>
            <span className="text-xs text-slate-400">11 Full Source & Config Files</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2 font-['JetBrains_Mono',monospace]">
            ArcEdgeShopSystem Plugin Codebase
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ready to drop into your Paper server <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">plugins/</code> directory or compile with Maven.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            id="code-explorer-download-jar"
            onClick={handleDownloadJar}
            disabled={downloadingJar}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all border border-emerald-300/40 active:scale-95 disabled:opacity-50"
          >
            {downloadedJar ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>JAR Downloaded!</span>
              </>
            ) : (
              <>
                <Package className={`w-4 h-4 ${downloadingJar ? 'animate-bounce' : ''}`} />
                <span>{downloadingJar ? 'Building JAR...' : 'Download .JAR File'}</span>
              </>
            )}
          </button>

          <button
            id="code-explorer-download-zip"
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip ? 'Packing...' : 'Source (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Tree Sidebar (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0e121a] border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1.5">
              <Folder className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">arcedgeshopsystem/</span>
            </span>
            <span>{PLUGIN_CODEBASE.length} files</span>
          </div>

          <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1">
            {PLUGIN_CODEBASE.map((file) => (
              <button
                key={file.path}
                id={`file-tree-${file.filename.replace(/[^a-zA-Z0-9]/g, '-')}`}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between group ${
                  selectedFile.path === file.path
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                    file.language === 'java' ? 'text-amber-400' :
                    file.language === 'yaml' ? 'text-cyan-400' :
                    file.language === 'xml' ? 'text-rose-400' : 'text-slate-400'
                  }`} />
                  <span className="truncate font-mono">{file.filename}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                  {file.language}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Preview Window (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#090c12] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-white">
                  {selectedFile.path}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {selectedFile.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              id="copy-code-button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Container */}
          <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="font-['JetBrains_Mono',monospace] text-xs text-slate-300 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
