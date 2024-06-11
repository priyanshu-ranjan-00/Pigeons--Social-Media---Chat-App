import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
  const localUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(localUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!localUser) {
      showToast("Error", "Please login to follow/unfollow", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }
      // console.log(data);

      if (following) {
        showToast("Success", `unfollowed ${user?.name}`, "success");
        user?.followers.pop(); // decreasing length by 1 of followers in UI(just for simulation),not in db(fetch request with POST method is used for db)
      } else {
        showToast("Success", `following ${user?.name}`, "success");
        user?.followers.push(localUser?._id); // simulate for adding to followers in UI
      }
      // console.log(user?.followers);

      setFollowing(!following); // update following state
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      // to avoid multiple clicks
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;

// const handleFollowUnfollow = async () => {
//   if (!localUser) {
//     showToast("Error", "Please login to follow/unfollow", "error");
//     return;
//   }
//   if (updating) return;

//   setUpdating(true);

//   try {
//     const res = await fetch(`/api/users/follow/${user?._id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();
//     if (data.error) {
//       showToast("Error", data.error, "error");
//     }
//     // console.log(data);

//     if (following) {
//       showToast("Success", `unfollowed ${user?.name}`, "success");
//       user?.followers.pop(); // decreasing length by 1 of followers in UI(just for simulation),not in db(fetch request with POST method is used for db)
//     } else {
//       showToast("Success", `following ${user?.name}`, "success");
//       user?.followers.push(localUser?._id); // simulate for adding to followers in UI
//     }
//     // console.log(user?.followers);

//     setFollowing(!following); // update following state
//   } catch (error) {
//     showToast("Error", error, "error");
//   } finally {
//     // to avoid multiple clicks
//     setUpdating(false);
//   }
// };
