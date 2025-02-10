// Refactored utility to navigate inside a component or custom hook
import { useNavigate } from 'react-router-dom';

// Navigate to a specific path
export const useNavigateTo = (path) => {
  const navigate = useNavigate(); // Use the hook inside the function
  return () => navigate(path); // Return a function to call the navigate hook
};

// Navigate to login page
export const useNavigateToLogin = () => {
  const navigate = useNavigate();
  return () => navigate('/login'); // Redirect to login
};

export const useNavigateToPlay = () => {
  const navigate = useNavigate();

  return (courseId) => {
    if (courseId) {
      navigate('/play', { state: { courseId } }); 
    } else {
      navigate("/login")
    }
  };
};



export const useNavigateToProjects = () => {
  const navigate = useNavigate();

  return (courseId,courseName) => {

    if (!courseId || !courseName) {
      navigate('/'); 
      return;
    }

 
    navigate('/projects', { state: { courseId,courseName } });
  };
};


export const useNavigateToQuizList = () => {
  const navigate = useNavigate();

  return (courseId,courseName) => {

    if (!courseId || !courseName) {
      navigate('/'); 
      return;
    }
    navigate('/quiz_list', { state: { courseId,courseName } });
  };
};



export const useNavigateToQuiz = () => {
  const navigate = useNavigate();

  return (quizId) => {
    if (!quizId) {
      navigate('/'); 
      return;
    }
    navigate('/quiz', { state: { quizId,} });
  };
};


export const useNavigateToBack = () => {
    const navigate = useNavigate();
  
    return () => {
     
        navigate(-1) 
    };
  };