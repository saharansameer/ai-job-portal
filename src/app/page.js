import { JobCard } from "@/components/JobCard";

async function GetJobs() {
  const response = await fetch(
    `http://localhost:3000/api/jobs?category=DESIGN`
  );
  const { success, message, data } = await response.json();

  if (!success) {
    return <div>{message}</div>;
  }

  if (data.length === 0 || !data) {
    return <div>No Jobs Listed Yet</div>;
  }

  return (
    <div className="space-y-10">
      {data.map((job, idx) => (
        <JobCard
          key={`${idx}-job`}
          title={job.title}
          description={job.description}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-5 p-5 mx-auto">
      <h1 className="font-bold text-4xl">Job Lists</h1>
      <GetJobs />
    </div>
  );
}
