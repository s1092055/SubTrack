import { Badge } from "@/components/ui/badge";
import { getStatusMeta } from "@/utils/subDisplay";

export default function SubStatusBadge({ sub }) {
  const status = getStatusMeta(sub);

  return <Badge variant={status.variant}>{status.label}</Badge>;
}
