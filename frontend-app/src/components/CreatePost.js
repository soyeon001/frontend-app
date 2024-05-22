import React, { useState, useEffect } from "react";
import {
  View,
  Heading,
  TextField,
  TextAreaField,
  Button,
  Card,
  Flex,
  Text,
} from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const backendAPI = process.env.REACT_APP_BACKEND_API;

  const navigate = useNavigate();

  // useState 선언하기
  const [userAttributes, setUserAttributes] = useState({ name: "" });
  // useEffect로 사용자 속성 저장하기
  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes(); // fetchUserAttributes : 현재 로그인된 사용자의 속성을 가져옴
        setUserAttributes(attributes); // useState에 사용자의 속성이 담김
      } catch (e) {
        console.log(e);
      }
    };
    getUserAttributes();
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendAPI}/posts`, {
        title,
        content,
        author: userAttributes.name,
        userId: userAttributes.sub,
        date: new Date().toISOString(),
      });
      alert("Post created successfully!");
      setTitle("");
      setContent("");
      navigate("/posts");
    } catch (err) {
      setError(err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View maxWidth="1000px" margin="0 auto">
      <Card variation="elevated" margin="10px" width="100%">
        <Flex direction="column" padding="20px">
          <Heading level={2}>Create a New Post</Heading>
          <TextField
            placeholder="Write title of your post here..."
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextAreaField
            label="Post Content"
            placeholder="Write your post here..."
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variation="primary"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Submitting..."
          >
            Submit
          </Button>
          {error && <Text color="red">{error.message}</Text>}
        </Flex>
      </Card>
    </View>
  );
};

export default CreatePost;
