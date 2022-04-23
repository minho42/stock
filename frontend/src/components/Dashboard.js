import { BACKEND_BASE_URL } from "../globalVariables";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../UserContext";

export function Dashboard() {
  const { user } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState(null);
  const [allJournals, setAllJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Double check authorization

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchAllJournalsForEveryone();
  }, [allUsers]);

  const fetchAllJournalsForEveryone = async () => {
    if (!allUsers || allUsers?.length === 0) return;
    setIsLoading(true);
    setAllJournals([]);

    const tempAllJournals = [];

    await Promise.all(
      allUsers.map(async (user) => {
        const journals = await fetchJournalsForUser(user._id);
        tempAllJournals.push(...journals);
      })
    );

    setAllJournals(tempAllJournals);
    setIsLoading(false);
  };

  const fetchJournalsForUser = async (userId) => {
    if (!user.isSuperuser) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/journals/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("fetchJournalsForUser failed: " + userId);
      }
      const journals = await res.json();
      return journals;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchAllUsers = async () => {
    if (!user.isSuperuser) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("fetchAllUsers failed");
      }
      const users = await res.json();
      setAllUsers(users);
    } catch (error) {
      console.log(error);
      setAllUsers(null);
    }
  };

  if (!user.isSuperuser) {
    return <div className="text-center">😡 You're not meant to be here</div>;
  }

  return (
    <div className="flex justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {isLoading ? (
          <h2 className="text-xl animate-bounce">Loading...</h2>
        ) : (
          <h2 className="text-xl">
            {allUsers && `${allUsers.length} users`}, {allJournals && `${allJournals.length} journals`}
          </h2>
        )}

        <div className="w-full divide-y">
          {allUsers &&
            allUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between">
                {u.email}
                <div className="rounded-md bg-purple-100 px-1 py-0 my-1 text-sm font-semibold ml-2">
                  {isLoading ? "-" : allJournals.filter((journal) => journal.owner === u._id).length}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
