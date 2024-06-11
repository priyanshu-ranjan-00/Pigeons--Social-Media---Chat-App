// custom hooks
// for showing toast

import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();

  //useCallback is used here to memoize the function and avoid unnecessary re-renders.
  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title: title,
        description: description,
        status: status,
        duration: 2500,
        isClosable: true,
      });
    },
    [toast]
  );
  return showToast;
};

export default useShowToast;
