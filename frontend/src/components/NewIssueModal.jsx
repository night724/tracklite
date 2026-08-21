import { useState } from "react";
import api from "../api/client";


export default function NewIssueModal({
    projectId,
    onClose,
    onCreated
}) {


    const [form,setForm] = useState({

        title:"",
        description:"",
        status:"Todo",
        priority:"Medium",
        due_date:""

    });



    const [error,setError] = useState("");



    function handleChange(e){

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }



    async function handleSubmit(e){

        e.preventDefault();


        try{


            await api.post(
                "/issues",
                {

                    project_id: projectId,

                    issue_key:
                    "ISSUE-" + Date.now(),

                    title:
                    form.title,

                    description:
                    form.description,

                    status:
                    form.status,

                    priority:
                    form.priority,

                    due_date:
                    form.due_date || null

                }
            );


            if(onCreated){

                onCreated();

            }


            onClose();



        }catch(error){


            console.error(
                "CREATE ISSUE ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Cannot create issue"
            );

        }


    }



return (

<div className="modal-background">


<div className="modal-box">


<h2>
New Issue
</h2>



{
error &&
<p className="error">
{error}
</p>
}




<form onSubmit={handleSubmit}>


<input

name="title"

placeholder="Issue title"

value={form.title}

onChange={handleChange}

/>



<textarea

name="description"

placeholder="Description"

value={form.description}

onChange={handleChange}

/>



<select

name="status"

value={form.status}

onChange={handleChange}

>


<option>
Todo
</option>


<option>
In Progress
</option>


<option>
In Review
</option>


<option>
Done
</option>


</select>





<select

name="priority"

value={form.priority}

onChange={handleChange}

>


<option>
Low
</option>


<option>
Medium
</option>


<option>
High
</option>


<option>
Urgent
</option>


</select>





<input

type="date"

name="due_date"

value={form.due_date}

onChange={handleChange}

/>




<div>


<button

type="button"

onClick={onClose}

>

Cancel

</button>



<button

type="submit"

className="primary-button"

>

Create Issue

</button>


</div>



</form>


</div>


</div>

);

}