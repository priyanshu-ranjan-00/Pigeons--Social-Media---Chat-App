import { Avatar, Box, Button, Spinner } from "@chakra-ui/react";
import { Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// import { formatDistanceToNow } from "date-fns";
import moment from "moment";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile(); // fetching the user profile using custom hook useGetUserProfile;

  // const [post, setPost] = useState(null); // instead, use global state (used here for storing all posts)
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts[0]; //first post of the posts array

  const showToast = useShowToast();
  const { pid } = useParams(); // getting the post id from the url, path="/:username/post/:pid", route is App.jsx
  const localUser = useRecoilValue(userAtom); ///logged in user which is stored in local storage(taking help of recoil userAtom)
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      setPosts([]); //sets global posts variable to null array, to avoid flicker effect while switching bw diff pages or components
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);

        // setPost(data);
        setPosts([data]); // adding data as an array,though here will be only one post, we have defined it as array in postsAtom.js
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure, you want to delete this post?"))
        return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" color="gray.500" thickness="4px" />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          {/* <Text
            fontSize={"sm"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text> */}

          <Text fontSize="sm" width={36} textAlign="right" color="gray.light">
            {moment(new Date(currentPost.createdAt)).fromNow()}
          </Text>

          {localUser?._id === user?._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      {currentPost._id && ( //adding this condition for showing actions if there is a valid postId
        <Flex gap={3} my={3}>
          <Actions post={currentPost} />
        </Flex>
      )}

      <Divider my={3} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Login to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={3} />
      {currentPost?.replies?.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;

// https://chat.openai.com/share/3e0a4819-9394-4d10-8abe-d06cc8da08d1
// refer to above chat, if formatDistanceToNow problem exists
