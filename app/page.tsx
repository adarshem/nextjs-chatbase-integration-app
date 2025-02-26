'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [userData, setUserData] = useState<{
    userId: string;
    userHash: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = uuidv4(); // Generate a random userId
        const response = await fetch('/api/chat-base', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const userConfigScript = document.createElement('script');
      userConfigScript.innerHTML = `
        window.chatbaseUserConfig = {
          user_id: '${userData.userId}',
          user_hash: '${userData.userHash}', // this is the hash of the user_id, should be generated on the server
          user_metadata: {
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Acme Inc"
          }
        };
      `;
      document.body.appendChild(userConfigScript);

      const chatbaseScript = document.createElement('script');
      chatbaseScript.innerHTML = `
        (function(){
          if(!window.chatbase || window.chatbase("getState") !== "initialized"){
            window.chatbase = (...arguments) => {
              if(!window.chatbase.q) { window.chatbase.q = [] }
              window.chatbase.q.push(arguments)
            };
            window.chatbase = new Proxy(window.chatbase, {
              get(target, prop) {
                if(prop === "q") { return target.q }
                return (...args) => target(prop, ...args)
              }
            });
          }
          const onLoad = function() {
            const script = document.createElement("script");
            script.src = "https://www.chatbase.co/embed.min.js";
            script.id = "GFoHOPxAHbCI_WiXm2Ilg";
            script.domain = "www.chatbase.co";
            document.body.appendChild(script);
          };
          if(document.readyState === "complete") { onLoad() }
          else { window.addEventListener("load", onLoad) }
        })();
      `;
      document.body.appendChild(chatbaseScript);
    }
  }, [userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Chatbase Embedded Chat</h1>
      <p className="text-gray-700">
        Interact with the AI chatbot powered by Chatbase.
      </p>
      {userData && (
        <div className="mt-4">
          <p>User ID: {userData.userId}</p>
          <p>User Hash: {userData.userHash}</p>
        </div>
      )}
    </div>
  );
}
