import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { readProject, updateProject } from '../utils/api';
import CancelButton from '../components/buttons/cancelButton';
import ErrorAlert from '../layout/errorAlert';
import ProjectForm from '../views/projects/projectForm';

const UpdateProject = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { user } = useAuth0();

    const initialProjectState = {
        project_id: 0,
        title: "",
        description: "",
        due_date: "",
        due_time: "",
        creator_name: "",
        creator_email: "",
        completed: false,
        created_at: "",
        updated_at: "",
    }

    const [project, setProject] = useState({...initialProjectState});
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        const abortController = new AbortController();

        function loadProjectById() {
            readProject(projectId, abortController.signal)
                .then((response) => {
                    setProject({
                        project_id: response.project_id,
                        title: response.title,
                        description: response.description,
                        due_date: formatDateForUpdateForm(response.due_date),
                        due_time: response.due_time,
                        creator_name: response.creator_name,
                        creator_email: response.creator_email,
                        completed: response.complete,
                        created_at: response.created_at,
                        updated_at: response.updated_at,
                    });
                })
                .catch((error) => setError(error));
        }
        loadProjectById();
        return () => abortController.abort();
    }, [projectId]);

    const updateProjectCancelHandler = (event) => {
        event.preventDefault();
        setError(null);
        const confirmUnsavedChanges = window.confirm("Navigate away from this page? Changes that you've made may not be saved.");

        if (confirmUnsavedChanges) {
            navigate(`/projects/${projectId}`);
        }
    }

    const updateProjectChangeHandler = ({ target }) => {
        setProject({
            ...project,
            [target.name]: target.value,
        });
    }

    const updateProjectSubmitHandler = (event) => {
        event.preventDefault();
        const updatedProject = {
            ...project,
            creator_name: user.name,
            creator_email: user.email,
            completed: false,
        };
        updateProject(updatedProject, projectId)
            .then(() => navigate(`/projects/${projectId}`))
            .catch((error) => setError(error));
        setProject({...initialProjectState})
    }

    function formatDateForUpdateForm(date) {
        const dateArray = [...date];
        const updatedDateArray = [];

        let left = 0;
        let right = 9;

        while (left <= right) {
            updatedDateArray.push(dateArray[left]);
            left++;
        }
        return updatedDateArray.join('');
    }

    return (
        <section className="projects">
            <div className="projects-title">
                <div className="item item-one">
                    <CancelButton
                        cancelHandler={updateProjectCancelHandler}
                    />
                </div>
                <div className="item item-two">
                    <h2>Edit Project</h2>
                </div>
            </div>
            <div className="projects-form">
                <ErrorAlert error={error} />
                <ProjectForm
                    cancelHandler={updateProjectCancelHandler}
                    changeHandler={updateProjectChangeHandler}
                    formValueOne={project.title}
                    formValueTwo={project.description}
                    formValueThree={project.due_date}
                    formValueFour={project.due_time}
                    submitHandler={updateProjectSubmitHandler}
                />
            </div>
        </section>
    );
}

export default withAuthenticationRequired(UpdateProject);