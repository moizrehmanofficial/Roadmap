import { pathsIndex } from "@/lib/paths";

export const dynamic = "force-static";

export function GET() {
  return Response.json(pathsIndex());
}
