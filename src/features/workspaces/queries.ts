import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Models, Query } from "node-appwrite";
import { getMember } from "../members/util";
import { Workspace } from "./types";

export const getWorkspaces: () => Promise<
  Models.DocumentList<Models.Document>
> = async (): Promise<Models.DocumentList<Models.Document>> => {
  try {
    const { databases, account } = await createSessionClient();

    const user: Models.User<Models.Preferences> = await account.get();

    const members: Models.DocumentList<Models.Document> =
      await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("userId", user.$id),
      ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspacesIds: any[] = members.documents.map(
      (member: Models.Document): any => member.workspaceId
    );

    const workspaces: Models.DocumentList<Models.Document> =
      await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspacesIds),
      ]);

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspace: ({
  workspaceId,
}: GetWorkspaceProps) => Promise<Workspace | null> = async ({
  workspaceId,
}: GetWorkspaceProps): Promise<Workspace | null> => {
  try {
    const { databases, account } = await createSessionClient();

    const user: Models.User<Models.Preferences> = await account.get();

    const member: Models.Document = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const workspace: Workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
};

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export const getWorkspaceInfo: ({
  workspaceId,
}: GetWorkspaceInfoProps) => Promise<{
  name: string;
} | null> = async ({
  workspaceId,
}: GetWorkspaceInfoProps): Promise<{
  name: string;
} | null> => {
  try {
    const { databases } = await createSessionClient();

    const workspace: Workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return {
      name: workspace.name,
    };
  } catch {
    return null;
  }
};