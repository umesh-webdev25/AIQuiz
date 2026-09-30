import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import { Loader2, Play, Send, Lightbulb, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Menu, List, Code2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CodingWorkspace() {
  const [searchParams] = useSearchParams();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const topic = searchParams.get('topic');

  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Layout State
  const [activeTab, setActiveTab] = useState('description');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Editor State
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  
  // Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // AI State
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Generator State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genTopic, setGenTopic] = useState("");
  const [customGenTopic, setCustomGenTopic] = useState("");
  const [genDifficulty, setGenDifficulty] = useState("Mixed");
  const [genCount, setGenCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const predefinedTopics = [
    "Array", "String", "Linked List", "HashMap", "Stack", 
    "Queue", "Binary Search", "Sorting", "Recursion", "Dynamic Programming"
  ];

  useEffect(() => {
    fetchData();
  }, [topic]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRunCode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [probRes, progRes] = await Promise.all([
        api.get(`/coding/problems?topic=${topic || ''}`),
        api.get('/coding/progress')
      ]);
      setProblems(probRes.data);
      setProgress(progRes.data);
      
      if (probRes.data.length > 0) {
        selectProblem(probRes.data[0]);
      } else {
        setShowGenerateModal(true);
      }
    } catch (error) {
      toast.error('Failed to fetch coding workspace data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    const finalTopic = genTopic === "custom" ? customGenTopic : genTopic;
    if (!finalTopic) {
      toast.error("Please select or enter a topic");
      return;
    }
    setIsGenerating(true);
    try {
      await api.post("/coding/problems/generate", {
        topic: finalTopic,
        difficulty: genDifficulty,
        count: Number(genCount),
      });
      toast.success(`Generated ${genCount} problems successfully!`);
      setShowGenerateModal(false);
      navigate(`/coding/workspace?topic=${encodeURIComponent(finalTopic)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate problems");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectProblem = (prob) => {
    setActiveProblem(prob);
    setCode(prob.starterCode[language] || '');
    setTestResult(null);
    setHint('');
    setExplanation('');
    setActiveTab('description');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (activeProblem && activeProblem.starterCode[lang]) {
      setCode(activeProblem.starterCode[lang]);
    }
  };

  const handleRunCode = async () => {
    if (!activeProblem || isExecuting) return;
    setIsExecuting(true);
    setTestResult(null);
    try {
      const tc = activeProblem.testCases[0];
      const res = await api.post('/coding/run', {
        problemId: activeProblem._id,
        language,
        code,
        input: tc.input
      });
      setTestResult({
        type: 'run',
        success: res.data.success,
        stdout: res.data.stdout,
        stderr: res.data.stderr,
        expected: tc.expectedOutput,
        executionTime: res.data.executionTime,
        memory: res.data.memory
      });
    } catch (error) {
      toast.error("Execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeProblem || isExecuting) return;
    setIsExecuting(true);
    setTestResult(null);
    try {
      const res = await api.post('/coding/submit', {
        problemId: activeProblem._id,
        language,
        code
      });
      setTestResult({
        type: 'submit',
        status: res.data.status,
        passed: res.data.passed,
        total: res.data.total,
        message: res.data.message,
        stdout: res.data.stdout,
        stderr: res.data.stderr,
        runtime: res.data.runtime,
        memory: res.data.memory
      });
      api.get('/coding/progress').then(res => setProgress(res.data));
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const getHint = async () => {
    if (!activeProblem) return;
    setIsAiLoading(true);
    try {
      const res = await api.post('/coding/hint', { problemId: activeProblem._id, code, language });
      setHint(res.data.hint);
    } catch (error) {
      toast.error("Failed to get hint");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getExplanation = async () => {
    if (!activeProblem) return;
    setIsAiLoading(true);
    try {
      const res = await api.post('/coding/explain', { problemId: activeProblem._id, code, language });
      setExplanation(res.data.explanation);
    } catch (error) {
      toast.error("Failed to get explanation");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getProblemStatus = (id) => {
    const p = progress.find(x => x.problem._id === id || x.problem === id);
    if (!p) return 'not_started';
    return p.status;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)] bg-gray-50 dark:bg-[#181818]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  const solvedCount = progress.filter(p => p.status === 'solved').length;
  const totalCount = problems.length;

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-50 dark:bg-[#181818] text-gray-600 dark:text-gray-300 overflow-hidden font-sans w-full absolute left-0 top-14 z-0">
      
      {/* Problem List Sidebar (Collapsible) */}
      {isSidebarOpen && (
        <div className="w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-[#333] flex flex-col shrink-0 transition-all z-10 h-full shadow-2xl absolute md:relative">
          <div className="p-4 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800 dark:text-gray-100 uppercase text-xs tracking-wider">{topic || 'ALL'} PROBLEMS</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 mt-1">{solvedCount} / {totalCount} Solved</div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {problems.map((prob, idx) => {
              const status = getProblemStatus(prob._id);
              return (
                <button
                  key={prob._id}
                  onClick={() => selectProblem(prob)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:bg-[#2a2a2a] transition-colors ${activeProblem?._id === prob._id ? 'bg-gray-50 dark:bg-[#252525] border-l-2 border-l-orange-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <div>
                    {status === 'solved' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : status === 'attempted' ? (
                      <div className="w-4 h-4 rounded-full border-2 border-orange-500" />
                    ) : (
                      <div className="w-4 h-4 text-gray-500 dark:text-gray-400 font-mono text-xs text-center">{idx + 1}</div>
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <div className={`font-medium text-sm truncate ${activeProblem?._id === prob._id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{prob.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{prob.difficulty}</div>
                  </div>
                </button>
              );
            })}
            
            <div className="p-4 border-t border-gray-200 dark:border-[#333]">
              <button 
                onClick={() => setShowGenerateModal(true)}
                className="w-full py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded flex items-center justify-center gap-2 font-medium text-sm transition-colors border border-orange-200 dark:border-orange-900/50"
              >
                <Plus className="w-4 h-4" /> Generate New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Pane Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 gap-2">
        
        {/* Left Pane: Problem Description */}
        <div className="w-full md:w-[45%] flex flex-col bg-white dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-[#333] overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center bg-gray-50 dark:bg-[#252525] px-2 py-1 border-b border-gray-200 dark:border-[#333]">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 mr-2 text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-200 dark:bg-[#333] rounded" title="Problem List">
                <List className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1.5 text-sm font-medium rounded-t-md transition-colors ${activeTab === 'description' ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white border-t-2 border-orange-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:bg-[#333]'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('editorial')}
              className={`px-3 py-1.5 text-sm font-medium rounded-t-md transition-colors ${activeTab === 'editorial' ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white border-t-2 border-orange-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:bg-[#333]'}`}
            >
              Editorial
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed">Solutions</button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed">Submissions</button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {activeProblem && activeTab === 'description' && (
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">{activeProblem.title}</h1>
                  {getProblemStatus(activeProblem._id) === 'solved' && <span className="text-green-500 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Solved</span>}
                </div>
                
                <div className="flex gap-2 mb-6">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-[#2a2a2a] ${activeProblem.difficulty === 'Easy' ? 'text-green-400' : activeProblem.difficulty === 'Medium' ? 'text-orange-400' : 'text-red-400'}`}>
                    {activeProblem.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                    {activeProblem.topic}
                  </span>
                </div>

                <div className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap mb-8">
                  {activeProblem.description}
                </div>

                <div className="space-y-6 mb-8">
                  {activeProblem.examples.map((ex, i) => (
                    <div key={i}>
                      <div className="font-bold text-gray-700 dark:text-gray-200 mb-2">Example {i + 1}:</div>
                      <div className="bg-gray-50 dark:bg-[#252525] rounded-md p-4 border-l-2 border-orange-500/50 text-gray-600 dark:text-gray-300 font-mono text-sm shadow-inner">
                        <div className="mb-1"><strong className="text-gray-900 dark:text-white">Input:</strong> {ex.input}</div>
                        <div className="mb-1"><strong className="text-gray-900 dark:text-white">Output:</strong> {ex.output}</div>
                        {ex.explanation && <div className="text-gray-500 dark:text-gray-400 dark:text-gray-400 mt-2"><strong className="text-gray-600 dark:text-gray-300">Explanation:</strong> {ex.explanation}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <div className="font-bold text-gray-700 dark:text-gray-200 mb-3">Constraints:</div>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i} className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm">
                        <code className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono text-xs">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compact AI Assistance */}
                <div className="mt-8 border border-orange-500/20 bg-orange-500/5 rounded-lg overflow-hidden">
                  <div className="bg-orange-500/10 px-4 py-2 border-b border-orange-500/10 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-sm text-orange-200">AI Assistance</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 mb-3">Need help with this problem? Our AI can guide you without giving away the answer immediately.</p>
                    <div className="flex gap-2">
                      <button onClick={getHint} disabled={isAiLoading} className="px-3 py-1.5 bg-gray-50 dark:bg-[#252525] hover:bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-200 text-xs font-medium rounded border border-gray-300 dark:border-[#444] transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isAiLoading && !hint && !explanation ? <Loader2 className="w-3 h-3 animate-spin" /> : "Get Hint"}
                      </button>
                      <button onClick={getExplanation} disabled={isAiLoading} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-gray-900 dark:text-white text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isAiLoading && !hint && !explanation ? <Loader2 className="w-3 h-3 animate-spin" /> : "Explain Solution"}
                      </button>
                    </div>

                    {hint && (
                      <div className="mt-3 p-3 bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md">
                        <strong className="text-orange-400 text-xs block mb-1">Hint:</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-300 m-0">{hint}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeProblem && activeTab === 'editorial' && (
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Editorial & Solution</h2>
                {explanation ? (
                   <div className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">{explanation}</div>
                ) : (
                   <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center py-10 gap-3">
                     <Lightbulb className="w-10 h-10 text-gray-600" />
                     <p>Generate an AI explanation from the Description tab to see it here.</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code & Test Results */}
        <div className="w-full md:w-[55%] flex flex-col rounded-lg overflow-hidden gap-2">
          
          {/* Editor Block */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden relative">
            {/* Editor Toolbar */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#252525] px-3 py-1.5 border-b border-gray-200 dark:border-[#333]">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-xs font-bold flex items-center gap-1">&lt;/&gt; Code</span>
                <select 
                  value={language} 
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-200 dark:bg-[#333] hover:bg-gray-300 dark:bg-[#444] text-gray-700 dark:text-gray-200 text-xs rounded px-2 py-1 border border-transparent focus:border-gray-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleRunCode} disabled={isExecuting} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:bg-[#3a3a3a] text-gray-600 dark:text-gray-300 text-xs font-medium rounded border border-gray-300 dark:border-[#444] transition-colors disabled:opacity-50 group" title="Ctrl + Enter">
                  <Play className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 dark:text-gray-400 group-hover:text-green-500 transition-colors" /> Run
                </button>
                <button onClick={handleSubmit} disabled={isExecuting} className="flex items-center gap-1.5 px-3 py-1 bg-green-600/90 hover:bg-green-500 text-gray-900 dark:text-white text-xs font-medium rounded transition-colors disabled:opacity-50" title="Ctrl + Shift + Enter">
                  <Send className="w-3 h-3" /> Submit
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: "all",
                  hideCursorInOverviewRuler: true,
                  overviewRulerBorder: false,
                }}
              />
            </div>
          </div>

          {/* Test Results Panel */}
          <div className="h-[35%] bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-lg flex flex-col overflow-hidden shrink-0">
            <div className="flex items-center bg-gray-50 dark:bg-[#252525] px-3 py-1.5 border-b border-gray-200 dark:border-[#333]">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-xs font-bold">Testcase | Test Result</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-sm">
              {isExecuting ? (
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 dark:text-gray-400 h-full justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Executing code...
                </div>
              ) : !testResult ? (
                <div className="text-gray-500 dark:text-gray-400 flex h-full items-center justify-center text-xs">Run or Submit your code to see results.</div>
              ) : testResult.type === 'run' ? (
                <div className="space-y-4">
                  <div className={`font-bold text-base flex items-center gap-2 ${testResult.success ? 'text-green-500' : 'text-red-500'}`}>
                    {testResult.success ? 'Accepted' : 'Runtime Error'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Stdout</div>
                    <div className="bg-gray-100 dark:bg-[#111111] p-2 rounded text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{testResult.stdout || 'No output'}</div>
                  </div>
                  
                  {testResult.stderr && (
                    <div className="space-y-1">
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Stderr</div>
                      <div className="bg-red-50 dark:bg-[#2a1111] p-2 rounded text-red-400 whitespace-pre-wrap">{testResult.stderr}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`font-bold text-xl flex items-center gap-2 ${testResult.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    {testResult.status}
                  </div>
                  
                  <div className="text-sm">
                    <span className={testResult.status === 'Accepted' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{testResult.passed}</span>
                    <span className="text-gray-500 dark:text-gray-400"> / {testResult.total} Test Cases Passed</span>
                  </div>

                  {testResult.status !== 'Accepted' && (
                    <div className="space-y-3">
                      <div className="bg-red-50 dark:bg-[#2a1111] p-3 rounded border border-red-900/30">
                        <div className="text-red-400 text-xs mb-1">Error Details</div>
                        <div className="text-red-300">{testResult.message}</div>
                      </div>
                      
                      {(testResult.stdout || testResult.stderr) && (
                        <div className="space-y-1">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Output on failed test case:</div>
                          <div className="bg-gray-100 dark:bg-[#111111] p-3 rounded">
                            {testResult.stdout && <div className="mb-2 text-gray-600 dark:text-gray-300"><strong>Stdout:</strong><br/>{testResult.stdout}</div>}
                            {testResult.stderr && <div className="text-red-400"><strong>Stderr:</strong><br/>{testResult.stderr}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {testResult.status === 'Accepted' && (
                    <div className="flex gap-4 mt-2">
                      <div className="bg-gray-50 dark:bg-[#252525] px-3 py-1.5 rounded flex items-center gap-2 border border-gray-200 dark:border-[#333]">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Runtime:</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{testResult.runtime}</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#252525] px-3 py-1.5 rounded flex items-center gap-2 border border-gray-200 dark:border-[#333]">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Memory:</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{testResult.memory}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #404040;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-[#333]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#333]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-orange-500" /> 
                Generate Coding Problems
              </h2>
              {problems.length > 0 && (
                <button onClick={() => setShowGenerateModal(false)} disabled={isGenerating} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>
            
            <div className="p-6">
              {isGenerating ? (
                <div className="text-center py-10">
                  <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Generating problems...</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Generating {genCount} {genTopic === "custom" ? customGenTopic : genTopic} Problems</p>
                  <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-[#333] rounded-full h-2 overflow-hidden">
                    <div className="bg-orange-500 h-2 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">What do you want to practice?</label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedTopics.map(t => (
                        <button key={t} onClick={() => setGenTopic(t)} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${genTopic === t ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : 'border-gray-200 dark:border-[#444] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}>
                          {t}
                        </button>
                      ))}
                      <button onClick={() => setGenTopic("custom")} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${genTopic === "custom" ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : 'border-gray-200 dark:border-[#444] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}>
                        Custom Topic...
                      </button>
                    </div>
                    {genTopic === "custom" && (
                      <input type="text" value={customGenTopic} onChange={e => setCustomGenTopic(e.target.value)} placeholder="Enter your own topic" className="mt-3 w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-[#444] bg-transparent text-gray-900 dark:text-white focus:border-orange-500 outline-none" />
                    )}
                  </div>

                  <div className="flex gap-8">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Difficulty</label>
                      <div className="flex gap-3">
                        {["Easy", "Medium", "Hard", "Mixed"].map(diff => (
                          <label key={diff} className="flex items-center gap-1.5 cursor-pointer text-sm">
                            <input type="radio" name="difficulty" value={diff} checked={genDifficulty === diff} onChange={() => setGenDifficulty(diff)} className="text-orange-500 focus:ring-orange-500" />
                            <span className="text-gray-700 dark:text-gray-300">{diff}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Number of Problems</label>
                      <input type="number" min="1" max="20" value={genCount} onChange={e => setGenCount(e.target.value)} className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-[#444] bg-transparent text-gray-900 dark:text-white focus:border-orange-500 outline-none" />
                    </div>
                  </div>
                  
                  <button onClick={handleGenerate} disabled={!genTopic || (genTopic === 'custom' && !customGenTopic) || genCount < 1 || genCount > 20} className="w-full py-3 mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                    <Code2 className="w-5 h-5" /> Generate Problems
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
