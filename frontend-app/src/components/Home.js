import { View, Flex, Heading, Text, Image } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useEffect, useState } from "react";


const Home = () => {
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

  return (
    <View padding="20px">
      <Heading level={1} textAlign="center">
        <Text>Welcome! {userAttributes.name}</Text>
        <Text>This is sonaBoard</Text>
      </Heading>

    </View>
  );
};

export default Home;
