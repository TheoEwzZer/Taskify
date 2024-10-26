import { useParams } from "next/navigation";

export const useInviteCode: () => string = () => {
  const params = useParams();
  return params.inviteCode as string;
};
