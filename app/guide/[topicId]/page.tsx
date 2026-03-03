import { redirect } from "next/navigation";
import { topics } from "@/lib/data";

interface Props {
  params: { topicId: string };
}

export default function TopicPage({ params }: Props) {
  const topic = topics.find(t => t.id === params.topicId);
  if (!topic || topic.concepts.length === 0) redirect("/");
  redirect(`/guide/${topic.id}/${topic.concepts[0].id}`);
}
