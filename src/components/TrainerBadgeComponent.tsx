
import { getUserById } from '@/backend/user_backend';
import { useQuery } from '@tanstack/react-query';
import { Badge } from './ui/badge';

const TrainerBadgeComponent = ({ trainer_id }: { trainer_id: string }) => {
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getUserById(trainer_id),
    queryKey: [`trainer-${trainer_id}`],
    staleTime: 60 * 60 * 30
  });

  if (isLoading || !data) {
    return <Badge color='orange' />
  }

  if (isError) {
    return <Badge color='red' />
  }

  return (
    <Badge>
      {data.first_name} {data.last_name}
    </Badge>
  )
}

export default TrainerBadgeComponent
