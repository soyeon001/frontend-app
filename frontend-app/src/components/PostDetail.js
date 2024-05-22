import React, { useState, useEffect } from "react";
import {
  View,
  Heading,
  Text,
  Card,
  Flex,
  Divider,
  Button,
  TextField,
  TextAreaField,
  ScrollView,
} from "@aws-amplify/ui-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchUserAttributes } from "@aws-amplify/auth";

const PostDetail = () => {
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

  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 변수 추가
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // 백엔드에서 데이터를 가져오기 위한 useEffect 훅
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`${backendAPI}/posts/${id}`);
        const commentsResponse = await axios.get(
          `${backendAPI}/posts/${id}/comments`
        );
        setPost(postResponse.data);
        setEditedTitle(postResponse.data.title);
        setEditedContent(postResponse.data.content);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

  const handleEdit = async () => {
    if (post.userId !== userAttributes.sub) {
      alert("You can only edit your own posts.");
      return;
    }
    try {
      await axios.put(`${backendAPI}/posts/${id}`, {
        title: editedTitle,
        content: editedContent,
        date: new Date().toISOString(),
      });
      setPost({ ...post, title: editedTitle, content: editedContent });
      setEditMode(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleDelete = async () => {
    if (post.userId !== userAttributes.sub) {
      alert("You can only delete your own posts.");
      return;
    }
    try {
      await axios.delete(`${backendAPI}/posts/${id}`);
      navigate("/posts");
    } catch (err) {
      setError(err);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const response = await axios.post(`${backendAPI}/posts/${id}/comments`, {
        author: userAttributes.name,
        userId: userAttributes.sub,
        date: new Date().toISOString(),
        content: newComment,
      });
      setComments([response.data, ...comments]); // 백엔드에서 반환된 데이터를 사용
      setNewComment("");
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <Text>Loading...</Text>; // 로딩 상태 표시
  if (error) return <Text>Error: {error.message}</Text>; // 오류 상태 표시

  return (
    <View maxWidth="1000px" margin="0 auto">
      <Card padding="20px" variation="elevated" margin="10px" width="100%">
        <Flex direction="row" padding="20px" justifyContent="space-between">
          {editMode ? (
            <>
              <Flex direction="column" width="1000px">
                <Heading level={2}>Edit Post</Heading>
                <TextField
                  label="Post Title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <TextAreaField
                  rows={15}
                  label="Post Content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <Button onClick={handleEdit}>Save</Button>
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
              </Flex>
            </>
          ) : (
            <>
              <Flex direction="column" width="800px">
                <Heading level={2} fontWeight="bold">
                  {post.title}
                </Heading>
                <Text>By {post.author}</Text>
                <Text color="grey">{formatDate(post.date)}</Text>
                <ScrollView>
                  <Text style={{ whiteSpace: "pre-wrap" }}>{post.content}</Text>
                </ScrollView>
              </Flex>
              <Flex direction="column">
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <Button onClick={handleDelete} colorTheme="error">
                  Delete
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Card>
      <Flex direction="column" padding="20px">
        <Heading level={4}>Comments</Heading>
        <Divider size="small" orientation="horizontal" />
      </Flex>
      <Flex padding="20px" alignItems="flex-end">
        <TextField
          width="800px"
          placeholder="Write a Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment}>Add Comment</Button>
      </Flex>
      <Flex direction="column" padding="20px">
        {comments.map((comment) => (
          <Card key={comment.id} padding="10px" margin="10px">
            <Text fontWeight="bold">{comment.author}</Text>
            <Text color="grey">{formatDate(comment.date)}</Text>
            <ScrollView>
              <Text style={{ whiteSpace: "pre-wrap" }}>{comment.content}</Text>
            </ScrollView>
          </Card>
        ))}
      </Flex>
    </View>
  );
};

export default PostDetail;
