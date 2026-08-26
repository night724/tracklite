import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import api from "../api/client";


export default function IssueDetail() {


    const {
        issueId,
        projectId
    } = useParams();


    const navigate = useNavigate();


    const [issue, setIssue] =
        useState(null);


    const [editingTitle, setEditingTitle] =
        useState(false);


    const [title, setTitle] =
        useState("");


    const [comment, setComment] =
        useState("");



    async function loadIssue() {

        try {

            const res =
                await api.get(
                    `/issues/${issueId}`
                );


            setIssue(res.data);

            setTitle(
                res.data.title
            );


        } catch (error) {

            console.error(
                "LOAD ISSUE ERROR",
                error
            );

        }

    }



    useEffect(() => {

        loadIssue();

    }, [issueId]);





    async function saveTitle() {


        try {


            await api.patch(
                `/issues/${issueId}`,
                {
                    title
                }
            );


            await loadIssue();


            setEditingTitle(false);



        } catch (error) {

            console.error(error);

        }

    }







    async function updateProperty(
        field,
        value
    ) {


        try {


            await api.patch(
                `/issues/${issueId}`,
                {
                    [field]: value
                }
            );


            await loadIssue();


        } catch (error) {

            console.error(error);

        }


    }







    async function addComment() {


        if (!comment.trim())
            return;



        try {


            await api.post(
                `/comments`,
                {
                    issue_id: issueId,
                    body: comment
                }
            );


            setComment("");

            await loadIssue();



        } catch (error) {

            console.error(
                "COMMENT ERROR",
                error
            );

        }

    }






    async function deleteIssue() {


        const ok =
            window.confirm(
                "Delete this issue?"
            );


        if (!ok)
            return;



        try {


            await api.delete(
                `/issues/${issueId}`
            );


            navigate(
                `/projects/${projectId}/issues`
            );


        } catch (error) {

            console.error(error);

        }

    }







    if (!issue) {

        return (
            <div>
                Loading issue...
            </div>
        );

    }






    return (

        <div>


            <div className="breadcrumb">

                Acme Inc /
                Website Redesign /
                {issue.issue_key}

            </div>





            <div className="issue-detail">





                <main className="issue-main">



                    <div className="issue-key">

                        {issue.issue_key}

                    </div>






                    {
                        editingTitle ?


                            <div>


                                <input

                                    value={title}

                                    onChange={
                                        e =>
                                            setTitle(
                                                e.target.value
                                            )
                                    }

                                />



                                <button
                                    onClick={saveTitle}
                                >
                                    Save
                                </button>



                                <button

                                    onClick={() =>
                                        setEditingTitle(false)
                                    }

                                >

                                    Cancel

                                </button>



                            </div>



                            :



                            <h1
                                onClick={() =>
                                    setEditingTitle(true)
                                }
                            >

                                {issue.title}

                            </h1>


                    }





                    <p>

                        {
                            issue.description ||
                            "No description"
                        }

                    </p>







                    <section>

                        <h2>
                            Activity
                        </h2>


                        <div>
                            Issue created
                        </div>


                        <div>

                            Status:
                            {" "}
                            {issue.status}

                        </div>


                    </section>








                    <section>


                        <h2>
                            Comment
                        </h2>


                        <textarea

                            value={comment}

                            onChange={
                                e =>
                                    setComment(
                                        e.target.value
                                    )
                            }


                            placeholder="Write a comment..."

                        />



                        <button

                            className="primary-button"

                            onClick={addComment}

                        >

                            Comment

                        </button>


                    </section>



                </main>









                <aside className="properties">



                    <h2>
                        Properties
                    </h2>





                    <Property

                        label="Status"

                        value={
                            issue.status
                        }

                        options={[
                            "Backlog",
                            "Todo",
                            "In Progress",
                            "In Review",
                            "Done",
                            "Canceled"
                        ]}


                        onChange={
                            value =>
                                updateProperty(
                                    "status",
                                    value
                                )
                        }

                    />







                    <Property

                        label="Priority"

                        value={
                            issue.priority
                        }

                        options={[
                            "Urgent",
                            "High",
                            "Medium",
                            "Low"
                        ]}


                        onChange={
                            value =>
                                updateProperty(
                                    "priority",
                                    value
                                )
                        }

                    />







                    <div className="property">

                        <label>
                            Assignee
                        </label>

                        <div>

                            {
                                issue.assignee_name ||
                                "Unassigned"
                            }

                        </div>


                    </div>








                    <div className="property">

                        <label>
                            Due date
                        </label>


                        <div>

                            {
                                issue.due_date ||
                                "Not set"
                            }

                        </div>


                    </div>







                    <button

                        className="danger-button"

                        onClick={deleteIssue}

                    >

                        Delete issue

                    </button>




                </aside>






            </div>



        </div>

    );


}






function Property({
    label,
    value,
    options,
    onChange
}) {


    return (

        <div className="property">


            <label>
                {label}
            </label>



            <select

                value={value}

                onChange={
                    e =>
                        onChange(
                            e.target.value
                        )
                }

            >

                {
                    options.map(
                        option =>

                            <option
                                key={option}
                                value={option}
                            >

                                {option}

                            </option>

                    )
                }


            </select>


        </div>

    );

}