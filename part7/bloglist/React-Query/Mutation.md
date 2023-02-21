# Mutation

Mutations are created using `useMutation` and are used to perform server effects (CUD operations). Usage is similar to `useQuery`, but the CUD operations are instead run whenever `mutation.mutate` is invoked, this can be passed a payload.

The `onSuccess` option in combination with `invalidateQueries` can be used to keep client state in-sync with the server. Alternatively, `setQueryData` can be used. Also see `onMutate` (mutation is invoked) and `onSettled` (resolved to error or success) options.
