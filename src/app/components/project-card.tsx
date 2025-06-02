    import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  evaluated: boolean
}

export default function ProjectCard({ title, description, tags, evaluated }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index}     className="bg-gray-200 text-gray-700 hover:bg-white">
                {tag}
              </Badge>
            ))}
          </div>
          <Badge
       
            className={`${evaluated ? "bg-green-100 text-green-800 " : "bg-yellow-100 text-yellow-800"} hover:bg-yellow-100`}
          >
            {evaluated ? "Evaluated" : "Not Evaluated"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
