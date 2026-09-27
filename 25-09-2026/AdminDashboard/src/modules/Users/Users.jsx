  import React from 'react'
  import { useState } from 'react';
  import DataTable from '../../components/DataTable'
  import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
  import { userColumns, userFields } from './data';
  import Modal from '../../components/Modal';

  const Users = () => {

    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const {
      data,
      isLoading,
      isError,
      error,
    } = useUsers();

    // CREATE USER
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();
    console.log("Data:", data)

    // ADD
    const handleAdd = () => {
      setSelectedUser(null);
      setOpenModal(true);
    };

    // EDIT
    const handleEdit = (user) => {
      setSelectedUser(user);
      setOpenModal(true);
    };

    // CREATE / UPDATE
    const handleSubmit = (formData) => {
      const user = {
        ...formData,
        age: Number(formData.age),
      };

      if (selectedUser) {
        // UPDATE
        updateUser.mutate(
          {
            id: selectedUser.id,
            user,
          },
          {
            onSuccess: () => {
              setOpenModal(false);
              setSelectedUser(null);
            },
          }
        );
      } else {
        // CREATE
        createUser.mutate(user, {
          onSuccess: () => {
            setOpenModal(false);
          },
        });
      }
    };

    // DELETE
    const handleDelete = (user) => {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
      }

      deleteUser.mutate(user.id);
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error loading users</div>;
    }

    return (

      <div className="flex h-full flex-col gap-3 p-4">

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={ handleAdd }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/90"
          >
            Add User
          </button>
        </div>

        {/* DataTable */}
        <div className="min-h-0 flex-1">
          <DataTable
            columns={userColumns}
            data={data?.users ?? []}
            onRowDoubleClick={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modal */}
        <Modal
          open={openModal}
          onOpenChange={(open) => {
            setOpenModal(open);

            if (!open) {
              setSelectedUser(null);
            }
          }}
          title={selectedUser ? "Update User" : "Add User"}
          description={
            selectedUser
              ? "Update the user details below."
              : "Enter the user details below."
          }
          fields={userFields}
          initialData={selectedUser || {}}
          onSubmit={handleSubmit}
          submitLabel={
            selectedUser
              ? updateUser.isPending
                ? "Updating..."
                : "Update User"
              : createUser.isPending
                ? "Creating..."
                : "Add User"
          }
        />
      </div>
    );
  }

  export default Users
