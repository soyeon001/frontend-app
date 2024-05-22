import {
  View,
  Flex,
  Heading,
  Card,
  Text,
  Pagination,
  Button,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react"; // useEffect 추가
import axios from "axios"; // axios 추가

const Posts = () => {
  // 환경 변수 사용
  const backendAPI = process.env.REACT_APP_BACKEND_API;

  // 시간 형식 변경
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const navigate = useNavigate();
  const toCreatePost = () => {
    navigate("/create-post");
  };
  const toPostDetail = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendAPI}/posts`);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View maxWidth="1000px" margin="0 auto">
      <Flex padding="10px">
        <Button isFullWidth={true} loadingText="" onClick={toCreatePost}>
          📝Post!
        </Button>
      </Flex>
      <Flex direction="column">
        {currentPosts.map((post) => (
          <Card key={post.id} variation="elevated" margin="10px" width="100%">
            <Flex direction="row" justifyContent="space-between">
              <Flex
                padding="15px"
                direction="column"
                justifyContent="space-between"
              >
                <Heading level={3}>{post.title}</Heading>
                <Text>By {post.author}</Text>
                <Text color="grey">{formatDate(post.date)}</Text>
              </Flex>
              <Flex>
                <Button onClick={() => toPostDetail(post.id)}>Read</Button>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(posts.length / postsPerPage)}
        siblingCount={3}
        onChange={handlePageChange}
        hasMorePages={currentPage < Math.ceil(posts.length / postsPerPage)}
      />
    </View>
  );
};

export default Posts;
