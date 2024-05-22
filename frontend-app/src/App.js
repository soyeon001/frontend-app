import config from "./aws-exports";
import { Amplify } from "aws-amplify";
import {
  View,
  Flex,
  Heading,
  SearchField,
  Text,
  Divider,
  Button,
  Authenticator,
  Menu,
  MenuItem,
  MenuButton,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Route, Routes } from "react-router-dom";
// 라우팅할 페이지들
import Home from "./components/Home";
import Posts from "./components/Posts";
import About from "./components/About";
import Test from "./components/Test";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/PostDetail";

// Amplify 설정 구성 (aws-exports.js)
Amplify.configure(config);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <View padding="10px">
            <Flex justifyContent="center">
              <Heading level={1} textAlign="center">
                <Text fontWeight={500}>🌹 sonaBoard 🌹</Text>
              </Heading>
            </Flex>
            <Flex
              padding="20px"
              direction="row"
              justifyContent="space-around"
              alignItems="flex-end"
            >
              <Flex>
                <Button
                  variation="link"
                  loadingText=""
                  onClick={() => (window.location.href = "/")}
                >
                  Home
                </Button>
                <Button
                  variation="link"
                  loadingText=""
                  onClick={() => (window.location.href = "/posts")}
                >
                  Posts
                </Button>
                <Menu
                  trigger={
                    <MenuButton variation="link" loadingText="">
                      Test
                    </MenuButton>
                  }
                >
                  <MenuItem onClick={() => (window.location.href = "/test")}>
                    Terraform
                  </MenuItem>
                  <MenuItem>Kubernetes</MenuItem>
                  <MenuItem>Linux</MenuItem>
                  <MenuItem>React</MenuItem>
                </Menu>
                <Button
                  variation="link"
                  loadingText=""
                  onClick={() => (window.location.href = "/about")}
                >
                  About
                </Button>
              </Flex>
              <Flex>
                <SearchField />
                <Button
                  size="small"
                  variation="primary"
                  loadingText=""
                  onClick={signOut}
                >
                  🔑 SignOut
                </Button>
              </Flex>
            </Flex>
            <Divider orientation="horizontal" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/test" element={<Test />} />
              <Route path="/about" element={<About />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/posts/:id" element={<PostDetail />} />
            </Routes>
          </View>
        );
      }}
    </Authenticator>
  );
}

export default App;
