import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AddCourse from "./pages/AddCourse";
import AddTopic from "./pages/AddTopic";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./pages/Sidebar";
import Topics from "./pages/Topics";
import Departments from "./pages/Departments";
import AddQuiz from "./pages/AddQuiz";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import FAQs from "./pages/FAQs";
import Contactus from "./pages/Contactus";
import Testimonals from "./pages/Testimonals";
import Mentors from "./pages/Mentors";
import Signin from "./pages/Signin";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Module from "./pages/Module";
import Pricings from "./pages/Pricings";
import Careers from "./pages/Careers";
import MentorsMangement from "./pages/MentorsMangement";
import QuestionsHub from "./pages/QuestionsHub";

function App() {
  const isUser = localStorage.getItem("token");

  return (
    <div className="flex">
    
      <div className="flex-1  ">
        <Routes>
          <Route
            path="/login"
            element={isUser ? <Navigate to="/" /> : <Signin />}
          />
         

          <Route
            path="*"
            element={
              <ProtectedRoutes>
                  <Sidebar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/dashboard/addcourses/:departmentId"
                    element={<AddCourse />}
                  />
                  <Route
                    path="/dashboard/courses/:departmentId"
                    element={<Courses />}
                  />
                  <Route
                    path="/courses/add-topic/:courseId"
                    element={<AddTopic />}
                  />
                  <Route path="/dashboard/topics/:courseId" element={<Topics />} />
                  <Route
                    path="/dashboard/departments"
                    element={<Departments />}
                  />
                  <Route
                    path="/dashboard/departments/courses/topic/:topicId"
                    element={<AddQuiz />}
                  />
                  <Route
                    path="/dashboard/courses/projects/:courseId"
                    element={<Projects />}
                  />
                   <Route
                    path="/dashboard/courses/modules/:courseId"
                    element={<Module/>}
                  />
                   <Route
                    path="/control_center/questions_hub"
                    element={<QuestionsHub/>}
                  />
                  <Route path="/dashboard/users" element={<Users />} />
                  <Route path="/website/faq" element={<FAQs />} />
                  <Route path="/contactus" element={<Contactus />} />
                  <Route path="/reviews" element={<Testimonals />} />
                  <Route path="/website/mentors" element={<Mentors />} />
                  <Route path="/website/pricing" element={<Pricings />} />
                  <Route path="/website/careers" element={<Careers />} />
                  <Route path="/control_center/mentors_managment" element={<MentorsMangement />} />
                </Routes>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
