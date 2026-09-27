import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quiz/${id}`);
        // If quiz is already submitted, redirect to results
        if (data.questions[0].userAnswer) {
          navigate(`/results/${id}`, { replace: true });
        } else {
          setQuiz(data);
          setAnswers(new Array(data.questions.length).fill(null));
        }
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSelectOption = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      return toast.error('Please answer all questions before submitting.');
    }
    
    setSubmitting(true);
    const loadingToast = toast.loading('Submitting your answers...');
    
    try {
      await api.post(`/quiz/${id}/submit`, { answers });
      toast.success('Quiz submitted successfully!', { id: loadingToast });
      navigate(`/results/${id}`);
    } catch (err) {
      toast.error('Failed to submit quiz', { id: loadingToast });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your quiz...</p>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{quiz.topic} Quiz</h2>
          <p className="text-gray-500 text-sm">Question {currentQuestion + 1} of {quiz.totalQuestions}</p>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium text-sm">
          {quiz.difficulty}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
          {question.questionText}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[currentQuestion] === option 
                  ? 'border-orange-600 bg-orange-50 text-orange-900' 
                  : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  answers[currentQuestion] === option ? 'border-orange-600' : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === option && <div className="w-3 h-3 bg-orange-600 rounded-full" />}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-70 transition-colors"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
