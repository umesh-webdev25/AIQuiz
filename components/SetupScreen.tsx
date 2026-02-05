import React, { useState } from 'react';
import { Settings, Play, FileText, Type } from 'lucide-react';
import FileUpload from './FileUpload';
import ConfigSlider from './ConfigSlider';
import { QuizConfig } from '../types';

interface SetupScreenProps {
  config: QuizConfig;
  setConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  inputMode: 'file' | 'text';
  setInputMode: (mode: 'file' | 'text') => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  config,
  setConfig,
  selectedFile,
  onFileSelect,
  textInput,
  setTextInput,
  inputMode,
  setInputMode,
  onGenerate,
  isGenerating
}) => {
  
  const updateQuestions = (val: number) => setConfig(prev => ({ ...prev, numQuestions: val }));
  const updateTime = (val: number) => setConfig(prev => ({ ...prev, timePerQuestion: val }));

  const isReady = inputMode === 'file' ? !!selectedFile : textInput.trim().length > 50;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">AIQuiz</h1>
        <p className="text-slate-500 text-lg">
          Turn any PDF or Text into an interactive knowledge check instantly.
        </p>
      </div>

      <div className="bg-white w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Input Type Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setInputMode('file')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
              inputMode === 'file' 
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload File
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
              inputMode === 'text' 
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4 mr-2" />
            Paste Text
          </button>
        </div>

        <div className="p-6 sm:p-8 border-b border-slate-100 border-dashed">
          {inputMode === 'file' ? (
            <FileUpload onFileSelect={onFileSelect} selectedFile={selectedFile} />
          ) : (
            <div className="w-full">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your study notes, article, or text here..."
                className="w-full h-48 p-4 rounded-xl border border-slate-300 bg-slate-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-none placeholder:text-slate-400"
              ></textarea>
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${textInput.length > 0 && textInput.length < 50 ? 'text-red-400' : 'text-slate-400'}`}>
                  {textInput.length} chars (min 50)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 bg-white">
          <div className="flex items-center mb-6 text-slate-800">
            <Settings className="w-5 h-5 mr-2 text-emerald-500" />
            <h2 className="font-semibold text-lg">Quiz Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ConfigSlider
              label="Number of Questions"
              value={config.numQuestions}
              onChange={updateQuestions}
              min={3}
              max={50}
              displayValue={config.numQuestions}
            />
            <ConfigSlider
              label="Time per Question"
              value={config.timePerQuestion}
              onChange={updateTime}
              min={10}
              max={120}
              step={5}
              unit="s"
              displayValue={`${config.timePerQuestion}s`}
            />
          </div>

          <button
            onClick={onGenerate}
            disabled={!isReady || isGenerating}
            className={`
              w-full flex items-center justify-center py-4 rounded-xl text-lg font-semibold transition-all duration-200
              ${isReady && !isGenerating
                ? 'bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 shadow-sm hover:shadow-md' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2 fill-current" />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;