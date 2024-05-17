import config from "./aws-exports"
import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useState, useEffect } from 'react';
import "@aws-amplify/ui-react/styles.css";

//amplify  설정 구성 (aws-exports.js)
Amplify.configure(config);

function App() {
  //useState 선언하기 (react에서의 변수 선언)
  /// userAttributes 값, userAttributes를 수정할 수 있는 setUserAttributes
  const [userAttributes, setUserAttributes] = useState({ name: ""});
  //useEffect로 사용자 속성을 useState 에 저장
  useEffect(()=> {
    const getUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes(); //fetchUserAttributes : 현재 로그인된 사용자의 속성을 가져옴
        setUserAttributes(attributes);
      } catch (e) { //에러 처리 
        console.log(e);
      }
    };
    getUserAttributes();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => {
        return(
          <div className="App">
            <header className="App-header">
              {/* 사이트접속 사용자 이름 출력 */}
              <h1> Hello {userAttributes.name}</h1>
              <button onClick={signOut}> Sign Out </button>
            </header>
          </div>  
        )
      }}
    </Authenticator>
  );
} 

export default App;
