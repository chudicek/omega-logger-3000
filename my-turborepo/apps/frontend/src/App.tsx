import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPageComponents/LoginPage';
import SignupPage from './components/signupPageComponents/SignupPage';
import CallbackPage from './components/auth0/CallbackPage';
import ProjectsPage from './components/projectsPageComponents/ProjectsPage';
import CreateProjectPage from './components/createProjectComponents/CreateProjectPage';
import ProjectDetailPage from './components/projectDetailComponents/ProjectDetailPage';
import EditProjectPage from './components/editProjectComponents/EditProjectPage';
import ParticipantsPage from './components/participantsComponents/ParticipantsPage';
import AddParticipantPage from './components/addParticipantComponents/AddParticipantsPage';
import CreateTaskPage from './components/createTaskComponents/CreateTaskPage';
import TaskDetailPage from './components/taskDetailComponents/TaskDetailPage';
import EditTaskPage from './components/editTaskComponents/EditTaskPage';
import CreateTaskUpdatePage from './components/createTaskUpdateComponents/CreateTaskUpdatePage';
import TaskUpdateDetailPage from './components/taskUpdateDetailComponents/TaskUpdateDetailPage';

import { AuthenticationGuard } from './components/auth0/AuthenticationGuard';

function App() {
  // return (
  //   <div className="w-screen h-screen min-w-[308px] relative flex items-center justify-center">
  //     <Routes>
  //       <Route path="/" element={<LoginPage />} />
  //       <Route path="/signup" element={<SignupPage />} />
  //       <Route path="/callback" element={<CallbackPage />} /> {/*TODO*/}
  //       {/* <Route path="/projects" element={<ProjectsPage />}> */}
  //       <Route path="/projects">
  //         <Route index element={<ProjectsPage />} />
  //         <Route path="create" element={<CreateProjectPage />} />
  //         <Route path=":projectId">
  //           <Route index element={<ProjectDetailPage />} />
  //           <Route path="edit" element={<EditProjectPage />} />
  //           <Route path="participants">
  //             <Route index element={<ParticipantsPage />} />
  //             <Route path="addParticipant" element={<AddParticipantPage />} />
  //           </Route>
  //           <Route path="task-create" element={<CreateTaskPage />} />
  //           <Route path="tasks/:taskId">
  //             <Route index element={<TaskDetailPage />} />
  //             <Route path="edit" element={<EditTaskPage />} />
  //             <Route path="update-create" element={<CreateTaskUpdatePage />} />
  //             <Route path=":taskUpdateId" element={<TaskUpdateDetailPage />} />
  //           </Route>
  //         </Route>
  //       </Route>
  //     </Routes>
  //   </div>
  // );

  return (
    <div className="w-screen h-screen min-w-[308px] relative flex items-center justify-center">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/projects">
          <Route
            index
            element={<AuthenticationGuard component={ProjectsPage} />}
          />
          <Route
            path="create"
            element={<AuthenticationGuard component={CreateProjectPage} />}
          />
          <Route path=":projectId">
            <Route
              index
              element={<AuthenticationGuard component={ProjectDetailPage} />}
            />
            <Route
              path="edit"
              element={<AuthenticationGuard component={EditProjectPage} />}
            />
            <Route path="participants">
              <Route
                index
                element={<AuthenticationGuard component={ParticipantsPage} />}
              />
              <Route
                path="addParticipant"
                element={<AuthenticationGuard component={AddParticipantPage} />}
              />
            </Route>
            <Route
              path="task-create"
              element={<AuthenticationGuard component={CreateTaskPage} />}
            />
            <Route path="tasks/:taskId">
              <Route
                index
                element={<AuthenticationGuard component={TaskDetailPage} />}
              />
              <Route
                path="edit"
                element={<AuthenticationGuard component={EditTaskPage} />}
              />
              <Route
                path="update-create"
                element={
                  <AuthenticationGuard component={CreateTaskUpdatePage} />
                }
              />
              <Route
                path=":taskUpdateId"
                element={
                  <AuthenticationGuard component={TaskUpdateDetailPage} />
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
