import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import api from "../api/client";


export default function Dashboard(){


const {projectId}=useParams();


const [data,setData]=useState({

stats:{},
issues:[]
});



useEffect(()=>{


api.get(
`/dashboard/${projectId}`
)

.then(res=>{

setData(res.data);

})

.catch(console.log);


},[projectId]);



const stats=data.stats;



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

🟣 Website Redesign

</h1>


<p>

Relaunch of the marketing site · 12 members

</p>


</div>


<button className="primary-button">

New issue

</button>


</div>





<div className="stat-grid">


<Card
title="OPEN ISSUES"
value={stats.open}
/>


<Card
title="IN PROGRESS"
value={stats.progress}
/>


<Card
title="OVERDUE"
value={stats.overdue}
/>


<Card
title="DONE THIS WEEK"
value={stats.done}
/>


</div>





<div className="dashboard-grid">



<section className="panel">

<h2>
Issues by status
</h2>


<Bar name="Backlog" count="14"/>

<Bar name="Todo" count="12"/>

<Bar name="In Progress" count={stats.progress}/>

<Bar name="In Review" count="3"/>

<Bar name="Done" count={stats.done}/>


</section>





<section className="panel">


<h2>
Open issues by assignee
</h2>



{

data.issues.map(issue=>(


<div className="workload"
key={issue.id}>


<span>

{issue.assignee_name ||
"Unassigned"}

</span>


<strong>

1

</strong>


</div>


))

}


</section>



</div>






<section className="panel">


<h2>
Recently updated
</h2>



{

data.issues.map(issue=>(


<Link

className="recent-item"

key={issue.id}

to={`/projects/${projectId}/issues/${issue.id}`}

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





function Card({title,value}){


return (

<div className="stat-card">

<small>
{title}
</small>


<h1>
{value || 0}
</h1>


</div>

)

}





function Bar({name,count}){


return (

<div className="status-row">


<span>
{name}
</span>


<div className="bar">

<div
style={{
width:`${count*10}%`
}}
/>


</div>


<strong>
{count}
</strong>


</div>

)


}