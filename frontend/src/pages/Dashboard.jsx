import {
    Link,
    useParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import api from "../api/client";

import NewIssueModal from "../components/NewIssueModal";


export default function Dashboard() {


    const {
        projectId
    } = useParams();



    const [
        issues,
        setIssues
    ] = useState([]);



    const [
        showModal,
        setShowModal
    ] = useState(false);




    function loadIssues(){


        api.get(
            `/issues/project/${projectId}`
        )

        .then(response=>{

            setIssues(
                response.data
            );

        })

        .catch(error=>{

            console.error(
                "LOAD ISSUES ERROR:",
                error.response?.data || error
            );

        });


    }




    useEffect(()=>{


        if(projectId){

            loadIssues();

        }


    },[projectId]);





    const openIssues =
    issues.filter(issue=>

        issue.status !== "Done"
        &&
        issue.status !== "Canceled"

    );




    const inProgress =
    issues.filter(issue=>

        issue.status === "In Progress"

    );




    const overdue =
    openIssues.filter(issue=>{


        if(!issue.due_date)
            return false;


        return new Date(issue.due_date)
        <
        new Date();


    });





return (

<div>



<div className="page-header">


<div>


<div className="breadcrumb">

Acme Inc /
Website Redesign /
Dashboard

</div>



<h1>
Website Redesign
</h1>


<p>
Relaunch of the marketing site
</p>



</div>



<button

className="primary-button"

onClick={()=>
setShowModal(true)
}

>

New issue

</button>



</div>




{
showModal &&

<NewIssueModal

projectId={projectId}

onClose={()=>
setShowModal(false)
}

onCreated={()=>

api.get(
`/issues/project/${projectId}`
)

.then(res=>

setIssues(res.data)

)

}

/>

}







<div className="stat-grid">


<StatCard

title="OPEN ISSUES"

value={
openIssues.length
}

/>



<StatCard

title="IN PROGRESS"

value={
inProgress.length
}

/>



<StatCard

title="OVERDUE"

value={
overdue.length
}

/>



<StatCard

title="DONE THIS WEEK"

value="0"

/>


</div>






<div className="dashboard-grid">


<section className="panel">


<h2>
Issues by status
</h2>



<StatusBar

name="Backlog"

count={
issues.filter(
i=>i.status==="Backlog"
).length
}

/>



<StatusBar

name="Todo"

count={
issues.filter(
i=>i.status==="Todo"
).length
}

/>



<StatusBar

name="In Progress"

count={
inProgress.length
}

/>



<StatusBar

name="Done"

count={
issues.filter(
i=>i.status==="Done"
).length
}

/>



</section>







<section className="panel">


<h2>
Open issues by assignee
</h2>



{

openIssues.map(issue=>(


<Workload

key={issue.id}

name={
issue.assignee_name ||
"Unassigned"
}

count={1}

/>


))

}



</section>



</div>







<section className="panel">


<h2>
Recently updated
</h2>



{

issues
.slice(0,10)
.map(issue=>(


<Link

key={issue.id}

className="recent-item"

to={
`/projects/${projectId}/issues/${issue.id}`
}

>


<strong>

{issue.issue_key}

</strong>



<span>

{issue.title}

</span>



<span>

{issue.status}

</span>



</Link>



))

}



</section>




</div>

);


}





function StatCard({
title,
value
}){


return (

<div className="stat-card">

<small>
{title}
</small>


<strong>
{value}
</strong>


</div>

);


}







function StatusBar({
name,
count
}){


return (

<div className="status-row">


<span>
{name}
</span>



<div className="bar">

<div

style={{

width:`${count*5}%`

}}

/>

</div>



<strong>
{count}
</strong>



</div>

);


}







function Workload({
name,
count
}){


return (

<div className="workload">

<span>
{name}
</span>


<strong>
{count}
</strong>


</div>

);


}
