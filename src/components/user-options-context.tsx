import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from "react";

interface UserContextType {
  // centreGlobal: { id: number; name: string };
  centreGlobal: any;
  setCentreGlobal: Dispatch<SetStateAction<any>>;
  memberGlobal: any;
  setMemberGlobal: Dispatch<SetStateAction<any>>;
}

const UserOptionsContext = createContext<UserContextType>({
  centreGlobal: null,
  setCentreGlobal: () => {},
  memberGlobal: null,
  setMemberGlobal: () => {},
});

export const UserOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [someObj, setSomeObj] = useState<{ id: number; name: string }>(() => {
    const saved = localStorage.getItem("someObj");
    return saved ? JSON.parse(saved) : { id: 0, name: "" };
  });

  useEffect(() => {
    localStorage.setItem("someObj", JSON.stringify(someObj));
  }, [someObj]);

  const [centreGlobal, setCentreGlobal] = useState<any>(() => {
    const saved = localStorage.getItem("centreGlobal");
    return saved ? JSON.parse(saved) : null;
  });

  const [memberGlobal, setMemberGlobal] = useState<any>(() => {
    const saved = localStorage.getItem("memberGlobal");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("centreGlobal", JSON.stringify(centreGlobal));
    localStorage.setItem("memberGlobal", JSON.stringify(memberGlobal));
  }, [centreGlobal, memberGlobal]);

  const val = {
    centreGlobal,
    setCentreGlobal,
    memberGlobal,
    setMemberGlobal,
  };

  return <UserOptionsContext.Provider value={val}>{children}</UserOptionsContext.Provider>;
};

export const useUserOptionsContext = () => useContext(UserOptionsContext);
