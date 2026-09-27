import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUser, getUsers, updateUser, createUser, deleteUser } from "../../api/usersApi";


//Get all Users
export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    })
}

//Get One user

export const useUser = (id) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    })
}

//For creating users
// export const useCreateUser = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: createUser,

//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["users"],
//             });
//         },
//     });
// }

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: (newUser) => {
      queryClient.setQueryData(["users"], (old) => {
        if (!old?.users) return old;
        return {
          ...old,
          users: [...old.users, newUser],
        };
      });
    },

    onError: (error) => {
      console.error("CREATE ERROR:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (old) => {
        if (!old?.users) return old;
        return {
          ...old,
          users: old.users.map((u) =>
            u.id === updatedUser.id ? { ...u, ...updatedUser } : u
          ),
        };
      });
    },
    onError: (error) => {
      console.error("UPDATE ERROR:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (deletedUser) => {
      queryClient.setQueryData(["users"], (old) => {
        if (!old?.users) return old;
        return {
          ...old,
          users: old.users.filter((u) => u.id !== deletedUser.id),
        };
      });
    },
    onError: (error) => {
      console.error("DELETE ERROR:", error);
    },
  });
};