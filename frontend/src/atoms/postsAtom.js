import { atom } from "recoil";

const postsAtom = atom({
  key: "postsAtom",
  default: [],
});

export default postsAtom;



// making global state instead of defining it as "const [posts, setPosts] = useState([]);" in UserPage.jsx, then passing to Post.jsx, and again passing to Actions.jsx
// will be imported (firstly in UserPage.jsx )as: "const [posts, setPosts] = useRecoilState(postsAtom);" instead of "const [posts, setPosts] = useState([]);"
